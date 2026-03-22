import type { ProfileLocationInput } from '../domain/profile.types';

const googlePlacesApiBaseUrl = 'https://places.googleapis.com/v1';

interface GooglePlacesAutocompleteApiResponse {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    };
  }>;
}

interface GooglePlaceDetailsApiResponse {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  addressComponents?: Array<{
    longText?: string;
    shortText?: string;
    types?: string[];
  }>;
}

export interface GooglePlaceSuggestion {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  description: string;
}

/**
 * Queries Google Places autocomplete suggestions for a partial location string.
 * @param input - Free-form text typed by the user.
 * @returns A promise resolving to lightweight place suggestions.
 */
export async function searchGooglePlaceSuggestions(
  input: string,
): Promise<GooglePlaceSuggestion[]> {
  if (!input.trim()) {
    return [];
  }

  const response = await fetch(`${googlePlacesApiBaseUrl}/places:autocomplete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': getGooglePlacesApiKey(),
      'X-Goog-FieldMask':
        'suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat',
    },
    body: JSON.stringify({
      input: input.trim(),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`GOOGLE_PLACES_AUTOCOMPLETE_ERROR_${response.status}`);
  }

  const payload = (await response.json()) as GooglePlacesAutocompleteApiResponse;
  const predictions = (payload.suggestions ?? [])
    .map((suggestion) => suggestion.placePrediction)
    .filter(
      (prediction): prediction is {
        placeId: string;
        text: { text: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      } => Boolean(prediction?.placeId && prediction.text?.text),
    );

  return predictions.map((prediction) => ({
      placeId: prediction.placeId,
      primaryText:
        prediction.structuredFormat?.mainText?.text ??
        prediction.text?.text ??
        '',
      secondaryText: prediction.structuredFormat?.secondaryText?.text ?? '',
      description: prediction.text?.text ?? '',
    }));
}

/**
 * Loads a structured location payload from Google Places using a stable place ID.
 * @param placeId - Stable Google Places identifier returned from autocomplete.
 * @returns A normalized location object suitable for storage in the tenant profile.
 */
export async function getGooglePlaceDetails(
  placeId: string,
): Promise<ProfileLocationInput> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    throw new Error('GOOGLE_PLACES_DETAILS_ERROR_INVALID_PLACE_ID');
  }

  const response = await fetch(
    `${googlePlacesApiBaseUrl}/places/${encodeURIComponent(normalizedPlaceId)}`,
    {
      headers: {
        'X-Goog-Api-Key': getGooglePlacesApiKey(),
        'X-Goog-FieldMask':
          'id,displayName,formattedAddress,location,addressComponents',
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`GOOGLE_PLACES_DETAILS_ERROR_${response.status}`);
  }

  const payload = (await response.json()) as GooglePlaceDetailsApiResponse;

  if (
    !payload.id ||
    !payload.displayName?.text ||
    !payload.formattedAddress ||
    payload.location?.latitude == null ||
    payload.location?.longitude == null
  ) {
    throw new Error('GOOGLE_PLACES_DETAILS_ERROR_INVALID_RESPONSE');
  }

  const addressComponents = payload.addressComponents ?? [];

  return {
    provider: 'google_places',
    placeId: payload.id,
    displayName: payload.displayName.text,
    formattedAddress: payload.formattedAddress,
    latitude: payload.location.latitude,
    longitude: payload.location.longitude,
    countryCode:
      findAddressComponent(addressComponents, 'country', 'shortText') ?? null,
    country:
      findAddressComponent(addressComponents, 'country', 'longText') ?? null,
    region:
      findAddressComponent(
        addressComponents,
        'administrative_area_level_1',
        'longText',
      ) ?? null,
    city:
      findAddressComponent(addressComponents, 'locality', 'longText') ??
      findAddressComponent(
        addressComponents,
        'postal_town',
        'longText',
      ) ??
      null,
    locality:
      findAddressComponent(
        addressComponents,
        'sublocality_level_1',
        'longText',
      ) ??
      findAddressComponent(addressComponents, 'neighborhood', 'longText') ??
      null,
    postalCode:
      findAddressComponent(addressComponents, 'postal_code', 'longText') ?? null,
  };
}

function findAddressComponent(
  components: NonNullable<GooglePlaceDetailsApiResponse['addressComponents']>,
  type: string,
  field: 'longText' | 'shortText',
): string | undefined {
  return components.find((component) => component.types?.includes(type))?.[field];
}

function getGooglePlacesApiKey(): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();

  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY_MISSING');
  }

  return apiKey;
}

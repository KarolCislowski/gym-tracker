'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material';

import type { AuthenticatedUserSnapshot } from '@/features/auth/domain/auth.types';
import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

type ProfileLocation = NonNullable<
  NonNullable<AuthenticatedUserSnapshot['profile']>['location']
>;

interface GooglePlaceSuggestion {
  placeId: string;
  primaryText: string;
  secondaryText: string;
  description: string;
}

interface ProfileLocationFieldProps {
  defaultLocation: ProfileLocation | null;
  translations: TranslationDictionary['profile'];
}

/**
 * Client-side autocomplete field backed by Google Places for profile location selection.
 * @param props - Component props for the location field.
 * @param props.defaultLocation - Previously saved structured location.
 * @param props.translations - Localized profile labels and helper text.
 * @returns A React element rendering the location search input and hidden form fields.
 */
export function ProfileLocationField({
  defaultLocation,
  translations,
}: ProfileLocationFieldProps) {
  const [inputValue, setInputValue] = useState(
    defaultLocation?.formattedAddress ?? '',
  );
  const [selectedLocation, setSelectedLocation] = useState<ProfileLocation | null>(
    defaultLocation,
  );
  const [options, setOptions] = useState<GooglePlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const deferredInputValue = useDeferredValue(inputValue);

  useEffect(() => {
    const query = deferredInputValue.trim();

    if (
      query.length < 2 ||
      query === selectedLocation?.formattedAddress ||
      query === selectedLocation?.displayName
    ) {
      setOptions([]);
      return;
    }

    const controller = new AbortController();
    const timerId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/google-places/autocomplete?input=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          },
        );
        const payload = (await response.json()) as {
          suggestions?: GooglePlaceSuggestion[];
        };

        setOptions(payload.suggestions ?? []);
      } catch {
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timerId);
    };
  }, [deferredInputValue, selectedLocation]);

  return (
    <>
      <Autocomplete
        autoHighlight
        filterOptions={(filteredOptions) => filteredOptions}
        getOptionKey={(option) => option.placeId}
        getOptionLabel={(option) => option.description}
        inputValue={inputValue}
        loading={isLoading}
        noOptionsText={translations.locationNoOptions}
        onChange={(_, option) => {
          if (!option) {
            setSelectedLocation(null);
            return;
          }

          void resolveSelectedPlace(option.placeId);
        }}
        onInputChange={(_, value, reason) => {
          setInputValue(value);

          if (reason === 'clear' || value !== selectedLocation?.formattedAddress) {
            setSelectedLocation(null);
          }
        }}
        options={options}
        renderInput={(params) => (
          <TextField
            {...params}
            helperText={translations.locationHelperText}
            label={translations.locationLabel}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position='start'>
                      <SearchRoundedIcon fontSize='small' />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress size={18} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.placeId}>
            <div>
              <div>{option.primaryText}</div>
              {option.secondaryText ? (
                <div style={{ color: 'var(--mui-palette-text-secondary)' }}>
                  {option.secondaryText}
                </div>
              ) : null}
            </div>
          </li>
        )}
      />

      <input
        name='locationProvider'
        type='hidden'
        value={selectedLocation?.provider ?? ''}
      />
      <input
        name='locationPlaceId'
        type='hidden'
        value={selectedLocation?.placeId ?? ''}
      />
      <input
        name='locationDisplayName'
        type='hidden'
        value={selectedLocation?.displayName ?? ''}
      />
      <input
        name='locationFormattedAddress'
        type='hidden'
        value={selectedLocation?.formattedAddress ?? ''}
      />
      <input
        name='locationLatitude'
        type='hidden'
        value={selectedLocation?.latitude ?? ''}
      />
      <input
        name='locationLongitude'
        type='hidden'
        value={selectedLocation?.longitude ?? ''}
      />
      <input
        name='locationCountryCode'
        type='hidden'
        value={selectedLocation?.countryCode ?? ''}
      />
      <input
        name='locationCountry'
        type='hidden'
        value={selectedLocation?.country ?? ''}
      />
      <input
        name='locationRegion'
        type='hidden'
        value={selectedLocation?.region ?? ''}
      />
      <input
        name='locationCity'
        type='hidden'
        value={selectedLocation?.city ?? ''}
      />
      <input
        name='locationLocality'
        type='hidden'
        value={selectedLocation?.locality ?? ''}
      />
      <input
        name='locationPostalCode'
        type='hidden'
        value={selectedLocation?.postalCode ?? ''}
      />
    </>
  );

  async function resolveSelectedPlace(placeId: string): Promise<void> {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/google-places/details?placeId=${encodeURIComponent(placeId)}`,
      );
      const payload = (await response.json()) as {
        location?: ProfileLocation;
      };

      if (!payload.location) {
        return;
      }

      setSelectedLocation(payload.location);
      setInputValue(payload.location.formattedAddress);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }
}

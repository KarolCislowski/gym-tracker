import { NextResponse } from 'next/server';

import { getGooglePlaceDetails } from '@/features/profile/infrastructure/google-places';

/**
 * Resolves a selected Google place ID into the structured location object persisted in profiles.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId') ?? '';

  if (!placeId.trim()) {
    return NextResponse.json(
      { error: 'GOOGLE_PLACES_DETAILS_ERROR_INVALID_PLACE_ID' },
      { status: 400 },
    );
  }

  try {
    const location = await getGooglePlaceDetails(placeId);

    return NextResponse.json({ location });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'GOOGLE_PLACES_DETAILS_ERROR',
      },
      { status: 500 },
    );
  }
}

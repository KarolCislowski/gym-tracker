'use client';

import { useTransition } from 'react';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';

import type { TranslationDictionary } from '@/shared/i18n/domain/i18n.types';

import { toggleFavoriteExerciseAction } from '../infrastructure/exercise-favorites.actions';

interface ExerciseFavoriteButtonProps {
  exerciseName: string;
  exerciseSlug: string;
  isFavorite: boolean;
  translations: TranslationDictionary['exercises'];
  size?: 'small' | 'medium' | 'large';
}

/**
 * Client-side toggle button for marking an atlas exercise as favorite.
 * @param props - Component props for the favorite toggle button.
 * @param props.exerciseName - Human-readable exercise name used in a11y labels.
 * @param props.exerciseSlug - Stable exercise slug used by the server action.
 * @param props.isFavorite - Current favorite state for the authenticated user.
 * @param props.translations - Localized labels for the favorite action.
 * @param props.size - Optional icon-button size.
 * @returns A React element rendering a favorite toggle icon button.
 */
export function ExerciseFavoriteButton({
  exerciseName,
  exerciseSlug,
  isFavorite,
  translations,
  size = 'small',
}: ExerciseFavoriteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const tooltip = isFavorite
    ? translations.removeFromFavorites
    : translations.addToFavorites;

  const handleToggle = () => {
    startTransition(async () => {
      await toggleFavoriteExerciseAction({ exerciseSlug, isFavorite });
      router.refresh();
    });
  };

  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton
          aria-label={`${tooltip}: ${exerciseName}`}
          color={isFavorite ? 'error' : 'default'}
          disabled={isPending}
          onClick={handleToggle}
          size={size}
        >
          {isFavorite ? (
            <FavoriteRoundedIcon fontSize='small' />
          ) : (
            <FavoriteBorderRoundedIcon fontSize='small' />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}

import Link from 'next/link';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import {
  getTranslations,
  resolveLanguage,
} from '../application/i18n.service';

interface LanguageSwitcherProps {
  activeLanguage?: string | null;
  pathname: string;
  query?: Record<string, string | undefined>;
}

export function LanguageSwitcher({
  activeLanguage,
  pathname,
  query,
}: LanguageSwitcherProps) {
  const resolvedLanguage = resolveLanguage(activeLanguage);
  const t = getTranslations(resolvedLanguage);
  const languages = [
    { code: 'en', label: t.auth.languageEnglish },
    { code: 'pl', label: t.auth.languagePolish },
    { code: 'sv', label: t.auth.languageSwedish },
  ] as const;

  return (
    <Stack
      direction='row'
      spacing={1}
      flexWrap='wrap'
      useFlexGap
      alignItems='center'
      aria-label='Language switcher'
    >
      <TranslateRoundedIcon color='action' fontSize='small' />
      {languages.map((language) => {
        const searchParams = new URLSearchParams();

        Object.entries(query ?? {}).forEach(([key, value]) => {
          if (value && key !== 'lang') {
            searchParams.set(key, value);
          }
        });

        searchParams.set('lang', language.code);

        return (
          <Tooltip key={language.code} title={language.label}>
            <Link href={`${pathname}?${searchParams.toString()}`}>
              <Chip
                clickable
                color={
                  language.code === resolvedLanguage ? 'primary' : 'default'
                }
                label={language.label}
                size='small'
                variant={
                  language.code === resolvedLanguage ? 'filled' : 'outlined'
                }
              />
            </Link>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

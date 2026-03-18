import Link from 'next/link';

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
    <nav className='language-switcher' aria-label='Language switcher'>
      {languages.map((language) => {
        const searchParams = new URLSearchParams();

        Object.entries(query ?? {}).forEach(([key, value]) => {
          if (value && key !== 'lang') {
            searchParams.set(key, value);
          }
        });

        searchParams.set('lang', language.code);

        return (
          <Link
            key={language.code}
            className={
              language.code === resolvedLanguage
                ? 'language-switcher__link language-switcher__link--active'
                : 'language-switcher__link'
            }
            href={`${pathname}?${searchParams.toString()}`}
          >
            {language.label}
          </Link>
        );
      })}
    </nav>
  );
}

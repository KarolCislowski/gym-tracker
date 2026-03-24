import { redirect } from 'next/navigation';

import { verifyEmailAddress } from '@/features/auth/application/auth.service';
import { resolveLanguage } from '@/shared/i18n/application/i18n.service';

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    lang?: string;
    token?: string;
  }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const activeLanguage = resolveLanguage(params?.lang);
  const rawToken = String(params?.token ?? '');

  try {
    await verifyEmailAddress(rawToken);
    redirect(`/login?lang=${activeLanguage}&verified=1`);
  } catch {
    redirect(`/login?lang=${activeLanguage}&error=verification_invalid`);
  }
}

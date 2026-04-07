import nodemailer from 'nodemailer';

import type {
  SendPasswordResetEmailInput,
  SendVerificationEmailInput,
} from '../domain/auth.types';

/**
 * Sends the transactional email used to verify a newly registered email address.
 */
export async function sendVerificationEmail({
  email,
  firstName,
  language,
  verificationUrl,
}: SendVerificationEmailInput): Promise<{ messageId: string }> {
  const transporter = createSmtpTransport();
  const fromAddress = getFromAddress();

  const content = buildVerificationEmailContent({
    firstName,
    language,
    verificationUrl,
  });

  const result = await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  console.info('[auth] verification email sent', {
    email,
    messageId: result.messageId,
  });

  return {
    messageId: result.messageId,
  };
}

/**
 * Sends the transactional email used to start a password-reset flow.
 */
export async function sendPasswordResetEmail({
  email,
  firstName,
  language,
  resetUrl,
}: SendPasswordResetEmailInput): Promise<{ messageId: string }> {
  const transporter = createSmtpTransport();
  const fromAddress = getFromAddress();
  const content = buildPasswordResetEmailContent({
    firstName,
    language,
    resetUrl,
  });

  const result = await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  console.info('[auth] password reset email sent', {
    email,
    messageId: result.messageId,
  });

  return {
    messageId: result.messageId,
  };
}

function buildVerificationEmailContent({
  firstName,
  language,
  verificationUrl,
}: Pick<
  SendVerificationEmailInput,
  'firstName' | 'language' | 'verificationUrl'
>): {
  subject: string;
  text: string;
  html: string;
} {
  if (language === 'pl') {
    return {
      subject: 'Zweryfikuj swój adres email',
      text: `Cześć ${firstName},\n\nDziękujemy za rejestrację. Kliknij poniższy link, aby zweryfikować swój adres email:\n${verificationUrl}\n\nJeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.`,
      html: `<p>Cześć ${escapeHtml(firstName)},</p><p>Dziękujemy za rejestrację. Kliknij poniższy link, aby zweryfikować swój adres email:</p><p><a href="${verificationUrl}">Zweryfikuj adres email</a></p><p>Jeśli to nie Ty zakładałeś konto, zignoruj tę wiadomość.</p>`,
    };
  }

  if (language === 'sv') {
    return {
      subject: 'Verifiera din e-postadress',
      text: `Hej ${firstName},\n\nTack för att du registrerade dig. Klicka på länken nedan för att verifiera din e-postadress:\n${verificationUrl}\n\nOm det inte var du som skapade kontot kan du ignorera det här meddelandet.`,
      html: `<p>Hej ${escapeHtml(firstName)},</p><p>Tack för att du registrerade dig. Klicka på länken nedan för att verifiera din e-postadress:</p><p><a href="${verificationUrl}">Verifiera e-postadress</a></p><p>Om det inte var du som skapade kontot kan du ignorera det här meddelandet.</p>`,
    };
  }

  return {
    subject: 'Verify your email address',
    text: `Hi ${firstName},\n\nThanks for registering. Click the link below to verify your email address:\n${verificationUrl}\n\nIf you did not create this account, you can ignore this message.`,
    html: `<p>Hi ${escapeHtml(firstName)},</p><p>Thanks for registering. Click the link below to verify your email address:</p><p><a href="${verificationUrl}">Verify email address</a></p><p>If you did not create this account, you can ignore this message.</p>`,
  };
}

function buildPasswordResetEmailContent({
  firstName,
  language,
  resetUrl,
}: Pick<SendPasswordResetEmailInput, 'firstName' | 'language' | 'resetUrl'>): {
  subject: string;
  text: string;
  html: string;
} {
  if (language === 'pl') {
    return {
      subject: 'Zresetuj swoje hasło',
      text: `Cześć ${firstName},\n\nOtrzymaliśmy prośbę o zresetowanie hasła. Kliknij poniższy link, aby ustawić nowe hasło:\n${resetUrl}\n\nJeśli to nie Ty, zignoruj tę wiadomość.`,
      html: `<p>Cześć ${escapeHtml(firstName)},</p><p>Otrzymaliśmy prośbę o zresetowanie hasła. Kliknij poniższy link, aby ustawić nowe hasło:</p><p><a href="${resetUrl}">Ustaw nowe hasło</a></p><p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>`,
    };
  }

  if (language === 'sv') {
    return {
      subject: 'Återställ ditt lösenord',
      text: `Hej ${firstName},\n\nVi har fått en begäran om att återställa ditt lösenord. Klicka på länken nedan för att välja ett nytt lösenord:\n${resetUrl}\n\nOm det inte var du kan du ignorera det här meddelandet.`,
      html: `<p>Hej ${escapeHtml(firstName)},</p><p>Vi har fått en begäran om att återställa ditt lösenord. Klicka på länken nedan för att välja ett nytt lösenord:</p><p><a href="${resetUrl}">Välj nytt lösenord</a></p><p>Om det inte var du kan du ignorera det här meddelandet.</p>`,
    };
  }

  return {
    subject: 'Reset your password',
    text: `Hi ${firstName},\n\nWe received a request to reset your password. Click the link below to choose a new password:\n${resetUrl}\n\nIf this was not you, you can ignore this message.`,
    html: `<p>Hi ${escapeHtml(firstName)},</p><p>We received a request to reset your password. Click the link below to choose a new password:</p><p><a href="${resetUrl}">Choose a new password</a></p><p>If this was not you, you can ignore this message.</p>`,
  };
}

function createSmtpTransport() {
  if (!process.env.SMTP_HOST) {
    throw new Error(
      'Email delivery is not configured. Set SMTP_HOST and SMTP_FROM first.',
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });
}

function getFromAddress(): string {
  const fromAddress = process.env.SMTP_FROM;

  if (!fromAddress) {
    throw new Error(
      'Email delivery is not configured. Set SMTP_HOST and SMTP_FROM first.',
    );
  }

  return fromAddress;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

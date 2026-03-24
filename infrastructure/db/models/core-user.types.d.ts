import type { Types } from 'mongoose';

export interface CoreUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  isActive: boolean;
  tenantDbName: string;
  emailVerifiedAt: Date | null;
  emailVerificationTokenHash: string | null;
  emailVerificationTokenExpiresAt: Date | null;
  passwordResetTokenHash: string | null;
  passwordResetTokenExpiresAt: Date | null;
  createdAt: Date;
}

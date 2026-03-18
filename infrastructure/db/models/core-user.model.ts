import { Schema, type Model, type HydratedDocument } from 'mongoose';

import { getCoreDbConnection } from '../mongoose.client';
import type { CoreUser } from './core-user.types';

export type CoreUserDocument = HydratedDocument<CoreUser>;

const coreUserSchema = new Schema<CoreUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    tenantDbName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    collection: 'users',
  },
);

/**
 * Returns the CoreUser model bound to the shared Core database.
 * This collection can be used to resolve which tenant database belongs to a user.
 */
export async function getCoreUserModel(): Promise<Model<CoreUser>> {
  const connection = await getCoreDbConnection();

  return (
    (connection.models.CoreUser as Model<CoreUser> | undefined) ??
    connection.model<CoreUser>('CoreUser', coreUserSchema)
  );
}

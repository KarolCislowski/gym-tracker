import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getCoreDbConnection } from '../mongoose.client';
import type { CoreMuscleGroup } from './core-muscle-group.types';

export type CoreMuscleGroupDocument = HydratedDocument<CoreMuscleGroup>;

const coreMuscleGroupSchema = new Schema<CoreMuscleGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    parentGroupId: {
      type: String,
      required: false,
      default: null,
    },
    level: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['upper_body', 'lower_body', 'core', 'full_body'],
    },
    aliases: {
      type: [String],
      required: false,
      default: undefined,
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    isTrackableVolume: {
      type: Boolean,
      required: true,
      default: true,
    },
    order: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'muscle_groups',
  },
);

/**
 * Returns the shared Core muscle-group model used by the exercise atlas.
 */
export async function getCoreMuscleGroupModel(): Promise<Model<CoreMuscleGroup>> {
  const connection = await getCoreDbConnection();

  return (
    (connection.models.CoreMuscleGroup as Model<CoreMuscleGroup> | undefined) ??
    connection.model<CoreMuscleGroup>(
      'CoreMuscleGroup',
      coreMuscleGroupSchema,
    )
  );
}

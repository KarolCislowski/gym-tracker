import { Schema, type HydratedDocument, type Model } from 'mongoose';

import { getCoreDbConnection } from '../mongoose.client';
import type { CoreExercise } from './core-exercise.types';

export type CoreExerciseDocument = HydratedDocument<CoreExercise>;

const muscleActivationSchema = new Schema(
  {
    muscleGroupId: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['primary', 'secondary', 'stabilizer'],
    },
    activationLevel: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
  },
  { _id: false },
);

const exerciseVariantSchema = new Schema(
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
    },
    equipment: {
      type: [String],
      required: true,
      default: [],
    },
    gripOptions: {
      type: [String],
      required: false,
      default: undefined,
    },
    stanceOptions: {
      type: [String],
      required: false,
      default: undefined,
    },
    attachmentOptions: {
      type: [String],
      required: false,
      default: undefined,
    },
    bodyPosition: {
      type: String,
      required: false,
      enum: [
        'standing',
        'seated',
        'lying_flat',
        'incline',
        'decline',
        'kneeling',
        'hanging',
      ],
      default: undefined,
    },
    limbMode: {
      type: String,
      required: false,
      enum: ['bilateral', 'unilateral', 'alternating'],
      default: undefined,
    },
    musclesOverride: {
      type: [muscleActivationSchema],
      required: false,
      default: undefined,
    },
    difficultyOverride: {
      type: String,
      required: false,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: undefined,
    },
    executionNotes: {
      type: [String],
      required: false,
      default: undefined,
    },
    trackableMetrics: {
      type: [String],
      required: true,
      default: [],
    },
    isDefault: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  { _id: true },
);

const coreExerciseSchema = new Schema<CoreExercise>(
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
    aliases: {
      type: [String],
      required: false,
      default: undefined,
    },
    type: {
      type: String,
      required: true,
      enum: ['compound', 'isolation'],
    },
    movementPattern: {
      type: String,
      required: true,
      enum: ['push', 'pull', 'squat', 'hinge', 'lunge', 'rotation', 'carry', 'other'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    muscles: {
      type: [muscleActivationSchema],
      required: true,
      default: [],
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    instructions: {
      type: [String],
      required: false,
      default: undefined,
    },
    tips: {
      type: [String],
      required: false,
      default: undefined,
    },
    commonMistakes: {
      type: [String],
      required: false,
      default: undefined,
    },
    variants: {
      type: [exerciseVariantSchema],
      required: true,
      default: [],
    },
    tags: {
      type: [String],
      required: false,
      default: undefined,
    },
    goals: {
      type: [String],
      required: false,
      default: undefined,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: 'exercises',
  },
);

/**
 * Returns the shared Core exercise model used by the exercise atlas.
 */
export async function getCoreExerciseModel(): Promise<Model<CoreExercise>> {
  const connection = await getCoreDbConnection();

  return (
    (connection.models.CoreExercise as Model<CoreExercise> | undefined) ??
    connection.model<CoreExercise>('CoreExercise', coreExerciseSchema)
  );
}

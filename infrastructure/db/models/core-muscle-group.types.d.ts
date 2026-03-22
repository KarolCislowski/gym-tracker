import type { Types } from 'mongoose';

export interface CoreMuscleGroup {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  parentGroupId?: string | null;
  level: number;
  category: 'upper_body' | 'lower_body' | 'core' | 'full_body';
  aliases?: string[];
  description?: string;
  isTrackableVolume: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

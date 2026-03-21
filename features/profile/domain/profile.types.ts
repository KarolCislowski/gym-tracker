export interface UpdateProfileInput {
  tenantDbName: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number | null;
  gender: 'female' | 'male' | 'other' | 'prefer_not_to_say' | null;
  activityLevel:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extra_active'
    | null;
}

import type {
  WorkoutSessionDetails,
  WorkoutSessionDuplicateDraft,
} from '../domain/workout.types';

/**
 * Builds a new workout draft from an existing workout report.
 * @param source - Persisted workout report used as the duplication source.
 * @param referenceDate - Date used as the new performed-at value.
 * @returns A workout draft with preserved structure and reset execution fields.
 * @remarks Logged set values are cleared so the duplicated draft behaves like a fresh session outline.
 */
export function buildWorkoutDuplicateDraft(
  source: WorkoutSessionDetails,
  referenceDate: Date = new Date(),
): WorkoutSessionDuplicateDraft {
  return {
    workoutName: source.workoutName,
    startedAt: null,
    endedAt: null,
    durationMinutes: null,
    performedAt: referenceDate.toISOString(),
    notes: source.notes,
    weatherSnapshot: null,
    blocks: source.blocks.map((block) => ({
      ...block,
      entries: block.entries.map((entry) => ({
        ...entry,
        sets: entry.sets.map((set) => ({
          ...set,
          reps: null,
          weight: null,
          durationSec: null,
          distanceMeters: null,
          calories: null,
          rpe: null,
          rir: null,
          completedAt: null,
        })),
      })),
    })),
  };
}

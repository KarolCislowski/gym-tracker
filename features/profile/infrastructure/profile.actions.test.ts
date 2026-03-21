import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('../application/profile.service', () => ({
  updateProfile: vi.fn(),
}));

import { auth } from '@/auth';

import { updateProfile } from '../application/profile.service';
import { updateProfileAction } from './profile.actions';

const mockedAuth = vi.mocked(auth);
const mockedUpdateProfile = vi.mocked(updateProfile);

function createFormData(entries: Record<string, string | boolean>): FormData {
  const formData = new FormData();

  Object.entries(entries).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      if (value) {
        formData.set(key, 'on');
      }

      return;
    }

    formData.set(key, value);
  });

  return formData;
}

describe('profile.actions', () => {
  /**
   * Resets mock state before each action scenario.
   */
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAuth.mockResolvedValue({
      user: {
        id: 'user-1',
        tenantDbName: 'tenant_john',
      },
    } as unknown as Awaited<ReturnType<typeof auth>>);
  });

  /**
   * Verifies that profile form data is normalized and forwarded to the service.
   */
  test('updateProfileAction sends profile values to the service', async () => {
    await expect(
      updateProfileAction(
        createFormData({
          firstName: 'John',
          lastName: 'Doe',
          age: '31',
          gender: 'male',
          activityLevel: 'moderately_active',
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:/profile?status=updated');

    expect(mockedUpdateProfile).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      age: 31,
      gender: 'male',
      activityLevel: 'moderately_active',
    });
  });

  /**
   * Verifies that profile action errors redirect back with a stable error code.
   */
  test('updateProfileAction redirects back to profile on error', async () => {
    mockedUpdateProfile.mockRejectedValueOnce(new Error('PROFILE_ERROR_GENERIC'));

    await expect(
      updateProfileAction(
        createFormData({
          firstName: 'John',
          lastName: 'Doe',
          age: '',
          gender: '',
          activityLevel: '',
        }),
      ),
    ).rejects.toThrow('NEXT_REDIRECT:/profile?error=PROFILE_ERROR_GENERIC');
  });
});

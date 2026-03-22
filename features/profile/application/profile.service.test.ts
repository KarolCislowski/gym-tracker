import { describe, expect, test, vi } from 'vitest';

import { updateProfile } from './profile.service';

vi.mock('../infrastructure/profile.db', () => ({
  updateTenantProfileRecord: vi.fn(),
}));

import { updateTenantProfileRecord } from '../infrastructure/profile.db';

const mockedUpdateTenantProfileRecord = vi.mocked(updateTenantProfileRecord);

describe('profile.service', () => {
  /**
   * Verifies that validated profile values are delegated to the persistence layer.
   */
  test('updateProfile persists normalized profile data', async () => {
    await updateProfile({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1994-03-22T00:00:00.000Z'),
      unitSystem: 'imperial_uk',
      heightCm: null,
      heightFeet: 5,
      heightInches: 11,
      gender: 'male',
      activityLevel: 'moderately_active',
    });

    expect(mockedUpdateTenantProfileRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1994-03-22T00:00:00.000Z'),
      heightCm: 180.34,
      gender: 'male',
      activityLevel: 'moderately_active',
    });
  });
});

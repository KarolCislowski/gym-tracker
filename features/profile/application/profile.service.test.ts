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
      age: 31,
      gender: 'male',
      activityLevel: 'moderately_active',
    });

    expect(mockedUpdateTenantProfileRecord).toHaveBeenCalledWith({
      tenantDbName: 'tenant_john',
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      age: 31,
      gender: 'male',
      activityLevel: 'moderately_active',
    });
  });
});

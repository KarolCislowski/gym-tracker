import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../infrastructure/supplementation.db', () => ({
  createTenantSupplementIntakeReportRecord: vi.fn(),
  createTenantSupplementStackRecord: vi.fn(),
  listTenantSupplementIntakeReportRecords: vi.fn(),
  listTenantSupplementStackRecords: vi.fn(),
}));

import {
  createTenantSupplementIntakeReportRecord,
  createTenantSupplementStackRecord,
  listTenantSupplementIntakeReportRecords,
  listTenantSupplementStackRecords,
} from '../infrastructure/supplementation.db';
import {
  createSupplementIntakeReport,
  createSupplementStack,
  listSupplementIntakeReports,
  listSupplementStacks,
} from './supplementation.service';

const mockedCreateTenantSupplementStackRecord = vi.mocked(
  createTenantSupplementStackRecord,
);
const mockedListTenantSupplementStackRecords = vi.mocked(
  listTenantSupplementStackRecords,
);
const mockedCreateTenantSupplementIntakeReportRecord = vi.mocked(
  createTenantSupplementIntakeReportRecord,
);
const mockedListTenantSupplementIntakeReportRecords = vi.mocked(
  listTenantSupplementIntakeReportRecords,
);

describe('supplementation.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('createSupplementStack persists a validated stack payload', async () => {
    await createSupplementStack({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      name: 'PWO',
      context: 'pre_workout',
      notes: 'Heavy day only',
      isFavorite: true,
      items: [
        {
          order: 1,
          supplementId: 'supplement-1',
          supplementSlug: 'creatine',
          supplementName: 'Creatine',
          variantId: 'variant-1',
          variantSlug: 'creatine-monohydrate',
          variantName: 'Creatine Monohydrate',
          amount: 5,
          unit: 'g',
          notes: null,
        },
      ],
    });

    expect(mockedCreateTenantSupplementStackRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantDbName: 'tenant_demo_user',
        userId: 'user-1',
        name: 'PWO',
        context: 'pre_workout',
      }),
    );
  });

  test('listSupplementStacks proxies tenant stack summaries', async () => {
    mockedListTenantSupplementStackRecords.mockResolvedValue([
      {
        id: 'stack-1',
        name: 'Morning basics',
        context: 'morning',
        notes: null,
        isFavorite: false,
        itemCount: 2,
        items: [],
      },
    ]);

    await expect(
      listSupplementStacks('tenant_demo_user', 'user-1'),
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'stack-1',
        name: 'Morning basics',
      }),
    ]);
  });

  test('createSupplementIntakeReport persists a validated snapshot payload', async () => {
    const takenAt = new Date('2026-03-24T07:15:00.000Z');

    await createSupplementIntakeReport({
      tenantDbName: 'tenant_demo_user',
      userId: 'user-1',
      takenAt,
      stackId: 'stack-1',
      stackName: 'PWO',
      context: 'pre_workout',
      notes: null,
      items: [
        {
          order: 1,
          supplementId: 'supplement-1',
          supplementSlug: 'creatine',
          supplementName: 'Creatine',
          variantId: 'variant-1',
          variantSlug: 'creatine-monohydrate',
          variantName: 'Creatine Monohydrate',
          amount: 5,
          unit: 'g',
          notes: null,
        },
      ],
    });

    expect(mockedCreateTenantSupplementIntakeReportRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        takenAt,
        stackName: 'PWO',
      }),
    );
  });

  test('listSupplementIntakeReports proxies intake history', async () => {
    mockedListTenantSupplementIntakeReportRecords.mockResolvedValue([
      {
        id: 'report-1',
        takenAt: '2026-03-24T07:15:00.000Z',
        stackId: 'stack-1',
        stackName: 'PWO',
        context: 'pre_workout',
        notes: null,
        itemCount: 3,
        items: [],
      },
    ]);

    await expect(
      listSupplementIntakeReports('tenant_demo_user', 'user-1'),
    ).resolves.toEqual([
      expect.objectContaining({
        id: 'report-1',
        stackName: 'PWO',
      }),
    ]);
  });
});

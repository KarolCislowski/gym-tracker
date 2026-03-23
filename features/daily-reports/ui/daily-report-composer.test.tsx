/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { enMessages } from '@/shared/i18n/infrastructure/messages/en';

import { DailyReportComposer } from './daily-report-composer';

vi.mock('./daily-report-form', () => ({
  DailyReportForm: () => <div>Daily form body</div>,
}));

describe('DailyReportComposer', () => {
  test('hides the daily report form until the user opens it', () => {
    render(
      <DailyReportComposer
        translations={enMessages}
        userSnapshot={null}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Add daily report' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Daily form body')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Add daily report' }));

    expect(screen.getByText('Daily form body')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide daily report form' }),
    ).toBeInTheDocument();
  });
});

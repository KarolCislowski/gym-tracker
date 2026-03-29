import { Stack, Typography } from '@mui/material';

import { AppCard } from '@/shared/ui/app-card';

interface ExerciseDetailsListSectionProps {
  title: string;
  values: string[];
}

/**
 * Generic bulleted text section for exercise details content.
 * @param props - Component props for the bulleted section.
 * @param props.title - Section heading.
 * @param props.values - List of text items to render.
 * @returns A React element rendering the section content.
 */
export function ExerciseDetailsListSection({
  title,
  values,
}: ExerciseDetailsListSectionProps) {
  return (
    <AppCard padding='lg' radius='lg' tone='standard'>
      <Stack spacing={1.25}>
        <Typography component='h2' variant='h6'>
          {title}
        </Typography>
        {values.map((value) => (
          <Typography key={value} color='text.secondary'>
            • {value}
          </Typography>
        ))}
      </Stack>
    </AppCard>
  );
}

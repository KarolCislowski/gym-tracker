import { Paper, Stack, Typography } from '@mui/material';

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
    <Paper
      elevation={0}
      sx={{ p: { xs: 3, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 6 }}
    >
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
    </Paper>
  );
}

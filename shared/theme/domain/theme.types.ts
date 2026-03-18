export const colorModes = ['light', 'dark'] as const;

export type AppColorMode = (typeof colorModes)[number];

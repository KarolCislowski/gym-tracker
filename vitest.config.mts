/**
 * Vitest configuration file for the Gym Tracker project.
 * This file configures Vitest for testing React components with TypeScript support,
 * including plugins for React transformation and TypeScript path resolution.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Default Vitest configuration object.
 * Defines the test setup including plugins and environment settings.
 * @type {import('vitest/config').UserConfig}
 */
export default defineConfig({
  /**
   * Array of Vite plugins to use during testing.
   * Includes React plugin for JSX transformation and TypeScript paths plugin for module resolution.
   */
  plugins: [tsconfigPaths(), react()],
  /**
   * Test-specific configuration options.
   */
  test: {
    /**
     * The test environment to use.
     * 'jsdom' simulates a browser DOM for testing React components.
     */
    environment: 'jsdom',
    /**
     * Global test setup for matcher extensions and DOM cleanup.
     */
    setupFiles: ['./vitest.setup.ts'],
  },
});

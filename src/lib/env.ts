
// Environment configuration utility
// This file provides a safe way to access environment variables

/**
 * Get an environment variable with a fallback value if not found
 */
export const getEnv = (key: string, fallback: string = ''): string => {
  return import.meta.env[key] || fallback;
};

/**
 * Get the API key for diet plan generation (OpenAI API key)
 */
export const getDietApiKey = (): string => {
  return getEnv('VITE_DIET_API_KEY', '');
};

/**
 * Check if the diet API is configured
 */
export const isDietApiConfigured = (): boolean => {
  return Boolean(getDietApiKey());
};

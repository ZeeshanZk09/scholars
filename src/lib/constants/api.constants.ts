export const API_VERSION = "v1";

export const API_BASE_PATH = `/api/${API_VERSION}` as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

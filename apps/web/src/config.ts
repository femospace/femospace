// Central API configuration
// Set VITE_API_BASE_URL in your .env.local or Vercel environment variables
const PRODUCTION_API_URL = 'https://femospace.onrender.com';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || PRODUCTION_API_URL;

export const SOCKET_URL: string =
  import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || PRODUCTION_API_URL;

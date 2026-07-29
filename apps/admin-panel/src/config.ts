// Central API configuration
// Set VITE_API_BASE_URL in your .env.local or Vercel environment variables
const PRODUCTION_API_URL = 'https://femospace.onrender.com';

export const API_BASE_URL: string = import.meta.env.PROD 
  ? PRODUCTION_API_URL 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

export const SOCKET_URL: string = import.meta.env.PROD 
  ? PRODUCTION_API_URL 
  : (import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

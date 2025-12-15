export const environment = {
  production: true,
  // Use relative path in production to avoid CORS issues
  // The hosting platform (Vercel/Netlify) should handle proxying
  apiUrl: '/api' // Will be proxied by hosting platform
};


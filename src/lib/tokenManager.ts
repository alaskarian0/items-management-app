import Cookies from 'js-cookie';

// Token management utilities - localStorage for axios, cookies for middleware
export const tokenManager = {
  // Get token from localStorage (for axios)
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Set token in both localStorage and cookie
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      // Set in localStorage for axios
      localStorage.setItem('accessToken', token);

      // Set in cookie for middleware using js-cookie
      Cookies.set('accessToken', token, {
        expires: 1, // 1 day
        path: '/',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
        secure: false, // Allow non-HTTPS in development
      });

      // Log for debugging
      console.log('[TokenManager] Token set:', {
        localStorage: !!localStorage.getItem('accessToken'),
        cookie: !!Cookies.get('accessToken')
      });
    }
  },

  // Remove token from both localStorage and cookie
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      // Remove from localStorage
      localStorage.removeItem('accessToken');

      // Remove cookie using js-cookie
      Cookies.remove('accessToken', { path: '/' });

      // Log for debugging
      console.log('[TokenManager] Token removed');
    }
  },

  hasToken: (): boolean => {
    return !!tokenManager.getToken();
  },
};
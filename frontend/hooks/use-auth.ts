/**
 * Authentication Hook
 * Manages authentication state and provides auth utilities
 */

import { useState, useEffect } from 'react';
import { AuthState } from '@/types';
import { AuthStorage } from '@/utils/storage';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const state = await AuthStorage.getAuthState();
      setAuthState(state);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = authState?.isAuthenticated ?? false;

  return {
    authState,
    isAuthenticated,
    isLoading,
    refreshAuth: checkAuthState,
  };
}





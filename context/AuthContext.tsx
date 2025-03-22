'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { refreshToken, logout as logoutAction } from '../app/auth/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  showRefreshModal: boolean;
  lastActivity: number;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  updateLastActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showRefreshModal, setShowRefreshModal] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await fetch('/api/auth/status');
        const { isAuthenticated, expiresAt } = await authStatus.json();
        
        setIsAuthenticated(isAuthenticated);
        if (isAuthenticated && expiresAt) {
          setTokenExpiresAt(expiresAt);
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Token refresh logic
  useEffect(() => {
    if (!isAuthenticated || !tokenExpiresAt) return;

    const timeUntilExpiry = tokenExpiresAt - Date.now();
    const timeUntilWarning = timeUntilExpiry - 60 * 1000; // 1 minute before expiry

    // If token is about to expire in the next minute, decide whether to show modal or auto-refresh
    const warningTimer = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      // If user has been inactive for more than 2 minutes, show the modal
      if (timeSinceLastActivity > 2 * 60 * 1000) {
        setShowRefreshModal(true);
      } else {
        // Otherwise, auto-refresh
        refreshSession();
      }
    }, timeUntilWarning > 0 ? timeUntilWarning : 0);

    return () => clearTimeout(warningTimer);
  }, [isAuthenticated, tokenExpiresAt, lastActivity]);

  // Multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_state') {
        const newState = JSON.parse(e.newValue || '{}');
        setIsAuthenticated(newState.isAuthenticated || false);
        setTokenExpiresAt(newState.expiresAt || null);
        
        if (newState.isAuthenticated) {
          setShowRefreshModal(false); // Hide modal if another tab refreshed
        }
      }
      
      if (e.key === 'auth_logout') {
        setIsAuthenticated(false);
        setTokenExpiresAt(null);
        window.location.href = '/welcome'; // Redirect to login page
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshSession = async () => {
    try {
      const result = await refreshToken(); // server action
      
      if (result) {
        // Update tokenExpiresAt based on the new token
        const authStatus = await fetch('/api/auth/status');
        const { expiresAt } = await authStatus.json();
        
        setTokenExpiresAt(expiresAt);
        setShowRefreshModal(false);
        
        // Synchronize with other tabs
        localStorage.setItem('auth_state', JSON.stringify({ 
          isAuthenticated: true, 
          expiresAt 
        }));
      } else {
        // Token refresh failed, log out
        await logout();
      }
    } catch (error) {
      console.error('Failed to refresh session:', error);
      await logout();
    }
  };

  const logout = async () => {
    try {
      await logoutAction(); // server action
      setIsAuthenticated(false);
      setTokenExpiresAt(null);
      
      // Notify other tabs
      localStorage.setItem('auth_logout', Date.now().toString());
      
      window.location.href = '/welcome'; // Redirect to welcome page
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      loading,
      showRefreshModal,
      lastActivity,
      refreshSession,
      logout,
      updateLastActivity,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
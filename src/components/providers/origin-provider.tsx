'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CampProvider, useAuth } from '@campnetwork/origin/react';

interface OriginContextType {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  origin: unknown; // Origin instance from SDK
}

const OriginContext = createContext<OriginContextType | undefined>(undefined);

interface OriginProviderProps {
  children: ReactNode;
  clientId: string;
}

function OriginProviderInner({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = auth.isAuthenticated;
  const address = auth.walletAddress;
  const origin = auth.origin;

  const connect = async () => {
    setIsLoading(true);
    try {
      await auth.connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    setIsLoading(true);
    try {
      await auth.disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OriginContext.Provider
      value={{
        isConnected,
        address,
        isLoading,
        connect,
        disconnect,
        origin,
      }}
    >
      {children}
    </OriginContext.Provider>
  );
}

export function OriginProvider({ children, clientId }: OriginProviderProps) {
  return (
    <CampProvider 
      clientId={clientId}
      redirectUri={typeof window !== 'undefined' ? window.location.origin : ''}
    >
      <OriginProviderInner>{children}</OriginProviderInner>
    </CampProvider>
  );
}

export function useOriginAuth() {
  const context = useContext(OriginContext);
  if (context === undefined) {
    throw new Error('useOriginAuth must be used within an OriginProvider');
  }
  return context;
} 
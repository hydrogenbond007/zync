'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampProvider, useAuth } from '@campnetwork/origin/react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

interface OriginContextType {
  isConnected: boolean;
  address: string | null;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  origin: unknown;
  error: string | null;
}

const OriginContext = createContext<OriginContextType | undefined>(undefined);

interface OriginProviderProps {
  children: ReactNode;
  clientId: string;
}

function OriginProviderInner({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure component is mounted client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isConnected = isMounted && (auth?.isAuthenticated ?? false);
  const address = isMounted ? (auth?.walletAddress ?? null) : null;
  const origin = isMounted ? (auth?.origin ?? null) : null;

  const connect = async () => {
    if (!auth) {
      setError('Origin SDK not properly initialized');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simple connect call - let the SDK handle everything
      await auth.connect();
      console.log('✅ Connected successfully!');
    } catch (error) {
      console.error('❌ Connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!auth) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await auth.disconnect();
      console.log('✅ Disconnected successfully');
    } catch (error) {
      console.error('❌ Disconnect failed:', error);
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
        error,
      }}
    >
      {children}
    </OriginContext.Provider>
  );
}

export function OriginProvider({ children, clientId }: OriginProviderProps) {
  // Validate client ID
  if (!clientId || clientId === 'default-client-id') {
    console.error('❌ Invalid client ID. Please check NEXT_PUBLIC_CAMP_CLIENT_ID in .env.local');
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-red-800 font-medium">Configuration Error</h3>
        <p className="text-red-600 text-sm">
          Missing or invalid NEXT_PUBLIC_CAMP_CLIENT_ID. Please check your .env.local file.
        </p>
      </div>
    );
  }

  // Use dynamic redirectUri that matches the actual server port
  const redirectUri = typeof window !== 'undefined' ? window.location.origin : undefined;
  
  console.log('🔧 Origin Provider Config:', {
    clientId: clientId,
    redirectUri: redirectUri,
    windowAvailable: typeof window !== 'undefined'
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider 
        clientId={clientId}
        redirectUri={redirectUri}
      >
        <OriginProviderInner>{children}</OriginProviderInner>
      </CampProvider>
    </QueryClientProvider>
  );
}

export function useOriginAuth() {
  const context = useContext(OriginContext);
  if (context === undefined) {
    throw new Error('useOriginAuth must be used within an OriginProvider');
  }
  return context;
} 
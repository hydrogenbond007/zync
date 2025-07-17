'use client';

import { useOriginAuth } from '@/components/providers/origin-provider';

export function OriginDebug() {
  const { 
    isConnected, 
    address, 
    origin, 
    isLoading,
    error
  } = useOriginAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm border border-gray-600">
      <h4 className="font-bold mb-2">Origin Debug</h4>
      <div className="space-y-1">
        <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
        <div>Address: {address || 'None'}</div>
        <div>Origin: {origin ? 'Available' : 'Not available'}</div>
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Client ID: {process.env.NEXT_PUBLIC_CAMP_CLIENT_ID || 'Not set'}</div>
        {error && (
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="text-red-400">Error: {error}</div>
          </div>
        )}
        <div className="border-t border-gray-600 pt-2 mt-2">
          <div>Ethereum: {typeof window !== 'undefined' && (window as typeof window & { ethereum?: unknown }).ethereum ? 'Available' : 'Not available'}</div>
        </div>
      </div>
    </div>
  );
} 
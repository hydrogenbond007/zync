'use client';

import { useState, useCallback, useEffect } from 'react';
import { useOriginAuth } from '@/components/providers/origin-provider';
import { useOrigin } from '@campnetwork/origin/react';
import { LicenseTerms, IIpAsset } from '@/types';

// Type for Origin instance methods we need
interface OriginInstance {
  hasAccess: (userAddress: string, tokenId: bigint) => Promise<boolean>;
  mintFile: (file: File, metadata: Record<string, unknown>, license: LicenseTerms, parentId?: bigint, options?: { progressCallback?: (percent: number) => void }) => Promise<string>;
  buyAccessSmart: (tokenId: bigint, periods: number) => Promise<unknown>;
  subscriptionExpiry: (userAddress: string, tokenId: bigint) => Promise<bigint>;
  getData: (tokenId: bigint) => Promise<unknown>;
}

// Hook to get all IP assets from the platform
export function useAllIpAssets() {
  const [assets, setAssets] = useState<IIpAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For now, return empty array - this would need backend API to aggregate all assets
  // In a real implementation, you'd have a backend service that indexes all Origin assets
  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement backend API to fetch all platform assets
      setAssets([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return { assets, isLoading, error, refetch: fetchAssets };
}

// Hook to get creator's IP assets using Origin SDK
export function useCreatorIpAssets(creatorAddress?: string) {
  const { origin } = useOriginAuth();
  const { uploads } = useOrigin();
  const [assets, setAssets] = useState<IIpAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !creatorAddress) {
      setAssets([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Get uploads from Origin SDK
      const originUploads = uploads.data || [];
      
      // Transform Origin uploads to our IIpAsset format
      const transformedAssets: IIpAsset[] = originUploads.map((upload: unknown, index: number) => {
        const uploadData = upload as Record<string, unknown>;
        // Ensure we always have a unique ID that can be converted to BigInt
        const baseId = (uploadData.tokenId as string)?.toString() || (uploadData.id as string);
        const uniqueId = baseId || `${Date.now()}${index.toString().padStart(3, '0')}`;
        
        return {
          id: uniqueId,
          title: ((uploadData.metadata as Record<string, unknown>)?.title as string) || (uploadData.name as string) || 'Untitled',
          description: ((uploadData.metadata as Record<string, unknown>)?.description as string) || '',
          creator: creatorAddress,
          contentHash: (uploadData.contentHash as string) || '',
          tokenURI: (uploadData.uri as string) || '',
          license: {
            price: BigInt((uploadData.price as string) || '0'),
            duration: Number(uploadData.duration) || 0,
            royaltyBps: Number(uploadData.royaltyBps) || 0,
            paymentToken: (uploadData.paymentToken as string) || '0x0000000000000000000000000000000000000000'
          },
          createdAt: (uploadData.createdAt as string) || new Date().toISOString()
        };
      });

      setAssets(transformedAssets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch creator assets');
    } finally {
      setIsLoading(false);
    }
  }, [origin, creatorAddress, uploads.data]);

  const refetchCreatorAssets = useCallback(() => {
    // Trigger re-fetch by updating a state that's watched by useEffect
    setIsLoading(true);
  }, []);

  return { assets, isLoading, error, refetch: refetchCreatorAssets };
}

// Hook to check if user has access to an IP asset
export function useHasAccess(tokenId: string) {
  const { origin, address } = useOriginAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    if (!origin || !address || !tokenId) {
      setHasAccess(false);
      return;
    }

    // Check if tokenId can be converted to BigInt
    if (!/^\d+$/.test(tokenId)) {
      console.warn(`Cannot check access for non-numeric token ID: ${tokenId}`);
      setHasAccess(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const originInstance = origin as OriginInstance;
      const access = await originInstance.hasAccess(address, BigInt(tokenId));
      setHasAccess(access);
    } catch (err) {
      console.error('Error checking access:', err);
      setError(err instanceof Error ? err.message : 'Failed to check access');
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [origin, address, tokenId]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  return { hasAccess, isLoading, error, refetch: checkAccess };
}

// Hook to mint a new IP asset using Origin SDK
export function useMintIpAsset() {
  const { origin } = useOriginAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintAsset = useCallback(async (
    file: File,
    metadata: { title: string; description: string },
    license: LicenseTerms,
    onProgress?: (percent: number) => void
  ) => {
    if (!origin) {
      const errorMessage = 'Origin not connected. Please connect your wallet first.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsLoading(true);
    setError(null);
    try {
      const originInstance = origin as OriginInstance;
      const tokenId = await originInstance.mintFile(
        file,
        metadata,
        license,
        undefined, // parentId
        { progressCallback: onProgress }
      );
      return tokenId;
    } catch (err) {
      console.error('Error minting asset:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint asset';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [origin]);

  return { mintAsset, isLoading, error };
}

// Hook to buy access to an IP asset
export function useBuyAccess() {
  const { origin } = useOriginAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyAccess = useCallback(async (tokenId: string, periods: number = 1) => {
    if (!origin) {
      throw new Error('Origin not connected');
    }

    if (!/^\d+$/.test(tokenId)) {
      throw new Error(`Invalid token ID: ${tokenId}. Must be numeric.`);
    }

    setIsLoading(true);
    setError(null);
    try {
      // Use the smart buy access that handles payment approval
      const originInstance = origin as OriginInstance;
      const result = await originInstance.buyAccessSmart(BigInt(tokenId), periods);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy access';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [origin]);

  return { buyAccess, isLoading, error };
}

// Hook to get subscription expiry
export function useSubscriptionExpiry(tokenId: string) {
  const { origin, address } = useOriginAuth();
  const [expiry, setExpiry] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpiry = useCallback(async () => {
    if (!origin || !address || !tokenId) return;

    if (!/^\d+$/.test(tokenId)) {
      console.warn(`Cannot fetch expiry for non-numeric token ID: ${tokenId}`);
      setExpiry(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const originInstance = origin as OriginInstance;
      const expiryTimestamp = await originInstance.subscriptionExpiry(address, BigInt(tokenId));
      setExpiry(expiryTimestamp ? new Date(Number(expiryTimestamp) * 1000) : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch expiry');
      setExpiry(null);
    } finally {
      setIsLoading(false);
    }
  }, [origin, address, tokenId]);

  useEffect(() => {
    fetchExpiry();
  }, [fetchExpiry]);

  return { expiry, isLoading, error, refetch: fetchExpiry };
}

// Hook to get asset data with fallback to uploads list
export function useAssetData(tokenId: string) {
  const { origin } = useOriginAuth();
  const { uploads } = useOrigin();
  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!origin || !tokenId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // First, try to find the asset in the uploads list (this works for all videos)
    const originUploads = uploads.data || [];
    const foundUpload = originUploads.find((upload: unknown) => {
      const uploadData = upload as Record<string, unknown>;
      const uploadId = (uploadData.tokenId as string)?.toString() || (uploadData.id as string);
      return uploadId === tokenId;
    });

    if (foundUpload) {
      console.log('📁 Found asset in uploads list:', foundUpload);
      setData(foundUpload);
      setIsLoading(false);
      return;
    }

    // If not found in uploads and tokenId is numeric, try the Origin SDK getData method
    if (!/^\d+$/.test(tokenId)) {
      console.warn(`Cannot fetch data for non-numeric token ID: ${tokenId}`);
      setError(`Invalid token ID format: ${tokenId}`);
      setData(null);
      setIsLoading(false);
      return;
    }

    // Fallback to Origin SDK getData method
    const fetchFromOrigin = async () => {
      try {
        const originInstance = origin as OriginInstance;
        const assetData = await originInstance.getData(BigInt(tokenId));
        console.log('🔗 Fetched asset from Origin SDK:', assetData);
        setData(assetData);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch from Origin SDK:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch asset data');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromOrigin();
  }, [origin, tokenId, uploads.data]);

  const refetchData = useCallback(() => {
    setIsLoading(true);
  }, []);

  return { data, isLoading, error, refetch: refetchData };
} 
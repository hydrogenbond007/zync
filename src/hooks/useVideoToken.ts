import { useState, useCallback, useEffect } from 'react';
import { useWriteContract, useReadContract, useWatchContractEvent, useAccount } from 'wagmi';
import { parseEther } from 'viem';

import { 
  ZYNC_FACTORY_ADDRESS, 
  ZYNC_FACTORY_ABI 
} from '@/services/web3';

export function useVideoToken() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { address } = useAccount();

  // Contract write hook
  const { writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  // Get creator's videos
  const { data: creatorVideos, refetch: refetchCreatorVideos, error: creatorVideosError } = useReadContract({
    address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
    abi: ZYNC_FACTORY_ABI,
    functionName: 'getCreatorVideos',
    args: address ? [address] : undefined,
  });

  // Get all videos
  const { data: allVideos, refetch: refetchAllVideos, error: allVideosError } = useReadContract({
    address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
    abi: ZYNC_FACTORY_ABI,
    functionName: 'getAllVideos',
  });

  // Watch for VideoRegistered event
  useWatchContractEvent({
    address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
    abi: ZYNC_FACTORY_ABI,
    eventName: 'VideoRegistered',
    onLogs() {
      // Refetch data when new videos are registered
      refetchAllVideos();
      if (address) refetchCreatorVideos();
    },
  });

  // Handle contract read errors
  useEffect(() => {
    if (creatorVideosError) {
      console.error('Error fetching creator videos:', creatorVideosError);
    }
    if (allVideosError) {
      console.error('Error fetching all videos:', allVideosError);
    }
  }, [creatorVideosError, allVideosError]);

  const handleRegisterVideo = useCallback(
    async (
      videoURI: string, 
      videoTitle: string,
      videoDescription: string,
      tokenName: string,
      tokenSymbol: string
    ) => {
      try {
        setIsLoading(true);
        setError(null);
        setIsPending(true);

        console.log('Registering video with data:', {
          videoURI,
          videoTitle,
          videoDescription,
          tokenName,
          tokenSymbol
        });

        writeContract({
          address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
          abi: ZYNC_FACTORY_ABI,
          functionName: 'registerVideo',
          args: [videoURI, videoTitle, videoDescription, tokenName, tokenSymbol],
        });
      } catch (err) {
        console.error('Error registering video:', err);
        setError(err instanceof Error ? err.message : 'Failed to register video');
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract]
  );

  const handleBuyTokens = useCallback(
    async (vaultAddress: string, amount: string) => {
      try {
        setIsLoading(true);
        setError(null);
        setIsPending(true);

        // Convert amount to BigInt (tokens)
        const tokenAmount = BigInt(amount);
        const defaultPrice = 0.0001; // ETH per token
        const totalPrice = parseEther((Number(amount) * defaultPrice).toString());

        console.log('Buying tokens with data:', {
          vaultAddress,
          tokenAmount: tokenAmount.toString(),
          totalPrice: totalPrice.toString()
        });

        writeContract({
          address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
          abi: ZYNC_FACTORY_ABI,
          functionName: 'buyVideoTokens',
          args: [vaultAddress, tokenAmount],
          value: totalPrice,
        });
      } catch (err) {
        console.error('Error buying tokens:', err);
        setError(err instanceof Error ? err.message : 'Failed to buy tokens');
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract]
  );

  // Update isLoading state based on write contract state
  useEffect(() => {
    if (!isWritePending && isPending) {
      setIsPending(false);
      if (writeError) {
        console.error('Transaction error:', writeError);
        setError(writeError.message || 'Transaction failed');
      }
    }
  }, [isWritePending, isPending, writeError]);

  return {
    registerVideo: handleRegisterVideo,
    buyTokens: handleBuyTokens,
    isLoading: isLoading || isWritePending || isPending,
    error,
    creatorVideos,
    allVideos,
    refetchCreatorVideos,
    refetchAllVideos
  };
} 
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAccount, useReadContract } from 'wagmi';
import VideoDetail from '@/components/video/VideoDetail';
import { VIDEO_NFT_ABI, VIDEO_NFT_ADDRESS } from '@/services/web3';
import { ipfsToHttps } from '@/services/ipfs';

interface VideoData {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  vaultAddress: string;
}

export default function WatchPage() {
  const { id } = useParams();
  const { address } = useAccount();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get video metadata
  const { data: videoMetadata, error: videoError } = useReadContract({
    address: VIDEO_NFT_ADDRESS as `0x${string}`,
    abi: VIDEO_NFT_ABI,
    functionName: 'videos',
    args: id ? [BigInt(id as string)] : undefined,
  });

  // Get video URI
  const { data: tokenURI } = useReadContract({
    address: VIDEO_NFT_ADDRESS as `0x${string}`,
    abi: VIDEO_NFT_ABI,
    functionName: 'tokenURI',
    args: id ? [BigInt(id as string)] : undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        if (videoError || !videoMetadata) {
          throw new Error('Could not load video data');
        }
        
        // Extract data from the contract response
        const metadata = videoMetadata as unknown as {
          title: string;
          description: string;
          creator: string;
          timestamp: bigint;
          royaltyVault: string;
        };
        
        // Format the data
        setVideoData({
          id: id as string,
          title: metadata.title,
          description: metadata.description,
          creator: metadata.creator,
          timestamp: Number(metadata.timestamp) * 1000, // Convert to JS timestamp
          videoURI: tokenURI as string,
          vaultAddress: metadata.royaltyVault,
        });
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, videoMetadata, tokenURI, videoError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">
            {error || 'Could not load video data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <VideoDetail
            id={videoData.id}
            title={videoData.title}
            description={videoData.description}
            creator={videoData.creator}
            timestamp={videoData.timestamp}
            videoURI={videoData.videoURI}
            vaultAddress={videoData.vaultAddress}
          />
        </div>
      </div>
    </div>
  );
} 
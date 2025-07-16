'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useReadContract } from 'wagmi';
import VideoDetail from '@/components/video/VideoDetail';
import { IP_NFT_ADDRESS, IP_NFT_ABI } from '@/services/web3';
import { ethers } from 'ethers';
import { irysToHttps } from '@/services/irys';

interface VideoData {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  price: string;
  duration: number;
}

export default function WatchPage() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tokenId = id ? BigInt(id as string) : undefined;

  const { data: terms, error: termsError } = useReadContract({
    address: IP_NFT_ADDRESS,
    abi: IP_NFT_ABI,
    functionName: 'getTerms',
    args: tokenId ? [tokenId] : undefined,
  });

  const { data: tokenURI, error: uriError } = useReadContract({
    address: IP_NFT_ADDRESS,
    abi: IP_NFT_ABI,
    functionName: 'tokenURI',
    args: tokenId ? [tokenId] : undefined,
  });
  
  const { data: owner, error: ownerError } = useReadContract({
    address: IP_NFT_ADDRESS,
    abi: IP_NFT_ABI,
    functionName: 'ownerOf',
    args: tokenId ? [tokenId] : undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id || !terms || !tokenURI || !owner) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        if (termsError || uriError || ownerError) {
            throw new Error('Could not load video data from the contract.');
        }

        // The metadata (title, description) is now off-chain in the JSON file pointed to by tokenURI.
        // We need to fetch it.
        const metadataResponse = await fetch(irysToHttps(tokenURI as string));
        if(!metadataResponse.ok) throw new Error("Failed to fetch metadata");
        const metadata = await metadataResponse.json();

        const typedTerms = terms as [bigint, number, number, string];
        
        setVideoData({
          id: id as string,
          title: metadata.title,
          description: metadata.description,
          creator: owner as string,
          timestamp: metadata.timestamp, // Assuming timestamp is in the off-chain metadata
          videoURI: metadata.videoURI, // Assuming the actual video URI is also in the metadata
          price: ethers.formatEther(typedTerms[0]),
          duration: typedTerms[1] / (24 * 60 * 60), // Convert seconds to days
        });
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, terms, tokenURI, owner, termsError, uriError, ownerError]);

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
            price={videoData.price}
            duration={videoData.duration}
          />
        </div>
      </div>
    </div>
  );
} 
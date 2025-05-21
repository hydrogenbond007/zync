'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useReadContract } from 'wagmi';
import Link from 'next/link';
import { 
  VIDEO_NFT_ADDRESS, 
  VIDEO_NFT_ABI, 
  ZYNC_FACTORY_ADDRESS, 
  ZYNC_FACTORY_ABI 
} from '@/services/web3';
import VideoCard from '@/components/video/VideoCard';

interface Video {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  vaultAddress: string;
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all video IDs
  const { data: videoIds } = useReadContract({
    address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
    abi: ZYNC_FACTORY_ABI,
    functionName: 'getAllVideos',
  });

  // Load video details for each ID
  useEffect(() => {
    const loadVideos = async () => {
      if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const videosData: Video[] = [];
        const fetchPromises = [];

        // Create fetch promises for each video ID
        for (const id of videoIds) {
          const fetchVideoDetails = async () => {
            try {
              // Fetch video metadata
              const metadata = await fetchVideoMetadata(id.toString());
              // Fetch video URI
              const uri = await fetchVideoURI(id.toString());
              
              return {
                id: id.toString(),
                ...metadata,
                videoURI: uri
              };
            } catch (err) {
              console.error(`Error fetching video ${id}:`, err);
              return null;
            }
          };
          
          fetchPromises.push(fetchVideoDetails());
        }

        // Execute all promises in parallel
        const results = await Promise.all(fetchPromises);
        
        // Filter out any failed fetches and add successful ones to our videos array
        for (const result of results) {
          if (result) {
            videosData.push(result);
          }
        }

        setVideos(videosData);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [videoIds]);

  // Helper function to fetch video metadata
  const fetchVideoMetadata = async (id: string) => {
    // This would normally be a contract call, but we'll mock it for now
    // TODO: Replace with actual contract call in production
    const response = await fetch(`/api/videos/${id}`).catch(() => null);
    
    // If API call fails, return mock data as fallback
    if (!response) {
      return {
        title: `Video ${id}`,
        description: 'This is a video description.',
        creator: '0x1234567890123456789012345678901234567890',
        timestamp: Date.now(),
        vaultAddress: '0x0000000000000000000000000000000000000000',
      };
    }
    
    return await response.json();
  };

  // Helper function to fetch video URI
  const fetchVideoURI = async (id: string) => {
    // This would normally be a contract call, but we'll mock it for now
    // TODO: Replace with actual contract call in production
    return `ipfs://QmVideoHash${id}`;
  };

  // Filter videos based on search query
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Explore Content
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover videos and invest in their IP
          </p>

          {/* Search Bar */}
          <div className="mt-8 w-full max-w-lg">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-12 text-center">
              <p className="text-gray-600">Loading videos...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="mt-12 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* No videos state */}
          {!isLoading && !error && videos.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-600">No videos available yet.</p>
              <Link href="/upload" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                Upload a video
              </Link>
            </div>
          )}

          {/* Video Grid */}
          {!isLoading && !error && filteredVideos.length > 0 && (
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  creator={video.creator}
                  timestamp={video.timestamp}
                  videoURI={video.videoURI}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
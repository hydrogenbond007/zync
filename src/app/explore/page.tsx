'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAllIpAssets } from '@/hooks/useIpAsset';
import VideoCard from '@/components/video/VideoCard';
import { IIpAsset } from '@/types';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use the new hook to get all assets.
  // NOTE: This currently returns mock/empty data. A subgraph is needed for real data.
  const { assets: videos, isLoading, error } = useAllIpAssets();

  // Filter videos based on search query
  const filteredVideos = videos.filter((video: IIpAsset) => 
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
                Be the first to create content!
              </Link>
            </div>
          )}

          {/* Video Grid */}
          {!isLoading && !error && filteredVideos.length > 0 && (
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video: IIpAsset) => (
                <VideoCard
                  key={video.id}
                  {...video}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
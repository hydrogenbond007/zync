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
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-12">
            <div className="inline-block p-4 border-2 border-cyan-400 rounded-lg mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-cyan-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white font-mono">
              EXPLORE CONTENT
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Discover videos • Invest in IP • Build your portfolio
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-cyan-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg bg-gray-900 border border-gray-600 py-4 pl-12 pr-4 text-white font-mono placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center">
              <div className="inline-block p-6 border-2 border-cyan-400 rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-cyan-400 rounded"></div>
              </div>
              <p className="mt-4 text-gray-400 font-mono">LOADING VIDEOS...</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center">
              <div className="inline-block p-6 border-2 border-red-500 rounded-lg">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
              </div>
              <p className="mt-4 text-red-400 font-mono">ERROR: {error}</p>
            </div>
          )}

          {/* No videos state */}
          {!isLoading && !error && videos.length === 0 && (
            <div className="text-center">
              <div className="inline-block p-8 border-2 border-gray-600 rounded-lg mb-6">
                <div className="w-12 h-12 bg-gray-600 rounded mx-auto"></div>
              </div>
              <p className="text-gray-400 font-mono mb-4">NO VIDEOS AVAILABLE YET</p>
              <Link href="/upload" className="text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
                → BE THE FIRST TO CREATE CONTENT
              </Link>
            </div>
          )}

          {/* Video Grid */}
          {!isLoading && !error && filteredVideos.length > 0 && (
            <div className="w-full">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredVideos.map((video: IIpAsset) => (
                  <VideoCard
                    key={video.id}
                    {...video}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
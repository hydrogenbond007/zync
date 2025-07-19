'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { irysToHttps } from '@/services/irys';

interface VideoCardProps {
  id: string;
  title: string;
  creator: string;
  thumbnailUri: string;
  tokenPrice: bigint;
  tokenSymbol: string;
  views: number;
  onInvest?: () => void;
}

export function VideoCard({
  id,
  title,
  creator,
  thumbnailUri,
  tokenPrice,
  tokenSymbol,
  views,
  onInvest,
}: VideoCardProps) {
  const { address } = useAccount();
  const [isHovered, setIsHovered] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/watch/${id}`} className="flex-shrink-0 relative h-48">
        <Image
          className="object-cover"
          src={irysToHttps(thumbnailUri)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Watch Now</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <Link href={`/watch/${id}`} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
              {title}
            </p>
          </Link>
          <p className="mt-3 text-base text-gray-500">
            Created by {formatAddress(creator)}
          </p>
          <div className="mt-3 flex items-center">
            <span className="text-sm text-gray-500">{views} views</span>
            <span className="mx-2 text-gray-500">•</span>
            <span className="text-sm font-medium text-indigo-600">
              {formatEther(tokenPrice)} WCAMP per {tokenSymbol}
            </span>
          </div>
        </div>
        {address && onInvest && (
          <div className="mt-6">
            <button
              onClick={onInvest}
              className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Invest Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
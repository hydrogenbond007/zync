'use client';

import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useAccount, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import Link from 'next/link';
import VideoCard from '@/components/video/VideoCard';
import { 
  ZYNC_FACTORY_ADDRESS, 
  ZYNC_FACTORY_ABI,
  VIDEO_NFT_ADDRESS,
  VIDEO_NFT_ABI,
  ROYALTY_VAULT_ABI
} from '@/services/web3';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface Video {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  vaultAddress: string;
}

interface Investment {
  id: string;
  title: string;
  description: string;
  creator: string;
  vaultAddress: string;
  tokensOwned: string;
  totalDividends: string;
  availableDividends: string;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState(0);
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [myInvestments, setMyInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get creator's videos
  const { data: creatorVideoIds } = useReadContract({
    address: ZYNC_FACTORY_ADDRESS as `0x${string}`,
    abi: ZYNC_FACTORY_ABI,
    functionName: 'getCreatorVideos',
    args: address ? [address] : undefined,
  });

  // Load video data
  useEffect(() => {
    const loadVideos = async () => {
      if (!address || !creatorVideoIds || !Array.isArray(creatorVideoIds)) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Mock data for demonstration - would be replaced with actual contract calls
        const videos: Video[] = [];
        
        for (const id of creatorVideoIds) {
          videos.push({
            id: id.toString(),
            title: `Video ${id}`,
            description: 'This is a description of the video content.',
            creator: address,
            timestamp: Date.now() - Math.floor(Math.random() * 10000000),
            videoURI: `ipfs://QmVideoHash${id}`,
            vaultAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
          });
        }
        
        setMyVideos(videos);
        
        // Also get investment data (videos where user owns tokens but is not the creator)
        await loadInvestments();
      } catch (err) {
        console.error('Error loading videos:', err);
        setError(err instanceof Error ? err.message : 'Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [address, creatorVideoIds]);

  // Load user's investments
  const loadInvestments = async () => {
    if (!address) return;
    
    try {
      // Mock data - would be replaced with actual blockchain queries
      const investments: Investment[] = [
        {
          id: '0',
          title: 'Web3 Tutorial',
          description: 'Learn about Web3 concepts.',
          creator: '0x1234567890123456789012345678901234567890',
          vaultAddress: '0x2345678901234567890123456789012345678901',
          tokensOwned: ethers.formatUnits('5000000000000000000000', 18), // 5000 tokens
          totalDividends: ethers.formatUnits('100000000000000000', 18), // 0.1 ETH
          availableDividends: ethers.formatUnits('50000000000000000', 18), // 0.05 ETH
        },
        {
          id: '1',
          title: 'Blockchain Development',
          description: 'Building on blockchain platforms.',
          creator: '0x3456789012345678901234567890123456789012',
          vaultAddress: '0x4567890123456789012345678901234567890123',
          tokensOwned: ethers.formatUnits('10000000000000000000000', 18), // 10000 tokens
          totalDividends: ethers.formatUnits('200000000000000000', 18), // 0.2 ETH
          availableDividends: ethers.formatUnits('100000000000000000', 18), // 0.1 ETH
        }
      ];
      
      setMyInvestments(investments);
    } catch (err) {
      console.error('Error loading investments:', err);
    }
  };

  // Handle claiming dividends
  const handleClaimDividends = async (vaultAddress: string) => {
    try {
      console.log(`Claiming dividends from ${vaultAddress}`);
      // TODO: Implement actual dividend claim from RoyaltyVault
      
      // Refresh investments after claiming
      await loadInvestments();
    } catch (err) {
      console.error('Failed to claim dividends:', err);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
          <p className="mt-2 text-gray-600">
            Please connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your content and investments
          </p>

          <div className="mt-8">
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="flex space-x-1 rounded-xl bg-indigo-900/20 p-1">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  My Content
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-indigo-100 hover:bg-white/[0.12] hover:text-white'
                    )
                  }
                >
                  My Investments
                </Tab>
              </Tab.List>
              <Tab.Panels className="mt-4">
                <Tab.Panel>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>Loading your videos...</p>
                    </div>
                  ) : myVideos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven&apos;t uploaded any videos yet.</p>
                      <Link href="/upload" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                        Upload a video
                      </Link>
                    </div>
                  ) : (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                      {myVideos.map((video) => (
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
                </Tab.Panel>
                <Tab.Panel>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p>Loading your investments...</p>
                    </div>
                  ) : myInvestments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">You haven&apos;t invested in any videos yet.</p>
                      <Link href="/explore" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                        Explore videos to invest
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myInvestments.map((investment) => (
                        <div
                          key={investment.id}
                          className="bg-white shadow rounded-lg p-6"
                        >
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/watch/${investment.id}`} className="hover:text-indigo-600">
                              {investment.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Creator: {investment.creator.slice(0, 6)}...{investment.creator.slice(-4)}
                          </p>
                          <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="block font-medium text-gray-900">
                                {investment.tokensOwned}
                              </span>
                              Tokens Owned
                            </div>
                            <div>
                              <span className="block font-medium text-gray-900">
                                {investment.totalDividends} ETH
                              </span>
                              Total Earnings
                            </div>
                            <div>
                              <span className="block font-medium text-gray-900">
                                {investment.availableDividends} ETH
                              </span>
                              Available to Claim
                            </div>
                          </div>
                          {Number(investment.availableDividends) > 0 && (
                            <button
                              onClick={() => handleClaimDividends(investment.vaultAddress)}
                              className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Claim Dividends
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
    </div>
  );
} 
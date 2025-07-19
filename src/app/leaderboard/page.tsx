'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  TrophyIcon, 
  CurrencyDollarIcon, 
  FireIcon, 
  StarIcon,
  ChartBarIcon,
  SparklesIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { LEADERBOARD_CATEGORIES, type CreatorMetrics } from '@/types/leaderboard';
import { useLeaderboard } from '@/hooks/useLeaderboard';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatRevenue(revenue: bigint) {
  return `${(Number(revenue) / 1e18).toFixed(2)} WCAMP`;
}

function getRankChange(current: number, previous?: number) {
  if (!previous) return 0;
  return previous - current;
}

function RankChangeIcon({ change }: { change: number }) {
  if (change > 0) {
    return <ArrowUpIcon className="h-4 w-4 text-green-500" />;
  } else if (change < 0) {
    return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
  }
  return <MinusIcon className="h-4 w-4 text-gray-400" />;
}

function LeaderboardTable({ creators, category }: { creators: CreatorMetrics[], category: string }) {
  const getMetricValue = (creator: CreatorMetrics, metric: keyof CreatorMetrics) => {
    const value = creator[metric];
    if (typeof value === 'bigint') {
      return formatRevenue(value);
    }
    if (typeof value === 'number') {
      if (metric === 'averageRating') {
        return value.toFixed(1);
      }
      if (metric.includes('Rate') || metric.includes('retention')) {
        return `${(value * 100).toFixed(1)}%`;
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Videos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Change
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {creators.slice(0, 50).map((creator, index) => {
            const rankChange = getRankChange(creator.rank, creator.previousRank);
            
            return (
              <tr key={creator.address} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 && (
                      <div className="mr-2">
                        {index === 0 && <span className="text-yellow-500 text-lg">🥇</span>}
                        {index === 1 && <span className="text-gray-400 text-lg">🥈</span>}
                        {index === 2 && <span className="text-yellow-600 text-lg">🥉</span>}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      #{creator.rank}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {creator.displayName?.charAt(0) || formatAddress(creator.address).charAt(2)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {creator.displayName || formatAddress(creator.address)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatAddress(creator.address)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {creator.totalVideos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {creator.leaderboardScore}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getMetricValue(creator, LEADERBOARD_CATEGORIES.find(c => c.id === category)?.metric || 'totalRevenue')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <RankChangeIcon change={rankChange} />
                    <span className={classNames(
                      'ml-1 text-sm',
                      rankChange > 0 ? 'text-green-600' : rankChange < 0 ? 'text-red-600' : 'text-gray-500'
                    )}>
                      {rankChange !== 0 ? Math.abs(rankChange) : '-'}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const { leaderboardData: processedMetrics, isLoading, error } = useLeaderboard();

  const categoryIcons = {
    '🏆': TrophyIcon,
    '💰': CurrencyDollarIcon,
    '🔥': FireIcon,
    '⭐': StarIcon,
    '📈': ChartBarIcon,
    '🌟': SparklesIcon,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Leaderboard</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Creator Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most successful creators on Zync. Rankings based on engagement, 
            revenue, content quality, and platform contribution.
          </p>
          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>

        {/* No Data State */}
        {!isLoading && processedMetrics.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No creators yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to upload content and claim the top spot!
            </p>
          </div>
        )}

        {/* Stats Cards */}
        {processedMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Creators</p>
                <p className="text-2xl font-bold text-gray-900">{processedMetrics.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatRevenue(processedMetrics.reduce((sum, c) => sum + c.totalRevenue, BigInt(0)))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <FireIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processedMetrics.reduce((sum, c) => sum + c.totalVideos, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Category Tabs */}
        {processedMetrics.length > 0 && (
        <Tab.Group selectedIndex={selectedCategory} onChange={setSelectedCategory}>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-8">
            {LEADERBOARD_CATEGORIES.map((category) => {
              const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons];
              return (
                <Tab
                  key={category.id}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-purple-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-purple-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-purple-600'
                    )
                  }
                >
                  <div className="flex items-center justify-center space-x-2">
                    <IconComponent className="h-5 w-5" />
                    <span>{category.name}</span>
                  </div>
                </Tab>
              );
            })}
          </Tab.List>
          
          <Tab.Panels>
            {LEADERBOARD_CATEGORIES.map((category) => (
              <Tab.Panel key={category.id}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                  <LeaderboardTable 
                    creators={processedMetrics} 
                    category={category.id}
                  />
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
        )}
      </div>
    </div>
  );
} 
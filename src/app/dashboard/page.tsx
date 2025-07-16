'use client';

import { Tab } from '@headlessui/react';
import { FilmIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCreatorIpAssets, useAllIpAssets, useHasAccess } from '@/hooks/useIpAsset';
import { useOriginAuth } from '@/components/providers/origin-provider';
import VideoCard from '@/components/video/VideoCard';
import { IIpAsset } from '@/types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// A new component to render the list of subscribed assets
const SubscribedAsset = ({ asset }: { asset: IIpAsset }) => {
    // NOTE: This is inefficient as it makes a separate call for each asset.
    // In a real app, this data would ideally be fetched in a single batch
    // from a subgraph or a specialized hook.
    const { hasAccess } = useHasAccess(asset.id);

    // For now, we just show a placeholder if they have access.
    // A full implementation would fetch asset details here.
    if (!hasAccess) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-900">{asset.title}</p>
                <p className="text-xs text-gray-500">Token ID: {asset.id.toString()}</p>
            </div>
            <Link 
                href={`/watch/${asset.id}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
                Watch
            </Link>
        </div>
    );
};


export default function DashboardPage() {
  const { address } = useOriginAuth();
  // Using the new hooks to fetch data.
  // NOTE: These hooks currently return mock/empty data.
  // A full implementation requires a subgraph.
  const { assets: createdAssets, isLoading: isLoadingCreations, error: creationsError } = useCreatorIpAssets(address || undefined);
  const { assets: allAssets, isLoading: isLoadingAll, error: allAssetsError } = useAllIpAssets();

  const isLoading = isLoadingCreations || isLoadingAll;
  const error = creationsError || allAssetsError;

  const tabs = [
    { name: 'My Creations', icon: FilmIcon },
    { name: 'My Subscriptions', icon: CheckBadgeIcon },
  ];

  // This is not the final implementation, just a placeholder to show the concept.
  // The correct way would be to have a dedicated hook like `useMySubscriptions`.
  // For now, we are just preparing the UI. The list will appear empty because of the hook logic.
  const subscribedAssets = allAssets;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your created content and view your active subscriptions.
            </p>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/5 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-gray-700 hover:bg-white/[0.12] hover:text-indigo-600'
                    )
                  }
                >
                   <div className="flex items-center justify-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </div>
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                 {isLoading && <p>Loading creations...</p>}
                 {error && <p className="text-red-500">{error}</p>}
                 {!isLoading && !error && (
                    <>
                        {createdAssets.length === 0 ? (
                            <div className="text-center py-12">
                                <FilmIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No content created</h3>
                                <p className="mt-1 text-sm text-gray-500">You have not created any content yet.</p>
                                <div className="mt-6">
                                <Link
                                    href="/upload"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Create Content
                                </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {createdAssets.map((asset: IIpAsset) => (
                                    <VideoCard
                                        key={asset.id}
                                        {...asset}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                 )}
              </Tab.Panel>
              <Tab.Panel
                className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                )}
              >
                 {isLoading && <p>Loading subscriptions...</p>}
                 {error && <p className="text-red-500">{error}</p>}
                 {!isLoading && !error && (
                    <>
                        {subscribedAssets.length === 0 ? (
                           <div className="text-center py-12">
                                <CheckBadgeIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">No subscriptions</h3>
                                <p className="mt-1 text-sm text-gray-500">You have not purchased access to any content yet.</p>
                                 <div className="mt-6">
                                <Link
                                    href="/explore"
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Explore Content
                                </Link>
                                </div>
                           </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                               {/* 
                                 This is a simplified representation. A subgraph is the proper solution.
                                 We are passing all assets to the SubscribedAsset component, which will
                                 then individually check for access. This is very inefficient but demonstrates the flow.
                               */}
                               {subscribedAssets.map((asset: IIpAsset) => (
                                   <SubscribedAsset key={asset.id} asset={asset} />
                               ))}
                            </div>
                        )}
                    </>
                 )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
} 
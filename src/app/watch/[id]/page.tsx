'use client';

import { useParams } from 'next/navigation';
import VideoDetail from '@/components/video/VideoDetail';
import { useAssetData, useHasAccess } from '@/hooks/useIpAsset';

export default function WatchPage() {
  const { id } = useParams();
  
  const tokenId = id as string;
  
  // Use Origin SDK hooks to fetch asset data and check access
  const { data: assetData, isLoading: isLoadingData, error: dataError } = useAssetData(tokenId);
  const { hasAccess, isLoading: isLoadingAccess, error: accessError } = useHasAccess(tokenId);

  const isLoading = isLoadingData || isLoadingAccess;
  const error = dataError || accessError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!assetData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Video not found</h2>
          <p className="mt-2 text-gray-600">
            The video you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Transform assetData to match VideoDetail expected format
  const assetRecord = assetData as Record<string, unknown>;
  const videoData = {
    id: tokenId,
    title: (assetRecord?.title as string) || `Asset ${tokenId}`,
    description: (assetRecord?.description as string) || '',
    creator: (assetRecord?.creator as string) || 'Unknown',
    videoURI: (assetRecord?.contentURI as string) || '',
    timestamp: Date.now(), // Current timestamp as fallback
    price: '0.01', // This would come from license terms
    duration: 30, // This would come from license terms
    hasAccess: hasAccess
  };

  return <VideoDetail {...videoData} />;
} 
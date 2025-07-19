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
  
  // Extract video URI from multiple possible fields
  const possibleVideoURIs = [
    assetRecord?.contentURI as string,
    assetRecord?.uri as string,
    assetRecord?.videoURI as string,
    assetRecord?.url as string,
    assetRecord?.contentUrl as string,
    (assetRecord?.metadata as Record<string, unknown>)?.uri as string,
    (assetRecord?.metadata as Record<string, unknown>)?.url as string,
    (assetRecord?.metadata as Record<string, unknown>)?.contentUrl as string
  ].filter(Boolean);
  
  const videoURI = possibleVideoURIs[0] || '';
  
  // Extract title from multiple possible fields  
  const possibleTitles = [
    assetRecord?.title as string,
    assetRecord?.name as string,
    (assetRecord?.metadata as Record<string, unknown>)?.title as string,
    (assetRecord?.metadata as Record<string, unknown>)?.name as string
  ].filter(Boolean);
  
  const title = possibleTitles[0] || `Video ${tokenId}`;
  
  // Extract description from multiple possible fields
  const possibleDescriptions = [
    assetRecord?.description as string,
    (assetRecord?.metadata as Record<string, unknown>)?.description as string
  ].filter(Boolean);
  
  const description = possibleDescriptions[0] || '';
  
  console.log('🎥 Asset data:', assetRecord);
  console.log('🔗 Video URI candidates:', possibleVideoURIs);
  console.log('📹 Selected video URI:', videoURI);
  console.log('📝 Title candidates:', possibleTitles);
  console.log('📄 Description candidates:', possibleDescriptions);
  console.log('🔑 Current Client ID:', process.env.NEXT_PUBLIC_CAMP_CLIENT_ID);
  console.log('🆔 Token ID:', tokenId);
  
  // Check if the video URI contains the old client ID
  if (videoURI && videoURI.includes('wv2h4to5qa')) {
    console.warn('⚠️ Video URI contains old client ID (wv2h4to5qa), this may cause 400 errors');
    console.log('🔍 Debugging old client ID issue:');
    console.log('   - Current env client ID:', process.env.NEXT_PUBLIC_CAMP_CLIENT_ID);
    console.log('   - Video URI with old ID:', videoURI);
    console.log('   - Raw asset data:', assetRecord);
    console.log('   - This suggests the video was uploaded with old client ID or SDK has cached data');
  }
  
  const videoData = {
    id: tokenId,
    title: title,
    description: description,
    creator: (assetRecord?.creator as string) || 'Unknown',
    videoURI: videoURI,
    timestamp: Date.now(), // Current timestamp as fallback
    price: '0.01', // This would come from license terms (in CAMP)
    duration: 30, // This would come from license terms
    hasAccess: hasAccess
  };

  return <VideoDetail {...videoData} />;
} 
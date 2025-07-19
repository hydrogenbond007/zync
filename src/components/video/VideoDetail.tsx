'use client';

import { useState } from 'react';
import { useOriginAuth } from '@/components/providers/origin-provider';
import { useHasAccess, useBuyAccess } from '@/hooks/useIpAsset';
import { showSuccess, showError, showLoading, dismissToast } from '@/components/ui/ToastProvider';
import { VideoPlayer } from './VideoPlayer';

interface VideoDetailProps {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  price: string;
  duration: number;
}

export default function VideoDetail({
  id,
  title,
  description,
  creator,
  timestamp,
  videoURI,
  price,
  duration
}: VideoDetailProps) {
  const { address } = useOriginAuth();
  const { hasAccess } = useHasAccess(id);
  const { buyAccess, isLoading: isBuyLoading } = useBuyAccess();
  
  const [periods, setPeriods] = useState(1);

  // Use videoURI directly - Origin SDK should provide proper URLs
  const videoUrl = videoURI;
  const isCreator = address?.toLowerCase() === creator.toLowerCase();
  const formattedDate = new Date(timestamp).toLocaleDateString();
  const canWatch = hasAccess || isCreator;

  const handleBuyAccess = async () => {
    if (!address || !id || periods <= 0) return;
    
    let toastId;
    try {
      toastId = showLoading('Processing your purchase...');
      
      await buyAccess(id, periods);
      
      if (toastId) dismissToast(toastId);
      showSuccess('Successfully purchased access!');
    } catch (err) {
      console.error("Error buying access:", err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to buy access';
      showError(errorMsg);
    } finally {
        if(toastId) dismissToast(toastId);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Uploaded by {isCreator ? 'you' : creator.slice(0, 6) + '...' + creator.slice(-4)} on {formattedDate}
          </p>
        </div>
        <div className="text-sm text-gray-500">
          ID: {id}
        </div>
      </div>

      <div className="border-t border-gray-200">
        <VideoPlayer
          src={videoUrl}
          title={title}
          poster="/video-placeholder.svg"
          canWatch={canWatch}
        />

        <div className="px-4 py-5 sm:p-6">
          <div className="text-sm text-gray-900 whitespace-pre-wrap">
            {description}
          </div>
        </div>

        {/* Access Purchase */}
        {!isCreator && !canWatch && (
          <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">Purchase Access</h4>
            
            {/* WCAMP Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-800">
                  <strong>Payment requires WCAMP tokens</strong> in your connected wallet.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="periods" className="block text-sm font-medium text-gray-700">
                  Subscription Periods
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="periods"
                    id="periods"
                    min="1"
                    step="1"
                    value={periods}
                    onChange={(e) => setPeriods(parseInt(e.target.value))}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Number of periods to buy"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Total cost: {periods * parseFloat(price)} WCAMP for {periods * duration} days
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleBuyAccess}
                  disabled={isBuyLoading || !address}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuyLoading ? 'Processing...' : 'Buy Access'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>
                Purchase a time-based license to access this content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
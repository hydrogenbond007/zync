'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ipfsToHttps } from '@/services/ipfs';
import { useVideoToken } from '@/hooks/useVideoToken';

interface VideoDetailProps {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
  vaultAddress: string;
}

export default function VideoDetail({
  id,
  title,
  description,
  creator,
  timestamp,
  videoURI,
  vaultAddress,
}: VideoDetailProps) {
  const { address } = useAccount();
  const { buyTokens, isLoading, error } = useVideoToken();
  const [amount, setAmount] = useState('1000');
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState(false);

  const videoUrl = ipfsToHttps(videoURI);
  const isCreator = address?.toLowerCase() === creator.toLowerCase();
  const formattedDate = new Date(timestamp).toLocaleDateString();

  const handleBuyTokens = async () => {
    if (!address || !vaultAddress || !amount) return;
    
    try {
      setBuyError(null);
      setBuySuccess(false);
      await buyTokens(vaultAddress, amount);
      setBuySuccess(true);
    } catch (err) {
      console.error("Error buying tokens:", err);
      setBuyError(err instanceof Error ? err.message : 'Failed to buy tokens');
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
        <div className="aspect-w-16 aspect-h-9">
          <video
            src={videoUrl}
            controls
            className="w-full h-auto"
            poster="/video-placeholder.jpg"
          />
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="text-sm text-gray-900 whitespace-pre-wrap">
            {description}
          </div>
        </div>

        {/* Token Purchase */}
        {!isCreator && (
          <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
            <h4 className="text-base font-medium text-gray-900 mb-4">Invest in this video</h4>
            {buySuccess && (
              <div className="rounded-md bg-green-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Successfully purchased tokens!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(buyError || error) && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {buyError || error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Token amount
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Number of tokens to buy"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Estimated cost: {Number(amount) * 0.0001} ETH
                </p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleBuyTokens}
                  disabled={isLoading || !address}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Buy Tokens'}
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              <p>
                By purchasing tokens, you&apos;re investing in the IP ownership of this video. 
                You&apos;ll receive a proportional share of any royalties distributed by the creator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
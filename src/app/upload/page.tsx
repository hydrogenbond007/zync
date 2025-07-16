'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useOriginAuth } from '@/components/providers/origin-provider';
import { useMintIpAsset } from '@/hooks/useIpAsset'; 
import { showError, showLoading, dismissToast, showSuccess } from '@/components/ui/ToastProvider';
import { LicenseTerms } from '@/types';

export default function UploadPage() {
  const router = useRouter();
  const { isConnected, address } = useOriginAuth();
  const { mintAsset, isLoading: isMinting, error: mintError } = useMintIpAsset();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0.01'); // Default price in ETH
  const [duration, setDuration] = useState('30'); // Default duration in days
  const [royaltyBps, setRoyaltyBps] = useState('1000'); // Default royalty 10%

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !address) return;

    setIsUploading(true);
    setUploadError(null);
    let toastId: string | number = '';

    try {
      // Prepare license terms in the correct format
      const licenseTerms: LicenseTerms = {
        price: BigInt(Math.floor(parseFloat(price) * 1e18)), // Convert ETH to wei
        duration: parseInt(duration) * 24 * 60 * 60, // Convert days to seconds
        royaltyBps: parseInt(royaltyBps),
        paymentToken: '0x0000000000000000000000000000000000000000' // ETH
      };

      const metadata = {
        title,
        description
      };

      toastId = showLoading('Uploading and minting your IP Asset...');

      // Use Origin SDK to upload file and mint in one step
      const tokenId = await mintAsset(
        file,
        metadata,
        licenseTerms,
        (percent: number) => {
          // Update toast with progress if needed
          if (toastId) dismissToast(toastId);
          toastId = showLoading(`Uploading... ${Math.round(percent)}%`);
        }
      );

      if (toastId) dismissToast(toastId);
      showSuccess(`Successfully minted asset! Token ID: ${tokenId}`);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      
      if (toastId) dismissToast(toastId);
      showError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
          <p className="mt-2 text-gray-600">
            Please connect your wallet to upload content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Upload Video
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create an IP Asset for your content with custom license terms.
          </p>

          {(uploadError || mintError) && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">
                {uploadError || mintError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-6 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
              {/* Video File Input */}
              <div>
                <label
                  htmlFor="video"
                  className="block text-sm font-medium text-gray-700"
                >
                  Video File
                </label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="video"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="video"
                          name="video"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, WebM up to 2GB</p>
                  </div>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected file: {file.name}
                  </p>
                )}
              </div>

              {/* Title and Description */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter video title"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Describe your video"
                  />
                </div>
              </div>
              
              {/* License Terms */}
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (ETH)
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 0.01"
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 30"
                  />
                </div>
                <div>
                  <label htmlFor="royaltyBps" className="block text-sm font-medium text-gray-700">
                    Royalty (%)
                  </label>
                  <input
                    type="number"
                    name="royaltyBps"
                    id="royaltyBps"
                    value={parseInt(royaltyBps) / 100}
                    onChange={(e) => setRoyaltyBps(String(parseFloat(e.target.value) * 100))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 10"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || isMinting || !file || !title}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading || isMinting ? 'Processing...' : 'Upload & Mint Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
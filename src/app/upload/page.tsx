'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
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
  const [price, setPrice] = useState('0.01'); // Default price in WCAMP
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
        price: BigInt(Math.floor(parseFloat(price) * 1e18)), // Convert WCAMP to wei
        duration: parseInt(duration) * 24 * 60 * 60, // Convert days to seconds
        royaltyBps: parseInt(royaltyBps),
        paymentToken: '0x1aE9c40eCd2DD6ad5858E5430A556d7aff28A44b' // wCAMP
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-cyan-400 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-400" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%)' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white font-mono">CONNECT WALLET</h2>
          <p className="mt-2 text-gray-400">
            Please connect your wallet to upload content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-block p-4 border-2 border-cyan-400 rounded-lg mb-6">
              <CloudArrowUpIcon className="h-12 w-12 text-cyan-400" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white font-mono">
              UPLOAD VIDEO
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Create an IP Asset • Set license terms • Start monetizing
            </p>
          </div>

          {(uploadError || mintError) && (
            <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-sm text-red-400 font-mono">
                ERROR: {uploadError || mintError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-8 bg-gray-900 border border-gray-700 px-6 py-8 rounded-lg shadow-xl">
              {/* Video File Input */}
              <div>
                <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                  Video File
                </label>
                <div className="flex justify-center rounded-lg border-2 border-dashed border-cyan-400/30 px-6 py-8 hover:border-cyan-400/60 transition-colors">
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto border-2 border-cyan-400 rounded-lg flex items-center justify-center">
                      <CloudArrowUpIcon className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="text-sm text-gray-400">
                      <label
                        htmlFor="video"
                        className="relative cursor-pointer font-medium text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                      >
                        <span>UPLOAD FILE</span>
                        <input
                          id="video"
                          name="video"
                          type="file"
                          accept="video/*"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                      </label>
                      <span className="text-gray-500"> OR DRAG & DROP</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">MP4, WebM • MAX 2GB</p>
                  </div>
                </div>
                {file && (
                  <div className="mt-3 p-3 bg-green-900/20 border border-green-500 rounded-lg">
                    <p className="text-sm text-green-400 font-mono">
                      SELECTED: {file.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Title and Description */}
              <div>
                <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-lg bg-black border border-gray-600 text-white px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono placeholder-gray-500"
                  placeholder="Enter video title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full rounded-lg bg-black border border-gray-600 text-white px-4 py-3 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono placeholder-gray-500 resize-none"
                  placeholder="Describe your video content..."
                />
              </div>
              
              {/* Payment Notice */}
              <div className="bg-cyan-900/20 border border-cyan-400/50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-cyan-400 rounded flex items-center justify-center">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-cyan-400 font-mono uppercase">Payment Info</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      All payments are processed using <span className="text-cyan-400 font-mono">WCAMP</span> tokens. 
                      Users need WCAMP to purchase access to your content.
                    </p>
                  </div>
                </div>
              </div>

              {/* License Terms */}
              <div>
                <h3 className="text-lg font-medium text-white font-mono mb-6 flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  LICENSE TERMS
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                      Access Price
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        step="0.001"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="block w-full rounded-lg bg-black border border-gray-600 text-white px-4 py-3 pr-20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="0.01"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-cyan-400 text-sm font-mono">WCAMP</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-mono">Price per access period</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                      Duration
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="duration"
                        id="duration"
                        min="1"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="block w-full rounded-lg bg-black border border-gray-600 text-white px-4 py-3 pr-16 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="30"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-cyan-400 text-sm font-mono">DAYS</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-mono">How long access lasts</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-400 font-mono uppercase tracking-wide mb-3">
                      Royalty
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="royaltyBps"
                        id="royaltyBps"
                        step="0.1"
                        min="0"
                        max="50"
                        value={parseInt(royaltyBps) / 100}
                        onChange={(e) => setRoyaltyBps(String(parseFloat(e.target.value) * 100))}
                        className="block w-full rounded-lg bg-black border border-gray-600 text-white px-4 py-3 pr-12 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
                        placeholder="10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-cyan-400 text-sm font-mono">%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-mono">Revenue share percentage</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                disabled={isUploading || isMinting || !file || !title}
                variant="cyber"
                size="xl"
                className="px-12"
              >
                {isUploading || isMinting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESSING...
                  </>
                ) : (
                  'UPLOAD & MINT ASSET'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
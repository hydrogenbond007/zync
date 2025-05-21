'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import { uploadToIPFS, uploadMetadataToIPFS } from '@/services/ipfs';
import { useVideoToken } from '@/hooks/useVideoToken';

export default function UploadPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { registerVideo, isLoading: isContractLoading, error: contractError } = useVideoToken();
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !address) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload video to IPFS
      const videoURI = await uploadToIPFS(file);

      // Generate token symbol if not provided (first 5 letters of title, uppercased)
      const tokenSymbol = symbol || title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
      
      // Create token name based on title
      const tokenName = `${title} Token`;

      // Register video and create tokens
      await registerVideo(
        videoURI,
        title,
        description,
        tokenName,
        tokenSymbol
      );

      router.push('/dashboard');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (!address) {
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
            Share your content with the world and tokenize your IP
          </p>

          {(uploadError || contractError) && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">
                {uploadError || contractError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-6 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
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

              <div>
                <label
                  htmlFor="symbol"
                  className="block text-sm font-medium text-gray-700"
                >
                  Token Symbol (optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="symbol"
                    id="symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. VID01 (max 5 characters)"
                    maxLength={5}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This will be the symbol for your video's token. If not provided, we'll generate one from your title.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || isContractLoading || !file || !title}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading || isContractLoading ? 'Processing...' : 'Upload & Tokenize'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
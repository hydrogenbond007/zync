import { upload } from "thirdweb/storage";

// Initialize development mode flag
const isDevelopment = process.env.NODE_ENV === 'development';

// Set default for mock IPFS usage
const useMockIPFS = process.env.NEXT_PUBLIC_USE_MOCK_IPFS !== 'false'; // Default to true unless explicitly set to false

// ThirdWeb client configuration
const client = {
  clientId: "e987593c0d25747a31d0c224c8da5ade",
  secretKey: "PZkszOq9BwzYqJ8ozrxUVVQDMq9TfuvzeM_CtdmCIfsugpuZ__TGCLc_MXAgvqLW7R-R9-m4p8eblBUtSgRxvQ"
};

// Mock implementation for development
async function mockUploadToIPFS(file: File): Promise<string> {
  console.log('Using mock IPFS upload for file:', file.name);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Generate a random CID-like hash
  const mockCid = 'Qm' + Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
  return `ipfs://${mockCid}`;
}

interface IPFSMetadata {
  title: string;
  description: string;
  videoURI: string;
  creator: string;
  timestamp: number;
}

async function mockUploadMetadataToIPFS(metadata: IPFSMetadata): Promise<string> {
  console.log('Using mock IPFS upload for metadata:', metadata);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Generate a random CID-like hash
  const mockCid = 'Qm' + Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
  return `ipfs://${mockCid}`;
}

export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // ALWAYS use mock implementation to bypass ThirdWeb storage limits
    if (true) {
      console.log('Using mock IPFS service to bypass ThirdWeb storage limits');
      return await mockUploadToIPFS(file);
    }
    
    console.log('Uploading file to ThirdWeb IPFS:', file.name);
    
    // Upload to ThirdWeb IPFS with the v5 API
    const uri = await upload({
      client,
      files: [file]
    });
    
    console.log('Upload successful, IPFS URI:', uri);
    return uri;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export async function uploadMetadataToIPFS(metadata: IPFSMetadata): Promise<string> {
  try {
    // ALWAYS use mock implementation to bypass ThirdWeb storage limits
    if (true) {
      console.log('Using mock IPFS service for metadata to bypass ThirdWeb storage limits');
      return await mockUploadMetadataToIPFS(metadata);
    }
    
    console.log('Uploading metadata to ThirdWeb IPFS');
    
    // Create a blob from the metadata
    const metadataBlob = new Blob([JSON.stringify(metadata)], { 
      type: 'application/json' 
    });
    const metadataFile = new File([metadataBlob], 'metadata.json', { 
      type: 'application/json' 
    });
    
    // Upload metadata to ThirdWeb IPFS with the v5 API
    const uri = await upload({
      client,
      files: [metadataFile]
    });
    
    console.log('Metadata upload successful, IPFS URI:', uri);
    return uri;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

export function ipfsToHttps(ipfsUri: string): string {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) {
    // Return a placeholder image URL for development
    return 'https://placehold.co/600x400?text=Video+Placeholder';
  }
  
  // Use ThirdWeb's gateway
  const hash = ipfsUri.replace('ipfs://', '');
  return `https://ipfs.thirdwebstorage.com/ipfs/${hash}`;
} 
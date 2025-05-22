// Browser-compatible implementation for Irys uploads

interface UploadMetadata {
  title: string;
  description: string;
  videoURI: string;
  creator: string;
  timestamp: number;
}

// Mock implementation for development and browser environments
async function mockUpload(file: File): Promise<string> {
  console.log('Using mock upload for file:', file.name);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Generate a random transaction ID
  const mockId = Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
  return mockId;
}

async function mockUploadMetadata(metadata: UploadMetadata): Promise<string> {
  console.log('Using mock upload for metadata:', metadata);
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Generate a random transaction ID
  const mockId = Math.random().toString(36).substring(2, 30) + Math.random().toString(36).substring(2, 30);
  return mockId;
}

export async function uploadToIrys(file: File): Promise<string> {
  try {
    console.log('Using mock upload for file:', file.name);
    // For now, we'll use the mock implementation to avoid Node.js dependencies in browser
    return await mockUpload(file);
  } catch (error) {
    console.error('Error uploading to Irys:', error);
    throw new Error('Failed to upload file to Irys');
  }
}

export async function uploadMetadataToIrys(metadata: UploadMetadata): Promise<string> {
  try {
    console.log('Using mock upload for metadata');
    // For now, we'll use the mock implementation to avoid Node.js dependencies in browser
    return await mockUploadMetadata(metadata);
  } catch (error) {
    console.error('Error uploading metadata to Irys:', error);
    throw new Error('Failed to upload metadata to Irys');
  }
}

export function irysToHttps(irysId: string): string {
  if (!irysId) {
    return 'https://placehold.co/600x400?text=Video+Placeholder';
  }
  
  // Use standard Irys gateway
  return `https://gateway.irys.xyz/${irysId}`;
} 
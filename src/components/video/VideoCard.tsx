import Link from 'next/link';
import { ipfsToHttps } from '@/services/ipfs';

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  creator: string;
  timestamp: number;
  videoURI: string;
}

export default function VideoCard({
  id,
  title,
  description,
  creator,
  timestamp,
  videoURI,
}: VideoCardProps) {
  // Truncate description if it's too long
  const truncatedDescription = description.length > 100
    ? description.substring(0, 100) + '...'
    : description;
  
  // Format the date
  const formattedDate = new Date(timestamp).toLocaleDateString();
  
  // Convert IPFS URL to HTTP URL for display
  const thumbnailUrl = ipfsToHttps(videoURI);
  
  return (
    <Link href={`/watch/${id}`} className="group">
      <div className="bg-white overflow-hidden shadow rounded-lg transition-shadow duration-300 hover:shadow-md">
        <div className="relative pb-[56.25%] bg-gray-200">
          {/* Thumbnail/Video Preview */}
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Fallback if the video thumbnail fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/video-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-white text-sm font-medium">Watch video</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 truncate">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">
            {creator.slice(0, 6)}...{creator.slice(-4)} • {formattedDate}
          </p>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {truncatedDescription}
          </p>
        </div>
      </div>
    </Link>
  );
} 
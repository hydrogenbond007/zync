'use client';

import { TrophyIcon, UserIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

// Mock leaderboard data
const topCreators = [
  { rank: 1, name: 'CryptoVisioneer', revenue: '$2,847', videos: 23, views: '156K' },
  { rank: 2, name: 'TechPixel_dev', revenue: '$2,103', videos: 18, views: '134K' },
  { rank: 3, name: 'RetroFuturist', revenue: '$1,892', videos: 15, views: '98K' },
  { rank: 4, name: 'DigitalArtisan', revenue: '$1,645', videos: 21, views: '87K' },
  { rank: 5, name: 'NeonCreator', revenue: '$1,421', videos: 12, views: '76K' },
  { rank: 6, name: 'PixelMaster_88', revenue: '$1,298', videos: 19, views: '65K' },
  { rank: 7, name: 'CyberArtist', revenue: '$1,156', videos: 14, views: '58K' },
  { rank: 8, name: 'VoxelVision', revenue: '$987', videos: 16, views: '45K' },
  { rank: 9, name: 'ByteCreative', revenue: '$876', videos: 11, views: '42K' },
  { rank: 10, name: 'QuantumPixel', revenue: '$743', videos: 9, views: '38K' },
];

const topVideos = [
  { rank: 1, title: 'The Future of AI Computing', creator: 'CryptoVisioneer', revenue: '$482', views: '28K' },
  { rank: 2, title: 'Cyberpunk City Design Tutorial', creator: 'RetroFuturist', revenue: '$421', views: '25K' },
  { rank: 3, title: 'Blockchain Explained in 8-bit', creator: 'TechPixel_dev', revenue: '$389', views: '22K' },
  { rank: 4, title: 'NFT Art Creation Masterclass', creator: 'DigitalArtisan', revenue: '$356', views: '19K' },
  { rank: 5, title: 'Pixel Art Animation Secrets', creator: 'PixelMaster_88', revenue: '$298', views: '17K' },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block p-4 border-2 border-cyan-400 rounded-lg mb-6">
            <TrophyIcon className="h-12 w-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white font-mono">
            LEADERBOARD
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Top creators • Highest earnings • Best content
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Stats Cards */}
          <Card variant="cyber">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-cyan-400" />
                Total Creators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-400 font-mono">1,247</div>
              <p className="text-gray-500 text-sm">+23 this week</p>
            </CardContent>
          </Card>

          <Card variant="cyber">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2 text-indigo-400" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-400 font-mono">$47.2K</div>
              <p className="text-gray-500 text-sm">+$2.1K this week</p>
            </CardContent>
          </Card>

          <Card variant="cyber">
            <CardHeader>
              <CardTitle className="flex items-center">
                <EyeIcon className="h-5 w-5 mr-2 text-purple-400" />
                Total Views
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400 font-mono">2.8M</div>
              <p className="text-gray-500 text-sm">+156K this week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Creators */}
          <div>
            <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              TOP CREATORS
            </h2>
            <div className="space-y-4">
              {topCreators.map((creator) => (
                <Card key={creator.rank} variant="glass" className="hover:border-cyan-400/40">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold ${
                          creator.rank === 1 ? 'bg-yellow-500 text-black' :
                          creator.rank === 2 ? 'bg-gray-400 text-black' :
                          creator.rank === 3 ? 'bg-amber-600 text-black' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          #{creator.rank}
                        </div>
                        <div>
                          <div className="text-white font-mono font-medium">{creator.name}</div>
                          <div className="text-gray-400 text-sm font-mono">
                            {creator.videos} videos • {creator.views} views
                          </div>
                        </div>
                      </div>
                      <div className="text-cyan-400 font-mono font-bold">
                        {creator.revenue}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Videos */}
          <div>
            <h2 className="text-2xl font-bold text-white font-mono mb-6 flex items-center">
              <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
              TOP VIDEOS
            </h2>
            <div className="space-y-4">
              {topVideos.map((video) => (
                <Card key={video.rank} variant="glass" className="hover:border-indigo-400/40">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                          video.rank === 1 ? 'bg-yellow-500 text-black' :
                          video.rank === 2 ? 'bg-gray-400 text-black' :
                          video.rank === 3 ? 'bg-amber-600 text-black' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          #{video.rank}
                        </div>
                        <div>
                          <div className="text-white font-medium mb-1">{video.title}</div>
                          <div className="text-gray-400 text-sm font-mono">
                            by {video.creator}
                          </div>
                          <div className="text-gray-500 text-sm font-mono">
                            {video.views} views
                          </div>
                        </div>
                      </div>
                      <div className="text-indigo-400 font-mono font-bold">
                        {video.revenue}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 border-2 border-cyan-400/30 rounded-lg">
            <h3 className="text-xl font-bold text-white font-mono mb-2">JOIN THE RANKS</h3>
            <p className="text-gray-400 mb-4">Start creating and climb the leaderboard</p>
            <a 
              href="/upload" 
              className="inline-block px-6 py-3 bg-cyan-400 text-black font-mono font-bold rounded-lg hover:bg-cyan-300 transition-colors"
            >
              START CREATING →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
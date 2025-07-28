import { ArrowRightIcon, PlayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { LogoText } from '../components/ui/Logo';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <SparklesIcon className="h-16 w-16 text-cyan-400 animate-pulse" />
            </div>
            
            <h1 className="text-5xl tracking-tight font-extrabold sm:text-6xl md:text-7xl font-mono">
              <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                OWN THE FUTURE
              </span>
              <span className="block text-white mt-2">OF VIDEO CONTENT</span>
            </h1>
            
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 sm:text-xl font-light leading-relaxed">
              Tokenize your content • Share revenue with your community • Unlock new monetization streams
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/upload">
                <Button size="xl" variant="cyber" className="w-full sm:w-auto">
                  <ArrowRightIcon className="mr-2 h-5 w-5" />
                  UPLOAD VIDEO
                </Button>
              </Link>
              
              <Link href="/explore">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  <PlayIcon className="mr-2 h-5 w-5" />
                  EXPLORE CONTENT
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 font-mono">1.2K+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Videos Tokenized</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-400 font-mono">$50K+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Revenue Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 font-mono">800+</div>
                <div className="text-gray-400 uppercase tracking-wide text-sm">Active Creators</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Content Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl font-mono">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                FEATURED CONTENT
              </span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              Discover trending videos and investment opportunities
            </p>
          </div>
          
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Featured Content Cards */}
            <Card variant="cyber" className="group">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                  <PlayIcon className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>Tech Review: Future of AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Deep dive into the latest AI technologies and their impact on society.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400 font-mono">$250 Revenue</span>
                  <span className="text-gray-500">2.1K views</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="cyber" className="group">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <PlayIcon className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>Crypto Trading Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Professional strategies for cryptocurrency trading and investment.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400 font-mono">$480 Revenue</span>
                  <span className="text-gray-500">3.8K views</span>
                </div>
              </CardContent>
            </Card>

            <Card variant="cyber" className="group">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
                  <PlayIcon className="h-12 w-12 text-white group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>NFT Art Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Step-by-step guide to creating and selling NFT artwork.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyan-400 font-mono">$320 Revenue</span>
                  <span className="text-gray-500">1.9K views</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/explore">
              <Button variant="outline" size="lg">
                VIEW ALL CONTENT
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Documentation Section */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white font-mono mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                IP OWNERSHIP MARKETS
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Built on Camp Network&apos;s Origin Protocol • Democratizing creator finance • The future of content monetization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card variant="cyber" className="group">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                  What is Zync?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  The foundational platform for IP Ownership Markets - enabling video creators to tokenize their IP and share revenue with their community.
                </p>
                <a 
                  href="https://zync-1.gitbook.io/zync-docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
                >
                  READ DOCS →
                </a>
              </CardContent>
            </Card>

            <Card variant="cyber" className="group">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                  Origin Protocol
                </CardTitle>
              </CardHeader>
              <CardContent>
                                 <p className="text-gray-400 mb-4">
                   Camp Network&apos;s specialized IP tokenization framework with on-chain registry, graph structure, and automated revenue distribution.
                 </p>
                <a 
                  href="https://zync-1.gitbook.io/zync-docs/architecture-and-stack" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-mono text-sm transition-colors"
                >
                  LEARN MORE →
                </a>
              </CardContent>
            </Card>

            <Card variant="cyber" className="group">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                  Revenue Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Content tokenization, trading fees, direct revenue sharing, token-powered advertising, and derivative content rights.
                </p>
                <a 
                  href="https://zync-1.gitbook.io/zync-docs/revenue-flows" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-mono text-sm transition-colors"
                >
                  EXPLORE →
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-cyan-900/20 via-indigo-900/20 to-purple-900/20 border border-cyan-400/30 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white font-mono mb-4">
                  Why Zync vs Traditional Platforms?
                </h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                    <span><strong className="text-white">PE-Style Deals for Everyone:</strong> Access revenue-sharing previously reserved for top creators</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 mt-2"></span>
                    <span><strong className="text-white">Searchable Content Focus:</strong> Built for discovery, not algorithmic consumption</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2"></span>
                    <span><strong className="text-white">Community Ownership:</strong> Token holders participate in creator success from day one</span>
                  </li>
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <a 
                  href="https://zync-1.gitbook.io/zync-docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-400 to-indigo-400 text-black font-mono font-bold rounded-lg hover:from-cyan-300 hover:to-indigo-300 transition-all transform hover:scale-105"
                >
                  READ FULL DOCUMENTATION →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-cyan-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <LogoText className="mb-4" />
              <p className="text-gray-400 max-w-md">
                The foundational platform for IP Ownership Markets. Transform how content creates and distributes value.
              </p>
              <div className="flex space-x-4 mt-4">
                <a 
                  href="https://zync-1.gitbook.io/zync-docs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors"
                >
                  Documentation
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4">PLATFORM</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/upload" className="hover:text-cyan-400 transition-colors">Upload</Link></li>
                <li><Link href="/explore" className="hover:text-cyan-400 transition-colors">Explore</Link></li>
                <li><Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link></li>
                <li><Link href="/leaderboard" className="hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-mono font-semibold mb-4">RESOURCES</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://zync-1.gitbook.io/zync-docs/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="https://zync-1.gitbook.io/zync-docs/architecture-and-stack" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Architecture</a></li>
                <li><a href="https://zync-1.gitbook.io/zync-docs/revenue-flows" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Revenue Models</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm font-mono">
                             © 2025 ZYNC • Built on Camp Network&apos;s Origin Protocol
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
      </main>
  );
}

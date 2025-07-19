export interface CreatorMetrics {
  address: string;
  displayName?: string;
  avatar?: string;
  
  // Core Metrics
  totalVideos: number;
  totalViews: number;
  totalRevenue: bigint; // in wei (CAMP tokens)
  totalSubscribers: number;
  
  // Engagement Metrics
  averageRating: number;
  engagementRate: number; // views per video
  retentionRate: number; // repeat viewers
  
  // Economic Metrics
  revenuePerVideo: bigint; // in wei (CAMP tokens)
  subscriptionConversionRate: number; // subscribers/views
  averageSubscriptionDuration: number; // days
  
  // Platform Metrics
  platformAge: number; // days since first upload
  contentConsistency: number; // uploads per week
  
  // Calculated Score
  leaderboardScore: number;
  rank: number;
  previousRank?: number;
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  metric: keyof CreatorMetrics;
  sortOrder: 'desc' | 'asc';
}

export interface LeaderboardEntry {
  creator: CreatorMetrics;
  position: number;
  change: number; // +1, -1, 0
  badge?: 'rising' | 'top' | 'consistent';
}

export const LEADERBOARD_CATEGORIES: LeaderboardCategory[] = [
  {
    id: 'overall',
    name: 'Overall Score',
    description: 'Comprehensive ranking based on all metrics',
    icon: '🏆',
    metric: 'leaderboardScore',
    sortOrder: 'desc'
  },
  {
    id: 'revenue',
    name: 'Top Earners',
    description: 'Creators with highest total revenue',
    icon: '💰',
    metric: 'totalRevenue',
    sortOrder: 'desc'
  },
  {
    id: 'engagement',
    name: 'Most Engaging',
    description: 'Highest engagement rate and views',
    icon: '🔥',
    metric: 'engagementRate',
    sortOrder: 'desc'
  },
  {
    id: 'quality',
    name: 'Quality Content',
    description: 'Best average ratings and retention',
    icon: '⭐',
    metric: 'averageRating',
    sortOrder: 'desc'
  },
  {
    id: 'consistent',
    name: 'Most Consistent',
    description: 'Regular content creators',
    icon: '📈',
    metric: 'contentConsistency',
    sortOrder: 'desc'
  },
  {
    id: 'rising',
    name: 'Rising Stars',
    description: 'New creators with high growth',
    icon: '🌟',
    metric: 'subscriptionConversionRate',
    sortOrder: 'desc'
  }
];

// Leaderboard Scoring Algorithm
export function calculateLeaderboardScore(metrics: Omit<CreatorMetrics, 'leaderboardScore' | 'rank'>): number {
  // Normalize metrics to 0-100 scale and apply weights
  const weights = {
    revenue: 0.25,        // 25% - Economic success
    engagement: 0.20,     // 20% - Audience engagement  
    quality: 0.20,        // 20% - Content quality
    growth: 0.15,         // 15% - Growth metrics
    consistency: 0.10,    // 10% - Content consistency
    retention: 0.10       // 10% - Audience retention
  };
  
  // Revenue score (log scale for fairness)
  const revenueScore = Math.min(100, Math.log10(Number(metrics.totalRevenue) / 1e18 + 1) * 25);
  
  // Engagement score
  const engagementScore = Math.min(100, metrics.engagementRate);
  
  // Quality score
  const qualityScore = (metrics.averageRating / 5) * 100;
  
  // Growth score (subscribers + conversion rate)
  const growthScore = Math.min(100, 
    (metrics.totalSubscribers * 0.1) + (metrics.subscriptionConversionRate * 50)
  );
  
  // Consistency score
  const consistencyScore = Math.min(100, metrics.contentConsistency * 10);
  
  // Retention score
  const retentionScore = Math.min(100, metrics.retentionRate * 100);
  
  // Calculate weighted score
  const totalScore = 
    (revenueScore * weights.revenue) +
    (engagementScore * weights.engagement) +
    (qualityScore * weights.quality) +
    (growthScore * weights.growth) +
    (consistencyScore * weights.consistency) +
    (retentionScore * weights.retention);
    
  return Math.round(totalScore * 10) / 10; // Round to 1 decimal
} 
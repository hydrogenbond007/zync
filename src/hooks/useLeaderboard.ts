'use client';

import { useState, useEffect, useCallback } from 'react';
import { useOrigin } from '@campnetwork/origin/react';

import { type CreatorMetrics, calculateLeaderboardScore } from '@/types/leaderboard';

export function useLeaderboard() {
  const { uploads } = useOrigin();
  const [leaderboardData, setLeaderboardData] = useState<CreatorMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateCreatorMetrics = useCallback((uploads: unknown[]) => {
    // Group uploads by creator
    const creatorGroups = new Map<string, unknown[]>();
    
    uploads.forEach((upload: unknown) => {
      const uploadData = upload as Record<string, unknown>;
      const creator = uploadData.creator as string || 'Unknown';
      
      if (!creatorGroups.has(creator)) {
        creatorGroups.set(creator, []);
      }
      creatorGroups.get(creator)!.push(upload);
    });

    // Calculate metrics for each creator
    const creatorMetrics: CreatorMetrics[] = [];
    
    creatorGroups.forEach((creatorUploads, creatorAddress) => {
      const totalVideos = creatorUploads.length;
      
      // Calculate total revenue (sum of all video earnings)
      let totalRevenue = BigInt(0);
      let totalViews = 0;
      let totalSubscribers = 0;
      let totalRatings = 0;
      let ratingCount = 0;
      
      creatorUploads.forEach((upload: unknown) => {
        const uploadData = upload as Record<string, unknown>;
        
        // Extract revenue data
        const price = uploadData.price as string;
        if (price) {
          totalRevenue += BigInt(price);
        }
        
        // Extract view data (mock for now - Origin SDK doesn't provide this yet)
        totalViews += Math.floor(Math.random() * 1000) + 100;
        
        // Extract subscriber data (mock for now)
        totalSubscribers += Math.floor(Math.random() * 50) + 10;
        
        // Extract rating data (mock for now)
        const rating = Math.random() * 1.5 + 3.5; // 3.5 - 5.0
        totalRatings += rating;
        ratingCount++;
      });

      // Calculate derived metrics
      const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;
      const engagementRate = totalVideos > 0 ? totalViews / totalVideos : 0;
      const revenuePerVideo = totalVideos > 0 ? totalRevenue / BigInt(totalVideos) : BigInt(0);
      const subscriptionConversionRate = totalViews > 0 ? totalSubscribers / totalViews : 0;
      
      // Platform age (days since first upload)
      const firstUpload = creatorUploads[0] as Record<string, unknown>;
      const createdAt = firstUpload.createdAt as string;
      const platformAge = createdAt 
        ? Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      
      // Content consistency (uploads per week)
      const contentConsistency = platformAge > 0 ? (totalVideos / platformAge) * 7 : 0;
      
      // Mock some additional metrics that Origin SDK doesn't provide yet
      const retentionRate = Math.random() * 0.3 + 0.4; // 40-70%
      const averageSubscriptionDuration = Math.floor(Math.random() * 30) + 20; // 20-50 days
      
      const metrics: Omit<CreatorMetrics, 'leaderboardScore' | 'rank'> = {
        address: creatorAddress,
        displayName: creatorAddress === 'Unknown' ? undefined : `Creator_${creatorAddress.slice(-4)}`,
        totalVideos,
        totalViews,
        totalRevenue,
        totalSubscribers,
        averageRating,
        engagementRate,
        retentionRate,
        revenuePerVideo,
        subscriptionConversionRate,
        averageSubscriptionDuration,
        platformAge,
        contentConsistency
      };

      const leaderboardScore = calculateLeaderboardScore(metrics);
      
      creatorMetrics.push({
        ...metrics,
        leaderboardScore,
        rank: 0 // Will be set after sorting
      });
    });

    // Sort by leaderboard score and assign ranks
    return creatorMetrics
      .sort((a, b) => b.leaderboardScore - a.leaderboardScore)
      .map((creator, index) => ({
        ...creator,
        rank: index + 1
      }));
  }, []);

  useEffect(() => {
    if (!uploads.data) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📊 Processing uploads for leaderboard:', uploads.data.length);
      
      const metrics = calculateCreatorMetrics(uploads.data);
      console.log('📈 Calculated creator metrics:', metrics);
      
      setLeaderboardData(metrics);
    } catch (err) {
      console.error('❌ Error calculating leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [uploads.data, calculateCreatorMetrics]);

  const refetch = useCallback(() => {
    if (uploads.data) {
      const metrics = calculateCreatorMetrics(uploads.data);
      setLeaderboardData(metrics);
    }
  }, [uploads.data, calculateCreatorMetrics]);

  return {
    leaderboardData,
    isLoading: isLoading || uploads.isLoading,
    error: error || (uploads.isError ? 'Failed to fetch uploads' : null),
    refetch
  };
} 
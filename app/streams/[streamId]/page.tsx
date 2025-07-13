"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Clock, 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign,
  RefreshCw,
  ArrowLeft,
  Wallet,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Prediction {
  id: string;
  amount: number;
  status: string;
  placed_at: string;
  wallet_address: string;
  resolved_at: string | null;
  payout_amount: number | null;
}

interface ChallengeOption {
  id: string;
  challenge_id: string;
  option_key: string;
  display_name: string;
  token_name: string;
  created_at: string;
  predictions: Prediction[];
  prediction_count: number;
  total_amount: number;
}

interface Challenge {
  id: string;
  stream_id: string;
  event_type: string;
  title: string;
  state: string;
  started_at: string;
  closed_at: string | null;
  resolved_at: string | null;
  created_at: string;
  challenge_options: ChallengeOption[];
  total_predictions: number;
  total_amount: number;
}

export default function StreamPage() {
  const params = useParams();
  const streamId = params.streamId as string;
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isPolling, setIsPolling] = useState(false);

  const fetchChallenges = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setIsPolling(true);
      }
      
      const response = await fetch(`/api/streams/${streamId}/challenges`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch challenges: ${response.status}`);
      }

      const data = await response.json();
      setChallenges(data || []);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
      setIsPolling(false);
    }
  }, [streamId]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  // Set up polling every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChallenges(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchChallenges]);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'closed':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'resolved':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'confirmed':
        return <Trophy className="h-3 w-3 text-green-500" />;
      case 'resolved':
        return <Crown className="h-3 w-3 text-blue-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/streams">
              <Button variant="outline" size="sm" className="bg-transparent border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#f5f5f5]/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Streams
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#f5f5f5]">
                Stream Challenges
              </h1>
              <p className="text-[#f5f5f5]/70 mt-1">
                Stream ID: {streamId}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-[#f5f5f5]/70">
                Last updated: {formatDate(lastUpdated.toISOString())}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-[#FF0052] animate-pulse' : 'bg-green-500'}`} />
                <span className="text-xs text-[#f5f5f5]/60">
                  {isPolling ? 'Updating...' : 'Live'}
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => fetchChallenges()}
              variant="outline"
              size="sm"
              disabled={loading || isPolling}
              className="bg-transparent border-[#f5f5f5]/20 text-[#f5f5f5] hover:bg-[#FF0052] hover:border-[#FF0052] hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isPolling) ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
            <div className="text-red-400 font-medium">
              Error: {error}
            </div>
          </div>
        )}

        {/* Challenges */}
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl text-[#f5f5f5] mb-2">No challenges yet</h3>
            <p className="text-[#f5f5f5]/70">
              Challenges for this stream will appear here when they&apos;re created.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="backdrop-blur-xl bg-[#f5f5f5]/5 border border-[#f5f5f5]/10 rounded-2xl">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl text-[#f5f5f5]">
                          {challenge.title}
                        </CardTitle>
                        <Badge className={`${getStateColor(challenge.state)} border`}>
                          {challenge.state}
                        </Badge>
                      </div>
                      <CardDescription className="text-[#f5f5f5]/70">
                        {challenge.event_type} • Created {formatDate(challenge.created_at)}
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-[#f5f5f5]/70">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-[#FF0052]" />
                        {challenge.total_predictions} predictions
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-[#FF0052]" />
                        {formatAmount(challenge.total_amount)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {challenge.challenge_options.map((option) => (
                      <div key={option.id} className="border border-[#f5f5f5]/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#FF0052]/20">
                              <Trophy className="h-4 w-4 text-[#FF0052]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#f5f5f5]">{option.display_name}</h4>
                              <p className="text-sm text-[#f5f5f5]/70">{option.token_name}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70">
                              <Users className="h-3 w-3" />
                              {option.prediction_count} predictions
                            </div>
                            <div className="text-lg font-bold text-[#f5f5f5]">
                              {formatAmount(option.total_amount)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Predictions List */}
                        {option.predictions.length > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-[#f5f5f5]/70 mb-3">
                              <TrendingUp className="h-4 w-4" />
                              Recent Predictions
                            </div>
                            
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {option.predictions
                                .sort((a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime())
                                .map((prediction) => (
                                <div key={prediction.id} className="flex items-center justify-between p-3 bg-[#f5f5f5]/5 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(prediction.status)}
                                      <span className="text-sm text-[#f5f5f5]/70 capitalize">
                                        {prediction.status}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Wallet className="h-3 w-3 text-[#f5f5f5]/50" />
                                      <span className="text-sm text-[#f5f5f5]/70 font-mono">
                                        {truncateAddress(prediction.wallet_address)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-right">
                                    <div className="font-semibold text-[#f5f5f5]">
                                      {formatAmount(prediction.amount)}
                                    </div>
                                    <div className="text-xs text-[#f5f5f5]/50">
                                      {formatDate(prediction.placed_at)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-[#f5f5f5]/50">
                            <div className="text-3xl mb-2">🎯</div>
                            <p className="text-sm">No predictions yet for this option</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
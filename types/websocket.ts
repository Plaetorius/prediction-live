export interface StreamStatusResponse {
  open: boolean;
  streamId: string;
}

export interface ChallengeOption {
  id: string;
  challenge_id: string;
  optionKey: string;
  displayName: string;
  tokenName: string;
  odds?: number;
  created_at?: string;
  updated_at?: string;
  metadata?: {
    created_at?: string;
    updated_at?: string;
  };
}

export interface Challenge {
  id: string;
  streamId: string;
  eventType: string;
  title: string;
  state: 'open' | 'closed' | 'resolved';
  startedAt: string;
  createdAt?: string;
  updatedAt?: string;
  closingAt?: string;
  options: ChallengeOption[];
  metadata?: {
    total_options: number;
    stream_id: string;
    event_type: string;
    broadcast_timestamp: string;
  };
}

export interface PredictionRequest {
  challengeId: string;
  optionId: string;
  amount: number;
  userId?: string;
}

export interface PredictionResponse {
  success: boolean;
  message: string;
  predictionId?: string;
} 
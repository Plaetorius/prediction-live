export interface StreamStatusResponse {
  open: boolean;
  streamId: string;
}

export interface ChallengeOption {
  id: string;
  optionKey: string;
  displayName: string;
  tokenName: string;
  odds?: number;
}

export interface Challenge {
  id: string;
  streamId: string;
  eventType: string;
  title: string;
  state: 'open' | 'closed' | 'resolved';
  startedAt: string;
  options: ChallengeOption[];
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
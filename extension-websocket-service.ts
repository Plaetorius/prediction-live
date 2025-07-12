import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StreamStatusResponse, Challenge, PredictionRequest, PredictionResponse } from './types/websocket';

interface ChallengePayload {
  id: string;
  title: string;
  event_type: string;
  stream_id: string;
  options: Array<{
    id: string;
    option_key: string;
    display_name: string;
    token_name: string;
    odds?: number;
  }>;
  timestamp: string;
}

export class WebSocketService {
  private supabase: SupabaseClient;
  private streamId: string | null = null;
  private isConnected: boolean = false;
  private eventSource: EventSource | null = null;

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      'https://iitjsrlhyffgtwiwbqln.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpdGpzcmxoeWZmZ3R3aXdicWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNjk0NDEsImV4cCI6MjA2Nzg0NTQ0MX0.kak2FanxJX0tw2eXad5dP5pvG97aeeULEqrwvuZau18'
    );
  }

  async checkStreamStatus(streamId: string): Promise<StreamStatusResponse> {
    try {
      const response = await fetch(`https://prediction-live.vercel.app/api/streams/${streamId}/challenge`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error('Failed to check stream status:', response.statusText);
        return { open: false, streamId };
      }

      const data: StreamStatusResponse = await response.json();
      console.log('Stream status:', data);
      return data;
    } catch (error) {
      console.error('Error checking stream status:', error);
      return { open: false, streamId };
    }
  }

  async connectToStream(streamId: string): Promise<boolean> {
    try {
      console.log('🔌 Connecting to stream:', streamId);
      
      // Check if stream is open for challenges
      const streamStatus = await this.checkStreamStatus(streamId);
      
      if (!streamStatus.open) {
        console.log('❌ Stream not open for challenges:', streamId);
        return false;
      }

      this.streamId = streamId;
      
      // Method 1: Use Server-Sent Events (SSE) for better browser extension compatibility
      await this.connectViaSSE(streamId);
      
      // Method 2: Also try Supabase real-time as backup
      await this.connectViaSupabase(streamId);
      
      return true;
    } catch (error) {
      console.error('❌ Error connecting to stream:', error);
      return false;
    }
  }

  private async connectViaSSE(streamId: string): Promise<void> {
    try {
      console.log('📡 Connecting via SSE to stream:', streamId);
      
      // Close existing connection if any
      if (this.eventSource) {
        this.eventSource.close();
      }

      // Connect to the SSE endpoint
      this.eventSource = new EventSource(`https://prediction-live.vercel.app/api/ws?streamId=${streamId}`);
      
      this.eventSource.onopen = () => {
        console.log('✅ SSE connection opened');
        this.isConnected = true;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received SSE message:', data);
          
          if (data.type === 'challenge:new') {
            this.handleChallengeBroadcast(data.data);
          } else if (data.type === 'connected') {
            console.log('✅ Successfully connected to stream:', data.streamId);
          }
        } catch (error) {
          console.error('❌ Error parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('❌ SSE connection error:', error);
        this.isConnected = false;
      };
    } catch (error) {
      console.error('❌ Error connecting via SSE:', error);
    }
  }

  private async connectViaSupabase(streamId: string): Promise<void> {
    try {
      console.log('📡 Connecting via Supabase to stream:', streamId);
      
      // Subscribe to the stream channel for challenge broadcasts
      this.supabase
        .channel(`stream-${streamId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'challenges' }, (payload) => {
          console.log('🎯 Received Supabase challenge broadcast:', payload);
          // Handle database changes if needed
        })
        .subscribe((status) => {
          console.log('📡 Supabase subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully connected to Supabase channel');
          } else {
            console.log('❌ Failed to connect to Supabase channel');
          }
        });
    } catch (error) {
      console.error('❌ Error connecting via Supabase:', error);
    }
  }

  async sendPrediction(predictionRequest: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await fetch('https://prediction-live.vercel.app/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(predictionRequest)
      });

      const data: PredictionResponse = await response.json();
      
      if (response.ok) {
        console.log('✅ Prediction sent successfully:', data);
        return data;
      } else {
        console.error('❌ Error sending prediction:', data);
        return data;
      }
    } catch (error) {
      console.error('❌ Error sending prediction:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  private handleChallengeBroadcast(payload: ChallengePayload): void {
    console.log('🎯 Handling challenge broadcast:', payload);
    
    // Transform the payload to match our Challenge interface
    const challenge: Challenge = {
      id: payload.id,
      streamId: this.streamId!,
      eventType: payload.event_type,
      title: payload.title,
      state: 'open',
      startedAt: new Date().toISOString(),
      options: payload.options.map((opt) => ({
        id: opt.id,
        optionKey: opt.option_key || opt.display_name.toLowerCase().replace(/\s+/g, '_'),
        displayName: opt.display_name,
        tokenName: opt.token_name,
        odds: opt.odds || 1.0
      }))
    };
    
    // Dispatch custom event for the content script to handle
    const event = new CustomEvent('challenge-update', {
      detail: {
        type: 'challenge:new',
        challenge: challenge
      }
    });
    document.dispatchEvent(event);
  }

  disconnect(): void {
    console.log('🔌 Disconnecting from stream');
    
    // Close SSE connection
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    // Close Supabase connection
    if (this.streamId) {
      const channel = this.supabase.channel(`stream-${this.streamId}`);
      channel.unsubscribe();
    }
    
    this.isConnected = false;
    this.streamId = null;
  }

  isStreamConnected(): boolean {
    return this.isConnected;
  }
} 
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  response?: unknown;
  error?: string;
}

export default function PredictionsDebugPage({ params }: { params: Promise<{ streamId: string }> }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [streamId, setStreamId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get the streamId from params
    params.then(({ streamId }) => {
      setStreamId(streamId);
    });

    // Create a WebSocket connection for real-time logs
    const ws = new WebSocket(`ws://${window.location.host}/api/debug/ws`);
    
    ws.onopen = () => {
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const logEntry: LogEntry = JSON.parse(event.data);
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 logs
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [params]);

  const testFetch = async () => {
    try {
      const response = await fetch(`/api/predictions/${streamId}`);
      const data = await response.json();
      
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        method: 'GET',
        url: `/api/predictions/${streamId}`,
        status: response.status,
        response: data
      };
      
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    } catch (error) {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        method: 'GET',
        url: `/api/predictions/${streamId}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    }
  };

  const testWithStreamId = async (testStreamId: string) => {
    try {
      const response = await fetch(`/api/predictions/${testStreamId}`);
      const data = await response.json();
      
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        method: 'GET',
        url: `/api/predictions/${testStreamId}`,
        status: response.status,
        response: data
      };
      
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    } catch (error) {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        method: 'GET',
        url: `/api/predictions/${testStreamId}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                  Predictions API Debug
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-300">
                    WebSocket {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={testFetch}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 sm:h-12 font-medium"
                >
                  Test Fetch
                </Button>
                <Button
                  onClick={clearLogs}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white h-10 sm:h-12 font-medium"
                >
                  Clear Logs
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stream Info */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-300">Stream ID:</span>
                <code className="bg-gray-700 text-green-400 px-2 py-1 rounded text-sm font-mono break-all">
                  {streamId || 'Loading...'}
                </code>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-medium text-gray-300">API Endpoint:</span>
                <code className="bg-gray-700 text-blue-400 px-2 py-1 rounded text-sm font-mono break-all">
                  /api/predictions/{streamId}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Logs */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-white">
              Live Logs ({logs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 italic">No logs yet. Click &quot;Test Fetch&quot; to make a request.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-3 sm:p-4 rounded-lg border ${
                      log.error
                        ? 'bg-red-900/20 border-red-500'
                        : log.status && log.status >= 400
                        ? 'bg-yellow-900/20 border-yellow-500'
                        : 'bg-green-900/20 border-green-500'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                      <span className="font-mono text-xs sm:text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <Badge 
                        variant={log.error ? 'destructive' : log.status && log.status >= 400 ? 'secondary' : 'default'}
                        className={`text-xs ${
                          log.error
                            ? 'bg-red-600 text-white'
                            : log.status && log.status >= 400
                            ? 'bg-yellow-600 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {log.error ? 'ERROR' : log.status || 'PENDING'}
                      </Badge>
                    </div>
                    
                    <div className="font-mono text-xs sm:text-sm space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <span className="text-blue-400 font-medium">{log.method}</span>
                        <span className="text-gray-300 break-all">{log.url}</span>
                      </div>
                      
                      {log.error && (
                        <div className="text-red-400 text-xs p-2 bg-red-900/20 rounded">
                          <strong>Error:</strong> {log.error}
                        </div>
                      )}
                      
                      {log.response !== undefined && (
                        <div className="mt-2">
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-300 hover:text-white p-1 rounded bg-gray-700/50">
                              Response Data
                            </summary>
                            <pre className="mt-2 p-2 sm:p-3 bg-gray-900 rounded overflow-x-auto text-xs leading-relaxed">
                              {String(JSON.stringify(log.response as Record<string, unknown>, null, 2))}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Test */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-white">
              Quick Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Test with different Stream IDs:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {['test123', 'demo456', 'live789', streamId].filter(Boolean).map((id) => (
                    <Button
                      key={id}
                      onClick={() => testWithStreamId(id)}
                      variant="outline"
                      className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 text-xs sm:text-sm h-10 truncate"
                      title={id}
                    >
                      {id}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
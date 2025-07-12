'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    // Get the streamId from params
    params.then(({ streamId }) => {
      setStreamId(streamId);
    });

    // Create a WebSocket connection for real-time logs
    const ws = new WebSocket(`ws://${window.location.host}/api/debug/ws`);
    
    ws.onmessage = (event) => {
      const logEntry: LogEntry = JSON.parse(event.data);
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]); // Keep last 100 logs
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
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

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Predictions API Debug</h1>
          <div className="space-x-4">
            <button
              onClick={testFetch}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
            >
              Test Fetch
            </button>
            <button
              onClick={clearLogs}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
            >
              Clear Logs
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-300">
            <strong>Stream ID:</strong> {streamId || 'Loading...'}
          </p>
          <p className="text-gray-300">
            <strong>API Endpoint:</strong> /api/predictions/{streamId}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Live Logs</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-400 italic">No logs yet. Click &quot;Test Fetch&quot; to make a request.</p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border ${
                    log.error
                      ? 'bg-red-900/20 border-red-500'
                      : log.status && log.status >= 400
                      ? 'bg-yellow-900/20 border-yellow-500'
                      : 'bg-green-900/20 border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm text-gray-300">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.error
                        ? 'bg-red-600'
                        : log.status && log.status >= 400
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                    }`}>
                      {log.error ? 'ERROR' : log.status || 'PENDING'}
                    </span>
                  </div>
                  
                  <div className="font-mono text-sm">
                    <div className="mb-1">
                      <span className="text-blue-400">{log.method}</span>{' '}
                      <span className="text-gray-300">{log.url}</span>
                    </div>
                    
                    {log.error && (
                      <div className="text-red-400 text-xs">
                        Error: {log.error}
                      </div>
                    )}
                    
                    {log.response !== undefined && (
                      <div className="mt-2">
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-300 hover:text-white">
                            Response Data
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-700 rounded overflow-x-auto">
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
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Quick Test</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test with different Stream IDs:</label>
              <div className="flex gap-2">
                {['test123', 'demo456', 'live789', streamId].filter(Boolean).map((id) => (
                  <button
                    key={id}
                    onClick={() => fetch(`/api/predictions/${id}`).then(r => r.json()).then(data => {
                      const logEntry: LogEntry = {
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString(),
                        method: 'GET',
                        url: `/api/predictions/${id}`,
                        status: 200,
                        response: data
                      };
                      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
                    })}
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
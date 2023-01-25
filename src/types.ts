export interface IsConnectedResult {
  name: string;
  status: 'connected' | 'not-connected' | 'error' | 'timed-out';
}

export interface AppService {
  isConnected: () => Promise<IsConnectedResult>;
}

export interface HealthCheckResult {
  name: string;
  status: 'ok' | 'error' | 'timed-out';
}

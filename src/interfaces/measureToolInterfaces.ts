export interface CheckpointResult {
  name: string | undefined;
  durationMs: number;
  /** Timestamp (ms) captured at the end of this checkpoint interval. */
  timestamp: number;
}

export interface StopResult {
  name: string | undefined;
  durationMs: number;
  /** Timestamp (ms) captured at the moment stop() was called. */
  timestamp: number;
}

export interface MeasureExecTimeResult<T> {
  name: string | undefined;
  durationMs: number;
  timestamp: number;
  result: T;
}

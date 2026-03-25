export enum LoggerLevels {
  NONE,
  ERROR,
  WARNING,
  LOG,
  DEBUG,
}

export interface LoggerInterface {
  level: LoggerLevels;
  /** Include a timestamp prefix on every log line. Defaults to false. */
  timestamp?: boolean;
  /** Use UTC time for the timestamp. Defaults to false (local time). Has no effect if timestamp is false. */
  timestampUtc?: boolean;
  /** Optional request ID included in every log line prefix. */
  requestId?: string;
  /** Optional module/service name included in every log line prefix. */
  module?: string;
  error?(...params: any): void;
  warn?(...params: any): void;
  log?(...params: any): void;
  debug?(...params: any): void;
}

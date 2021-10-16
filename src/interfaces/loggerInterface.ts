import { LoggerLevels } from './loggerLevels';

export interface LoggerInterface {
  level: LoggerLevels;
  error?(...params: any): void;
  warn?(...params: any): void;
  log?(...params: any): void;
  debug?(...params: any): void;
}

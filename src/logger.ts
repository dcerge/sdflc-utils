// ./src/logger.ts

import { LoggerInterface, LoggerLevels } from './interfaces';

type LogFn = (...args: any[]) => void;

const LEVELS_VALUES = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  LOG: 3,
  DEBUG: 4,
} as const;

const LEVELS_TO_VALUES: Record<string, number> = {
  [LoggerLevels.NONE]: LEVELS_VALUES.NONE,
  [LoggerLevels.ERROR]: LEVELS_VALUES.ERROR,
  [LoggerLevels.WARNING]: LEVELS_VALUES.WARNING,
  [LoggerLevels.LOG]: LEVELS_VALUES.LOG,
  [LoggerLevels.DEBUG]: LEVELS_VALUES.DEBUG,
};

export class Logger {
  private level: LoggerLevels;
  private timestamp: boolean;
  private timestampUtc: boolean;
  private requestId: string | undefined;
  private module: string | undefined;

  private fnDebug: LogFn;
  private fnLog: LogFn;
  private fnWarn: LogFn;
  private fnError: LogFn;

  constructor(props?: LoggerInterface) {
    this.level = LEVELS_TO_VALUES[props?.level ?? ''] === undefined ? LoggerLevels.LOG : props!.level;

    this.timestamp = props?.timestamp ?? false;
    this.timestampUtc = props?.timestampUtc ?? false;
    this.requestId = props?.requestId;
    this.module = props?.module;

    this.fnDebug = typeof props?.debug === 'function' ? props.debug : Logger.defaultDebug;
    this.fnLog = typeof props?.log === 'function' ? props.log : Logger.defaultLog;
    this.fnWarn = typeof props?.warn === 'function' ? props.warn : Logger.defaultWarn;
    this.fnError = typeof props?.error === 'function' ? props.error : Logger.defaultError;
  }

  // ---------------------------------------------------------------------------
  // Default handlers
  // ---------------------------------------------------------------------------

  private static defaultDebug(...params: any[]): void {
    console.debug(...params);
  }
  private static defaultLog(...params: any[]): void {
    console.log(...params);
  }
  private static defaultWarn(...params: any[]): void {
    console.warn(...params);
  }
  private static defaultError(...params: any[]): void {
    console.error(...params);
  }

  // ---------------------------------------------------------------------------
  // Prefix
  // ---------------------------------------------------------------------------

  /**
   * Formats a Date as `YYYYMMDD-HHmmss+HH:MM` (local) or `YYYYMMDD-HHmmssZ` (UTC).
   *
   * Examples:
   *   20250325-143022.123+05:30   (local, UTC+5:30)
   *   20250325-143022.123-07:00   (local, UTC-7)
   *   20250325-093022.123Z        (UTC)
   */
  private static formatTimestamp(date: Date, utc: boolean): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const pad3 = (n: number) => String(n).padStart(3, '0');

    const Y = utc ? date.getUTCFullYear() : date.getFullYear();
    const Mo = utc ? date.getUTCMonth() + 1 : date.getMonth() + 1;
    const D = utc ? date.getUTCDate() : date.getDate();
    const H = utc ? date.getUTCHours() : date.getHours();
    const Mi = utc ? date.getUTCMinutes() : date.getMinutes();
    const S = utc ? date.getUTCSeconds() : date.getSeconds();
    const Ms = utc ? date.getUTCMilliseconds() : date.getMilliseconds();

    const datePart = `${Y}${pad(Mo)}${pad(D)}`;
    const timePart = `${pad(H)}${pad(Mi)}${pad(S)}.${pad3(Ms)}`;

    if (utc) {
      return `${datePart}-${timePart}Z`;
    }

    const offsetMin = -date.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMin);
    const offH = Math.floor(absOffset / 60);
    const offM = absOffset % 60;

    return `${datePart}-${timePart}${sign}${pad(offH)}:${pad(offM)}`;
  }

  /**
   * Builds the optional prefix prepended to every log message.
   * Only non-empty fields are included. Format:
   *   [20250325-143022+05:30] [req-abc123] [UserService]   (local time)
   *   [20250325-093022Z] [req-abc123] [UserService]         (UTC)
   */
  private buildPrefix(): string {
    const parts: string[] = [];

    if (this.timestamp) {
      parts.push(`[${Logger.formatTimestamp(new Date(), this.timestampUtc)}]`);
    }
    if (this.requestId) parts.push(`[${this.requestId}]`);
    if (this.module) parts.push(`[${this.module}]`);

    return parts.length > 0 ? parts.join(' ') + ' ' : '';
  }

  // ---------------------------------------------------------------------------
  // Level API
  // ---------------------------------------------------------------------------

  public getLevel(): LoggerLevels {
    return this.level;
  }

  public setLevel(newLevel: LoggerLevels): LoggerLevels {
    if (LEVELS_TO_VALUES[newLevel] !== undefined) {
      this.level = newLevel;
    }
    return this.level;
  }

  // ---------------------------------------------------------------------------
  // Logging methods
  // ---------------------------------------------------------------------------

  public debug(...params: any[]): void {
    if (LEVELS_VALUES.DEBUG > (LEVELS_TO_VALUES[this.level] ?? -1)) return;
    const prefix = this.buildPrefix();
    prefix ? this.fnDebug(prefix, ...params) : this.fnDebug(...params);
  }

  public log(...params: any[]): void {
    if (LEVELS_VALUES.LOG > (LEVELS_TO_VALUES[this.level] ?? -1)) return;
    const prefix = this.buildPrefix();
    prefix ? this.fnLog(prefix, ...params) : this.fnLog(...params);
  }

  public warn(...params: any[]): void {
    if (LEVELS_VALUES.WARNING > (LEVELS_TO_VALUES[this.level] ?? -1)) return;
    const prefix = this.buildPrefix();
    prefix ? this.fnWarn(prefix, ...params) : this.fnWarn(...params);
  }

  public error(...params: any[]): void {
    if (LEVELS_VALUES.ERROR > (LEVELS_TO_VALUES[this.level] ?? -1)) return;
    const prefix = this.buildPrefix();
    prefix ? this.fnError(prefix, ...params) : this.fnError(...params);
  }
}

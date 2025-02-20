import { LoggerInterface, LoggerLevels } from './interfaces';

const LEVELS_VALUES = {
  NONE: 0,
  ERROR: 1,
  WARNING: 2,
  LOG: 3,
  DEBUG: 4,
};

const LEVELS_TO_VALUES = {
  [LoggerLevels.NONE]: LEVELS_VALUES.NONE,
  [LoggerLevels.ERROR]: LEVELS_VALUES.ERROR,
  [LoggerLevels.WARNING]: LEVELS_VALUES.WARNING,
  [LoggerLevels.LOG]: LEVELS_VALUES.LOG,
  [LoggerLevels.DEBUG]: LEVELS_VALUES.DEBUG,
};

export class Logger {
  private level = LoggerLevels.DEBUG;
  private fnDebug: any;
  private fnLog: any;
  private fnWarn: any;
  private fnError: any;

  constructor(props: LoggerInterface) {
    this.level = LEVELS_TO_VALUES[props.level] === undefined ? LoggerLevels.LOG : props.level;

    this.fnDebug = typeof props.debug === 'function' ? props.debug : this.defaultDebug;
    this.fnLog = typeof props.log === 'function' ? props.log : this.defaultLog;
    this.fnWarn = typeof props.warn === 'function' ? props.warn : this.defaultWarn;
    this.fnError = typeof props.error === 'function' ? props.error : this.defaultError;
  }

  private defaultDebug(...params: any[]) {
    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  private defaultLog(...params: any[]) {
    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  private defaultWarn(...params: any[]) {
    const args = Array.prototype.slice.call(params);
    console.log.apply(console, [...args]);
  }

  private defaultError(...params: any[]) {
    const args = Array.prototype.slice.call(params);
    console.error.apply(console, [...args]);
  }

  public getLevel() {
    return this.level;
  }

  public setLevel(newLevel: LoggerLevels) {
    this.level = newLevel;
    return this.level;
  }

  public debug(...params: any[]) {
    if (LEVELS_VALUES.DEBUG > LEVELS_TO_VALUES[this.level]) {
      return;
    }

    this.fnDebug(...params);
  }

  public log(...params: any[]) {
    if (LEVELS_VALUES.LOG > LEVELS_TO_VALUES[this.level]) {
      return;
    }

    this.fnLog(...params);
  }

  public warn(...params: any[]) {
    if (LEVELS_VALUES.WARNING > LEVELS_TO_VALUES[this.level]) {
      return;
    }

    this.fnWarn(...params);
  }

  public error(...params: any[]) {
    if (LEVELS_VALUES.ERROR > LEVELS_TO_VALUES[this.level]) {
      return;
    }

    this.fnError(...params);
  }
}

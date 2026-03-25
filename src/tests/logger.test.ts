// ./src/tests/logger.test.ts

import { Logger } from '../';
import { LoggerLevels } from '../interfaces';

// =============================================================================
// Helpers
// =============================================================================

/** Creates a Logger wired to jest mock functions for easy assertion. */
const makeLogger = (level: LoggerLevels, extra?: object) => {
  const fns = {
    debug: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  const logger = new Logger({ level, ...fns, ...extra });
  return { logger, fns };
};

// =============================================================================
// Constructor
// =============================================================================
describe('Logger — constructor', () => {
  it('accepts all valid levels', () => {
    expect(new Logger({ level: LoggerLevels.NONE }).getLevel()).toBe(LoggerLevels.NONE);
    expect(new Logger({ level: LoggerLevels.ERROR }).getLevel()).toBe(LoggerLevels.ERROR);
    expect(new Logger({ level: LoggerLevels.WARNING }).getLevel()).toBe(LoggerLevels.WARNING);
    expect(new Logger({ level: LoggerLevels.LOG }).getLevel()).toBe(LoggerLevels.LOG);
    expect(new Logger({ level: LoggerLevels.DEBUG }).getLevel()).toBe(LoggerLevels.DEBUG);
  });

  it('defaults to LOG level when an unrecognised level is provided', () => {
    expect(new Logger({ level: 999 as LoggerLevels }).getLevel()).toBe(LoggerLevels.LOG);
  });

  it('defaults to LOG level when no props are provided', () => {
    expect(new Logger().getLevel()).toBe(LoggerLevels.LOG);
  });

  it('uses custom handler functions when provided', () => {
    const customLog = jest.fn();
    const logger = new Logger({ level: LoggerLevels.DEBUG, log: customLog });
    logger.log('hello');
    expect(customLog).toHaveBeenCalledWith('hello');
  });

  it('ignores non-function handlers and falls back to defaults', () => {
    expect(() => new Logger({ level: LoggerLevels.DEBUG, log: 'not-a-function' as any })).not.toThrow();
  });
});

// =============================================================================
// getLevel / setLevel
// =============================================================================
describe('Logger — getLevel / setLevel', () => {
  it('getLevel returns the current level', () => {
    const { logger } = makeLogger(LoggerLevels.DEBUG);
    expect(logger.getLevel()).toBe(LoggerLevels.DEBUG);
  });

  it('setLevel updates the level and returns it', () => {
    const { logger } = makeLogger(LoggerLevels.DEBUG);
    const returned = logger.setLevel(LoggerLevels.ERROR);
    expect(returned).toBe(LoggerLevels.ERROR);
    expect(logger.getLevel()).toBe(LoggerLevels.ERROR);
  });

  it('setLevel ignores invalid values and returns the current level unchanged', () => {
    const { logger } = makeLogger(LoggerLevels.LOG);
    const returned = logger.setLevel(999 as LoggerLevels);
    expect(returned).toBe(LoggerLevels.LOG);
    expect(logger.getLevel()).toBe(LoggerLevels.LOG);
  });
});

// =============================================================================
// Level filtering
// =============================================================================
describe('Logger — DEBUG level: all methods fire', () => {
  it('calls debug, log, warn, and error', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG);
    logger.debug('d');
    logger.log('l');
    logger.warn('w');
    logger.error('e');
    expect(fns.debug).toHaveBeenCalledWith('d');
    expect(fns.log).toHaveBeenCalledWith('l');
    expect(fns.warn).toHaveBeenCalledWith('w');
    expect(fns.error).toHaveBeenCalledWith('e');
  });
});

describe('Logger — LOG level: debug suppressed', () => {
  it('suppresses debug', () => {
    const { logger, fns } = makeLogger(LoggerLevels.LOG);
    logger.debug('d');
    expect(fns.debug).not.toHaveBeenCalled();
  });

  it('calls log, warn, and error', () => {
    const { logger, fns } = makeLogger(LoggerLevels.LOG);
    logger.log('l');
    logger.warn('w');
    logger.error('e');
    expect(fns.log).toHaveBeenCalledWith('l');
    expect(fns.warn).toHaveBeenCalledWith('w');
    expect(fns.error).toHaveBeenCalledWith('e');
  });
});

describe('Logger — WARNING level: debug and log suppressed', () => {
  it('suppresses debug and log', () => {
    const { logger, fns } = makeLogger(LoggerLevels.WARNING);
    logger.debug('d');
    logger.log('l');
    expect(fns.debug).not.toHaveBeenCalled();
    expect(fns.log).not.toHaveBeenCalled();
  });

  it('calls warn and error', () => {
    const { logger, fns } = makeLogger(LoggerLevels.WARNING);
    logger.warn('w');
    logger.error('e');
    expect(fns.warn).toHaveBeenCalledWith('w');
    expect(fns.error).toHaveBeenCalledWith('e');
  });
});

describe('Logger — ERROR level: only error fires', () => {
  it('suppresses debug, log, and warn', () => {
    const { logger, fns } = makeLogger(LoggerLevels.ERROR);
    logger.debug('d');
    logger.log('l');
    logger.warn('w');
    expect(fns.debug).not.toHaveBeenCalled();
    expect(fns.log).not.toHaveBeenCalled();
    expect(fns.warn).not.toHaveBeenCalled();
  });

  it('calls error', () => {
    const { logger, fns } = makeLogger(LoggerLevels.ERROR);
    logger.error('e');
    expect(fns.error).toHaveBeenCalledWith('e');
  });
});

describe('Logger — NONE level: nothing fires', () => {
  it('suppresses all methods', () => {
    const { logger, fns } = makeLogger(LoggerLevels.NONE);
    logger.debug('d');
    logger.log('l');
    logger.warn('w');
    logger.error('e');
    expect(fns.debug).not.toHaveBeenCalled();
    expect(fns.log).not.toHaveBeenCalled();
    expect(fns.warn).not.toHaveBeenCalled();
    expect(fns.error).not.toHaveBeenCalled();
  });
});

// =============================================================================
// Multiple arguments
// =============================================================================
describe('Logger — multiple arguments', () => {
  it('passes all arguments through to the handler', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG);
    logger.log('hello', 'world', 42, { key: 'value' });
    expect(fns.log).toHaveBeenCalledWith('hello', 'world', 42, { key: 'value' });
  });
});

// =============================================================================
// Default handlers
// =============================================================================
describe('Logger — default handlers', () => {
  it('uses console.debug for debug()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    new Logger({ level: LoggerLevels.DEBUG }).debug('test');
    expect(spy).toHaveBeenCalledWith('test');
    spy.mockRestore();
  });

  it('uses console.log for log()', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    new Logger({ level: LoggerLevels.DEBUG }).log('test');
    expect(spy).toHaveBeenCalledWith('test');
    spy.mockRestore();
  });

  it('uses console.warn for warn()', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    new Logger({ level: LoggerLevels.DEBUG }).warn('test');
    expect(spy).toHaveBeenCalledWith('test');
    spy.mockRestore();
  });

  it('uses console.error for error()', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    new Logger({ level: LoggerLevels.DEBUG }).error('test');
    expect(spy).toHaveBeenCalledWith('test');
    spy.mockRestore();
  });
});

// =============================================================================
// Dynamic level changes
// =============================================================================
describe('Logger — dynamic level changes', () => {
  it('respects level change mid-use', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG);

    logger.debug('before');
    expect(fns.debug).toHaveBeenCalledTimes(1);

    logger.setLevel(LoggerLevels.ERROR);
    logger.debug('after');
    logger.log('after');
    logger.warn('after');
    expect(fns.debug).toHaveBeenCalledTimes(1);
    expect(fns.log).not.toHaveBeenCalled();
    expect(fns.warn).not.toHaveBeenCalled();

    logger.error('after');
    expect(fns.error).toHaveBeenCalledWith('after');
  });
});

describe('Logger — timestamp prefix', () => {
  it('prepends a formatted timestamp when timestamp: true (local time)', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { timestamp: true });
    logger.log('msg');
    const firstArg: string = fns.log.mock.calls[0][0];
    // Format: [YYYYMMDD-HHmmss.mmm+HH:MM] or [YYYYMMDD-HHmmss.mmm-HH:MM]
    expect(firstArg).toMatch(/^\[\d{8}-\d{6}\.\d{3}[+-]\d{2}:\d{2}\] $/);
    expect(fns.log.mock.calls[0][1]).toBe('msg');
  });

  it('does not prepend timestamp when timestamp is not set', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG);
    logger.log('msg');
    expect(fns.log).toHaveBeenCalledWith('msg');
  });
});

describe('Logger — timestampUtc prefix', () => {
  it('uses YYYYMMDD-HHmmss.mmmZ format when timestampUtc: true', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { timestamp: true, timestampUtc: true });
    logger.log('msg');
    const prefix: string = fns.log.mock.calls[0][0];
    expect(prefix).toMatch(/^\[\d{8}-\d{6}\.\d{3}Z\] $/);
    expect(fns.log.mock.calls[0][1]).toBe('msg');
  });

  it('uses YYYYMMDD-HHmmss.mmm+HH:MM format when timestampUtc: false', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { timestamp: true, timestampUtc: false });
    logger.log('msg');
    const prefix: string = fns.log.mock.calls[0][0];
    expect(prefix).toMatch(/^\[\d{8}-\d{6}\.\d{3}[+-]\d{2}:\d{2}\] $/);
  });

  it('timestampUtc has no effect when timestamp is false', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { timestamp: false, timestampUtc: true });
    logger.log('msg');
    expect(fns.log).toHaveBeenCalledWith('msg');
  });
});

// =============================================================================
// Prefix — requestId
// =============================================================================
describe('Logger — requestId prefix', () => {
  it('prepends [requestId] when provided', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { requestId: 'req-123' });
    logger.log('msg');
    expect(fns.log.mock.calls[0][0]).toBe('[req-123] ');
    expect(fns.log.mock.calls[0][1]).toBe('msg');
  });

  it('does not prepend requestId when not set', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG);
    logger.log('msg');
    expect(fns.log).toHaveBeenCalledWith('msg');
  });
});

// =============================================================================
// Prefix — module
// =============================================================================
describe('Logger — module prefix', () => {
  it('prepends [module] when provided', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { module: 'UserService' });
    logger.log('msg');
    expect(fns.log.mock.calls[0][0]).toBe('[UserService] ');
    expect(fns.log.mock.calls[0][1]).toBe('msg');
  });
});

describe('Logger — combined prefix', () => {
  it('combines timestamp, requestId, and module in order', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, {
      timestamp: true,
      timestampUtc: true,
      requestId: 'req-123',
      module: 'UserService',
    });
    logger.log('msg');
    const prefix: string = fns.log.mock.calls[0][0];
    expect(prefix).toMatch(/^\[\d{8}-\d{6}\.\d{3}Z\] \[req-123\] \[UserService\] $/);
    expect(fns.log.mock.calls[0][1]).toBe('msg');
  });

  it('applies prefix to all log levels', () => {
    const { logger, fns } = makeLogger(LoggerLevels.DEBUG, { module: 'Svc' });
    logger.debug('d');
    logger.log('l');
    logger.warn('w');
    logger.error('e');
    expect(fns.debug.mock.calls[0][0]).toBe('[Svc] ');
    expect(fns.log.mock.calls[0][0]).toBe('[Svc] ');
    expect(fns.warn.mock.calls[0][0]).toBe('[Svc] ');
    expect(fns.error.mock.calls[0][0]).toBe('[Svc] ');
  });
});

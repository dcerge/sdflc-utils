// ./src/measureTool.ts

import { CheckpointResult, MeasureExecTimeResult, StopResult } from './interfaces';

/**
 * Returns current time in milliseconds with sub-millisecond precision.
 * Uses `performance.now()` (available in Node.js 16+ and all modern browsers).
 */
const now = (): number => performance.now();

/**
 * Defers a callback to the next event loop tick.
 * Uses `setImmediate` in Node.js, `setTimeout` in browsers.
 */
const defer = (fn: () => void): void => {
  if (typeof setImmediate === 'function') {
    setImmediate(fn);
  } else {
    setTimeout(fn, 0);
  }
};

class MeasureTool {
  private startTime: number = 0;
  private checkpointTime: number = 0;
  private checkpoints: CheckpointResult[] = [];

  private calcDuration(startMs: number, endMs: number): number {
    return Math.round(endMs - startMs);
  }

  /**
   * Measure the total execution time of an async (or sync) function.
   * Calls `start()` internally — do not call it separately.
   *
   * @param name - Label for this measurement.
   * @param fn   - Function to measure.
   * @returns Stop result merged with the function's return value.
   */
  async measureExecTime<T>(name: string, fn: () => T | Promise<T>): Promise<MeasureExecTimeResult<T>> {
    this.start();
    const result = await fn();
    const measure = this.stop(name);
    return { ...measure, result };
  }

  /**
   * Measures event-loop blocking time by comparing timestamps before and
   * after the next event loop tick.
   *
   * Uses `setImmediate` in Node.js, `setTimeout` in browsers.
   *
   * @param name - Optional label for this measurement.
   * @param fn   - Callback invoked with `{ name, durationMs }`.
   */
  threadBlockTime(name?: string, fn?: (result: { name: string | undefined; durationMs: number }) => void): void {
    const start = now();

    defer(() => {
      const durationMs = this.calcDuration(start, now());
      if (typeof fn === 'function') {
        fn({ name, durationMs });
      }
    });
  }

  /**
   * Start a measurement session. Resets all checkpoints.
   * Must be called before `addCheckpoint` or `stop`.
   *
   * @returns The timestamp (ms) captured at start.
   */
  start(): { timestamp: number } {
    this.startTime = now();
    this.checkpointTime = now();
    this.checkpoints = [];

    return { timestamp: this.startTime };
  }

  /**
   * Record a checkpoint measuring time elapsed since the previous checkpoint
   * (or since `start()` for the first checkpoint).
   *
   * @param name - Optional label for this checkpoint.
   * @returns Checkpoint result with `name`, `durationMs`, and `timestamp`.
   */
  addCheckpoint(name?: string): CheckpointResult {
    const t = now();
    const duration = this.calcDuration(this.checkpointTime, t);
    this.checkpointTime = t;

    const entry: CheckpointResult = {
      name,
      durationMs: duration,
      timestamp: t,
    };

    this.checkpoints.push(entry);
    return entry;
  }

  /**
   * Stop the measurement session and return total duration since `start()`.
   * The stop result is NOT added to the checkpoints list.
   *
   * @param name - Optional label for the final measurement.
   * @returns Stop result with `name`, `durationMs`, and `timestamp`.
   */
  stop(name?: string): StopResult {
    const t = now();

    return {
      name,
      durationMs: this.calcDuration(this.startTime, t),
      timestamp: t,
    };
  }

  /**
   * Return all checkpoints recorded since the last `start()` call.
   *
   * @returns Array of checkpoint results in insertion order.
   */
  getCheckpoints(): CheckpointResult[] {
    return this.checkpoints;
  }
}

export { MeasureTool };

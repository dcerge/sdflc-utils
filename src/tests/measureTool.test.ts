// ./src/tests/measureTool.test.ts

import { MeasureTool } from '../';

// =============================================================================
// Helpers
// =============================================================================

/** Small async delay in ms. */
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// =============================================================================
// calcDuration (tested indirectly via durationMs)
// =============================================================================
describe('MeasureTool — duration accuracy', () => {
  it('reports durationMs within a reasonable range for a known delay', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(50);
    const result = tool.stop('test');
    // Allow ±30ms tolerance for timer imprecision
    expect(result.durationMs).toBeGreaterThanOrEqual(40);
    expect(result.durationMs).toBeLessThan(150);
  });
});

// =============================================================================
// start()
// =============================================================================
describe('MeasureTool — start', () => {
  it('returns an object with a numeric timestamp', () => {
    const tool = new MeasureTool();
    const result = tool.start();
    expect(typeof result.timestamp).toBe('number');
    expect(result.timestamp).toBeGreaterThanOrEqual(0);
  });

  it('resets checkpoints on each call', () => {
    const tool = new MeasureTool();
    tool.start();
    tool.addCheckpoint('cp1');
    tool.start(); // reset
    expect(tool.getCheckpoints()).toHaveLength(0);
  });
});

// =============================================================================
// addCheckpoint()
// =============================================================================
describe('MeasureTool — addCheckpoint', () => {
  it('returns a checkpoint with name, durationMs, and timestamp', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(20);
    const cp = tool.addCheckpoint('step1');

    expect(cp.name).toBe('step1');
    expect(typeof cp.durationMs).toBe('number');
    expect(cp.durationMs).toBeGreaterThanOrEqual(10);
    expect(typeof cp.timestamp).toBe('number');
    expect(cp.timestamp).toBeGreaterThanOrEqual(0);
  });

  it('accumulates multiple checkpoints', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(10);
    tool.addCheckpoint('a');
    await delay(10);
    tool.addCheckpoint('b');

    const checkpoints = tool.getCheckpoints();
    expect(checkpoints).toHaveLength(2);
    expect(checkpoints[0].name).toBe('a');
    expect(checkpoints[1].name).toBe('b');
  });

  it('measures time between checkpoints independently', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(30);
    const cp1 = tool.addCheckpoint('first');
    await delay(10);
    const cp2 = tool.addCheckpoint('second');

    // first checkpoint should be longer than second
    expect(cp1.durationMs).toBeGreaterThan(cp2.durationMs);
  });

  it('works with no name argument', async () => {
    const tool = new MeasureTool();
    tool.start();
    const cp = tool.addCheckpoint();
    expect(cp.name).toBeUndefined();
  });
});

// =============================================================================
// stop()
// =============================================================================
describe('MeasureTool — stop', () => {
  it('returns name, durationMs, and timestamp', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(20);
    const result = tool.stop('final');

    expect(result.name).toBe('final');
    expect(typeof result.durationMs).toBe('number');
    expect(result.durationMs).toBeGreaterThanOrEqual(10);
    expect(typeof result.timestamp).toBe('number');
    expect(result.timestamp).toBeGreaterThanOrEqual(0);
  });

  it('measures total duration from start, not from last checkpoint', async () => {
    const tool = new MeasureTool();
    tool.start();
    await delay(20);
    tool.addCheckpoint('mid');
    await delay(20);
    const result = tool.stop('end');

    // total should be ~40ms, not ~20ms
    expect(result.durationMs).toBeGreaterThanOrEqual(30);
  });

  it('does NOT add itself to the checkpoints list', async () => {
    const tool = new MeasureTool();
    tool.start();
    tool.addCheckpoint('cp1');
    tool.stop('end');
    expect(tool.getCheckpoints()).toHaveLength(1);
    expect(tool.getCheckpoints()[0].name).toBe('cp1');
  });

  it('works with no name argument', () => {
    const tool = new MeasureTool();
    tool.start();
    const result = tool.stop();
    expect(result.name).toBeUndefined();
  });
});

// =============================================================================
// getCheckpoints()
// =============================================================================
describe('MeasureTool — getCheckpoints', () => {
  it('returns empty array before any checkpoints are added', () => {
    const tool = new MeasureTool();
    tool.start();
    expect(tool.getCheckpoints()).toEqual([]);
  });

  it('returns checkpoints in insertion order', async () => {
    const tool = new MeasureTool();
    tool.start();
    tool.addCheckpoint('one');
    tool.addCheckpoint('two');
    tool.addCheckpoint('three');
    const names = tool.getCheckpoints().map((c) => c.name);
    expect(names).toEqual(['one', 'two', 'three']);
  });
});

// =============================================================================
// measureExecTime()
// =============================================================================
describe('MeasureTool — measureExecTime', () => {
  it('returns name, durationMs, timestamp, and the function result', async () => {
    const tool = new MeasureTool();
    const result = await tool.measureExecTime('myFn', async () => {
      await delay(20);
      return 42;
    });

    expect(result.name).toBe('myFn');
    expect(result.result).toBe(42);
    expect(typeof result.durationMs).toBe('number');
    expect(result.durationMs).toBeGreaterThanOrEqual(10);
    expect(typeof result.timestamp).toBe('number');
    expect(result.timestamp).toBeGreaterThanOrEqual(0);
  });

  it('works with a sync function', async () => {
    const tool = new MeasureTool();
    const result = await tool.measureExecTime('syncFn', () => 'hello');
    expect(result.result).toBe('hello');
  });

  it('preserves the return type of the function (generic)', async () => {
    const tool = new MeasureTool();
    const result = await tool.measureExecTime('obj', async () => ({ id: 1, name: 'test' }));
    // TypeScript should infer result.result as { id: number; name: string }
    expect(result.result.id).toBe(1);
    expect(result.result.name).toBe('test');
  });

  it('propagates errors thrown by fn', async () => {
    const tool = new MeasureTool();
    await expect(
      tool.measureExecTime('failing', async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
  });
});

// =============================================================================
// threadBlockTime()
// =============================================================================
describe('MeasureTool — threadBlockTime', () => {
  it('calls the callback with name and a numeric durationMs', (done) => {
    const tool = new MeasureTool();
    tool.threadBlockTime('blockCheck', ({ name, durationMs }) => {
      expect(name).toBe('blockCheck');
      expect(typeof durationMs).toBe('number');
      expect(durationMs).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('works with no arguments (does not throw)', () => {
    const tool = new MeasureTool();
    expect(() => tool.threadBlockTime()).not.toThrow();
  });

  it('does not call fn when fn is not a function', (done) => {
    const tool = new MeasureTool();
    // Should not throw — fn is undefined
    tool.threadBlockTime('test', undefined);
    setTimeout(done, 0); // confirm we reach here without error
  });
});

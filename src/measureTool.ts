class MeasureTool {
  private hrstart: any = 0;
  private hrcheckpoint: any = 0;
  private checkoints: any[] = [];

  constructor() {
    this.hrstart = 0;
    this.hrcheckpoint = 0;
    this.checkoints = [];
  }

  calcDuration(hrcp: any[]) {
    return Math.round(hrcp[0] * 1000 + hrcp[1] / 1000000);
  }

  /**
   * Measure execution time of a function fn
   * @param {string} name Name of function that has been called, used for loggin purposes
   * @param fn
   * @returns
   */
  async measureExecTime(name: string, fn: any) {
    this.start();

    const result = await fn();

    const measure = this.stop(name);

    return { ...measure, result };
  }

  /**
   * Check the thread blocking time and calls a function
   * @param {{ name: string, durationMs: number }} fn Function that get called after measuring is done
   */
  threadBlockTime(name?: string, fn?: any) {
    const hrstart = process.hrtime();

    setImmediate(() => {
      const hrcp = process.hrtime(hrstart);

      if (typeof fn === 'function') {
        fn({ name, durationMs: this.calcDuration(hrcp) });
      }
    });
  }

  /**
   * Start a serie of measurements with checkpoints
   * @returns {object} Object of type { hrtime }
   */
  start() {
    this.hrstart = process.hrtime();
    this.hrcheckpoint = process.hrtime();
    this.checkoints.length = 0;

    return { hrtime: this.hrstart };
  }

  /**
   * Add a checkpoint in between operations to measure duration of time since last checkpoint
   * @param {string} name Name of the checkpoint
   * @returns {object}
   */
  addCheckpoint(name?: string) {
    const hrcp = process.hrtime(this.hrcheckpoint);
    this.hrcheckpoint = process.hrtime();

    const msg = { name, durationMs: this.calcDuration(hrcp) };

    this.checkoints.push(msg);

    return { hrtime: this.hrcheckpoint, ...msg };
  }

  /**
   * Stop a serie of measurements and return a final duration in msec along with name of the step
   * @param {string} name Name of last checkpoint
   * @returns {object}
   */
  stop(name?: string) {
    const hrcp = process.hrtime(this.hrstart);

    const msg = { name, durationMs: this.calcDuration(hrcp) };

    return { hrtime: process.hrtime(), ...msg };
  }

  /**
   * Return a list of checkpoints
   * @returns {object[]}
   */
  getCheckpoints() {
    return this.checkoints;
  }
}

export { MeasureTool };

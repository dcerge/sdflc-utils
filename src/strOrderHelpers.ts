class StrOrderHelpers {
  private start = '';
  private step = '0';
  private orderNo = '';
  private base = 36; // English alphabet + 10 digits

  /**
   * OrderHerlpers constructor
   * @param opt Object with initial params: start, step and value base (default 36)
   */
  constructor(opt: any) {
    this.start = opt?.start ?? '0';
    this.step = opt?.step ?? '1';
    this.base = isNaN(opt?.base) || opt?.base == null ? 36 : Number(opt.base);

    this.orderNo = this.start;
  }

  /**
   * Returns current counter value
   * @returns string
   */
  current() {
    return this.orderNo;
  }

  /**
   * Resets counter to the start value
   */
  reset() {
    this.orderNo = this.start;
  }

  /**
   * Adds a value to the counter and returns next counter value
   * @param {string} value to add to the current counter
   * @returns {string} New counter increased by value
   */
  addValue(value: string) {
    this.orderNo = this.add(this.orderNo, value);
    return this.orderNo;
  }

  /**
   * Substracts a value to the counter and returns next counter value
   * @param {string} value to substract to the current counter
   * @returns {string} New counter decreased by value
   */
  substractValue(value: string) {
    this.orderNo = this.substract(this.orderNo, value);
    return this.orderNo;
  }

  /**
   * Increases counter value by step and return new value
   * @returns {string} A string value increased by step
   */
  increase() {
    return this.addValue(this.step);
  }

  /**
   * Decreases counter value by step and return new value
   * @returns {string} A string value decreased by step
   */
  decrease() {
    return this.substractValue(this.step);
  }

  /**
   * Adds valueB to the valueA and returns result
   * @param {string} valueA
   * @param {string} valueB
   * @returns
   */
  add(valueA: string, valueB: string) {
    return (parseInt(valueA, this.base) + parseInt(valueB, this.base)).toString(this.base);
  }

  /**
   * Substracts valueB from the valueA and returns result
   * @param {string} valueA
   * @param {string} valueB
   * @returns {string}
   */
  substract(valueA: string, valueB: string) {
    return (parseInt(valueA, this.base) - parseInt(valueB, this.base)).toString(this.base);
  }

  /**
   * Finds values in the middle between valueA and valueB. If nothing found returns null value
   * @param {string} valueA
   * @param {string} valueB
   * @returns {string} A value between valueA and valueB or null
   */
  valueBetween(valueA: string, valueB: string) {
    let minValue = valueA;
    let maxValue = valueB;

    if (minValue > maxValue) {
      minValue = valueB;
      maxValue = valueA;
    }

    const diff = ((parseInt(maxValue, this.base) - parseInt(minValue, this.base)) / 2).toString(this.base);
    const newValue = this.add(minValue, diff);

    return newValue != minValue ? newValue : null;
  }
}

export { StrOrderHelpers };

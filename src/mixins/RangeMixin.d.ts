declare function RangeMixin<T extends new (...args: any[]) => {}>(base: T): T & RangeMixinConstructor;

/**
 * Use `RangeMixin` to implement an element that has a range of minimum and maximum.
 * @fires ratiochange
 */
export interface RangeMixinConstructor {
  new(...args: any[]): RangeMixin;

  /**
   * @returns the ratio of the value.
   */
  get ratio(): number;
}

export const ratioValue: unique symbol;
export const rangeChanged: unique symbol;
export const computeStep: unique symbol;
export const clampValue: unique symbol;
export const computeRatio: unique symbol;
export const validateValue: unique symbol;
export const valueValue: unique symbol;
export const minValue: unique symbol;
export const maxValue: unique symbol;
export const stepValue: unique symbol;
export const computeDebounce: unique symbol;
export const debounceValue: unique symbol;

/**
 * Use `RangeMixin` to implement an element that has a range of minimum and maximum.
 * @fires ratiochange
 */
export interface RangeMixin {
  /**
   * the ratio of the value.
   */
  readonly ratio: number;
  /**
   * The number that represents the current value.
   * @attribute
   */
  value: number;

  /**
  * The number that indicates the minimum value of the range.
  * @attribute
  */
  min: number;

  /**
  * The number that indicates the maximum value of the range.
  * @attribute
  */
  max: number;

  /**
  * Specifies the value granularity of the range's value.
  * @attribute
  */
  step: number;
  /**
   * Performs the update when values change.
   */
  [rangeChanged](): void;
  [computeStep](step: number): number;
  [clampValue](value: number): number;
  /**
   * Performs the computations in a RAF.
   * This is to make sure all attributes are set before computation occur.
   */
  [computeDebounce](): void;
  [computeRatio](value: number): number;
  /**
   * Makes sure the value is in the right format.
   * @returns True when the value has changed.
   */
  [validateValue](): boolean;
}

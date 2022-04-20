/* eslint-disable class-methods-use-this */
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

export const ratioValue = Symbol('rationValue');
export const rangeChanged = Symbol('rangeChanged');
export const computeStep = Symbol('computeStep');
export const clampValue = Symbol('clampValue');
export const computeRatio = Symbol('computeRatio');
export const validateValue = Symbol('validateValue');
export const valueValue = Symbol('valueValue');
export const minValue = Symbol('minValue');
export const maxValue = Symbol('maxValue');
export const stepValue = Symbol('stepValue');
export const computeDebounce = Symbol('computeDebounce');
export const debounceValue = Symbol('debounceValue');

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Use `RangeMixin` to implement an element that has a range of minimum and maximum.
 * 
 * This is inspired by Polymer's `iron-range-behavior`.
 *
 * @mixin
 * 
 * @attr {number} value
 * @prop {number | undefined} value
 * @attr {number} min
 * @prop {number | undefined} min
 * @attr {number} max
 * @prop {number | undefined} max
 * @attr {number} step
 * @prop {number | undefined} step
 * @fires ratiochange
 */
export interface RangeMixinInterface {
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

  [computeRatio](value: number): number;
  [rangeChanged](): void;
  [clampValue](value: number): number;
}

/**
 * Use `RangeMixin` to implement an element that has a range of minimum and maximum.
 * 
 * This is inspired by Polymer's `iron-range-behavior`.
 *
 * @mixin
 * 
 * @attr {number} value
 * @prop {number | undefined} value
 * @attr {number} min
 * @prop {number | undefined} min
 * @attr {number} max
 * @prop {number | undefined} max
 * @attr {number} step
 * @prop {number | undefined} step
 * @fires ratiochange
 */
export function RangeMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<RangeMixinInterface> & T {
  class MyMixinClass extends superClass {
    /**
     * @returns the ratio of the value.
     */
    get ratio(): number {
      return this[ratioValue];
    }

    [ratioValue] = 0;

    [valueValue] = 0;

    [minValue] = 0;

    [maxValue] = 100;

    [stepValue] = 1;

    [debounceValue]?: number;

    /**
     * The number that represents the current value.
     */
    @property({ reflect: true, type: Number })
    get value(): number {
      return this[valueValue];
    }

    set value(value: number) {
      let parsed = value;
      if (typeof parsed === 'string') {
        parsed = parseFloat(parsed);
      }
      if (this[valueValue] === parsed) {
        return;
      }
      this[valueValue] = parsed;
      this[computeDebounce]();
    }

    /**
     * The number that indicates the minimum value of the range.
     */
    @property({ reflect: true, type: Number })
    get min(): number {
      return this[minValue];
    }

    set min(value: number) {
      let parsed = value;
      if (typeof parsed === 'string') {
        parsed = parseFloat(parsed);
      }
      if (this[minValue] === parsed) {
        return;
      }
      this[minValue] = parsed;
      this[computeDebounce]();
    }

    /**
     * The number that indicates the maximum value of the range.
     */
    @property({ reflect: true, type: Number })
    get max(): number {
      return this[maxValue];
    }

    set max(value: number) {
      let parsed = value;
      if (typeof parsed === 'string') {
        parsed = parseFloat(parsed);
      }
      if (this[maxValue] === parsed) {
        return;
      }
      this[maxValue] = parsed;
      this[computeDebounce]();
    }

    /**
     * Specifies the value granularity of the range's value.
     */
    @property({ reflect: true, type: Number })
    get step(): number {
      return this[stepValue];
    }

    set step(value: number) {
      let parsed = value;
      if (typeof parsed === 'string') {
        parsed = parseFloat(parsed);
      }
      if (this[stepValue] === parsed) {
        return;
      }
      this[stepValue] = parsed;
      this[computeDebounce]();
    }

    oldValue?: number;

    constructor(...args: any[]) {
      super(...args);
      this[rangeChanged]();
    }

    /**
     * Performs the update when values change.
     */
    [rangeChanged](): void {
      this[validateValue]();
      const ratio = this[computeRatio](this.value) * 100;
      if (this[ratioValue] !== ratio) {
        this[ratioValue] = ratio;
        this.dispatchEvent(new Event('ratiochange'));
        if (typeof this.requestUpdate === 'function') {
          this.requestUpdate();
        }
      }
    }

    [computeStep](step: number): number {
      const value = step;
      if (!this.step) {
        return value;
      }
      const numSteps = Math.round((value - this.min) / this.step);
      if (this.step < 1) {
        /**
         * For small values of this.step, if we calculate the step using
         * `Math.round(value / step) * step` we may hit a precision point issue
         * eg. 0.1 * 0.2 =  0.020000000000000004
         * http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html
         *
         * as a work around we can divide by the reciprocal of `step`
         */
        return numSteps / (1 / this.step) + this.min;
      }
      return numSteps * this.step + this.min;
    }

    [clampValue](value: number): number {
      return Math.min(this.max, Math.max(this.min, this[computeStep](value)));
    }

    /**
     * Performs the computations in a RAF.
     * This is to make sure all attributes are set before computation occur.
     */
    [computeDebounce](): void {
      if (this[debounceValue]) {
        return;
      }
      this[debounceValue] = requestAnimationFrame(() => {
        this[debounceValue] = undefined;
        this[rangeChanged]();
      });
    }

    [computeRatio](value: number): number {
      const denominator = this.max - this.min;
      if (denominator === 0) {
        return 0;
      }
      return (this[clampValue](value) - this.min) / (this.max - this.min);
    }

    /**
     * Makes sure the value is in the right format.
     * @returns True when the value has changed.
     */
    [validateValue](): boolean {
      const v = this[clampValue](this.value);
      this.oldValue = Number.isNaN(v) ? this.oldValue : v;
      this.value = this.oldValue!;
      return this.value !== v;
    }
  }
  return MyMixinClass as Constructor<RangeMixinInterface> & T;
}

/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@open-wc/dedupe-mixin';

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

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class RangeMixinImpl extends base {
    static get properties() {
      return {
        /**
         * The number that represents the current value.
         */
        value: { type: Number, reflect: true },

        /**
         * The number that indicates the minimum value of the range.
         */
        min: { type: Number, reflect: true },

        /**
         * The number that indicates the maximum value of the range.
         */
        max: { type: Number, reflect: true },

        /**
         * Specifies the value granularity of the range's value.
         */
        step: { type: Number, reflect: true },
      };
    }

    /**
     * @returns {number} the ratio of the value.
     */
    get ratio() {
      return this[ratioValue];
    }

    /**
     * @returns {number}
     */
    get value() {
      return this[valueValue];
    }

    /**
     * @param {number} value
     */
    set value(value) {
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
     * @returns {number}
     */
    get min() {
      return this[minValue];
    }

    /**
     * @param {number} value
     */
    set min(value) {
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
     * @returns {number}
     */
    get max() {
      return this[maxValue];
    }

    /**
     * @param {number} value
     */
    set max(value) {
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
     * @returns {number}
     */
    get step() {
      return this[stepValue];
    }

    /**
     * @param {number} value
     */
    set step(value) {
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

    constructor() {
      super();
      
      this[ratioValue] = 0;
      this[valueValue] = 0;
      this[minValue] = 0;
      this[maxValue] = 100;
      this[stepValue] = 1;

      this[rangeChanged]();
    }

    /**
     * Performs the update when values change.
     */
    [rangeChanged]() {
      this[validateValue]();
      const ratio = this[computeRatio](this.value) * 100;
      if (this[ratioValue] !== ratio) {
        this[ratioValue] = ratio;
        this.dispatchEvent(new Event('ratiochange'));
        // @ts-ignore
        if (typeof this.requestUpdate === 'function') {
          // @ts-ignore
          this.requestUpdate();
        }
      }
    }

    /**
     * @param {number} step
     * @returns {number} 
     */
    [computeStep](step) {
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

    /**
     * @param {number} value
     * @returns {number} 
     */
    [clampValue](value) {
      return Math.min(this.max, Math.max(this.min, this[computeStep](value)));
    }

    /**
     * Performs the computations in a RAF.
     * This is to make sure all attributes are set before computation occur.
     */
    [computeDebounce]() {
      if (this[debounceValue]) {
        return;
      }
      this[debounceValue] = requestAnimationFrame(() => {
        this[debounceValue] = undefined;
        this[rangeChanged]();
      });
    }

    /**
     * @param {number} value
     * @returns {number} 
     */
    [computeRatio](value) {
      const denominator = this.max - this.min;
      if (denominator === 0) {
        return 0;
      }
      return (this[clampValue](value) - this.min) / (this.max - this.min);
    }

    /**
     * Makes sure the value is in the right format.
     * @returns {boolean} True when the value has changed.
     */
    [validateValue]() {
      const v = this[clampValue](this.value);
      this.oldValue = Number.isNaN(v) ? this.oldValue : v;
      this.value = this.oldValue;
      return this.value !== v;
    }
  }
  return RangeMixinImpl;
};

/**
 * Use `RangeMixin` to implement an element that has a range of minimum and maximum.
 * 
 * This is inspired by Polymer's `iron-range-behavior`.
 *
 * @mixin
 */
export const RangeMixin = dedupeMixin(mxFunction);

import { PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { floatConverter } from '../../lib/AttributeConverters.js';
import AnypointElement from "../AnypointElement.js";

/**
 * A base class for elements that computes a range.
 * 
 * @fires ratiochange
 */
export default class AnypointRangeElement extends AnypointElement {
  protected _ratio = 0;

  protected _debounce?: number;

  protected _oldValue?: number;

  /**
   * @returns the ratio of the value.
   */
  get ratio(): number {
    return this._ratio;
  }

  /**
   * The number that represents the current value.
   * @attr
   */
  @property({ reflect: true, type: Number, converter: floatConverter }) value: number = 0;

  /**
   * The number that indicates the minimum value of the range.
   * @attr
   */
  @property({ reflect: true, type: Number, converter: floatConverter }) min: number = 0;

  /**
   * The number that indicates the maximum value of the range.
   * @attr
   */
  @property({ reflect: true, type: Number, converter: floatConverter }) max: number = 100;

  /**
   * Specifies the value granularity of the range's value.
   * @attr
   */
  @property({ reflect: true, type: Number, converter: floatConverter }) step: number = 1;

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('value') || cp.has('min') || cp.has('max') || cp.has('step')) {
      this._rangeChanged();
    }
  }

  protected _rangeChanged(): void {
    this._validateValue();
    const ratio = this._computeRatio(this.value) * 100;
    if (this._ratio !== ratio) {
      this._ratio = ratio;
      this.dispatchEvent(new Event('ratiochange'));
    }
  }

  /**
   * Makes sure the value is in the right format.
   * @returns True when the value has changed.
   */
  protected _validateValue(): boolean {
    const v = this._clampValue(this.value);
    this._oldValue = Number.isNaN(v) ? this._oldValue : v;
    this.value = this._oldValue!;
    return this.value !== v;
  }

  protected _clampValue(value: number): number {
    return Math.min(this.max, Math.max(this.min, this._computeStep(value)));
  }

  protected _computeStep(step: number): number {
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

  protected _computeRatio(value: number): number {
    const denominator = this.max - this.min;
    if (denominator === 0) {
      return 0;
    }
    return (this._clampValue(value) - this.min) / (this.max - this.min);
  }
}

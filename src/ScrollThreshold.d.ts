import { TemplateResult, LitElement } from 'lit-element';
import { ScrollTargetMixin } from './mixins/ScrollTargetMixin.js';

/**
 * A port of `iron-scroll-threshold` element.
 * 
 * @fires upperchange
 * @fires lowerchange
 * @fires upperthreshold
 * @fires lowerthreshold
 */
export default class ScrollThresholdElement extends ScrollTargetMixin(LitElement) {
  /**
   * Distance from the top (or left, for horizontal) bound of the scroller
   * where the "upper trigger" will fire.
   * @attribute
   */
  upperThreshold: number;

  /**
   * Distance from the bottom (or right, for horizontal) bound of the scroller
   * where the "lower trigger" will fire.
   * @attribute
   */
  lowerThreshold: number;
  /**
   * True if the orientation of the scroller is horizontal.
   * @attribute
   */
  horizontal: boolean;

  /**
   * Read-only value that tracks the triggered state of the upper threshold.
   */
  get upperTriggered(): boolean;

  /**
   * Read-only value that tracks the triggered state of the lower threshold.
   */
  get lowerTriggered(): boolean;
  _upperTriggered: boolean;
  _lowerTriggered: boolean;

  get _defaultScrollTarget(): this;
  _scrollDebouncer: number;
  onlowerthreshold: EventListener | null | undefined;
  onupperthreshold: EventListener | null | undefined;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;
  _scrollTargetChanged(value: any): void;
  _setOverflow(scrollTarget: any): void;
  _scrollHandler(): void;
  _initCheck(): void;

  /**
   * Checks the scroll thresholds.
   * This method is automatically called by iron-scroll-threshold.
   */
  checkScrollThresholds(): void;

  /**
   * Clear the upper and lower threshold states.
   */
  clearTriggers(): void;
}

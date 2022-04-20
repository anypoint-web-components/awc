import { html, css, LitElement, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ScrollTargetMixin } from '../mixins/ScrollTargetMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/**
 * A port of `scroll-threshold` element.
 * 
 * @attr {string} scrollTarget
 * @prop {HTMLElement | string} scrollTarget
 */
export default class ScrollThresholdElement extends ScrollTargetMixin(LitElement) {
  static get styles(): CSSResult {
    return css`:host {display: block;}`;
  }

  /**
   * Distance from the top (or left, for horizontal) bound of the scroller
   * where the "upper trigger" will fire.
   */
  @property({ type: Number, reflect: true })
  upperThreshold = 100;

  /**
   * Distance from the bottom (or right, for horizontal) bound of the scroller
   * where the "lower trigger" will fire.
   */
  @property({ type: Number, reflect: true })
  lowerThreshold = 100;

  _horizontal?: boolean;

  _upperTriggered = false;

  _lowerTriggered = false;

  _scrollDebouncer = 200;
  
  /**
   * Read-only value that tracks the triggered state of the upper threshold.
   */
  get upperTriggered(): boolean {
    return this._upperTriggered;
  }

  /**
   * Read-only value that tracks the triggered state of the lower threshold.
   */
  get lowerTriggered(): boolean {
    return this._lowerTriggered;
  }

  /**
   * True if the orientation of the scroller is horizontal.
   */
  @property({ type: Boolean, reflect: true })
  get horizontal(): boolean | undefined {
    return this._horizontal;
  }

  set horizontal(value: boolean | undefined) {
    const old = this._horizontal;
    if (old === value) {
      return;
    }
    this._horizontal = value;
    this._initCheck();
  }

  get _defaultScrollTarget(): HTMLElement {
    return this;
  }

  /**
   * @return Previously registered callback for `lowerthreshold`.
   */
  get onlowerthreshold(): EventListener | undefined {
    return getListener('lowerthreshold', this);
  }

  /**
   * Registers event listener for `lowerthreshold` event.
   * @param value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onlowerthreshold(value: EventListener | undefined) {
    addListener('lowerthreshold', value, this);
  }

  /**
   * @return Previously registered callback for `upperthreshold`.
   */
  get onupperthreshold(): EventListener | undefined {
    return getListener('upperthreshold', this);
  }

  /**
   * Registers event listener for `upperthreshold` event.
   * @param value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onupperthreshold(value: EventListener | undefined) {
    addListener('upperthreshold', value, this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._initCheck();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  private _thresholdDebouncer: any;
  
  private __initDebouncer: any;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._thresholdDebouncer) {
      clearTimeout(this._thresholdDebouncer);
      this._thresholdDebouncer = undefined;
    }
    if (this.__initDebouncer) {
      clearTimeout(this.__initDebouncer);
      this.__initDebouncer = undefined;
    }
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  _scrollTargetChanged(value: HTMLElement | string): void {
    super._scrollTargetChanged(value);
    if (typeof value !== 'string') {
      this._setOverflow(value);
    }
  }

  _setOverflow(scrollTarget: HTMLElement): void {
    this.style.overflow = scrollTarget === this ? 'auto' : '';
    // @ts-ignore
    this.style.webkitOverflowScrolling = scrollTarget === this ? 'touch' : '';
  }

  _scrollHandler(): void {
    if (this._thresholdDebouncer) {
      return;
    }
    this._thresholdDebouncer = setTimeout(() => {
      this._thresholdDebouncer = undefined;
      this.checkScrollThresholds();
    }, this._scrollDebouncer);
  }

  _initCheck(): void {
    if (!this.isAttached || this.__initDebouncer) {
      return;
    }
    this.__initDebouncer = setTimeout(() => {
      this.__initDebouncer = undefined;
      this.clearTriggers();
      this.checkScrollThresholds();
    });
  }

  /**
   * Checks the scroll thresholds.
   * This method is automatically called by -scroll-threshold.
   *
   * @method checkScrollThresholds
   */
  checkScrollThresholds(): void {
    const scrollElement = this.scrollTarget as HTMLElement;
    if (!scrollElement || (this.lowerTriggered && this.upperTriggered)) {
      return;
    }
    const upperScrollValue = this.horizontal ? this._scrollLeft : this._scrollTop;
    const lowerScrollValue = this.horizontal ? scrollElement.scrollWidth - this._scrollTargetWidth - this._scrollLeft : scrollElement.scrollHeight - this._scrollTargetHeight - this._scrollTop;

    // Detect upper threshold
    if (upperScrollValue <= this.upperThreshold && !this.upperTriggered) {
      this._upperTriggered = true;
      this.dispatchEvent(new Event('upperchange'));
      this.dispatchEvent(new Event('upperthreshold'));
    }
    // Detect lower threshold
    if (lowerScrollValue <= this.lowerThreshold && !this.lowerTriggered) {
      this._lowerTriggered = true;
      this.dispatchEvent(new Event('lowerchange'));
      this.dispatchEvent(new CustomEvent('lowerthreshold'));
    }
  }

  /**
   * Clear the upper and lower threshold states.
   *
   * @method clearTriggers
   */
  clearTriggers(): void {
    this.dispatchEvent(new Event('upperchange'));
    this.dispatchEvent(new Event('lowerchange'));
    this._lowerTriggered = false;
    this._upperTriggered = false;
  }
}

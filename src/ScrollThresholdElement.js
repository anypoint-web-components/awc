import { html, css, LitElement } from 'lit';
import { ScrollTargetMixin } from './mixins/ScrollTargetMixin.js';

/**
 * A port of `iron-scroll-threshold` element.
 */
export default class ScrollThresholdElement extends ScrollTargetMixin(LitElement) {
  static get styles() {
    return css`:host {display: block;}`;
  }

  static get properties() {
    return {
      /**
       * Distance from the top (or left, for horizontal) bound of the scroller
       * where the "upper trigger" will fire.
       */
      upperThreshold: { type: Number },
      /**
       * Distance from the bottom (or right, for horizontal) bound of the scroller
       * where the "lower trigger" will fire.
       */
      lowerThreshold: { type: Number },
      /**
       * True if the orientation of the scroller is horizontal.
       */
      horizontal: { type: Boolean }
    };
  }

  /**
   * Read-only value that tracks the triggered state of the upper threshold.
   * @returns {boolean}
   */
  get upperTriggered() {
    return this._upperTriggered;
  }

  /**
   * Read-only value that tracks the triggered state of the lower threshold.
   * @returns {boolean}
   */
  get lowerTriggered() {
    return this._lowerTriggered;
  }

  get _upperTriggered() {
    return this.__upperTriggered;
  }

  set _upperTriggered(value) {
    this.__upperTriggered = value;
    this.dispatchEvent(new Event('upperchange'));
  }

  get _lowerTriggered() {
    return this.__lowerTriggered;
  }

  set _lowerTriggered(value) {
    this.__lowerTriggered = value;
    this.dispatchEvent(new Event('lowerchange'));
  }

  get horizontal() {
    return this._horizontal;
  }

  set horizontal(value) {
    const old = this._horizontal;
    if (old === value) {
      return;
    }
    this._horizontal = value;
    this._initCheck();
  }

  get _defaultScrollTarget() {
    return this;
  }

  get _scrollDebouncer() {
    return this.__scrollDebouncer || 200;
  }

  /**
   * Sets value for scroll debounce timeout.
   * @param {Number} value Scroll computation timeout value.
   */
  set _scrollDebouncer(value) {
    this.__scrollDebouncer = value;
  }

  /**
   * @return {EventListener|null|undefined} Previously registered callback for `lowerthreshold`.
   */
  get onlowerthreshold() {
    return this._onlowerthreshold;
  }

  /**
   * Registers event listener for `lowerthreshold` event.
   * @param {EventListener} value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onlowerthreshold(value) {
    if (this._onlowerthreshold) {
      this.removeEventListener('lowerthreshold', this._onlowerthreshold);
    }
    if (typeof value !== 'function') {
      this._onlowerthreshold = null;
      return;
    }
    this._onlowerthreshold = value;
    this.addEventListener('lowerthreshold', value);
  }

  /**
   * @return {EventListener|null|undefined} Previously registered callback for `upperthreshold`.
   */
  get onupperthreshold() {
    return this._onupperthreshold;
  }

  /**
   * Registers event listener for `upperthreshold` event.
   * @param {EventListener} value Function to register. Pass null or undefined to clear
   * registered function.
   */
  set onupperthreshold(value) {
    if (this._onupperthreshold) {
      this.removeEventListener('upperthreshold', this._onupperthreshold);
    }
    if (typeof value !== 'function') {
      this._onupperthreshold = null;
      return;
    }
    this._onupperthreshold = value;
    this.addEventListener('upperthreshold', value);
  }

  constructor() {
    super();
    this.upperThreshold = 100;
    this.lowerThreshold = 100;
    this.horizontal = false;
    this._upperTriggered = false;
    this._lowerTriggered = false;
  }

  connectedCallback() {
    /* istanbul ignore next */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._initCheck();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  disconnectedCallback() {
    /* istanbul ignore next */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    if (this._thresholdDebouncer) {
      clearTimeout(this._thresholdDebouncer);
      this._thresholdDebouncer = undefined;
    }
    if (this.__initDebouncer) {
      clearTimeout(this.__initDebouncer);
      this.__initDebouncer = undefined;
    }
  }

  render() {
    return html`<slot></slot>`;
  }

  _scrollTargetChanged(value) {
    super._scrollTargetChanged(value);
    this._setOverflow(value);
  }

  _setOverflow(scrollTarget) {
    this.style.overflow = scrollTarget === this ? 'auto' : '';
    // @ts-ignore
    this.style.webkitOverflowScrolling = scrollTarget === this ? 'touch' : '';
  }

  _scrollHandler() {
    if (this._thresholdDebouncer) {
      return;
    }
    this._thresholdDebouncer = setTimeout(() => {
      this._thresholdDebouncer = undefined;
      this.checkScrollThresholds();
    }, this._scrollDebouncer);
  }

  _initCheck() {
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
   * This method is automatically called by iron-scroll-threshold.
   *
   * @method checkScrollThresholds
   */
  checkScrollThresholds() {
    const scrollElement = /** @type HTMLElement */ (this.scrollTarget);
    if (!scrollElement || (this.lowerTriggered && this.upperTriggered)) {
      return;
    }
    const upperScrollValue = this.horizontal ? this._scrollLeft : this._scrollTop;
    const lowerScrollValue = this.horizontal ?
      scrollElement.scrollWidth - this._scrollTargetWidth - this._scrollLeft :
      scrollElement.scrollHeight - this._scrollTargetHeight - this._scrollTop;

    // Detect upper threshold
    if (upperScrollValue <= this.upperThreshold && !this.upperTriggered) {
      this._upperTriggered = true;
      this.dispatchEvent(new Event('upperthreshold'));
    }
    // Detect lower threshold
    if (lowerScrollValue <= this.lowerThreshold && !this.lowerTriggered) {
      this._lowerTriggered = true;
      this.dispatchEvent(new CustomEvent('lowerthreshold'));
    }
  }

  /**
   * Clear the upper and lower threshold states.
   *
   * @method clearTriggers
   */
  clearTriggers() {
    this._upperTriggered = false;
    this._lowerTriggered = false;
  }
}

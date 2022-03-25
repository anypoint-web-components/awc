import { html, css, LitElement, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ResizableMixin } from '../mixins/ResizableMixin.js';

const transitionEndHandler = Symbol('transitionEndHandler');
const updateSize = Symbol('updateSize');
const isAttached = Symbol('isAttached');
const updateTransition = Symbol('updateTransition');
const calcSize = Symbol('calcSize');
const dimension = Symbol('dimension');
const dimensionMax = Symbol('dimensionMax');
const dimensionMaxCss = Symbol('dimensionMaxCss');
const transitionEnd = Symbol('transitionEnd');
const desiredSize = Symbol('desiredSize');
const transitioning = Symbol('transitioning');
const transitioningValue = Symbol('transitioningValue');
const openedChanged = Symbol('openedChanged');
const horizontalChanged = Symbol('horizontalChanged');
const toggleAttribute = Symbol('toggleAttribute');

export default class AnypointCollapseElement extends ResizableMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      transition-duration: var(--anypoint-collapse-transition-duration, 300ms);
      -webkit-transition-duration: var(--anypoint-collapse-transition-duration, 300ms);
      overflow: visible;
    }

    :host([collapse-closed]) {
      display: none;
    }

    :host(:not([collapse-opened])) {
      overflow: hidden;
    }
    `;
  }

  /**
   * Set noAnimation to true to disable animations.
   */
  @property({ type: Boolean })
  noAnimation?: boolean;

  _horizontal?: boolean;

  _opened?: boolean;

  [transitioningValue]?: boolean;

  /**
   * Stores the desired size of the collapse body.
   */
  [desiredSize] = '';
  
  /**
   * Renders the collapse horizontally when true and vertically otherwise
   * @attribute
   */
  @property({ type: Boolean })
  get horizontal(): boolean | undefined {
    return this._horizontal;
  }

  set horizontal(value: boolean | undefined) {
    const old = this._horizontal;
    if (old === value) {
      return;
    }
    this._horizontal = value;
    this[horizontalChanged]();
    this.requestUpdate('horizontal', old);
  }

  /**
   * Set opened to true to show the collapse element and to false to hide it.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get opened(): boolean | undefined {
    return this._opened;
  }

  set opened(value: boolean | undefined) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    this._opened = value;
    this[openedChanged]();
    this.requestUpdate('opened', old);
  }

  /**
   * @return When true, the element is transitioning its opened state. When false,
   * the element has finished opening/closing.
   */
  get transitioning(): boolean | undefined {
    return this[transitioning];
  }

  get [transitioning](): boolean {
    return this[transitioningValue] || false;
  }

  set [transitioning](value: boolean) {
    const old = this[transitioningValue];
    if (old === value) {
      return;
    }
    this[transitioningValue] = value;
    this.dispatchEvent(new Event('transitioningchange'));
  }

  get [dimension](): string {
    return this.horizontal ? 'width' : 'height';
  }

  /**
   * `maxWidth` or `maxHeight`.
   * @private
   */
  get [dimensionMax](): string {
    return this.horizontal ? 'maxWidth' : 'maxHeight';
  }

  /**
   * `max-width` or `max-height`.
   * @private
   */
  get [dimensionMaxCss](): string {
    return this.horizontal ? 'max-width' : 'max-height';
  }

  get [isAttached](): boolean {
    return !!this.parentNode;
  }

  constructor() {
    super();
    this.horizontal = false;
    this.opened = false;
    this.noAnimation = false;

    this[transitionEndHandler] = this[transitionEndHandler].bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'group');
    }
    if (!this.hasAttribute('aria-hidden')) {
      this.setAttribute('aria-hidden', 'true');
    }
    this.addEventListener('transitionend', this[transitionEndHandler]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('transitionend', this[transitionEndHandler]);
  }

  /**
   * Toggle the opened state.
   */
  toggle(): void {
    this.opened = !this.opened;
    this.dispatchEvent(new Event('openedchange'));
  }

  /**
   * Opens the collapsable
   */
  open(): void {
    this.opened = true;
    this.dispatchEvent(new Event('openedchange'));
  }

  /**
   * Closes the collapsable
   */
  close(): void {
    this.opened = false;
    this.dispatchEvent(new Event('openedchange'));
  }

  /**
   * Updates the size of the element.
   * @param size The new value for `maxWidth`/`maxHeight` as css property value, usually `auto` or `0px`.
   * @param animated if `true` updates the size with an animation, otherwise without.
   */
  [updateSize](size: string, animated?: boolean): void {
    // Consider 'auto' as '', to take full size.
    let sizeValue = size === 'auto' ? '' : size;

    let willAnimate = animated && !this.noAnimation && this[isAttached];
    this[desiredSize] = sizeValue;

    this[updateTransition](false);
    // If we can animate, must do some prep work.
    if (willAnimate) {
      // Animation will start at the current size.
      const startSize = this[calcSize]();
      // For `auto` we must calculate what is the final size for the animation.
      // After the transition is done, _transitionEnd will set the size back to
      // `auto`.
      if (sizeValue === '') {
        // @ts-ignore
        this.style[this[dimensionMax]] = '';
        sizeValue = this[calcSize]();
      }
      // Go to startSize without animation.
      // @ts-ignore
      this.style[this[dimensionMax]] = startSize;
      // Force layout to ensure transition will go. Set scrollTop to itself
      // so that compilers won't remove it.
      // eslint-disable-next-line no-self-assign
      this.scrollTop = this.scrollTop;
      // Enable animation.
      this[updateTransition](true);
      // If final size is the same as startSize it will not animate.
      willAnimate = (sizeValue !== startSize);
    }
    // Set the final size.
    // @ts-ignore
    this.style[this[dimensionMax]] = sizeValue;
    // If it won't animate, call transitionEnd to set correct classes.
    if (!willAnimate) {
      this[transitionEnd]();
    }
  }

  [updateTransition](enabled?: boolean): void {
    this.style.transitionDuration = (enabled && !this.noAnimation) ? '' : '0s';
  }

  /**
   * Calculates the size of the element when opened.
   */
  [calcSize](): string {
    // @ts-ignore
    const value = this.getBoundingClientRect()[this[dimension]];
    return `${value}px`;
  }

  [transitionEnd](): void {
    // @ts-ignore
    this.style[this[dimensionMax]] = this[desiredSize];
    this[toggleAttribute]('collapse-closed', !this.opened);
    this[toggleAttribute]('collapse-opened', this.opened);
    this[updateTransition](false);
    this.notifyResize();
    this[transitioning] = false;
  }

  [transitionEndHandler](e: Event): void {
    const target = e.composedPath().find((node) => node === this);
    if (target) {
      this[transitionEnd]();
    }
  }

  [openedChanged](): void {
    this.setAttribute('aria-hidden', String(!this.opened));

    this[transitioning] = true;
    this[toggleAttribute]('collapse-closed', false);
    this[toggleAttribute]('collapse-opened', false);
    this[updateSize](this.opened ? 'auto' : '0px', true);

    // Focus the current collapse.
    if (this.opened) {
      this.focus();
    }
  }

  /**
   * Toggles attribute on the element
   *
   * @param attr The attribute to toggle
   * @param add Whether the attribute should be added or removed.
   */
  [toggleAttribute](attr: string, add?: boolean): void {
    const has = this.hasAttribute(attr);
    if (!has && add) {
      this.setAttribute(attr, '');
    } else if (has && !add) {
      this.removeAttribute(attr);
    }
  }

  [horizontalChanged](): void {
    this.style.transitionProperty = this[dimensionMaxCss];
    const otherDimension = this[dimensionMax] === 'maxWidth' ? 'maxHeight' : 'maxWidth';
    this.style[otherDimension] = '';
    this[updateSize](this.opened ? 'auto' : '0px', false);
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

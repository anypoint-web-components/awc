/* eslint-disable class-methods-use-this */
import { html, LitElement } from 'lit-element';
import { Ripple } from './Ripple.js';
import elementStyles from './styles/ripple.styles.js';

export const animating = Symbol('animating');
export const animatingValue = Symbol('animatingValue');
export const keyEventTarget = Symbol('keyEventTarget');
export const keyDownHandler = Symbol('keyDownHandler');
export const keyUpHandler = Symbol('keyUpHandler');
export const uiUpAction = Symbol('uiUpAction');
export const uiDownAction = Symbol('uiDownAction');
export const animateRipple = Symbol('animateRipple');
export const onAnimationComplete = Symbol('onAnimationComplete');
export const addRipple = Symbol('addRipple');
export const removeRipple = Symbol('removeRipple');

export default class MaterialRippleElement extends LitElement {
  get styles() {
    // compatibility with ACM.
    return elementStyles;
  }

  static get properties() {
    return {
      /**
       * The initial opacity set on the wave.
       */
      initialOpacity: { type: Number },
      /**
       * How fast (opacity per second) the wave fades out.
       */
      opacityDecayVelocity: { type: Number },
      /**
       * If true, ripples will exhibit a gravitational pull towards
       * the center of their container as they fade away.
       */
      recenters: { type: Boolean },
      /**
       * If true, ripples will center inside its container
       */
      center: { type: Boolean },
      /**
       * If true, the ripple will not generate a ripple effect
       * via pointer interaction.
       * Calling ripple's imperative api like `simulatedRipple` will
       * still generate the ripple effect.
       */
      noink: { type: Boolean, reflect: true },
    };
  }

  /**
   * @returns {boolean} True when there are visible ripples animating within the element.
   */
  get animating() {
    return this[animatingValue];
  }

  /**
   * @param {boolean} value;
   */
  set [animating](value) {
    const old = this[animatingValue];
    if (old === value) {
      return;
    }
    this[animatingValue] = value;
    if (value && !this.hasAttribute('animating')) {
      this.setAttribute('animating', '');
    } else if (!value && this.hasAttribute('animating')) {
      this.removeAttribute('animating');
    }
  }

  /**
   * @returns {EventTarget}
   */
  get target() {
    return this[keyEventTarget];
  }

  get shouldKeepAnimating() {
    return this.ripples.some(r => !r.isAnimationComplete);
  }

  constructor() {
    super();
    this.initialOpacity = 0.25;
    this.opacityDecayVelocity = 0.8;
    this.recenters = false;
    this.center = false;
    /**
     * A list of the visual ripples.
     * @type {Ripple[]}
     */
    this.ripples = [];
    this.noink = false;
    this[animatingValue] = false;

    this[animateRipple] = this[animateRipple].bind(this);
    this[keyDownHandler] = this[keyDownHandler].bind(this);
    this[keyUpHandler] = this[keyUpHandler].bind(this);
    this[uiUpAction] = this[uiUpAction].bind(this);
    this[uiDownAction] = this[uiDownAction].bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {  // DOCUMENT_FRAGMENT_NODE -> 11
      const rNode = /** @type ShadowRoot */ (this.getRootNode());
      this[keyEventTarget] = rNode.host || rNode;
    } else {
      this[keyEventTarget] = this.parentNode;
    }
    const { target } = this;
    const eventConfig = /** @type AddEventListenerOptions */ ({ passive: true, });
    target.addEventListener('mouseup', this[uiUpAction], eventConfig);
    target.addEventListener('touchend', this[uiUpAction], eventConfig);
    target.addEventListener('mousedown', this[uiDownAction], eventConfig);
    target.addEventListener('touchstart', this[uiDownAction], eventConfig);
    target.addEventListener('keydown', this[keyDownHandler], eventConfig);
    target.addEventListener('keyup', this[keyUpHandler], eventConfig);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const eventConfig = /** @type AddEventListenerOptions */ ({ passive: true, });
    const { target } = this;
    this[keyEventTarget] = null;
    target.removeEventListener('mouseup', this[uiUpAction], eventConfig);
    target.removeEventListener('touchend', this[uiUpAction], eventConfig);
    target.removeEventListener('mousedown', this[uiDownAction], eventConfig);
    target.removeEventListener('touchstart', this[uiDownAction], eventConfig);
    target.removeEventListener('keydown', this[keyDownHandler], eventConfig);
    target.removeEventListener('keyup', this[keyUpHandler], eventConfig);
  }

  /**
   * Makes a ripple effect in a default position.
   */
  simulatedRipple() {
    this.down(null);
    setTimeout(() => { this.up() }, 1);
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   * @param {MouseEvent=} event
   */
  [uiDownAction](event) {
    if (!this.noink) {
      this.down(event);
    }
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param {MouseEvent=} event When present it uses the `x` and `y` as a start coordinates.
   */
  down(event) {
    const ripple = this[addRipple]();
    if (!ripple) {
      return;
    }
    ripple.downAction(event);
    if (!this[animatingValue]) {
      this[animating] = true;
      this[animateRipple]();
    }
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * *not* respecting the `noink` property.
   */
  up() {
    this.ripples.forEach(ripple  => ripple.upAction());
    this[animating] = true;
    this[animateRipple]();
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   */
  [uiUpAction]() {
    if (!this.noink) {
      this.up();
    }
  }

  [onAnimationComplete]() {
    this[animating] = false;
    const bg = /** @type HTMLElement */ (this.shadowRoot.querySelector('#background'));
    if (bg) {
      bg.style.backgroundColor = '';
    }
    this.dispatchEvent(new Event('transitionend'))
  }

  /**
   * @returns {Ripple} 
   */
  [addRipple]() {
    const bg = /** @type HTMLElement */ (this.shadowRoot.querySelector('#background'));
    const waves = /** @type HTMLElement */ (this.shadowRoot.querySelector('#waves'));
    if (!bg || !waves) {
      // this is when adding a ripple was scheduled in a timer but the element has been destroyed.
      return null;
    }
    // @ts-ignore
    const ripple = new Ripple(this);
    waves.appendChild(ripple.waveContainer);
    bg.style.backgroundColor = ripple.color;
    this.ripples.push(ripple);
    // this[animating] = true;
    return ripple;
  }

  /**
   * @param {Ripple} ripple
   */
  [removeRipple](ripple) {
    const rippleIndex = this.ripples.indexOf(ripple);
    if (rippleIndex < 0) {
      return;
    }
    this.ripples.splice(rippleIndex, 1);
    ripple.remove();
    if (!this.ripples.length) {
      this[animating] = false;
    }
  }

  [animateRipple]() {
    if (!this[animatingValue]) {
      return;
    }
    const bg = /** @type HTMLElement */ (this.shadowRoot.querySelector('#background'));
    this.ripples.forEach((ripple) => {
      ripple.draw();
      bg.style.opacity = String(ripple.outerOpacity);
      if (ripple.isOpacityFullyDecayed && !ripple.isRestingAtMaxRadius) {
        this[removeRipple](ripple);
      }
    });

    if (!this.shouldKeepAnimating && this.ripples.length === 0) {
      this[onAnimationComplete]();
    } else {
      window.requestAnimationFrame(this[animateRipple]);
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  [keyDownHandler](e) {
    if (['Enter', 'NumpadEnter'].includes(e.code)) {
      this[uiDownAction]();
      setTimeout(this[uiUpAction], 1);
    } else if (['Space'].includes(e.code)) {
      this[uiDownAction]();
      e.preventDefault();
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  [keyUpHandler](e) {
    if (['Space'].includes(e.code)) {
      this[uiUpAction]();
    }
  }

  render() {
    return html`<style>${this.styles}</style><div id="background"></div><div id="waves"></div>`;
  }
}

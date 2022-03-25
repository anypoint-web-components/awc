/* eslint-disable class-methods-use-this */
import { html, LitElement, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
// eslint-disable-next-line import/no-cycle
import { Ripple } from '../lib/Ripple.js';
import elementStyles from '../styles/ripple.styles.js';

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
  static get styles(): CSSResult {
    return elementStyles;
  }

  /**
   * The initial opacity set on the wave.
   */
  @property({ type: Number })
  initialOpacity = 0.25;

  /**
   * How fast (opacity per second) the wave fades out.
   */
  @property({ type: Number })
  opacityDecayVelocity = 0.8;

  /**
   * If true, ripples will exhibit a gravitational pull towards
   * the center of their container as they fade away.
   */
  @property({ type: Boolean })
  recenters?: boolean = false;
  
  /**
   * If true, ripples will center inside its container
   */
  @property({ type: Boolean })
  center?: boolean = false;

  /**
   * If true, the ripple will not generate a ripple effect
   * via pointer interaction.
   * Calling ripple's imperative api like `simulatedRipple` will
   * still generate the ripple effect.
   */
  @property({ type: Boolean, reflect: true })
  noink?: boolean = false;
  
  [animatingValue] = false;

  /**
   * @returns True when there are visible ripples animating within the element.
   */
  get animating(): boolean {
    return this[animatingValue];
  }

  set [animating](value: boolean) {
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

  [keyEventTarget]?: EventTarget;

  get target(): EventTarget | undefined {
    return this[keyEventTarget];
  }

  get shouldKeepAnimating(): boolean {
    return this.ripples.some(r => !r.isAnimationComplete);
  }

  /**
   * A list of the visual ripples.
   */
  ripples: Ripple[] = [];

  constructor() {
    super();
    
    this[animateRipple] = this[animateRipple].bind(this);
    this[keyDownHandler] = this[keyDownHandler].bind(this);
    this[keyUpHandler] = this[keyUpHandler].bind(this);
    this[uiUpAction] = this[uiUpAction].bind(this);
    this[uiDownAction] = this[uiDownAction].bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.parentNode && this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // DOCUMENT_FRAGMENT_NODE -> 11
      const rNode = this.getRootNode() as ShadowRoot;
      this[keyEventTarget] = rNode.host || rNode;
    } else {
      this[keyEventTarget] = this.parentNode!;
    }
    const target = this.target!;
    const eventConfig: AddEventListenerOptions = { passive: true };
    target.addEventListener('mouseup', this[uiUpAction], eventConfig);
    target.addEventListener('touchend', this[uiUpAction], eventConfig);
    target.addEventListener('mousedown', this[uiDownAction] as EventListener, eventConfig);
    target.addEventListener('touchstart', this[uiDownAction] as EventListener, eventConfig);
    target.addEventListener('keydown', this[keyDownHandler] as EventListener, eventConfig);
    target.addEventListener('keyup', this[keyUpHandler] as EventListener, eventConfig);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const eventConfig: AddEventListenerOptions = { passive: true };
    const target = this.target!;
    this[keyEventTarget] = undefined;
    target.removeEventListener('mouseup', this[uiUpAction], eventConfig);
    target.removeEventListener('touchend', this[uiUpAction], eventConfig);
    target.removeEventListener('mousedown', this[uiDownAction] as EventListener, eventConfig);
    target.removeEventListener('touchstart', this[uiDownAction] as EventListener, eventConfig);
    target.removeEventListener('keydown', this[keyDownHandler] as EventListener, eventConfig);
    target.removeEventListener('keyup', this[keyUpHandler] as EventListener, eventConfig);
  }

  /**
   * Makes a ripple effect in a default position.
   */
  simulatedRipple(): void {
    this.down();
    setTimeout(() => { this.up(); }, 1);
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   */
  [uiDownAction](event?: MouseEvent): void {
    if (!this.noink) {
      this.down(event);
    }
  }

  /**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param event When present it uses the `x` and `y` as a start coordinates.
   */
  down(event?: MouseEvent): void {
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
  up(): void {
    this.ripples.forEach(ripple => ripple.upAction());
    this[animating] = true;
    this[animateRipple]();
  }

  /**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   */
  [uiUpAction](): void {
    if (!this.noink) {
      this.up();
    }
  }

  [onAnimationComplete](): void {
    this[animating] = false;
    const bg = this.shadowRoot!.querySelector('#background') as HTMLElement | null;
    if (bg) {
      bg.style.backgroundColor = '';
    }
    this.dispatchEvent(new Event('transitionend'));
  }

  [addRipple](): Ripple | null {
    const bg = this.shadowRoot!.querySelector('#background') as HTMLElement | null;
    const waves = this.shadowRoot!.querySelector('#waves') as HTMLElement | null;
    if (!bg || !waves) {
      // this is when adding a ripple was scheduled in a timer but the element has been destroyed.
      return null;
    }
    const ripple = new Ripple(this);
    waves.appendChild(ripple.waveContainer);
    bg.style.backgroundColor = ripple.color;
    this.ripples.push(ripple);
    // this[animating] = true;
    return ripple;
  }

  [removeRipple](ripple: Ripple): void {
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

  [animateRipple](): void {
    if (!this[animatingValue]) {
      return;
    }
    const bg = this.shadowRoot!.querySelector('#background') as HTMLElement;
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

  [keyDownHandler](e: KeyboardEvent): void {
    if (['Enter', 'NumpadEnter'].includes(e.code)) {
      this[uiDownAction]();
      setTimeout(this[uiUpAction], 1);
    } else if (['Space'].includes(e.code)) {
      this[uiDownAction]();
      e.preventDefault();
    }
  }

  [keyUpHandler](e: KeyboardEvent): void {
    if (['Space'].includes(e.code)) {
      this[uiUpAction]();
    }
  }

  render(): TemplateResult {
    return html`<div id="background"></div><div id="waves"></div>`;
  }
}
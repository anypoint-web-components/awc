/* eslint-disable class-methods-use-this */
import { html, LitElement, TemplateResult, CSSResult, css } from 'lit';
import { property } from 'lit/decorators.js';
// eslint-disable-next-line import/no-cycle
import { Ripple } from '../../lib/Ripple.js';

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

/**
 * @fires transitionend
 */
export default class MaterialRippleElement extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      position: absolute;
      border-radius: inherit;
      overflow: hidden;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* See PolymerElements/paper-behaviors/issues/34. On non-Chrome browsers,
      * creating a node (with a position:absolute) in the middle of an event
      * handler "interrupts" that event handler (which happens when the
      * ripple is created on demand) */
      pointer-events: none;
    }
    
    :host([animating]) {
      /* This resolves a rendering issue in Chrome (as of 40) where the
        ripple is not properly clipped by its parent (which may have
        rounded corners). See: http://jsbin.com/temexa/4
        Note: We only apply this style conditionally. Otherwise, the browser
        will create a new compositing layer for every ripple element on the
        page, and that would be bad. */
      -webkit-transform: translate(0, 0);
      transform: translate3d(0, 0, 0);
    }
    
    #background,
    #waves,
    .wave-container,
    .wave {
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    #background,
    .wave {
      opacity: 0;
    }
    
    #waves,
    .wave {
      overflow: hidden;
    }
    
    .wave-container,
    .wave {
      border-radius: 50%;
    }
    
    :host(.circle) #background,
    :host(.circle) #waves {
      border-radius: 50%;
    }
    
    :host(.circle) .wave-container {
      overflow: hidden;
    }
    `;
  }

  /**
   * The initial opacity set on the wave.
   * @attr
   */
  @property({ type: Number })
  initialOpacity = 0.25;

  /**
   * How fast (opacity per second) the wave fades out.
   * @attr
   */
  @property({ type: Number })
  opacityDecayVelocity = 0.8;

  /**
   * If true, ripples will exhibit a gravitational pull towards
   * the center of their container as they fade away.
   * @attr
   */
  @property({ type: Boolean })
  recenters?: boolean = false;
  
  /**
   * If true, ripples will center inside its container
   * @attr
   */
  @property({ type: Boolean })
  center?: boolean = false;

  /**
   * If true, the ripple will not generate a ripple effect
   * via pointer interaction.
   * Calling ripple's imperative api like `simulatedRipple` will
   * still generate the ripple effect.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  noink?: boolean = false;

  protected _disabled?: boolean;

  /**
   * Disables the ripple.
   * When currently animating it cancels and removes all ripple effects.
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  get disabled(): boolean | undefined {
    return this._disabled;
  }

  set disabled(value: boolean | undefined) {
    const old = this._disabled;
    if (old === value) {
      return;
    }
    this._disabled = value;
    if (value) {
      this.cancel();
    }
  }

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

  cancel(): void {
    this.ripples.forEach(ripple => {
      ripple.remove();
    });
    this.ripples = [];
    this[animating] = false;
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

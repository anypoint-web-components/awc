import { CSSResult, LitElement, TemplateResult  } from 'lit-element';
import { Ripple } from './Ripple.js';

export const animating: unique symbol;
export const animatingValue: unique symbol;
export const keyEventTarget: unique symbol;
export const keyDownHandler: unique symbol;
export const keyUpHandler: unique symbol;
export const uiUpAction: unique symbol;
export const uiDownAction: unique symbol;
export const animateRipple: unique symbol;
export const onAnimationComplete: unique symbol;
export const addRipple: unique symbol;
export const removeRipple: unique symbol;

/**
 * @fires transitionend
 */
export default class MaterialRippleElement extends LitElement {
  get styles(): CSSResult;

  /**
   * The initial opacity set on the wave.
   * @attribute
   */
  initialOpacity: number;
  /**
  * How fast (opacity per second) the wave fades out.
  * @attribute
  */
  opacityDecayVelocity: number;
  /**
  * If true, ripples will exhibit a gravitational pull towards
  * the center of their container as they fade away.
  * @attribute
  */
  recenters: boolean;
  /**
  * If true, ripples will center inside its container
  * @attribute
  */
  center: boolean;
  /**
  * If true, the ripple will not generate a ripple effect
  * via pointer interaction.
  * Calling ripple's imperative api like `simulatedRipple` will
  * still generate the ripple effect.
  * @attribute
  */
  noink: boolean;

  /**
   * @returns True when there are visible ripples animating within the element.
   */
  get animating(): boolean;
  set [animating](value: boolean);
  get target(): EventTarget;
  [keyEventTarget]: EventTarget;
  get shouldKeepAnimating(): boolean;
  ripples: Ripple[];

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  /**
   * Makes a ripple effect in a default position.
   */
  simulatedRipple(): void;

  /**
   * Provokes a ripple down effect via a UI event,
   * respecting the `noink` property.
   */
  [uiDownAction](event?: MouseEvent): void;

  /**
   * Provokes a ripple down effect via a UI event,
   * *not* respecting the `noink` property.
   * @param event When present it uses the `x` and `y` as a start coordinates.
   */
  down(event?: MouseEvent): void;
  /**
   * Provokes a ripple up effect via a UI event,
   * *not* respecting the `noink` property.
   */
  up(): void;
  /**
   * Provokes a ripple up effect via a UI event,
   * respecting the `noink` property.
   */
  [uiUpAction](): void;
  [onAnimationComplete](): void;
  [addRipple](): Ripple;
  [removeRipple](ripple: Ripple): void;

  [animateRipple](): void;
  [keyDownHandler](e: KeyboardEvent): void;
  [keyUpHandler](e: KeyboardEvent): void;

  render(): TemplateResult;
}

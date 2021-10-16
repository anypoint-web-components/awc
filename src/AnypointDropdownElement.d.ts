import { TemplateResult, LitElement } from 'lit-element';
import { OverlayMixin } from './mixins/OverlayMixin.js';
import { ControlStateMixin } from './mixins/ControlStateMixin';

export default class AnypointDropdownElement extends OverlayMixin(ControlStateMixin(LitElement)) {
  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  openAnimationConfig: object;

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  closeAnimationConfig: object;
  /**
   * If provided, this will be the element that will be focused when
   * the dropdown opens.
   */
  focusTarget: HTMLElement;
  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   * @attribute
   */
  noAnimations: boolean;
  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * This property is a shortcut to set `scrollAction` to lock or refit.
   * Prefer directly setting the `scrollAction` property.
   * @attribute
   */
  allowOutsideScroll: boolean;

  /**
   * Set to true to fit dropdown content width to dropdown selector
   * @attribute
   */
  fitPositionTarget: boolean;

  /**
   * The element that is contained by the dropdown, if any.
   */
  readonly containedElement: HTMLElement;

  readonly contentWrapper: HTMLElement;

  constructor();

  connectedCallback(): void;

  firstUpdated(): void;

  disconnectedCallback(): void;

  _updateOverlayPosition(): void;

  _openedChanged(opened: boolean): void;

  _renderOpened(): void;

  _renderClosed(): void;

  /**
   * Called when animation finishes on the dropdown (when opening or
   * closing). Responsible for "completing" the process of opening or
   * closing the dropdown by positioning it or setting its display to
   * none.
   */
  _onAnimationFinish(): void;

  /**
   * Sets scrollAction according to the value of allowOutsideScroll.
   * Prefer setting directly scrollAction.
   */
  _allowOutsideScrollChanged(allowOutsideScroll: boolean): void;

  _applyFocus(): void;

  playAnimation(name: string): void;

  cancelAnimation(): void;

  _runEffects(node: Element, config: object): Animation[];

  __runAnimation(node: Element, options: object, results: Animation[]): void;

  _configureStartAnimation(node: Element, config: object): Animation[];

  _configureEndAnimation(node: Element, config: object): Animation[];

  _setPrefixedProperty(node: Element, property: string, value: string): void;

  render(): TemplateResult;
}

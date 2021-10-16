import { TemplateResult } from 'lit-element';
import AnypointInputElement from './AnypointInputElement.js';
import { VerticalAlign, HorizontalAlign } from './mixins/FitMixin';

/**
 * `anypoint-input-combobox`
 */
export default class AnypointInputComboboxElement extends AnypointInputElement {
  /**
   * The content element that is contained by the dropdown, if any.
   */
  get contentElement(): HTMLElement | null;
  /**
   * Whether the dropdown is rendered.
   * @attribute
   */
  opened: boolean;
  /**
   * The orientation against which to align the element vertically
   * relative to the `positionTarget`. Possible values are "top", "bottom",
   * "middle", "auto".
   * @attribute
   */
  verticalAlign: VerticalAlign;
  /**
   * The orientation against which to align the element horizontally
   * relative to the `positionTarget`. Possible values are "left", "right",
   * "center", "auto".
   * @attribute
   */
  horizontalAlign: HorizontalAlign;
  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`, in the direction of alignment. You can think
   * of it as increasing or decreasing the distance to the side of the
   * screen given by `verticalAlign`.
   *
   * If `verticalAlign` is "top" or "middle", this offset will increase or
   * decrease the distance to the top side of the screen: a negative offset
   * will move the dropdown upwards; a positive one, downwards.
   *
   * Conversely if `verticalAlign` is "bottom", this offset will increase
   * or decrease the distance to the bottom side of the screen: a negative
   * offset will move the dropdown downwards; a positive one, upwards.
   * @attribute
   */
  verticalOffset: number;
  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`, in the direction of alignment. You can think
   * of it as increasing or decreasing the distance to the side of the
   * screen given by `horizontalAlign`.
   *
   * If `horizontalAlign` is "left" or "center", this offset will increase or
   * decrease the distance to the left side of the screen: a negative offset
   * will move the dropdown to the left; a positive one, to the right.
   *
   * Conversely if `horizontalAlign` is "right", this offset will increase
   * or decrease the distance to the right side of the screen: a negative
   * offset will move the dropdown to the right; a positive one, to the left.
   * @attribute
   */
  horizontalOffset: number;
  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as
   * preferred alignment and if there's not enough space, it will pick the
   * values which minimize the cropping.
   * @attribute
   */
  dynamicAlign: boolean;
  /**
   * Will position the list around the button without overlapping
   * it.
   * @attribute
   */
  noOverlap: boolean;
  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   * @attribute
   */
  openAnimationConfig?: object;

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   * @attribute
   */
  closeAnimationConfig?: object;
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
   * Dropdown fits the content width.
   * Default value is false.
   * @attribute
   */
  fitPositionTarget: boolean;

  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * Toggles the dropdown opened state
   */
  toggle(): void;
  render(): TemplateResult;
  _suffixTemplate(): TemplateResult;
}

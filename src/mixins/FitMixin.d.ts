declare function FitMixin<T extends new (...args: any[]) => {}>(base: T): T & FitMixinConstructor;
interface FitMixinConstructor {
  new(...args: any[]): FitMixin;
}

declare interface FitInfo {
  inlineStyle: {
    top: string;
    left: string;
    position: string;
  }
  sizerInlineStyle: {
    maxWidth: string;
    maxHeight: string;
    boxSizing: string;
  }
  positionedBy: {
    vertically: string | null;
    horizontally: string | null;
  }
  sizedBy: {
    height: boolean;
    width: boolean;
    minWidth: number;
    minHeight: number;
  }
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
}

export type VerticalAlign = "top" | "bottom" | "middle" | "auto";
export type HorizontalAlign = "left" | "right" | "center" | "auto";

interface FitMixin {
  /**
   * The element that will receive a `max-height`/`width`. By default it is
   * the same as `this`, but it can be set to a child element. This is useful,
   * for example, for implementing a scrolling region inside the element.
   */
  sizingTarget: HTMLElement;
  /**
   * The element to fit `this` into.
   */
  fitInto: HTMLElement,
  /**
   * Will position the element around the positionTarget without overlapping
   * it.
   * @attribute
   */
  noOverlap: boolean;

  /**
   * The element that should be used to position the element. If not set, it
   * will default to the parent node.
   */
  positionTarget: HTMLElement,
  /**
   * The orientation against which to align the element horizontally
   * relative to the `positionTarget`. Possible values are "left", "right",
   * "center", "auto".
   * @attribute
   */
  horizontalAlign: string;
  /**
   * The orientation against which to align the element vertically
   * relative to the `positionTarget`. Possible values are "top", "bottom",
   * "middle", "auto".
   * @attribute
   */
  verticalAlign: VerticalAlign;
  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as
   * preferred alignment and if there's not enough space, it will pick the
   * values which minimize the cropping.
   * @attribute
   */
  dynamicAlign: boolean;
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
   * Set to true to auto-fit on attach.
   * @attribute
   */
  autoFitOnAttach: boolean;
  /**
   * When set it fits the positioning target width.
   * @attribute
   */
  fitPositionTarget: boolean;

  _fitInfo: FitInfo;

  readonly _fitWidth: number;
  readonly _fitHeight: number;
  readonly _fitLeft: number;
  readonly _fitTop: number;
  readonly _defaultPositionTarget: HTMLElement;
  readonly _localeHorizontalAlign: string;

  connectedCallback(): void;
  disconnectedCallback(): void;

  /**
   * Positions and fits the element into the `fitInto` element.
   */
  fit(): void;

  /**
   * Memoize information needed to position and size the target element.
   */
  _discoverInfo(): void;

  /**
   * Resets the target element's position and size constraints, and clear
   * the memoized data.
   */
  resetFit(): void;

  /**
   * Equivalent to calling `resetFit()` and `fit()`. Useful to call this after
   * the element or the `fitInto` element has been resized, or if any of the
   * positioning properties (e.g. `horizontalAlign, verticalAlign`) is updated.
   * It preserves the scroll position of the sizingTarget.
   */
  refit(): void;

  /**
   * Positions the element according to `horizontalAlign, verticalAlign`.
   */
  position(): void;

  /**
   * Constrains the size of the element to `fitInto` by setting `max-height`
   * and/or `max-width`.
   */
  constrain(): void;

  /**
   * Centers horizontally and vertically if not already positioned. This also
   * sets `position:fixed`.
   */
  center(): void;
}

export { FitMixinConstructor };
export { FitMixin };

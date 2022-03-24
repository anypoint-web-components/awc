/* eslint-disable max-classes-per-file */
import { LitElement } from 'lit';
import { property } from 'lit/decorators';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */

interface FitInfo {
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

interface PositionInfo {
  verticalAlign: VerticalAlign;
  horizontalAlign: HorizontalAlign;
  top: number;
  left: number;
  offscreenArea?: number;
}

interface SizeInfo {
  width: number;
  height: number;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export declare interface FitMixinInterface {
  sizingTarget: HTMLElement;

  /**
   * The element that should be used to position the element. If not set, it
   * will default to the parent node.
   */
  positionTarget?: HTMLElement | Window;

  /**
  * The orientation against which to align the element horizontally
  * relative to the `positionTarget`. Possible values are "left", "right",
  * "center", "auto".
  */
  horizontalAlign?: HorizontalAlign;

  /**
  * The orientation against which to align the element vertically
  * relative to the `positionTarget`. Possible values are "top", "bottom",
  * "middle", "auto".
  */
  verticalAlign?: VerticalAlign;

  /**
  * If true, it will use `horizontalAlign` and `verticalAlign` values as
  * preferred alignment and if there's not enough space, it will pick the
  * values which minimize the cropping.
  */
  dynamicAlign?: boolean;

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
  */
  verticalOffset: number;

  /**
  * Set to true to auto-fit on attach.
  */
  autoFitOnAttach?: boolean;

  /** 
  * When set it fits the positioning target width.
  */
  fitPositionTarget?: boolean;

  /**
   * Positions and fits the element into the `fitInto` element.
   */
  fit(): void;
  
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

/**
 * This mixin is a port of https://github.com/PolymerElements/iron-fit-behavior
 * that works with LitElement.
 *
 * `FitMixin` fits an element in another element using `max-height`
 * and `max-width`, and optionally centers it in the window or another element.
 * The element will only be sized and/or positioned if it has not already been
 * sized and/or positioned by CSS.
 *
 * CSS properties            | Action
 * --------------------------|-------------------------------------------
 * `position` set            | Element is not centered horizontally or vertically
 * `top` or `bottom` set     | Element is not vertically centered
 * `left` or `right` set     | Element is not horizontally centered
 * `max-height` set          | Element respects `max-height`
 * `max-width` set           | Element respects `max-width`
 *
 * `FitMixin` can position an element into another element using
 * `verticalAlign` and `horizontalAlign`. This will override the element's css
 * position.
 *
 *     <div class="container">
 *       <arc-fit-impl verticalalign="top" horizontalAlign="auto">
 *         Positioned into the container
 *       </arc-fit-impl>
 *     </div>
 *
 * Use `noOverlap` to position the element around another element without
 * overlapping it.
 *
 *     <div class="container">
 *       <arc-fit-impl noOverlap verticalalign="auto" horizontalAlign="auto">
 *         Positioned around the container
 *       </arc-fit-impl>
 *     </div>
 *
 * Use `horizontalOffset, verticalOffset` to offset the element from its
 * `positionTarget`; `FitMixin` will collapse these in order to
 * keep the element within `fitInto` boundaries, while preserving the element's
 * CSS margin values.
 *
 *     <div class="container">
 *       <arc-fit-impl verticalalign="top" verticalOffset="20">
 *         With vertical offset
 *       </arc-fit-impl>
 *     </div>
 *
 * ## Usage
 *
 * ```javascript
 * import { LitElement } from 'lit-element';
 * import { FitMixin } from 'anypoint-web-components/awc';
 *
 * class ArcFitImpl extends FitMixin(LitElement) {
 *  ...
 * }
 * ```
 *
 * @mixin
 */
export const FitMixin = dedupeMixin(<T extends Constructor<LitElement>>(superClass: T): Constructor<FitMixinInterface> & T => {
  class MyMixinClass extends superClass {
    /**
     * The element to fit `this` into.
     */
    @property({ type: Object }) fitInto: HTMLElement | Window;

    /**
     * The element that will receive a `max-height`/`width`. By default it is
     * the same as `this`, but it can be set to a child element. This is useful,
     * for example, for implementing a scrolling region inside the element.
     */
    @property({ type: Object }) sizingTarget: HTMLElement;
    
    /**
     * Will position the element around the positionTarget without overlapping
     * it.
     */
    @property({ type: Boolean }) noOverlap?: boolean;

    /**
     * The element that should be used to position the element. If not set, it
     * will default to the parent node.
     */
    @property({ type: Object }) positionTarget?: HTMLElement | Window;

    /**
    * The orientation against which to align the element horizontally
    * relative to the `positionTarget`. Possible values are "left", "right",
    * "center", "auto".
    */
    @property({ type: String }) horizontalAlign?: HorizontalAlign;

    /**
    * The orientation against which to align the element vertically
    * relative to the `positionTarget`. Possible values are "top", "bottom",
    * "middle", "auto".
    */
    @property({ type: String }) verticalAlign?: VerticalAlign;

    /**
    * If true, it will use `horizontalAlign` and `verticalAlign` values as
    * preferred alignment and if there's not enough space, it will pick the
    * values which minimize the cropping.
    */
    @property({ type: Boolean }) dynamicAlign?: boolean;

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
    */
    @property({ reflect: true, type: Number })
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
    */
    @property({ reflect: true, type: Number })
    verticalOffset: number;

    /**
    * Set to true to auto-fit on attach.
    */
    @property({ reflect: true, type: Boolean })
    autoFitOnAttach: boolean;

    _fitInfo?: FitInfo;

    /** 
    * When set it fits the positioning target width.
    */
    @property({ type: Boolean }) fitPositionTarget?: boolean;

    get _fitWidth(): number {
      let fitWidth;
      if (this.fitInto === window) {
        fitWidth = this.fitInto.innerWidth;
      } else {
        // @ts-ignore
        fitWidth = this.fitInto.getBoundingClientRect().width;
      }
      return fitWidth;
    }

    get _fitHeight(): number {
      let fitHeight;
      if (this.fitInto === window) {
        fitHeight = this.fitInto.innerHeight;
      } else {
        // @ts-ignore
        // @ts-ignore
        fitHeight = this.fitInto.getBoundingClientRect().height;
      }
      return fitHeight;
    }

    get _fitLeft(): number {
      let fitLeft;
      if (this.fitInto === window) {
        fitLeft = 0;
      } else {
        // @ts-ignore
        fitLeft = this.fitInto.getBoundingClientRect().left;
      }
      return fitLeft;
    }

    get _fitTop(): number {
      let fitTop;
      if (this.fitInto === window) {
        fitTop = 0;
      } else {
        // @ts-ignore
        fitTop = this.fitInto.getBoundingClientRect().top;
      }
      return fitTop;
    }

    /**
     * The element that should be used to position the element,
     * if no position target is configured.
     */
    get _defaultPositionTarget(): HTMLElement {
      let parent = this.parentNode;
      if (parent && parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
        // @ts-ignore
        parent = parent.host;
      }
      return parent as HTMLElement;
    }

    _isRTL?: boolean;

    /**
     * The horizontal align value, accounting for the RTL/LTR text direction.
     */
    get _localeHorizontalAlign(): HorizontalAlign {
      if (this._isRTL) {
        // In RTL, "left" becomes "right".
        if (this.horizontalAlign === 'right') {
          return 'left';
        }
        if (this.horizontalAlign === 'left') {
          return 'right';
        }
      }
      return this.horizontalAlign as HorizontalAlign;
    }

    /**
     * True if the element should be positioned instead of centered.
     */
    get __shouldPosition(): boolean {
      return !!(this.horizontalAlign || this.verticalAlign) && !!this.positionTarget;
    }

    constructor(...args: any[]) {
      super(...args);
      this.sizingTarget = this;
      this.fitInto = window;
      this.horizontalOffset = 0;
      this.verticalOffset = 0;
      this.autoFitOnAttach = false;
    }

    connectedCallback(): void {
      super.connectedCallback();
      // Memorize this to avoid expensive calculations & relayouts.
      // Make sure we do it only once
      if (typeof this._isRTL === 'undefined') {
        this._isRTL = window.getComputedStyle(this).direction === 'rtl';
      }
      this.positionTarget = this.positionTarget || this._defaultPositionTarget;
      if (this.autoFitOnAttach) {
        setTimeout(() => this.fit());
      }
    }

    /**
     * Positions and fits the element into the `fitInto` element.
     */
    fit(): void {
      this.position();
      this.constrain();
      this.center();
    }

    /**
     * Memoize information needed to position and size the target element.
     * @suppress {deprecated}
     */
    _discoverInfo(): void {
      if (this._fitInfo) {
        return;
      }
      const target = window.getComputedStyle(this);
      const sizer = window.getComputedStyle(this.sizingTarget);

      let vertically;
      if (target.top !== 'auto') {
        vertically = 'top';
      } else if (target.bottom !== 'auto') {
        vertically = 'bottom';
      } else {
        vertically = null;
      }

      let horizontally;
      if (target.left !== 'auto') {
        horizontally = 'left';
      } else if (target.right !== 'auto') {
        horizontally = 'right';
      } else {
        horizontally = null;
      }

      this._fitInfo = {
        inlineStyle: {
          top: this.style.top || '',
          left: this.style.left || '',
          position: this.style.position || '',
        },
        sizerInlineStyle: {
          maxWidth: this.sizingTarget.style.maxWidth || '',
          maxHeight: this.sizingTarget.style.maxHeight || '',
          boxSizing: this.sizingTarget.style.boxSizing || '',
        },
        positionedBy: {
          vertically,
          horizontally,
        },
        sizedBy: {
          height: sizer.maxHeight !== 'none',
          width: sizer.maxWidth !== 'none',
          minWidth: parseInt(sizer.minWidth, 10) || 0,
          minHeight: parseInt(sizer.minHeight, 10) || 0,
        },
        margin: {
          top: parseInt(target.marginTop, 10) || 0,
          right: parseInt(target.marginRight, 10) || 0,
          bottom: parseInt(target.marginBottom, 10) || 0,
          left: parseInt(target.marginLeft, 10) || 0,
        }
      };
    }

    /**
     * Resets the target element's position and size constraints, and clear
     * the memoized data.
     */
    resetFit(): void {
      const info = this._fitInfo!;
      if (info && info.sizerInlineStyle) {
        Object.keys(info.sizerInlineStyle).forEach((prop) => {
          // @ts-ignore
          this.sizingTarget.style[prop] = info.sizerInlineStyle[prop];
        });
      }
      if (info && info.inlineStyle) {
        Object.keys(info.inlineStyle).forEach((prop) => {
          // @ts-ignore
          this.style[prop] = info.inlineStyle[prop];
        });
      }
      this._fitInfo = undefined;
    }

    /**
     * Equivalent to calling `resetFit()` and `fit()`. Useful to call this after
     * the element or the `fitInto` element has been resized, or if any of the
     * positioning properties (e.g. `horizontalAlign, verticalAlign`) is updated.
     * It preserves the scroll position of the sizingTarget.
     */
    refit(): void {
      const { scrollLeft } = this.sizingTarget;
      const { scrollTop } = this.sizingTarget;
      this.resetFit();
      this.fit();
      this.sizingTarget.scrollLeft = scrollLeft;
      this.sizingTarget.scrollTop = scrollTop;
    }

    /**
     * Positions the element according to `horizontalAlign, verticalAlign`.
     */
    position(): void {
      if (!this.__shouldPosition) {
        // needs to be centered, and it is done after constrain.
        return;
      }
      this._discoverInfo();

      this.style.position = 'fixed';
      // Need border-box for margin/padding.
      this.sizingTarget.style.boxSizing = 'border-box';
      // Set to 0, 0 in order to discover any offset caused by parent stacking
      // contexts.
      this.style.left = '0px';
      this.style.top = '0px';

      const rect = this.getBoundingClientRect();
      const positionRect = this.__getNormalizedRect(this.positionTarget);
      const fitRect = this.__getNormalizedRect(this.fitInto);

      const { margin } = this._fitInfo!;

      // Consider the margin as part of the size for position calculations.
      const size: SizeInfo = {
        width: rect.width + margin.left + margin.right,
        height: rect.height + margin.top + margin.bottom
      };

      const position = this.__getPosition(
        this._localeHorizontalAlign,
        this.verticalAlign!,
        size,
        rect,
        positionRect,
        fitRect
      )!;

      let left = position.left + margin.left;
      let top = position.top + margin.top;

      // We first limit right/bottom within fitInto respecting the margin,
      // then use those values to limit top/left.
      const right = Math.min(fitRect.right - margin.right, left + rect.width);
      const bottom = Math.min(fitRect.bottom - margin.bottom, top + rect.height);

      // Keep left/top within fitInto respecting the margin.
      left = Math.max(fitRect.left + margin.left, Math.min(left, right - this._fitInfo!.sizedBy.minWidth));
      top = Math.max(fitRect.top + margin.top, Math.min(top, bottom - this._fitInfo!.sizedBy.minHeight));

      // Use right/bottom to set maxWidth/maxHeight, and respect
      // minWidth/minHeight.
      if (this.fitPositionTarget) {
        this.sizingTarget.style.maxWidth = `${Math.max(right - left, this._fitInfo!.sizedBy.minWidth, positionRect.width)}px`;
        this.style.width = this.sizingTarget.style.maxWidth;
      } else {
        this.sizingTarget.style.maxWidth = `${Math.max(right - left, this._fitInfo!.sizedBy.minWidth)}px`;
      }
      this.sizingTarget.style.maxHeight = `${Math.max(bottom - top, this._fitInfo!.sizedBy.minHeight)}px`;

      // Remove the offset caused by any stacking context.
      this.style.left = `${left - rect.left}px`;
      this.style.top = `${top - rect.top}px`;
    }

    /**
     * Constrains the size of the element to `fitInto` by setting `max-height`
     * and/or `max-width`.
     */
    constrain(): void {
      if (this.__shouldPosition) {
        return;
      }
      this._discoverInfo();

      const info = this._fitInfo!;
      // position at (0px, 0px) if not already positioned, so we can measure the
      // natural size.
      if (!info.positionedBy.vertically) {
        this.style.position = 'fixed';
        this.style.top = '0px';
      }
      if (!info.positionedBy.horizontally) {
        this.style.position = 'fixed';
        this.style.left = '0px';
      }

      // need border-box for margin/padding
      this.sizingTarget.style.boxSizing = 'border-box';
      // constrain the width and height if not already set
      const rect = this.getBoundingClientRect();
      if (!info.sizedBy.height) {
        this.__sizeDimension(rect, info.positionedBy.vertically!, 'top', 'bottom', 'Height');
      }
      if (!info.sizedBy.width) {
        this.__sizeDimension(rect, info.positionedBy.horizontally!, 'left', 'right', 'Width');
      }
    }

    __sizeDimension(rect: DOMRect, positionedBy: string, start: keyof DOMRect, end: keyof DOMRect, extent: 'Height' | 'Width'): void {
      const info = this._fitInfo;
      const fitRect = this.__getNormalizedRect(this.fitInto);
      const max = extent === 'Width' ? fitRect.width : fitRect.height;
      const flip = (positionedBy === end);
      const offset = flip ? max - (rect[end] as number) : (rect[start] as number);
      // @ts-ignore
      const margin = info.margin[flip ? start : end];
      const offsetExtent = `offset${extent}`;
      // @ts-ignore
      const sizingOffset = this[offsetExtent] - this.sizingTarget[offsetExtent];
      this.sizingTarget.style[`max${extent}`] = `${max - margin - offset - sizingOffset}px`;
    }

    /**
     * Centers horizontally and vertically if not already positioned. This also
     * sets `position:fixed`.
     */
    center(): void {
      if (this.__shouldPosition) {
        return;
      }
      this._discoverInfo();

      const { positionedBy } = this._fitInfo!;
      if (positionedBy.vertically && positionedBy.horizontally) {
        // Already positioned.
        return;
      }
      // Need position:fixed to center
      this.style.position = 'fixed';
      // Take into account the offset caused by parents that create stacking
      // contexts (e.g. with transform: translate3d). Translate to 0,0 and
      // measure the bounding rect.
      if (!positionedBy.vertically) {
        this.style.top = '0px';
      }
      if (!positionedBy.horizontally) {
        this.style.left = '0px';
      }
      // It will take in consideration margins and transforms
      const rect = this.getBoundingClientRect();
      const fitRect = this.__getNormalizedRect(this.fitInto);
      if (!positionedBy.vertically) {
        const top = fitRect.top - rect.top + (fitRect.height - rect.height) / 2;
        this.style.top = `${top}px`;
      }
      if (!positionedBy.horizontally) {
        const left = fitRect.left - rect.left + (fitRect.width - rect.width) / 2;
        this.style.left = `${left}px`;
      }
    }

    __getNormalizedRect(target?: HTMLElement | Window): DOMRect {
      if (target === document.documentElement || target === window || !target) {
        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          right: window.innerWidth,
          bottom: window.innerHeight,
          toJSON(): any {}
        };
      }
      return (target as HTMLElement).getBoundingClientRect();
    }

    __getOffscreenArea(position: PositionInfo, size: SizeInfo, fitRect: DOMRect): number {
      const verticalCrop = Math.min(0, position.top) + Math.min(0, fitRect.bottom - (position.top + size.height));
      const horizontalCrop = Math.min(0, position.left) + Math.min(0, fitRect.right - (position.left + size.width));
      return Math.abs(verticalCrop) * size.width + Math.abs(horizontalCrop) * size.height;
    }

    __getPosition(horizontalAlign: HorizontalAlign, verticalAlign: VerticalAlign, size: SizeInfo, sizeNoMargins: DOMRect, positionRect: DOMRect, fitRect: DOMRect): PositionInfo | undefined {
      // All the possible configurations.
      // Ordered as top-left, top-right, bottom-left, bottom-right.
      const positions: PositionInfo[] = [
        {
          verticalAlign: 'top',
          horizontalAlign: 'left',
          top: positionRect.top + this.verticalOffset,
          left: positionRect.left + this.horizontalOffset
        },
        {
          verticalAlign: 'top',
          horizontalAlign: 'right',
          top: positionRect.top + this.verticalOffset,
          left: positionRect.right - size.width - this.horizontalOffset
        },
        {
          verticalAlign: 'bottom',
          horizontalAlign: 'left',
          top: positionRect.bottom - size.height - this.verticalOffset,
          left: positionRect.left + this.horizontalOffset
        },
        {
          verticalAlign: 'bottom',
          horizontalAlign: 'right',
          top: positionRect.bottom - size.height - this.verticalOffset,
          left: positionRect.right - size.width - this.horizontalOffset
        }
      ];

      if (this.noOverlap) {
        // Duplicate.
        for (let i = 0, l = positions.length; i < l; i++) {
          const copy = {};
          const keys = Object.keys(positions[i]);
          for (let j = 0, lk = keys.length; j < lk; j++) {
            const key = keys[j];
            // @ts-ignore
            copy[key] = positions[i][key];
          }
          // @ts-ignore
          positions.push(copy);
        }
        // Horizontal overlap only.
        positions[0].top = positions[1].top += positionRect.height;
        positions[2].top = positions[3].top -= positionRect.height;
        // Vertical overlap only.
        positions[4].left = positions[6].left += positionRect.width;
        positions[5].left = positions[7].left -= positionRect.width;
      }

      // Consider auto as null for coding convenience.
      const vAlign = verticalAlign === 'auto' ? null : verticalAlign;
      const hAlign = horizontalAlign === 'auto' ? null : horizontalAlign;

      if (!hAlign || hAlign === 'center') {
        positions.push({
          verticalAlign: 'top',
          horizontalAlign: 'center',
          top: positionRect.top + this.verticalOffset + (this.noOverlap ? positionRect.height : 0),
          left: positionRect.left - sizeNoMargins.width / 2 + positionRect.width / 2 + this.horizontalOffset
        });
        positions.push({
          verticalAlign: 'bottom',
          horizontalAlign: 'center',
          top: positionRect.bottom - size.height - this.verticalOffset - (this.noOverlap ? positionRect.height : 0),
          left: positionRect.left - sizeNoMargins.width / 2 + positionRect.width / 2 + this.horizontalOffset
        });
      }

      if (!vAlign || vAlign === 'middle') {
        positions.push({
          verticalAlign: 'middle',
          horizontalAlign: 'left',
          top: positionRect.top - sizeNoMargins.height / 2 + positionRect.height / 2 + this.verticalOffset,
          left: positionRect.left + this.horizontalOffset + (this.noOverlap ? positionRect.width : 0)
        });
        positions.push({
          verticalAlign: 'middle',
          horizontalAlign: 'right',
          top: positionRect.top - sizeNoMargins.height / 2 + positionRect.height / 2 + this.verticalOffset,
          left: positionRect.right - size.width - this.horizontalOffset - (this.noOverlap ? positionRect.width : 0)
        });
      }

      if (vAlign === 'middle' && hAlign === 'center') {
        positions.push({
          verticalAlign: 'middle',
          horizontalAlign: 'center',
          top: positionRect.top - sizeNoMargins.height / 2 + positionRect.height / 2 + this.verticalOffset,
          left: positionRect.left - sizeNoMargins.width / 2 + positionRect.width / 2 + this.horizontalOffset
        });
      }

      let position: PositionInfo | undefined;
      for (let i = 0; i < positions.length; i++) {
        const candidate = positions[i];
        const vAlignOk = candidate.verticalAlign === vAlign;
        const hAlignOk = candidate.horizontalAlign === hAlign;

        // If both vAlign and hAlign are defined, return exact match.
        // For dynamicAlign and noOverlap we'll have more than one candidate, so
        // we'll have to check the offscreenArea to make the best choice.
        if (!this.dynamicAlign && !this.noOverlap && vAlignOk && hAlignOk) {
          position = candidate;
          break;
        }

        // Align is ok if alignment preferences are respected. If no preferences,
        // it is considered ok.
        const alignOk = (!vAlign || vAlignOk) && (!hAlign || hAlignOk);

        // Filter out elements that don't match the alignment (if defined).
        // With dynamicAlign, we need to consider all the positions to find the
        // one that minimizes the cropped area.
        if (!this.dynamicAlign && !alignOk) {
          continue;
        }

        candidate.offscreenArea = this.__getOffscreenArea(candidate, size, fitRect);
        // If not cropped and respects the align requirements, keep it.
        // This allows to prefer positions overlapping horizontally over the
        // ones overlapping vertically.
        if (candidate.offscreenArea === 0 && alignOk) {
          position = candidate;
          break;
        }
        position = position || candidate;
        const diff = candidate.offscreenArea - (position.offscreenArea || 0);
        // Check which crops less. If it crops equally, check if at least one
        // align setting is ok.
        if (diff < 0 || (diff === 0 && (vAlignOk || hAlignOk))) {
          position = candidate;
        }
      }

      return position;
    }
  }
  return MyMixinClass as Constructor<FitMixinInterface> & T;
});

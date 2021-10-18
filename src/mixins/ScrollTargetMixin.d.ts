declare function ScrollTargetMixin<T extends new (...args: any[]) => {}>(base: T): T & ScrollTargetMixinConstructor;

export {ScrollTargetMixinConstructor};
export {ScrollTargetMixin};

declare interface ScrollTargetMixinConstructor {
  new(...args: any[]): ScrollTargetMixin;
}

declare interface ScrollTargetMixin {
  /**
   * Specifies the element that will handle the scroll event
   * on the behalf of the current element. This is typically a reference to an
   * element, but there are a few more possibilities:
   *
   * ### Elements id
   *
   * ```html
   * <div id="scrollable-element" style="overflow: auto;">
   *  <x-element scroll-target="scrollable-element">
   *    <!-- Content-->
   *  </x-element>
   * </div>
   * ```
   * In this case, the `scrollTarget` will point to the outer div element.
   *
   * ### Document scrolling
   *
   * For document scrolling, you can use the reserved word `document`:
   *
   * ```html
   * <x-element scroll-target="document">
   *   <!-- Content -->
   * </x-element>
   * ```
   *
   * ### Elements reference
   *
   * ```js
   * appHeader.scrollTarget = document.querySelector('#scrollable-element');
   * ```
   * @attribute
   */
  scrollTarget: HTMLElement|string;

  isAttached: boolean;

  /**
   * The default scroll target. Consumers of this behavior may want to customize
   * the default scroll target.
   */
  readonly _defaultScrollTarget: HTMLElement;
  /**
   * Shortcut for the document element
   *
   * @type {HTMLElement}
   */
  readonly _doc: HTMLElement;

  /**
   * The number of pixels that the content of an element is scrolled upward.
   */
  _scrollTop: number;

  /**
   * The number of pixels that the content of an element is scrolled to the left.
   */
  _scrollLeft: number;

  connectedCallback(): void;
  disconnectedCallback(): void;

  /**
     * Runs on every scroll event. Consumer of this mixin may override this method.
     */
   _scrollHandler(): any;

  _scrollTargetChanged(scrollTarget): void;

  /**
   * Scrolls the content to a particular place.
   * 
   * @param leftOrOptions The left position or scroll options
   * @param top The top position
   */
  scroll(leftOrOptions: number|{left: number, top: number}, top?: number): void;

  /**
   * Gets the width of the scroll target.
   */
  readonly _scrollTargetWidth: number;

  /**
   * Gets the height of the scroll target.
   */
   readonly _scrollTargetHeight: number;

  /**
   * Returns true if the scroll target is a valid HTMLElement.
   */
  _isValidScrollTarget(): boolean;

  _toggleScrollListener(yes: boolean, scrollTarget: HTMLElement): void;

  /**
   * Enables or disables the scroll event listener.
   *
   * @param yes True to add the event, False to remove it.
   */
  toggleScrollListener(yes: boolean): void;
}

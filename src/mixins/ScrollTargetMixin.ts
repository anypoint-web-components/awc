/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { property } from 'lit/decorators';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ScrollTargetMixinInterface {
  /**
   * Specifies the element that will handle the scroll event
   * on the behalf of the current element. This is typically a reference to an
   *element, but there are a few more possibilities:
    *
    * ### Elements id
    *
    *```html
    * <div id="scrollable-element" style="overflow: auto;">
    *  <x-element scroll-target="scrollable-element">
    *    <!-- Content-->
    *  </x-element>
    * </div>
    *```
    * In this case, the `scrollTarget` will point to the outer div element.
    *
    * ### Document scrolling
    *
    * For document scrolling, you can use the reserved word `document`:
    *
    *```html
    * <x-element scroll-target="document">
    *   <!-- Content -->
    * </x-element>
    *```
    *
    * ### Elements reference
    *
    *```js
    * appHeader.scrollTarget = document.querySelector('#scrollable-element');
    *```
    */
  scrollTarget: HTMLElement | string | undefined;

  isAttached: boolean;

  /**
   * The default scroll target. Consumers of this behavior may want to customize
   * the default scroll target.
   */
  get _defaultScrollTarget(): HTMLElement;

  /**
   * Shortcut for the document element
   */
  get _doc(): HTMLElement;

  /**
   * Gets the number of pixels that the content of an element is scrolled
   * upward.
   */
  _scrollTop: number;

  /**
   * Gets the number of pixels that the content of an element is scrolled to the
   * left.
   */
  _scrollLeft: number;

  /**
   * Runs on every scroll event. Consumer of this mixin may override this method.
   */
  _scrollHandler(): void;

  /**
   * Scrolls the content to a particular place.
   *
   * @param leftOrOptions The left position or scroll options
   * @param top The top position
   */
  scroll(leftOrOptions?: number | ScrollToOptions, top?: number): void;

  /**
   * Enables or disables the scroll event listener.
   *
   * @param yes True to add the event, False to remove it.
   */
  toggleScrollListener(yes: boolean): void;
}

/**
 * This mixin is a port of [IronScrollTargetBehavior](https://github.com/PolymerElements/iron-acroll-target-behavior)
 * that works with LitElements.
 *
 * `ScrollTargetMixin` allows an element to respond to scroll
 * events from a designated scroll target.
 *
 * Elements that consume this mixin can override the `_scrollHandler`
 * method to add logic on the scroll event.
 * 
 * @mixin
 */
export const ScrollTargetMixin = dedupeMixin(<T extends Constructor<HTMLElement>>(superClass: T): Constructor<ScrollTargetMixinInterface> & T => {
  class MyMixinClass extends superClass {
    _scrollTarget: HTMLElement | string = this._defaultScrollTarget;

    /**
     * Specifies the element that will handle the scroll event
     * on the behalf of the current element. This is typically a reference to an
     *element, but there are a few more possibilities:
     *
     * ### Elements id
     *
     *```html
     * <div id="scrollable-element" style="overflow: auto;">
     *  <x-element scroll-target="scrollable-element">
     *    <!-- Content-->
     *  </x-element>
     * </div>
     *```
     * In this case, the `scrollTarget` will point to the outer div element.
     *
     * ### Document scrolling
     *
     * For document scrolling, you can use the reserved word `document`:
     *
     *```html
     * <x-element scroll-target="document">
     *   <!-- Content -->
     * </x-element>
     *```
     *
     * ### Elements reference
     *
     *```js
     * appHeader.scrollTarget = document.querySelector('#scrollable-element');
     *```
     */
    @property({ type: Object })
    get scrollTarget(): HTMLElement | string {
      return this._scrollTarget;
    }
    
    set scrollTarget(value: HTMLElement | string) {
      if (value === this._scrollTarget) {
        return;
      }
      this._scrollTarget = value;
      this._scrollTargetChanged(value);
    }

    /**
     * A convenient getter that casts the scroll target to an element.
     * Note, when a string is set on the target it is always translated to an element.
     */
    protected get scrollTargetElement(): HTMLElement {
      return this._scrollTarget as HTMLElement;
    }

    private _isAttached = false;
  
    get isAttached(): boolean {
      return this._isAttached;
    }
  
    set isAttached(value) {
      this._isAttached = value;
      this._scrollTargetChanged(this._scrollTarget);
    }
  
    /**
     * The default scroll target. Consumers of this behavior may want to customize
     * the default scroll target.
     */
    get _defaultScrollTarget(): HTMLElement {
      return this._doc;
    }
  
    /**
     * Shortcut for the document element
     */
    get _doc(): HTMLElement {
      return this.ownerDocument.documentElement;
    }
  
    /**
     * Gets the number of pixels that the content of an element is scrolled
     * upward.
     */
    get _scrollTop(): number {
      if (this._isValidScrollTarget()) {
        return this.scrollTarget === this._doc ? window.pageYOffset : this.scrollTargetElement.scrollTop;
      }
      return 0;
    }
  
    /**
     * Gets the number of pixels that the content of an element is scrolled to the
     * left.
     */
    get _scrollLeft(): number {
      if (this._isValidScrollTarget()) {
        return this.scrollTarget === this._doc ? window.pageXOffset : this.scrollTargetElement.scrollLeft;
      }
      return 0;
    }
  
    /**
     * Sets the number of pixels that the content of an element is scrolled
     * upward.
     */
    set _scrollTop(top: number) {
      if (this.scrollTarget === this._doc) {
        window.scrollTo(window.pageXOffset, top);
      } else if (this._isValidScrollTarget()) {
        this.scrollTargetElement.scrollTop = top;
      }
    }
  
    /**
     * Sets the number of pixels that the content of an element is scrolled to the
     * left.
     */
    set _scrollLeft(left: number) {
      if (this.scrollTarget === this._doc) {
        window.scrollTo(left, window.pageYOffset);
      } else if (this._isValidScrollTarget()) {
        this.scrollTargetElement.scrollLeft = left;
      }
    }

    /**
     * True if the event listener should be installed.
     */
    _shouldHaveListener = true;
  
    constructor(...args: any[]) {
      super(...args);
      this._scrollTargetChanged(this._scrollTarget);
    }
  
    connectedCallback(): void {
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this.isAttached = true;
      setTimeout(() => {
        if (!this._oldScrollTarget && this.scrollTarget) {
          this._scrollTargetChanged(this._scrollTarget);
        }
      });
    }
  
    disconnectedCallback(): void {
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.isAttached = false;
    }
  
    /**
     * Runs on every scroll event. Consumer of this mixin may override this method.
     */
    _scrollHandler(): void {
      // ...
    }

    _oldScrollTarget?: HTMLElement;
  
    _scrollTargetChanged(scrollTarget: HTMLElement | string): void {
      if (this._oldScrollTarget) {
        this._toggleScrollListener(false, this._oldScrollTarget);
        this._oldScrollTarget = undefined;
      }
      if (!this.isAttached) {
        return;
      }
      // Support element id references
      if (scrollTarget === 'document') {
        this.scrollTarget = this._doc;
      } else if (typeof scrollTarget === 'string') {
        if (!this.shadowRoot) {
          // shadowRoot is not yet ready. In connectedCallback it checks
          // whether this happened and calls this again to reinitialize.
          return;
        }
        const rootNode = (this.getRootNode && this.getRootNode()) as Element;
        let target;
        if (rootNode) {
          target = rootNode.querySelector(`#${scrollTarget}`);
        }
        if (!target) {
          this.ownerDocument.querySelector(`#${scrollTarget}`);
        }
        this.scrollTarget = target as HTMLElement;
      } else if (this._isValidScrollTarget()) {
        this._oldScrollTarget = scrollTarget;
        this._toggleScrollListener(this._shouldHaveListener, scrollTarget);
      }
    }

    /**
     * Scrolls the content to a particular place.
     *
     * @param leftOrOptions The left position or scroll options
     * @param top The top position
     */
    scroll(leftOrOptions?: number | ScrollToOptions, top?: number): void {
      let left: number | undefined;
      let behavior: ScrollBehavior | undefined;
  
      if (typeof leftOrOptions === 'object') {
        left = leftOrOptions.left;
        top = leftOrOptions.top;
        behavior = leftOrOptions.behavior;
      } else {
        left = leftOrOptions;
      }
  
      left = left || 0;
      top = top || 0;
      if (this.scrollTarget === this._doc) {
        if (behavior) {
          window.scroll({
            left,
            top,
            behavior,
          });
        } else {
          window.scrollTo(left, top);
        }
      } else if (this._isValidScrollTarget()) {
        if (behavior) {
          this.scrollTargetElement.scroll({
            left,
            top,
            behavior,
          });
        } else {
          this.scrollTargetElement.scrollLeft = left;
          this.scrollTargetElement.scrollTop = top;
        }
      }
    }
  
    /**
     * Gets the width of the scroll target.
     */
    get _scrollTargetWidth(): number {
      if (this._isValidScrollTarget()) {
        return this.scrollTarget === this._doc ? window.innerWidth : this.scrollTargetElement.offsetWidth;
      }
      return 0;
    }
  
    /**
     * Gets the height of the scroll target.
     */
    get _scrollTargetHeight(): number {
      if (this._isValidScrollTarget()) {
        return this.scrollTarget === this._doc ? window.innerHeight : this.scrollTargetElement.offsetHeight;
      }
      return 0;
    }
  
    /**
     * Returns true if the scroll target is a valid HTMLElement.
     */
    _isValidScrollTarget(): boolean {
      return this.scrollTarget instanceof HTMLElement;
    }

    _boundScrollHandler?: any;
  
    _toggleScrollListener(yes: boolean, scrollTarget: HTMLElement): void {
      if (!scrollTarget) {
        return;
      }
      const eventTarget = scrollTarget === this._doc ? window : scrollTarget;
      if (yes) {
        if (!this._boundScrollHandler) {
          this._boundScrollHandler = this._scrollHandler.bind(this);
          eventTarget.addEventListener('scroll', this._boundScrollHandler);
        }
      } else if (this._boundScrollHandler) {
          eventTarget.removeEventListener('scroll', this._boundScrollHandler);
          this._boundScrollHandler = null;
        }
    }
  
    /**
     * Enables or disables the scroll event listener.
     *
     * @param yes True to add the event, False to remove it.
     */
    toggleScrollListener(yes: boolean): void {
      this._shouldHaveListener = yes;
      this._toggleScrollListener(yes, this.scrollTargetElement);
    }
  }

  return MyMixinClass as Constructor<ScrollTargetMixinInterface> & T;
});

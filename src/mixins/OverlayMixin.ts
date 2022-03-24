import { LitElement } from 'lit';
import { property } from 'lit/decorators';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FitMixin, FitMixinInterface } from './FitMixin.js';
import { ResizableMixin, ResizableMixinInterface } from './ResizableMixin.js';
import { FocusableHelper } from '../../define/focusable-helper.js';
import { OverlayManager } from '../../define/overlay-manager.js';
import { pushScrollLock, removeScrollLock } from '../lib/ScrollManager.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */

type Constructor<T = {}> = new (...args: any[]) => T;

export interface OverlayMixinInterface extends FitMixinInterface, ResizableMixinInterface {
  /**
   * Set to true to disable auto-focusing the overlay or child nodes with
   * the `autofocus` attribute` when the overlay is opened.
   */
  noAutoFocus?: boolean;

  /**
   * Set to true to disable canceling the overlay with the ESC key.
   */
  noCancelOnEscKey?: boolean;

  /**
   * Set to true to disable canceling the overlay by clicking outside it.
   */
  noCancelOnOutsideClick?: boolean;

  /**
   * Contains the reason(s) this overlay was last closed (see
   * `overlay-closed`). `OverlayMixin` provides the `canceled`
   * reason; implementers of the behavior can provide other reasons in
   * addition to `canceled`.
   */
  closingReason: any;

  /**
   * Set to true to enable restoring of focus when overlay is closed.
   */
  restoreFocusOnClose?: boolean;

  /**
   * Set to true to allow clicks to go through overlays.
   * When the user clicks outside this overlay, the click may
   * close the overlay below.
   */
  allowClickThrough?: boolean;

  /**
   * Set to true to keep overlay always on top.
   */
  alwaysOnTop?: boolean;

  /**
   * True if the overlay is currently displayed.
   */
  opened: boolean;

  /**
   * True if the overlay was canceled when it was last closed.
   */
  get canceled(): boolean | undefined;

  /**
   * Set to true to display a backdrop behind the overlay. It traps the focus
   * within the light DOM of the overlay.
   */
  withBackdrop: boolean | undefined;

  isAttached: boolean;

  /**
   * Determines which action to perform when scroll outside an opened overlay
   * happens. Possible values: lock - blocks scrolling from happening, refit -
   * computes the new position on the overlay cancel - causes the overlay to
   * close
   */

  scrollAction: string | undefined;
  /**
   * The backdrop element.
   */
  get backdropElement(): Element;

  /**
   * @return Previously registered handler for `opened-changed` event
   */
  onopenedchanged: EventListener | undefined;

  /**
   * @return Previously registered handler for `overlay-canceled` event
   */
  onoverlaycanceled: EventListener | undefined;

  /**
   * @return Previously registered handler for `overlay-opened` event
   */
  onoverlayopened: EventListener | undefined;

  /**
   * @return Previously registered handler for `overlay-closed` event
   */
  onoverlayclosed: EventListener | undefined;

  /**
   * @return Previously registered handler for `opened` event
   */
  onopened: EventListener | undefined;

  /**
   * @return Previously registered handler for `closed` event
   */
  onclosed: EventListener | undefined;

  /**
   * Toggle the opened state of the overlay.
   */
  toggle(): void;

  /**
   * Open the overlay.
   */
  open(): void;

  /**
   * Close the overlay.
   */
  close(): void;

  /**
   * Cancels the overlay.
   * @param {Event=} event The original event
   */
  cancel(event?: Event): void;

  /**
   * Invalidates the cached tabbable nodes. To be called when any of the
   * focusable content changes (e.g. a button is disabled).
   */
  invalidateTabbables(): void;

  /**
   * Called when `opened` changes.
   */
  _openedChanged(opened?: boolean): void;

  /**
   * Tasks which cause the overlay to actually open; typically play an
   * animation.
   * @protected
   */
  _renderOpened(): void;

  /**
   * Tasks which cause the overlay to actually close; typically play an
   * animation.
   * @protected
   */
  _renderClosed(): void;

  /**
   * Tasks to be performed at the end of open action. Will fire
   * `overlay-opened`.
   * @protected
   */
  _finishRenderOpened(): void;

  /**
   * Tasks to be performed at the end of close action. Will fire
   * `overlay-closed`.
   * @protected
   */
  _finishRenderClosed(): void;
  /**
   * Applies focus according to the opened state.
   */
  _applyFocus(): void;
}

/**
 * This mixin is a port of [IronOverlayBehavior](https://github.com/PolymerElements/iron-overlay-behavior)
 * that works with LitElement.
 *
 * Use `OverlayMixin` to implement an element that can be hidden
 * or shown, and displays on top of other content. It includes an optional
 * backdrop, and can be used to implement a variety of UI controls including
 * dialogs and drop downs. Multiple overlays may be displayed at once.
 * See the [demo source
 * code](https://github.com/advanced-rest-client/arc-overlay-mixin/blob/master/demo/simple-overlay.html)
 * for an example.
 *
 * ### Closing and canceling
 *
 * An overlay may be hidden by closing or canceling. The difference between close
 * and cancel is user intent. Closing generally implies that the user
 * acknowledged the content on the overlay. By default, it will cancel whenever
 * the user taps outside it or presses the escape key. This behavior is
 * configurable with the `noCancelOnEscKey` and the
 * `noCancelOnOutsideClick` properties. `close()` should be called explicitly
 * by the implementer when the user interacts with a control in the overlay
 * element. When the dialog is canceled, the overlay fires an
 * 'overlay-canceled' event. Call `preventDefault` on this event to prevent
 * the overlay from closing.
 *
 * ### Positioning
 *
 * By default the element is sized and positioned to fit and centered inside the
 * window. You can position and size it manually using CSS. See `FitMixin`.
 *
 * ### Backdrop
 *
 * Set the `withBackdrop` attribute to display a backdrop behind the overlay.
 * The backdrop is appended to `<body>` and is of type `<arc-overlay-backdrop>`.
 * See its doc page for styling options.
 * In addition, `withBackdrop` will wrap the focus within the content in the
 * light DOM. Override the [`_focusableNodes`
 * getter](#FitMixin:property-_focusableNodes) to achieve a
 * different behavior.
 *
 * ### Limitations
 *
 * The element is styled to appear on top of other content by setting its
 * `z-index` property. You must ensure no element has a stacking context with a
 * higher `z-index` than its parent stacking context. You should place this
 * element as a child of `<body>` whenever possible.
 *
 *
 * ## Usage
 *
 * ```javascript
 * import { LitElement } from 'lit-element';
 * import { OverlayMixin } from '@anypoint-web-components/awc';
 *
 * class ArcOverlayImpl extends OverlayMixin(LitElement) {
 *  ...
 * }
 * ```
 *
 * @mixin
 */
export const OverlayMixin = dedupeMixin(<T extends Constructor<LitElement>>(superClass: T): Constructor<OverlayMixinInterface> & T => {
  class MyMixinClass extends FitMixin(ResizableMixin(superClass)) {
    /**
     * Set to true to disable auto-focusing the overlay or child nodes with
     * the `autofocus` attribute` when the overlay is opened.
     */
    @property({ reflect: true, type: Boolean })
    noAutoFocus?: boolean;

    /**
     * Set to true to disable canceling the overlay with the ESC key.
     */
    @property({ reflect: true, type: Boolean })
    noCancelOnEscKey?: boolean;

    /**
     * Set to true to disable canceling the overlay by clicking outside it.
     */
    @property({ reflect: true, type: Boolean })
    noCancelOnOutsideClick?: boolean;

    /**
     * Contains the reason(s) this overlay was last closed (see
     * `overlay-closed`). `OverlayMixin` provides the `canceled`
     * reason; implementers of the behavior can provide other reasons in
     * addition to `canceled`.
     */
    @property()
    closingReason: any;

    /**
     * Set to true to enable restoring of focus when overlay is closed.
     */
    @property({ reflect: true, type: Boolean })
    restoreFocusOnClose?: boolean;

    /**
     * Set to true to allow clicks to go through overlays.
     * When the user clicks outside this overlay, the click may
     * close the overlay below.
     */
    @property({ reflect: true, type: Boolean })
    allowClickThrough?: boolean;

    /**
     * Set to true to keep overlay always on top.
     */
    @property({ reflect: true, type: Boolean })
    alwaysOnTop?: boolean;

    /**
     * Shortcut to access to the overlay manager.
     * @private
     */
    _manager?: any;

    /**
     * The node being focused.
     */
    _focusedChild?: HTMLElement;

    _opened?: boolean;

    /**
     * True if the overlay is currently displayed.
     */
    @property({ type: Boolean })
    get opened(): boolean | undefined {
      return this._opened;
    }

    set opened(value: boolean | undefined) {
      const old = this._opened;
      if (value === old) {
        return;
      }
      this._opened = value;
      this.requestUpdate('opened', old);
      this._openedChanged(value);
      this.__updateScrollObservers(this._isAttached, !!value, this.scrollAction);
      this.dispatchEvent(new CustomEvent('openedchange'));
      this.dispatchEvent(new CustomEvent('opened-changed', {
        detail: {
          value
        }
      }));
    }

    /**
     * True if the overlay was canceled when it was last closed.
     */
    __canceled?: boolean;

    /**
     * True if the overlay was canceled when it was last closed.
     */
    get canceled(): boolean | undefined {
      return this.__canceled;
    }

    get _canceled(): boolean | undefined {
      return this.__canceled;
    }

    set _canceled(value: boolean | undefined) {
      if (value === this.__canceled) {
        return;
      }
      this.__canceled = value;
      this._canceledChanged();
    }

    _withBackdrop: boolean | undefined;

    /**
     * Set to true to display a backdrop behind the overlay. It traps the focus
     * within the light DOM of the overlay.
     */
    @property({ type: Boolean })
    get withBackdrop(): boolean | undefined {
      return this._withBackdrop;
    }

    set withBackdrop(value: boolean | undefined) {
      const old = this._withBackdrop;
      if (value === old) {
        return;
      }
      this._withBackdrop = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('withBackdrop', old);
      }
      this._withBackdropChanged();
    }

    _isAttached = false;

    @property({ type: Boolean })
    get isAttached(): boolean {
      return this._isAttached;
    }

    set isAttached(value: boolean) {
      this._isAttached = value;
      this.__updateScrollObservers(value, !!this._opened, this.scrollAction);
    }

    /**
     * Determines which action to perform when scroll outside an opened overlay
     * happens. Possible values: lock - blocks scrolling from happening, refit -
     * computes the new position on the overlay cancel - causes the overlay to
     * close
     */
    @property({ reflect: true, attribute: 'scrollAction' })
    _scrollAction?: string;

    @property({ type: String })
    get scrollAction(): string | undefined {
      return this._scrollAction;
    }

    set scrollAction(value: string | undefined) {
      this._scrollAction = value;
      this.__updateScrollObservers(this._isAttached, !!this._opened, value);
    }

    /**
     * The backdrop element.
     */
    get backdropElement(): Element {
      return this._manager.backdropElement;
    }

    /**
     * Returns the node to give focus to.
     */
    get _focusNode(): HTMLElement {
      return this._focusedChild || this.querySelector('[autofocus]') || this;
    }

    /**
     * Array of nodes that can receive focus (overlay included), ordered by
     * `tabindex`. This is used to retrieve which is the first and last focusable
     * nodes in order to wrap the focus for overlays `with-backdrop`.
     *
     * If you know what is your content (specifically the first and last focusable
     * children), you can override this method to return only `[firstFocusable,
     * lastFocusable];`
     */
    get _focusableNodes(): Node[] {
      return FocusableHelper.getTabbableNodes(this);
    }

    /**
     * @return Previously registered handler for `opened-changed` event
     */
    get onopenedchanged(): EventListener | undefined {
      return getListener('opened-changed', this);
    }

    /**
     * Registers a callback function for `opened-changed` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onopenedchanged(value: EventListener | undefined) {
      addListener('opened-changed', value, this);
    }

    /**
     * @return Previously registered handler for `overlay-canceled` event
     */
    get onoverlaycanceled(): EventListener | undefined {
      return getListener('overlay-canceled', this);
    }

    /**
     * Registers a callback function for `overlay-canceled` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onoverlaycanceled(value: EventListener | undefined) {
      addListener('overlay-canceled', value, this);
    }

    /**
     * @return Previously registered handler for `overlay-opened` event
     */
    get onoverlayopened(): EventListener | undefined {
      return getListener('overlay-opened', this);
    }

    /**
     * Registers a callback function for `overlay-opened` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onoverlayopened(value: EventListener | undefined) {
      addListener('overlay-opened', value, this);
    }

    /**
     * @return Previously registered handler for `overlay-closed` event
     */
    get onoverlayclosed(): EventListener | undefined {
      return getListener('overlay-closed', this);
    }

    /**
     * Registers a callback function for `overlay-closed` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onoverlayclosed(value: EventListener | undefined) {
      addListener('overlay-closed', value, this);
    }

    /**
     * @return Previously registered handler for `opened` event
     */
    get onopened(): EventListener | undefined {
      return getListener('opened', this);
    }

    /**
     * Registers a callback function for `opened` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onopened(value: EventListener | undefined) {
      addListener('opened', value, this);
    }

    /**
     * @return Previously registered handler for `closed` event
     */
    get onclosed(): EventListener | undefined {
      return getListener('closed', this);
    }

    /**
     * Registers a callback function for `closed` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onclosed(value: EventListener | undefined) {
      addListener('closed', value, this);
    }

    // Used to skip calls to notifyResize and refit while the overlay is
    // animating.
    __isAnimating = false;

    // with-backdrop needs tabindex to be set in order to trap the focus.
    // If it is not set, IronOverlayBehavior will set it, and remove it if
    // with-backdrop = false.
    __shouldRemoveTabIndex = false;

    // Used for wrapping the focus on TAB / Shift+TAB.
    __firstFocusableNode?: HTMLElement;

    __lastFocusableNode?: HTMLElement;

    // Used by to keep track of the RAF callbacks.
    __rafs: Record<string, number> = {};

    // Focused node before overlay gets opened. Can be restored on close.
    __restoreFocusNode?: HTMLElement;

    // Scroll info to be restored.
    __scrollTop?: number;

    __scrollLeft?: number;

    // Root nodes hosting the overlay, used to listen for scroll events on them.
    __rootNodes?: (Document | DocumentFragment)[];

    _elementReady = false;

    _childrenObserver?: MutationObserver;

    _overlaySetup = false;

    constructor() {
      super();
      this._opened = false;
      this._canceled = false;
      this._manager = OverlayManager;
      this._onIronResize = this._onIronResize.bind(this);
      this.__onCaptureScroll = this.__onCaptureScroll.bind(this);
      this._boundSchedule = this._boundSchedule.bind(this);
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('iron-resize', this._onIronResize);

      if (!this._elementReady) {
        this._elementReady = true;
        // @ts-ignore
        if (this.updateComplete) {
          // @ts-ignore
          this.updateComplete.then(() => {
            this._ensureSetup();
          });
        } else {
          this._ensureSetup();
        }
      }

      // Call _openedChanged here so that position can be computed correctly.
      if (this.opened) {
        this._openedChanged(this.opened);
      }
      this._setupSlotListeners();
      this._ensureAria();
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener('iron-resize', this._onIronResize);
      this._removeSlotListeners();

      Object.keys(this.__rafs).forEach((cb) => {
        if (this.__rafs[cb] !== null) {
          cancelAnimationFrame(this.__rafs[cb]);
        }
      });
      this.__rafs = {};
      this._manager.removeOverlay(this);
      // We got detached while animating, ensure we show/hide the overlay
      // and fire overlay-opened/closed event!
      if (this.__isAnimating) {
        if (this.opened) {
          this._finishRenderOpened();
        } else {
          // Restore the focus if necessary.
          this._applyFocus();
          this._finishRenderClosed();
        }
      }
    }

    _setupSlotListeners(): void {
      const observer = new MutationObserver((mutations) => {
        this._processMutations(mutations);
      });
      this._childrenObserver = observer;
      this._childrenObserver.observe(this, { childList: true });
    }

    _removeSlotListeners(): void {
      this._unlistenSlots(this.children);
      if (this._childrenObserver) {
        this._childrenObserver.disconnect();
        this._childrenObserver = undefined;
      }
    }

    _processMutations(mutations: MutationRecord[]): void {
      if (mutations) {
        for (let i = 0; i < mutations.length; i++) {
          const mutation = mutations[i];
          if (mutation.addedNodes) {
            this._listenSlots(mutation.addedNodes);
          }
          if (mutation.removedNodes) {
            this._unlistenSlots(mutation.removedNodes);
          }
        }
        this._onNodesChange();
      }
    }

    /**
     * @param nodeList Nodes that could change
     */
    _listenSlots(nodeList: Node[] | NodeList | HTMLCollection): void {
      for (let i = 0; i < nodeList.length; i++) {
        const n = nodeList[i] as Element;
        if (n.localName === 'slot') {
          n.addEventListener('slotchange', this._boundSchedule);
        }
      }
    }

    /**
     * @param nodeList Nodes that could change
     */
    _unlistenSlots(nodeList: Node[] | NodeList | HTMLCollection): void {
      for (let i = 0; i < nodeList.length; i++) {
        const n = nodeList[i] as Element;
        if (n.localName === 'slot') {
          n.removeEventListener('slotchange', this._boundSchedule);
        }
      }
    }

    _boundSchedule(): void {
      setTimeout(() => {
        this._onNodesChange();
      });
    }

    /**
     * Toggle the opened state of the overlay.
     */
    toggle(): void {
      this._canceled = false;
      this.opened = !this.opened;
    }

    /**
     * Open the overlay.
     */
    open(): void {
      this._canceled = false;
      this.opened = true;
    }

    /**
     * Close the overlay.
     */
    close(): void {
      this._canceled = false;
      this.opened = false;
    }

    /**
     * Cancels the overlay.
     * @param {Event=} event The original event
     */
    cancel(event?: Event): void {
      const detail = {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: event
      };
      // This is consistent with the web platform and the `cancel` event
      // Note, don't set `oncancel` event registration as this is a standard property
      let cancelEvent = new Event('cancel', { cancelable: true, bubbles: true });
      this.dispatchEvent(cancelEvent);
      if (cancelEvent.defaultPrevented) {
        return;
      }
      // Deprecate the two
      cancelEvent = new CustomEvent('overlay-canceled', detail);
      this.dispatchEvent(cancelEvent);
      if (cancelEvent.defaultPrevented) {
        return;
      }
      cancelEvent = new CustomEvent('iron-overlay-canceled', detail);
      this.dispatchEvent(cancelEvent);
      if (cancelEvent.defaultPrevented) {
        return;
      }

      this._canceled = true;
      this.opened = false;
    }

    /**
     * Invalidates the cached tabbable nodes. To be called when any of the
     * focusable content changes (e.g. a button is disabled).
     */
    invalidateTabbables(): void {
      this.__firstFocusableNode = undefined;
      this.__lastFocusableNode = undefined;
    }

    _ensureSetup(): void {
      if (this._overlaySetup) {
        return;
      }
      this._overlaySetup = true;
      this.style.outline = 'none';
      this.style.display = 'none';
    }

    /**
     * Called when `opened` changes.
     */
    _openedChanged(opened?: boolean): void {
      this._ensureAria(opened);
      // Defer any animation-related code on attached
      // (_openedChanged gets called again on attached).
      if (!this.isAttached) {
        return;
      }

      this.__isAnimating = true;

      // Deraf for non-blocking rendering.
      this.__deraf('__openedChanged', this.__openedChanged);
    }

    _ensureAria(opened?: boolean): void {
      if (opened === undefined) {
        opened = this.opened;
      }
      if (opened) {
        this.removeAttribute('aria-hidden');
      } else {
        this.setAttribute('aria-hidden', 'true');
      }
    }

    _canceledChanged(): void {
      this.closingReason = this.closingReason || {};
      this.closingReason.canceled = this.canceled;
    }

    _withBackdropChanged(): void {
      // If tabindex is already set, no need to override it.
      if (this.withBackdrop && !this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '-1');
        this.__shouldRemoveTabIndex = true;
      } else if (this.__shouldRemoveTabIndex) {
        this.removeAttribute('tabindex');
        this.__shouldRemoveTabIndex = false;
      }
      if (this.opened && this.isAttached) {
        this._manager.trackBackdrop();
      }
    }

    /**
     * tasks which must occur before opening; e.g. making the element visible.
     * @protected
     */
    _prepareRenderOpened(): void {
      // Store focused node.
      this.__restoreFocusNode = this._manager.deepActiveElement;

      // Needed to calculate the size of the overlay so that transitions on its
      // size will have the correct starting points.
      this._preparePositioning();
      this.refit();
      this._finishPositioning();

      // Safari will apply the focus to the autofocus element when displayed
      // for the first time, so we make sure to return the focus where it was.
      if (this.noAutoFocus && document.activeElement === this._focusNode) {
        this._focusNode.blur();
        this.__restoreFocusNode?.focus();
      }
    }

    /**
     * Tasks which cause the overlay to actually open; typically play an
     * animation.
     * @protected
     */
    _renderOpened(): void {
      this._finishRenderOpened();
    }

    /**
     * Tasks which cause the overlay to actually close; typically play an
     * animation.
     * @protected
     */
    _renderClosed(): void {
      this._finishRenderClosed();
    }

    /**
     * Tasks to be performed at the end of open action. Will fire
     * `overlay-opened`.
     * @protected
     */
    _finishRenderOpened(): void {
      this.notifyResize();
      this.__isAnimating = false;
      const detail = {
        bubbles: true,
        composed: true
      };
      this.dispatchEvent(new CustomEvent('opened', detail));
      // Deprecate the two
      this.dispatchEvent(new CustomEvent('overlay-opened', detail));
      this.dispatchEvent(new CustomEvent('iron-overlay-opened', detail));
    }

    /**
     * Tasks to be performed at the end of close action. Will fire
     * `overlay-closed`.
     * @protected
     */
    _finishRenderClosed(): void {
      // Hide the overlay.
      this.style.display = 'none';
      // Reset z-index only at the end of the animation.
      this.style.zIndex = '';
      this.notifyResize();
      this.__isAnimating = false;
      const detail = {
        bubbles: true,
        composed: true,
        detail: this.closingReason
      };
      this.dispatchEvent(new CustomEvent('closed', detail));
      // Deprecate the two
      this.dispatchEvent(new CustomEvent('overlay-closed', detail));
      this.dispatchEvent(new CustomEvent('iron-overlay-closed', detail));
    }

    _preparePositioning(): void {
      this.style.transition = this.style.webkitTransition = 'none';
      this.style.transform = this.style.webkitTransform = 'none';
      this.style.display = '';
    }

    _finishPositioning(): void {
      // First, make it invisible & reactivate animations.
      this.style.display = 'none';
      // Force reflow before re-enabling animations so that they don't start.
      // Set scrollTop to itself so that Closure Compiler doesn't remove this.
      let { scrollTop } = this;
      // @ts-ignore
      this.scrollTop = undefined;
      this.scrollTop = scrollTop;
      this.style.transition = this.style.webkitTransition = '';
      this.style.transform = this.style.webkitTransform = '';
      // Now that animations are enabled, make it visible again
      this.style.display = '';
      // Force reflow, so that following animations are properly started.
      // Set scrollTop to itself so that Closure Compiler doesn't remove this.
      scrollTop = this.scrollTop;
      // @ts-ignore
      this.scrollTop = undefined;
      this.scrollTop = scrollTop;
    }

    /**
     * Applies focus according to the opened state.
     * @protected
     */
    _applyFocus(): void {
      if (this.opened) {
        if (!this.noAutoFocus) {
          this._focusNode.focus();
        }
      } else {
        // Restore focus.
        if (this.restoreFocusOnClose && this.__restoreFocusNode) {
          // If the activeElement is `<body>` or inside the overlay,
          // we are allowed to restore the focus. In all the other
          // cases focus might have been moved elsewhere by another
          // component or by an user interaction (e.g. click on a
          // button outside the overlay).
          const activeElement = this._manager.deepActiveElement;
          if (activeElement === document.body || this.shadowRoot!.contains(activeElement) || this.contains(activeElement)) {
            this.__restoreFocusNode.focus();
          }
        }
        this.__restoreFocusNode = undefined;
        this._focusNode.blur();
        this._focusedChild = undefined;
      }
    }

    /**
     * Cancels (closes) the overlay. Call when click happens outside the overlay.
     * @param {!Event} event
     * @protected
     */
    _onCaptureClick(event: Event): void {
      if (!this.noCancelOnOutsideClick) {
        this.cancel(event);
      }
    }

    /**
     * Keeps track of the focused child. If withBackdrop, traps focus within
     * overlay.
     */
    _onCaptureFocus(event: Event): void {
      if (!this.withBackdrop) {
        return;
      }
      const cp = event.composedPath && event.composedPath();
      // @ts-ignore
      const path = cp || event.path;
      if (path.indexOf(this) === -1) {
        event.stopPropagation();
        this._applyFocus();
      } else {
        // eslint-disable-next-line prefer-destructuring
        this._focusedChild = path[0] as HTMLElement;
      }
    }

    /**
     * Handles the ESC key event and cancels (closes) the overlay.
     * @param {!Event} event
     * @protected
     */
    _onCaptureEsc(event: Event): void {
      if (!this.noCancelOnEscKey) {
        this.cancel(event);
      }
    }

    /**
     * Handles TAB key events to track focus changes.
     * Will wrap focus for overlays withBackdrop.
     */
    _onCaptureTab(event: KeyboardEvent): void {
      if (!this.withBackdrop) {
        return;
      }
      this.__ensureFirstLastFocusables();
      // TAB wraps from last to first focusable.
      // Shift + TAB wraps from first to last focusable.
      const shift = event.shiftKey;
      const nodeToCheck = shift ? this.__firstFocusableNode : this.__lastFocusableNode;
      const nodeToSet = shift ? this.__lastFocusableNode : this.__firstFocusableNode;
      let shouldWrap = false;
      if (nodeToCheck === nodeToSet) {
        // If nodeToCheck is the same as nodeToSet, it means we have an overlay
        // with 0 or 1 focusables; in either case we still need to trap the
        // focus within the overlay.
        shouldWrap = true;
      } else {
        // In dom=shadow, the manager will receive focus changes on the main
        // root but not the ones within other shadow roots, so we can't rely on
        // _focusedChild, but we should check the deepest active element.
        const focusedNode = this._manager.deepActiveElement;
        // If the active element is not the nodeToCheck but the overlay itself,
        // it means the focus is about to go outside the overlay, hence we
        // should prevent that (e.g. user opens the overlay and hit Shift+TAB).
        shouldWrap = (focusedNode === nodeToCheck || focusedNode === this);
      }

      if (shouldWrap) {
        // When the overlay contains the last focusable element of the document
        // and it's already focused, pressing TAB would move the focus outside
        // the document (e.g. to the browser search bar). Similarly, when the
        // overlay contains the first focusable element of the document and it's
        // already focused, pressing Shift+TAB would move the focus outside the
        // document (e.g. to the browser search bar).
        // In both cases, we would not receive a focus event, but only a blur.
        // In order to achieve focus wrapping, we prevent this TAB event and
        // force the focus. This will also prevent the focus to temporarily move
        // outside the overlay, which might cause scrolling.
        event.preventDefault();
        this._focusedChild = nodeToSet;
        this._applyFocus();
      }
    }

    /**
     * Refits if the overlay is opened and not animating.
     * @protected
     */
    _onIronResize(): void {
      if (this.opened && !this.__isAnimating) {
        this.__deraf('refit', this.refit);
      }
    }

    /**
     * Will call notifyResize if overlay is opened.
     * Can be overridden in order to avoid multiple observers on the same node.
     * @protected
     */
    _onNodesChange(): void {
      if (this.opened && !this.__isAnimating) {
        // It might have added focusable nodes, so invalidate cached values.
        this.invalidateTabbables();
        this.notifyResize();
      }
    }

    /**
     * Updates the references to the first and last focusable nodes.
     * @private
     */
    __ensureFirstLastFocusables(): void {
      const focusableNodes = this._focusableNodes;
      // eslint-disable-next-line prefer-destructuring
      this.__firstFocusableNode = focusableNodes[0] as HTMLElement;
      this.__lastFocusableNode = focusableNodes[focusableNodes.length - 1] as HTMLElement;
    }

    /**
     * Tasks executed when opened changes: prepare for the opening, move the
     * focus, update the manager, render opened/closed.
     * @private
     */
    __openedChanged(): void {
      if (this.opened) {
        // Make overlay visible, then add it to the manager.
        this._prepareRenderOpened();
        this._manager.addOverlay(this);
        // Move the focus to the child node with [autofocus].
        this._applyFocus();

        this._renderOpened();
      } else {
        // Remove overlay, then restore the focus before actually closing.
        this._manager.removeOverlay(this);
        this._applyFocus();

        this._renderClosed();
      }
    }

    /**
     * Debounces the execution of a callback to the next animation frame.
     * @param jobName
     * @param callback Always bound to `this`
     */
    __deraf(jobName: string, callback: Function): void {
      const rafs = this.__rafs;
      if (rafs[jobName] !== null) {
        cancelAnimationFrame(rafs[jobName]);
      }
      rafs[jobName] = requestAnimationFrame(() => {
        delete rafs[jobName];
        callback.call(this);
      });
    }

    __updateScrollObservers(isAttached: boolean, opened: boolean, scrollAction?: string): void {
      if (!isAttached || !opened || !this.__isValidScrollAction(scrollAction)) {
        removeScrollLock(this);
        this.__removeScrollListeners();
      } else {
        if (scrollAction === 'lock') {
          this.__saveScrollPosition();
          pushScrollLock(this);
        }
        this.__addScrollListeners();
      }
    }

    /**
     * @private
     */
    __addScrollListeners(): void {
      if (!this.__rootNodes) {
        this.__rootNodes = [];
        // Listen for scroll events in all shadowRoots hosting this overlay only
        // when in native ShadowDOM.
        let node: EventTarget = this;
        while (node) {
          // @ts-ignore
          if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE && node.host) {
            this.__rootNodes.push(node as DocumentFragment);
          }
          // @ts-ignore
          node = node.host || node.assignedSlot || node.parentNode;
        }
        this.__rootNodes.push(document);
      }
      this.__rootNodes.forEach((el) => {
        el.addEventListener('scroll', this.__onCaptureScroll, {
          capture: true,
          passive: true,
        });
      });
    }

    /**
     * @private
     */
    __removeScrollListeners(): void {
      if (this.__rootNodes) {
        this.__rootNodes.forEach((el) => {
          el.removeEventListener('scroll', this.__onCaptureScroll, {
            capture: true,
          });
        });
      }
      if (!this.isAttached) {
        this.__rootNodes = undefined;
      }
    }

    /**
     * @param {string=} scrollAction
     * @return {boolean}
     * @private
     */
    __isValidScrollAction(scrollAction?: string): boolean {
      return scrollAction === 'lock' || scrollAction === 'refit' || scrollAction === 'cancel';
    }

    __onCaptureScroll(event: Event): void {
      if (this.__isAnimating) {
        return;
      }
      // Check if scroll outside the overlay.
      const cp = event.composedPath && event.composedPath();
      // @ts-ignore
      const path = cp || event.path;
      if (path.indexOf(this) >= 0) {
        return;
      }
      switch (this.scrollAction) {
        case 'lock':
          // NOTE: scrolling might happen if a scroll event is not cancellable, or
          // if user pressed keys that cause scrolling (they're not prevented in
          // order not to break a11y features like navigate with arrow keys).
          this.__restoreScrollPosition();
          break;
        case 'refit':
          this.__deraf('refit', this.refit);
          break;
        case 'cancel':
          this.cancel(event);
          break;
        default:
      }
    }

    /**
     * Memoizes the scroll position of the outside scrolling element.
     * @private
     */
    __saveScrollPosition(): void {
      if (document.scrollingElement) {
        this.__scrollTop = document.scrollingElement.scrollTop;
        this.__scrollLeft = document.scrollingElement.scrollLeft;
      } else {
        // Since we don't know if is the body or html, get max.
        this.__scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        this.__scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      }
    }

    /**
     * Resets the scroll position of the outside scrolling element.
     * @private
     */
    __restoreScrollPosition(): void {
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = this.__scrollTop!;
        document.scrollingElement.scrollLeft = this.__scrollLeft!;
      } else {
        // Since we don't know if is the body or html, set both.
        document.documentElement.scrollTop = document.body.scrollTop = this.__scrollTop!;
        document.documentElement.scrollLeft = document.body.scrollLeft = this.__scrollLeft!;
      }
    }
  }
  return MyMixinClass as Constructor<OverlayMixinInterface> & T;
});

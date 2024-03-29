/* eslint-disable no-multi-assign */
import { PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import { FocusableHelper } from '../../define/focusable-helper.js';
import { OverlayManager } from '../../define/overlay-manager.js';
import { pushScrollLock, removeScrollLock } from '../../lib/ScrollManager.js';
import { addListener, getListener } from '../../lib/ElementEventsRegistry.js';
import OverlayBackdropElement from '../dialog/OverlayBackdropElement.js';
import FitElement from "./FitElement.js";

/**
 * @fires openedchange
 * @fires cancel
 * @fires opened
 * @fires closed
 */
export default class OverlayElement extends FitElement {
  /**
   * Set to true to disable auto-focusing the overlay or child nodes with
   * the `autofocus` attribute` when the overlay is opened.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) noAutoFocus?: boolean;

  /**
   * Set to true to disable canceling the overlay with the ESC key.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) noCancelOnEscKey?: boolean;

  /**
   * Set to true to disable canceling the overlay by clicking outside it.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) noCancelOnOutsideClick?: boolean;

  /**
   * Contains the reason(s) this overlay was last closed (see `closed`). `OverlayElement` provides the `canceled`
   * reason; implementers of the behavior can provide other reasons in
   * addition to `canceled`.
   * @attr
   */
  @property() closingReason: any;

  /**
   * Set to true to enable restoring of focus when overlay is closed.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) restoreFocusOnClose?: boolean;

  /**
   * Set to true to allow clicks to go through overlays.
   * When the user clicks outside this overlay, the click may
   * close the overlay below.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) allowClickThrough?: boolean;

  /**
   * Set to true to keep overlay always on top.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) alwaysOnTop?: boolean;

  /**
   * Shortcut to access to the overlay manager.
   * @private
   */
  _manager: typeof OverlayManager;

  /**
   * The node being focused.
   */
  _focusedChild?: HTMLElement;

  /**
   * True if the overlay is currently displayed.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) opened?: boolean;

  /**
   * True if the overlay was canceled when it was last closed.
   */
  get canceled(): boolean | undefined {
    return this._canceled;
  }

  /**
   * True if the overlay was canceled when it was last closed.
   */
  @state() _canceled?: boolean;

  /**
   * Set to true to display a backdrop behind the overlay. It traps the focus
   * within the light DOM of the overlay.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) withBackdrop?: boolean;

  /**
   * Determines which action to perform when scroll outside an opened overlay
   * happens. Possible values: lock - blocks scrolling from happening, refit -
   * computes the new position on the overlay cancel - causes the overlay to
   * close
   * @attr
   */
  @property({ type: String, reflect: true }) scrollAction?: string;

  /**
   * The backdrop element.
   */
  get backdropElement(): OverlayBackdropElement {
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
   * @return Previously registered handler for `cancel` event
   * @override
   */
  get oncancel(): EventListener | null {
    return getListener('cancel', this);
  }

  /**
   * Registers a callback function for `cancel` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   * @override
   */
  set oncancel(value: EventListener | null) {
    addListener('cancel', value, this);
  }

  /**
   * @return Previously registered handler for `opened` event
   */
  get onopened(): EventListener | null {
    return getListener('opened', this);
  }

  /**
   * Registers a callback function for `opened` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onopened(value: EventListener | null) {
    addListener('opened', value, this);
  }

  /**
   * @return Previously registered handler for `closed` event
   */
  get onclosed(): EventListener | null {
    return getListener('closed', this);
  }

  /**
   * Registers a callback function for `closed` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onclosed(value: EventListener | null) {
    addListener('closed', value, this);
  }

  // Used to skip calls to notifyResize and refit while the overlay is
  // animating.
  protected _isAnimating = false;

  // with-backdrop needs tabindex to be set in order to trap the focus.
  // If it is not set, OverlayElement will set it, and remove it if
  // with-backdrop = false.
  protected __shouldRemoveTabIndex = false;

  // Used for wrapping the focus on TAB / Shift+TAB.
  protected __firstFocusableNode?: HTMLElement;

  protected __lastFocusableNode?: HTMLElement;

  // Used by to keep track of the RAF callbacks.
  protected __rafs: Record<string, number> = {};

  // Focused node before overlay gets opened. Can be restored on close.
  protected __restoreFocusNode?: HTMLElement;

  // Scroll info to be restored.
  protected __scrollTop?: number;

  protected __scrollLeft?: number;

  // Root nodes hosting the overlay, used to listen for scroll events on them.
  protected __rootNodes?: (Document | DocumentFragment)[];

  protected _elementReady = false;

  protected _childrenObserver?: MutationObserver;

  protected _overlaySetup = false;

  constructor() {
    super();
    this._canceled = false;
    this._manager = OverlayManager;
    this.addEventListener('resize', this._onResize.bind(this));
    this.__onCaptureScroll = this.__onCaptureScroll.bind(this);
    this._boundSchedule = this._boundSchedule.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._elementReady) {
      this._elementReady = true;
      this._ensureSetup();
    }

    // Call _openedChanged here so that position can be computed correctly.
    if (this.opened) {
      this._openedChanged();
    }
    this._setupSlotListeners();
    this._ensureAria();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._removeSlotListeners();

    Object.keys(this.__rafs).forEach((cb) => {
      if (this.__rafs[cb] !== null) {
        cancelAnimationFrame(this.__rafs[cb]);
      }
    });
    this.__rafs = {};
    this._manager.removeOverlay(this);
    // We got detached while animating, ensure we show/hide the overlay
    // and fire opened/closed event!
    if (this._isAnimating) {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        // Restore the focus if necessary.
        this._applyFocus();
        this._finishRenderClosed();
      }
    }
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('_isAttached') || cp.has('scrollAction') || cp.has('opened')) {
      this.__updateScrollObservers(!!this._isAttached, !!this.opened, this.scrollAction);
    }
    if (cp.has('withBackdrop')) {
      this._withBackdropChanged();
    }
    if (cp.has('_canceled')) {
      this._canceledChanged();
    }
  }

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(cp);
    if (cp.has('opened')) {
      this._openedChanged();
      this.dispatchEvent(new Event('openedchange'));
    }
  }

  protected _setupSlotListeners(): void {
    const observer = new MutationObserver((mutations) => {
      this._processMutations(mutations);
    });
    this._childrenObserver = observer;
    this._childrenObserver.observe(this, { childList: true });
  }

  protected _removeSlotListeners(): void {
    this._unlistenSlots(this.children);
    if (this._childrenObserver) {
      this._childrenObserver.disconnect();
      this._childrenObserver = undefined;
    }
  }

  protected _processMutations(mutations: MutationRecord[]): void {
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
  protected _listenSlots(nodeList: Node[] | NodeList | HTMLCollection): void {
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
  protected _unlistenSlots(nodeList: Node[] | NodeList | HTMLCollection): void {
    for (let i = 0; i < nodeList.length; i++) {
      const n = nodeList[i] as Element;
      if (n.localName === 'slot') {
        n.removeEventListener('slotchange', this._boundSchedule);
      }
    }
  }

  protected _boundSchedule(): void {
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
   */
  cancel(): void {
    // This is consistent with the web platform and the `cancel` event
    // Note, don't set `oncancel` event registration as this is a standard property
    const cancelEvent = new Event('cancel', { cancelable: true });
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

  protected _ensureSetup(): void {
    if (this._overlaySetup) {
      return;
    }
    this._overlaySetup = true;
    this.style.outline = 'none';
    this.style.display = 'none';
  }

  /**
   * Tasks executed when opened changes: prepare for the opening, move the
   * focus, update the manager, render opened/closed.
   */
  protected _openedChanged(): void {
    const { opened } = this;
    this._ensureAria(opened);
    this._isAnimating = true;

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

  protected _ensureAria(opened: boolean | undefined = this.opened): void {
    if (opened) {
      this.removeAttribute('aria-hidden');
    } else {
      this.setAttribute('aria-hidden', 'true');
    }
  }

  protected _canceledChanged(): void {
    this.closingReason = this.closingReason || {};
    this.closingReason.canceled = this.canceled;
  }

  protected _withBackdropChanged(): void {
    // If tabindex is already set, no need to override it.
    if (this.withBackdrop && !this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
      this.__shouldRemoveTabIndex = true;
    } else if (this.__shouldRemoveTabIndex) {
      this.removeAttribute('tabindex');
      this.__shouldRemoveTabIndex = false;
    }
    if (this.opened && this._isAttached) {
      this._manager.trackBackdrop();
    }
  }

  /**
   * tasks which must occur before opening; e.g. making the element visible.
   * @protected
   */
  protected _prepareRenderOpened(): void {
    // Store focused node.
    this.__restoreFocusNode = this._manager.deepActiveElement as HTMLElement;

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
  protected _renderOpened(): void {
    this._finishRenderOpened();
  }

  /**
   * Tasks which cause the overlay to actually close; typically play an
   * animation.
   * @protected
   */
  protected _renderClosed(): void {
    this._finishRenderClosed();
  }

  /**
   * Tasks to be performed at the end of open action. Will fire `opened`.
   * @protected
   */
  protected _finishRenderOpened(): void {
    this.notifyResize();
    this._isAnimating = false;
    this.dispatchEvent(new Event('opened'));
  }

  /**
   * Tasks to be performed at the end of close action. Will fire `closed`.
   * @protected
   */
  protected _finishRenderClosed(): void {
    // Hide the overlay.
    this.style.display = 'none';
    // Reset z-index only at the end of the animation.
    this.style.zIndex = '';
    this.notifyResize();
    this._isAnimating = false;
    const detail = {
      detail: this.closingReason
    };
    this.dispatchEvent(new CustomEvent('closed', detail));
  }

  protected _preparePositioning(): void {
    this.style.transition = 'none';
    this.style.transform = 'none';
    this.style.display = '';
  }

  protected _finishPositioning(): void {
    // First, make it invisible & reactivate animations.
    this.style.display = 'none';
    // Force reflow before re-enabling animations so that they don't start.
    // Set scrollTop to itself so that Closure Compiler doesn't remove this.
    let { scrollTop } = this;
    // @ts-ignore
    this.scrollTop = undefined;
    this.scrollTop = scrollTop;
    this.style.transition = '';
    this.style.transform = '';
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
  protected _applyFocus(): void {
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
   * @protected
   */
  protected _onCaptureClick(): void {
    if (!this.noCancelOnOutsideClick) {
      this.cancel();
    }
  }

  /**
   * Keeps track of the focused child. If withBackdrop, traps focus within
   * overlay.
   */
  protected _onCaptureFocus(event: Event): void {
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
   * 
   * @protected
   */
  protected _onCaptureEsc(): void {
    if (!this.noCancelOnEscKey) {
      this.cancel();
    }
  }

  /**
   * Handles TAB key events to track focus changes.
   * Will wrap focus for overlays withBackdrop.
   */
  protected _onCaptureTab(event: KeyboardEvent): void {
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
  protected _onResize(e: Event): void {
    if (e.target === this) {
      return;
    }
    if (this.opened && !this._isAnimating) {
      this._queue('refit', this.refit);
    }
  }

  /**
   * Will call notifyResize if overlay is opened.
   * Can be overridden in order to avoid multiple observers on the same node.
   * @protected
   */
  protected _onNodesChange(): void {
    if (this.opened && !this._isAnimating) {
      // It might have added focusable nodes, so invalidate cached values.
      this.invalidateTabbables();
      this.notifyResize();
    }
  }

  /**
   * Updates the references to the first and last focusable nodes.
   * @private
   */
  protected __ensureFirstLastFocusables(): void {
    const focusableNodes = this._focusableNodes;
    // eslint-disable-next-line prefer-destructuring
    this.__firstFocusableNode = focusableNodes[0] as HTMLElement;
    this.__lastFocusableNode = focusableNodes[focusableNodes.length - 1] as HTMLElement;
  }

  /**
   * Debounces the execution of a callback to the next animation frame.
   * @param jobName
   * @param callback Always bound to `this`
   */
  protected _queue(jobName: string, callback: Function): void {
    const rafs = this.__rafs;
    if (typeof rafs[jobName] === 'number') {
      // we let the previous job to finish, no need to reschedule
      // the task.
      return;
      // cancelAnimationFrame(rafs[jobName]);
    }
    rafs[jobName] = requestAnimationFrame(() => {
      delete rafs[jobName];
      callback.call(this);
    });
  }

  protected __updateScrollObservers(isAttached: boolean, opened: boolean, scrollAction?: string): void {
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

  protected __addScrollListeners(): void {
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

  protected __removeScrollListeners(): void {
    if (this.__rootNodes) {
      this.__rootNodes.forEach((el) => {
        el.removeEventListener('scroll', this.__onCaptureScroll, {
          capture: true,
        });
      });
    }
    if (!this._isAttached) {
      this.__rootNodes = undefined;
    }
  }

  protected __isValidScrollAction(scrollAction?: string): boolean {
    return scrollAction === 'lock' || scrollAction === 'refit' || scrollAction === 'cancel';
  }

  protected __onCaptureScroll(event: Event): void {
    if (this._isAnimating) {
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
        this._queue('refit', this.refit);
        break;
      case 'cancel':
        this.cancel();
        break;
      default:
    }
  }

  /**
   * Memoizes the scroll position of the outside scrolling element.
   */
  protected __saveScrollPosition(): void {
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
   */
  protected __restoreScrollPosition(): void {
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

import { FitMixin } from './FitMixin';
import { ResizableMixin } from './ResizableMixin';
import { OverlayManager } from '../lib/OverlayManager';
import OverlayBackdrop from '../OverlayBackdropElement';

export declare function OverlayMixin<T extends new (...args: any[]) => {}>(base: T): T & FitMixin & ResizableMixin & OverlayMixinConstructor;
export declare interface OverlayMixinConstructor {
  new(...args: any[]): OverlayMixin;
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
 * configurable with the `no-cancel-on-esc-key` and the
 * `no-cancel-on-outside-click` properties. `close()` should be called explicitly
 * by the implementer when the user interacts with a control in the overlay
 * element. When the dialog is canceled, the overlay fires an
 * 'iron-overlay-canceled' event. Call `preventDefault` on this event to prevent
 * the overlay from closing.
 *
 * ### Positioning
 *
 * By default the element is sized and positioned to fit and centered inside the
 * window. You can position and size it manually using CSS. See `FitMixin`.
 *
 * ### Backdrop
 *
 * Set the `with-backdrop` attribute to display a backdrop behind the overlay.
 * The backdrop is appended to `<body>` and is of type `<iron-overlay-backdrop>`.
 * See its doc page for styling options.
 * In addition, `with-backdrop` will wrap the focus within the content in the
 * light DOM. Override the [`_focusableNodes`
 * getter](#OverlayMixin:property-_focusableNodes) to achieve a
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
 * class OverlayImpl extends OverlayMixin(LitElement) {
 *  ...
 * }
 * ```
 * 
 * @fires opened Dispatched after the element is rendered opened
 * @fires closed Dispatched after the element is rendered closed
 * @fires cancel Dispatched when element is about to be closed. Cancelling the event stops the closing.
 * @fires openedchange When the `opened` property changed.
 * @fires overlay-canceled Deprecated
 * @fires iron-overlay-canceled Deprecated
 * @fires overlay-opened Deprecated
 * @fires iron-overlay-opened Deprecated
 * @fires overlay-closed Deprecated
 * @fires iron-overlay-closed Deprecated
 * @fires opened-changed Deprecated
 */
export declare interface OverlayMixin extends FitMixin, ResizableMixin {
  /**
   * True if the overlay is currently displayed.
   * @attribute
   */
  opened: boolean;
  /**
   * Set to true to display a backdrop behind the overlay. It traps the focus
   * within the light DOM of the overlay.
   * @attribute
   */
  withBackdrop: boolean;
  /**
   * Set to true to disable auto-focusing the overlay or child nodes with
   * the `autofocus` attribute` when the overlay is opened.
   * @attribute
   */
  noAutoFocus: boolean;
  /**
   * Set to true to disable canceling the overlay with the ESC key.
   * @attribute
   */
  noCancelOnEscKey: boolean;
  /**
   * Set to true to disable canceling the overlay by clicking outside it.
   * @attribute
   */
  noCancelOnOutsideClick: boolean;
  /**
   * Contains the reason(s) this overlay was last closed (see
   * `overlay-closed`). `OverlayMixin` provides the `canceled`
   * reason; implementers of the behavior can provide other reasons in
   * addition to `canceled`.
   */
  closingReason: { type: Object },
  /**
   * Set to true to enable restoring of focus when overlay is closed.
   * @attribute
   */
  restoreFocusOnClose: boolean;
  /**
   * Set to true to allow clicks to go through overlays.
   * When the user clicks outside this overlay, the click may
   * close the overlay below.
   * @attribute
   */
  allowClickThrough: boolean;
  /**
   * Set to true to keep overlay always on top.
   * @attribute
   */
  alwaysOnTop: boolean;
  /**
   * Determines which action to perform when scroll outside an opened overlay
   * happens. Possible values: lock - blocks scrolling from happening, refit -
   * computes the new position on the overlay cancel - causes the overlay to
   * close
   * @attribute
   */
  scrollAction: string,
  /**
   * Shortcut to access to the overlay manager.
   */
  _manager: OverlayManager;
  /**
   * The node being focused.
   */
  _focusedChild: HTMLElement;

  readonly canceled: boolean;
  isAttached: boolean;
  readonly backdropElement: OverlayBackdrop;
  readonly _focusNode: HTMLElement;
  readonly _focusableNodes: HTMLElement[];
  onopenedchanged: EventListener | null;
  onoverlaycanceled: EventListener | null;
  onoverlayopened: EventListener | null;
  onoverlayclosed: EventListener | null;
  onopened: EventListener | null;
  onclosed: EventListener | null;
  connectedCallback(): void;
  disconnectedCallback(): void;

  _registerCallback(eventType: string, value: EventListener): void;
  _setupSlotListeners(): void;
  _removeSlotListeners(): void;
  _processMutations(mutations: MutationEvent[]): void;
  _listenSlots(nodeList: Node[] | NodeList | HTMLCollection): void;
  _unlistenSlots(nodeList: Node[] | NodeList | HTMLCollection): void;
  _boundSchedule(): void;
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
   * @param event The original event
   */
  cancel(event?: Event): void;
  /**
   * Invalidates the cached tabbable nodes. To be called when any of the
   * focusable content changes (e.g. a button is disabled).
   */
  invalidateTabbables(): void;
  _ensureSetup(): void;
  /**
   * Called when `opened` changes.
   * @param opened
   */
  _openedChanged(opened?: boolean): void;
  _ensureAria(opened: boolean): void;
  _canceledChanged(): void;
  _withBackdropChanged(): void;
  /**
   * tasks which must occur before opening; e.g. making the element visible.
   */
  _prepareRenderOpened(): void;
  /**
   * Tasks which cause the overlay to actually open; typically play an
   * animation.
   */
  _renderOpened(): void;

  /**
   * Tasks which cause the overlay to actually close; typically play an
   * animation.
   */
  _renderClosed(): void;

  /**
   * Tasks to be performed at the end of open action. Will fire
   * `overlay-opened`.
   */
  _finishRenderOpened(): void;

  /**
   * Tasks to be performed at the end of close action. Will fire
   * `overlay-closed`.
   */
  _finishRenderClosed(): void;

  _preparePositioning(): void;

  _finishPositioning(): void;

  /**
   * Applies focus according to the opened state.

   */
  _applyFocus(): void;

  /**
   * Cancels (closes) the overlay. Call when click happens outside the overlay.
   * @param event
   */
  _onCaptureClick(event: Event): void;

  /**
   * Keeps track of the focused child. If withBackdrop, traps focus within
   * overlay.
   * @param event

   */
  _onCaptureFocus(event: Event): void;

  /**
   * Handles the ESC key event and cancels (closes) the overlay.
   * @param event

   */
  _onCaptureEsc(event: Event): void;

  /**
   * Handles TAB key events to track focus changes.
   * Will wrap focus for overlays withBackdrop.
   * @param event

   */
  _onCaptureTab(event: KeyboardEvent): void;

  /**
   * Refits if the overlay is opened and not animating.

   */
  _onIronResize(): void;

  /**
   * Will call notifyResize if overlay is opened.
   * Can be overridden in order to avoid multiple observers on the same node.

   */
  _onNodesChange(): void;

  /**
   * Updates the references to the first and last focusable nodes.
   */
  __ensureFirstLastFocusables(): void;

  /**
   * Tasks executed when opened changes: prepare for the opening, move the
   * focus, update the manager, render opened/closed.
   */
  __openedChanged(): void;

  /**
   * Debounces the execution of a callback to the next animation frame.
   * @param jobName
   * @param callback Always bound to `this`
   */
  __deraf(jobName: string, callback: Function): void;

  __updateScrollObservers(isAttached: boolean, opened: boolean, scrollAction?: string): void;

  __addScrollListeners(): void;

  __removeScrollListeners(): void;

  __isValidScrollAction(scrollAction: string): boolean;

  __onCaptureScroll(event: Event): void;
  /**
   * Memoizes the scroll position of the outside scrolling element.
   */
  __saveScrollPosition(): void;

  /**
   * Resets the scroll position of the outside scrolling element.
   */
  __restoreScrollPosition(): void;
}

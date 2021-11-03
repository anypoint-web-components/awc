export declare const resizeNotificationEventType: string;
export declare const resizeEventType: string;
export declare const legacyResizeEventType: string;

declare function ResizableMixin<T extends new (...args: any[]) => {}>(base: T): T & ResizableMixinConstructor;
export interface ResizableMixinConstructor {
  new(...args: any[]): ResizableMixin;
}

/**
 * @fires resize Dispatched when the element should re-layout itself.
 * @fires requestresizenotifications
 */
export interface ResizableMixin {
  readonly _parentResizable: HTMLElement;
  _notifyingDescendant: Boolean;
  _interestedResizables: Element[];

  connectedCallback(): void;
  disconnectedCallback(): void;
  /**
   * Can be called to manually notify a resizable and its descendant
   * resizables of a resize change.
   */
  notifyResize(): void;

  /**
   * Used to assign the closest resizable ancestor to this resizable
   * if the ancestor detects a request for notifications.
   */
  assignParentResizable(parentResizable: HTMLElement): void;
  /**
   * Used to remove a resizable descendant from the list of descendants
   * that should be notified of a resize change.
   */
  stopResizeNotificationsFor(target: HTMLElement): void;
  /**
   * Subscribe this element to listen to `resize` events on the given target.
   *
   * Preferred over target.listen because the property renamer does not
   * understand to rename when the target is not specifically "this"
   *
   * @param target Element to listen to for `resize` events.
   */
  _subscribeIronResize(target: HTMLElement): void;
  /**
   * Unsubscribe this element from listening to to `resize` events on the
   * given target.
   *
   * Preferred over target.unlisten because the property renamer does not
   * understand to rename when the target is not specifically "this"
   *
   * @param {HTMLElement} target Element to listen to for `resize` events.
   */
  _unsubscribeIronResize(target: HTMLElement): void;
  /**
   * This method can be overridden to filter nested elements that should or
   * should not be notified by the current element. Return true if an element
   * should be notified, or false if it should not be notified.
   *
   * @param element A candidate descendant element that
   * implements `ResizableMixin`.
   * @returns True if the `element` should be notified of resize.
   */
  resizerShouldNotify(element: HTMLElement): boolean;

  _onDescendantIronResize(e: CustomEvent): void;
  _fireResize(): void;
  _onIronRequestResizeNotifications(e: CustomEvent): void;
  _parentResizableChanged(parentResizable: HTMLElement): void;
  _notifyDescendant(descendant: HTMLElement): void;
  _requestResizeNotifications(): void;
  _findParent(): void;
}

/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { state } from "lit/decorators.js";
import AnypointElement from "../AnypointElement.js";

// Contains all connected resizables that do not have a parent.
const ORPHANS = new Set();
export const resizeNotificationEventType = 'requestresizenotifications';
export const resizeEventType = 'resize';

/**
 * An element that coordinates the flow of resize events between "resizers" (elements that
 * control the size or hidden state of their children) and "resizables" (elements
 * that need to be notified when they are resized or un-hidden by their parents
 * in order to take action on their new measurements).
 * 
 * @fires requestresizenotifications
 * @fires resize
 */
export default class ResizableElement extends AnypointElement {
  __parentResizable?: ResizableElement;

  get _parentResizable(): ResizableElement | undefined {
    return this.__parentResizable;
  }

  set _parentResizable(value: ResizableElement | undefined) {
    const old = this.__parentResizable;
    this.__parentResizable = value;
    if (old !== value) {
      this._parentResizableChanged(value);
    }
  }

  protected _notifyingDescendant?: boolean;

  _interestedResizables: ResizableElement[] = [];

  @state() protected _isAttached?: boolean;

  constructor() {
    super();
    this.notifyResize = this.notifyResize.bind(this);
    this._onDescendantResize = this._onDescendantResize.bind(this);
    this.addEventListener(resizeNotificationEventType, this._onRequestResizeNotifications.bind(this), true);
  }

  connectedCallback(): void {
    this._isAttached = true;
    super.connectedCallback();
    setTimeout(() => {
      this._requestResizeNotifications();
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._isAttached = false;
    if (this._parentResizable) {
      // @ts-ignore
      this._parentResizable.stopResizeNotificationsFor(this);
    } else {
      ORPHANS.delete(this);
      window.removeEventListener('resize', this.notifyResize);
    }

    this._parentResizable = undefined;
  }

  /**
   * Can be called to manually notify a resizable and its descendant
   * resizables of a resize change.
   */
  notifyResize(): void {
    if (!this._isAttached) {
      return;
    }
    this._interestedResizables.forEach((resizable) => {
      if (this.resizerShouldNotify(resizable as HTMLElement)) {
        this._notifyDescendant(resizable);
      }
    });
    this._fireResize();
  }

  /**
   * Used to assign the closest resizable ancestor to this resizable
   * if the ancestor detects a request for notifications.
   */
  assignParentResizable(parentResizable?: ResizableElement): void {
    if (this._parentResizable) {
      this._parentResizable.stopResizeNotificationsFor(this);
    }

    this._parentResizable = parentResizable;
    if (parentResizable && parentResizable._interestedResizables.indexOf(this) === -1) {
      parentResizable._interestedResizables.push(this);
      parentResizable._subscribeIronResize(this);
    }
  }

  /**
   * Used to remove a resizable descendant from the list of descendants
   * that should be notified of a resize change.
   */
  stopResizeNotificationsFor(target: ResizableElement): void {
    const index = this._interestedResizables.indexOf(target);
    if (index > -1) {
      this._interestedResizables.splice(index, 1);
      this._unsubscribeIronResize(target);
    }
  }

  /**
   * This method can be overridden to filter nested elements that should or
   * should not be notified by the current element. Return true if an element
   * should be notified, or false if it should not be notified.
   *
   * @param element A candidate descendant element that implements `ResizableElements`.
   * @return True if the `element` should be notified of resize.
   */
  resizerShouldNotify(element: HTMLElement): boolean {
    return true;
  }

  /**
   * Subscribe this element to listen to `resize` events on the given target.
   *
   * Preferred over target.listen because the property "renamer" does not
   * understand to rename when the target is not specifically "this"
   *
   * @param target Element to listen to for `resize` events.
   */
  _subscribeIronResize(target: EventTarget): void {
    target.addEventListener(resizeEventType, this._onDescendantResize);
  }

  /**
   * Unsubscribe this element from listening to to `resize` events on the
   * given target.
   *
   * Preferred over target.unlisten because the property "renamer" does not
   * understand to rename when the target is not specifically "this"
   *
   * @param target Element to listen to for `resize` events.
   */
  _unsubscribeIronResize(target: EventTarget): void {
    target.removeEventListener(resizeEventType, this._onDescendantResize);
  }

  _onDescendantResize(e: Event): void {
    if (this._notifyingDescendant) {
      e.stopPropagation();
      return;
    }
    this._fireResize();
  }

  _fireResize(): void {
    this.dispatchEvent(new CustomEvent(resizeEventType));
  }

  _onRequestResizeNotifications(e: Event): void {
    const cp = e.composedPath && e.composedPath();
    let path;
    if (cp) {
      path = cp;
    } else {
      // @ts-ignore
      path = e.path || [];
    }
    const target = path[0];
    if (target === this) {
      return;
    }
    target.assignParentResizable(this);
    this._notifyDescendant(target);
    e.stopPropagation();
  }

  _parentResizableChanged(parentResizable?: EventTarget): void {
    if (parentResizable) {
      window.removeEventListener('resize', this.notifyResize);
    }
  }

  _notifyDescendant(descendant: any): void {
    // NOTE(cdata): In IE10, attached is fired on children first, so it's
    // important not to notify them if the parent is not attached yet (or
    // else they will get redundantly notified when the parent attaches).
    if (!this._isAttached) {
      return;
    }

    this._notifyingDescendant = true;
    descendant.notifyResize();
    this._notifyingDescendant = false;
  }

  _requestResizeNotifications(): void {
    if (!this._isAttached) {
      return;
    }

    if (document.readyState === 'loading') {
      const _requestResizeNotifications = this._requestResizeNotifications.bind(this);
      document.addEventListener('readystatechange', function readyStateChanged() {
        document.removeEventListener('readystatechange', readyStateChanged);
        _requestResizeNotifications();
      });
    } else {
      this._findParent();

      if (!this._parentResizable) {
        // If this resizable is an orphan, tell other orphans to try to find
        // their parent again, in case it's this resizable.
        ORPHANS.forEach((orphan) => {
          if (orphan !== this) {
            // @ts-ignore
            orphan._findParent();
          }
        });

        window.addEventListener('resize', this.notifyResize);
        this.notifyResize();
      } else {
        // If this resizable has a parent, tell other child resizables of
        // that parent to try finding their parent again, in case it's this
        // resizable.
        // @ts-ignore
        this._parentResizable._interestedResizables.forEach((resizable) => {
          if (resizable !== this) {
            resizable._findParent();
          }
        });
      }
    }
  }

  _findParent(): void {
    this.assignParentResizable(undefined);
    this.dispatchEvent(new CustomEvent(resizeNotificationEventType, {
      bubbles: true,
      cancelable: true,
      composed: true
    }));

    if (!this._parentResizable) {
      ORPHANS.add(this);
    } else {
      ORPHANS.delete(this);
    }
  }
}

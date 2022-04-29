/* eslint-disable import/no-mutable-exports */
/* istanbul ignore file */
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

/**
 * Used to calculate the scroll direction during touch events.
 */
const lastTouchPosition: {pageX: number, pageY: number} = { pageX: 0, pageY: 0 };
/**
 * Used to avoid computing event.path and filter scrollable nodes (better perf).
 */
let lastRootTarget: EventTarget | null = null;
let lastScrollableNodes: Node[] = [];

const scrollEvents: string[] = [
  // Modern `wheel` event for mouse wheel scrolling:
  'wheel',
  // Older, non-standard `mousewheel` event for some FF:
  'mousewheel',
  // IE:
  'DOMMouseScroll',
  // Touch enabled devices
  'touchstart',
  'touchmove'
];
// must be defined for modulizer
let _boundScrollHandler: (event: any) => void | undefined;
let currentLockingElement: Node|undefined;

export const _lockingElements: HTMLElement[] = [];
export let _lockedElementCache: HTMLElement[] | null = null;
export let _unlockedElementCache: HTMLElement[] | null = null;

/**
 * The ScrollManager is intended to provide a central source
 * of authority and control over which elements in a document are currently
 * allowed to scroll.
 *
 */

/**
 * The current element that defines the DOM boundaries of the
 * scroll lock. This is always the most recently locking element.
 */
export { currentLockingElement };

/**
 * Returns scroll `deltaX` and `deltaY`.
 * @param event The scroll event
 * @returns Object containing the
 * x-axis scroll delta (positive: scroll right, negative: scroll left,
 * 0: no scroll), and the y-axis scroll delta (positive: scroll down,
 * negative: scroll up, 0: no scroll).
 */
export function _getScrollInfo(event: Event): {deltaX: number, deltaY: number} {
  // @ts-ignore
  const info = { deltaX: event.deltaX, deltaY: event.deltaY };
  // Already available.
  if ('deltaX' in event) {
    // do nothing, values are already good.
  } else if ('wheelDeltaX' in event && 'wheelDeltaY' in event) {
    // Safari has scroll info in `wheelDeltaX/Y`.
    // @ts-ignore
    info.deltaX = -event.wheelDeltaX;
    // @ts-ignore
    info.deltaY = -event.wheelDeltaY;
  } else if ('wheelDelta' in event) {
    // IE10 has only vertical scroll info in `wheelDelta`.
    info.deltaX = 0;
    // @ts-ignore
    info.deltaY = -event.wheelDelta;
  } else if ('axis' in event) {
    // Firefox has scroll info in `detail` and `axis`.
    // @ts-ignore
    info.deltaX = event.axis === 1 ? event.detail : 0;
    // @ts-ignore
    info.deltaY = event.axis === 2 ? event.detail : 0;
    // @ts-ignore
  } else if (event.targetTouches) {
    // On mobile devices, calculate scroll direction.
    // @ts-ignore
    const touch = event.targetTouches[0];
    // Touch moves from right to left => scrolling goes right.
    info.deltaX = lastTouchPosition.pageX - touch.pageX;
    // Touch moves from down to up => scrolling goes down.
    info.deltaY = lastTouchPosition.pageY - touch.pageY;
  }
  return info;
}

/**
 * Returns the node that is scrolling. If there is no scrolling,
 * returns undefined.
 * 
 * @param deltaX Scroll delta on the x-axis
 * @param deltaY Scroll delta on the y-axis
 */
export function _getScrollingNode(nodes: Node[], deltaX: number, deltaY: number): Node|undefined {
  // No scroll.
  if (!deltaX && !deltaY) {
    return undefined;
  }
  // Check only one axis according to where there is more scroll.
  // Prefer vertical to horizontal.
  const verticalScroll = Math.abs(deltaY) >= Math.abs(deltaX);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i] as HTMLElement;
    let canScroll = false;
    if (verticalScroll) {
      // delta < 0 is scroll up, delta > 0 is scroll down.
      canScroll = deltaY < 0 ? node.scrollTop > 0 : node.scrollTop < node.scrollHeight - node.clientHeight;
    } else {
      // delta < 0 is scroll left, delta > 0 is scroll right.
      canScroll = deltaX < 0 ? node.scrollLeft > 0 : node.scrollLeft < node.scrollWidth - node.clientWidth;
    }
    if (canScroll) {
      return node;
    }
  }
  return undefined;
}

/**
 * Returns an array of scrollable nodes up to the current locking element,
 * which is included too if scrollable.
 */
export function _getScrollableNodes(nodes: Node[]): HTMLElement[] {
  const scrollables: HTMLElement[] = [];
  const lockingIndex = currentLockingElement ? nodes.indexOf(currentLockingElement) : -1;
  // Loop from root target to locking element (included).
  for (let i = 0; i <= lockingIndex; i++) {
    // Skip non-Element nodes.
    if (nodes[i].nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    const node = nodes[i] as HTMLElement;
    // Check inline style before checking computed style.
    let { style } = node;
    if (!style) {
      continue;
    }
    if (!style.overflow.includes('scroll') && !style.overflow.includes('auto')) {
      style = window.getComputedStyle(node);
    }
    if (style.overflow.includes('scroll') || style.overflow.includes('auto')) {
      scrollables.push(node);
    }
  }
  return scrollables;
}

export function _hasCachedLockedElement(element: HTMLElement): boolean {
  if (!_lockedElementCache) {
    return false;
  }
  return _lockedElementCache.includes(element);
}

export function _hasCachedUnlockedElement(element: HTMLElement): boolean {
  if (!_unlockedElementCache) {
    return false;
  }
  return _unlockedElementCache.includes(element);
}

export function _composedTreeContains(element: Node, child: HTMLElement): boolean {
  // NOTE(cdata): This method iterates over content elements and their
  // corresponding distributed nodes to implement a contains-like method
  // that pierces through the composed tree of the ShadowDOM. Results of
  // this operation are cached (elsewhere) on a per-scroll-lock basis, to
  // guard against potentially expensive lookups happening repeatedly as
  // a user scrolls / touchmoves.
  let distributedNodes;
  let contentIndex;
  let nodeIndex;

  if (element.contains(child)) {
    return true;
  }
  if (element.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const contentElements = (element as Element).querySelectorAll('slot');

  for (contentIndex = 0; contentIndex < contentElements.length; ++contentIndex) {
    const slot = contentElements[contentIndex];
    distributedNodes = slot.assignedNodes();
    for (nodeIndex = 0; nodeIndex < distributedNodes.length; ++nodeIndex) {
      // Polymer 2.x returns slot.assignedNodes which can contain text nodes.
      if (distributedNodes[nodeIndex].nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      if (_composedTreeContains(distributedNodes[nodeIndex], child)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Returns true if the event causes scroll outside the current locking
 * element, e.g. pointer/keyboard interactions, or scroll "leaking"
 * outside the locking element when it is already at its scroll boundaries.
 */
export function _shouldPreventScrolling(event: Event): boolean {
  // Update if root target changed. For touch events, ensure we don't
  // update during touchmove.
  const cp = event.composedPath && event.composedPath();
  // @ts-ignore
  const path = (cp || event.path) as Node[];
  const target = path[0];
  if (event.type !== 'touchmove' && lastRootTarget !== target) {
    lastRootTarget = target;
    lastScrollableNodes = _getScrollableNodes(path);
  }

  // Prevent event if no scrollable nodes.
  if (!lastScrollableNodes.length) {
    return true;
  }
  // Don't prevent touchstart event inside the locking element when it has
  // scrollable nodes.
  if (event.type === 'touchstart') {
    return false;
  }
  // Get deltaX/Y.
  const info = _getScrollInfo(event);
  // Prevent if there is no child that can scroll.
  return !_getScrollingNode(lastScrollableNodes, info.deltaX, info.deltaY);
}

export function _scrollInteractionHandler(event: Event | TouchEvent): void {
  // Avoid canceling an event with cancelable=false, e.g. scrolling is in
  // progress and cannot be interrupted.
  if (event.cancelable && _shouldPreventScrolling(event)) {
    event.preventDefault();
  }
  // If event has targetTouches (touch event), update last touch position.
  const typed = event as TouchEvent;
  if (typed.targetTouches) {
    const touch = typed.targetTouches[0];
    lastTouchPosition.pageX = touch.pageX;
    lastTouchPosition.pageY = touch.pageY;
  }
}
/**
 * Returns true if the provided element is "scroll locked", which is to
 * say that it cannot be scrolled via pointer or keyboard interactions.
 *
 * @param element An HTML element instance which may or may not be scroll locked.
 */
export function elementIsScrollLocked(element: HTMLElement): boolean {
  const lockingElement = currentLockingElement;

  if (lockingElement === undefined) {
    return false;
  }

  if (_hasCachedLockedElement(element)) {
    return true;
  }

  if (_hasCachedUnlockedElement(element)) {
    return false;
  }

  const scrollLocked = !!lockingElement && lockingElement !== element && !_composedTreeContains(lockingElement, element);

  if (scrollLocked) {
    if (!_lockedElementCache) {
      _lockedElementCache = [];
    }
    _lockedElementCache.push(element);
  } else {
    if (!_unlockedElementCache) {
      _unlockedElementCache = [];
    }
    _unlockedElementCache.push(element);
  }

  return scrollLocked;
}

export function _lockScrollInteractions(): void {
  _boundScrollHandler = _boundScrollHandler || _scrollInteractionHandler.bind(undefined);
  for (let i = 0, l = scrollEvents.length; i < l; i++) {
    // NOTE: browsers that don't support objects as third arg will
    // interpret it as boolean, hence useCapture = true in this case.
    document.addEventListener(scrollEvents[i], _boundScrollHandler, { capture: true, passive: false });
  }
}

export function _unlockScrollInteractions(): void {
  for (let i = 0, l = scrollEvents.length; i < l; i++) {
    // NOTE: browsers that don't support objects as third arg will
    // interpret it as boolean, hence useCapture = true in this case.
    // @ts-ignore
    document.removeEventListener(scrollEvents[i], _boundScrollHandler, { capture: true, passive: false });
  }
}

/**
 * Push an element onto the current scroll lock stack. The most recently
 * pushed element and its children will be considered scrollable. All
 * other elements will not be scrollable.
 *
 * Scroll locking is implemented as a stack so that cases such as
 * dropdowns within dropdowns are handled well.
 *
 * @param element The element that should lock scroll.
 */
export function pushScrollLock(element: HTMLElement): void {
  // Prevent pushing the same element twice
  if (_lockingElements.includes(element)) {
    return;
  }

  if (_lockingElements.length === 0) {
    _lockScrollInteractions();
  }

  _lockingElements.push(element);
  currentLockingElement = _lockingElements[_lockingElements.length - 1];

  _lockedElementCache = [];
  _unlockedElementCache = [];
}

/**
 * Remove an element from the scroll lock stack. The element being
 * removed does not need to be the most recently pushed element. However,
 * the scroll lock constraints only change when the most recently pushed
 * element is removed.
 *
 * @param element The element to remove from the scroll lock stack.
 */
export function removeScrollLock(element: HTMLElement): void {
  const index = _lockingElements.indexOf(element);
  if (index === -1) {
    return;
  }
  _lockingElements.splice(index, 1);
  currentLockingElement = _lockingElements[_lockingElements.length - 1];

  _lockedElementCache = [];
  _unlockedElementCache = [];

  if (_lockingElements.length === 0) {
    _unlockScrollInteractions();
  }
}

/**
 * @package
 */
export { _boundScrollHandler };

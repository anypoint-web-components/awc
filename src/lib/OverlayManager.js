/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import '../../overlay-backdrop.js';

/**
 * @typedef {import('../OverlayBackdropElement').default} OverlayBackdrop
 */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */

/**
 * The class was originally designed by Polymer team.
 */
export class OverlayManager {
  constructor() {
    /**
     * Used to keep track of the opened overlays.
     * @private {Array<HTMLElement>}
     */
    this._overlays = [];

    /**
     * iframes have a default z-index of 100,
     * so this default should be at least that.
     * @private {number}
     */
    this._minimumZ = 101;

    /**
     * Memoized backdrop element.
     * @private {OverlayBackdrop|null}
     */
    this._backdropElement = null;

    // Enable document-wide tap recognizer.
    // NOTE: Use useCapture=true to avoid accidentally prevention of the closing
    // of an overlay via event.stopPropagation(). The only way to prevent
    // closing of an overlay should be through its APIs.
    // NOTE: enable tap on <html> to workaround Polymer/polymer#4459
    // Pass no-op function because MSEdge 15 doesn't handle null as 2nd argument
    // https://github.com/Microsoft/ChakraCore/issues/3863
    document.documentElement.addEventListener('click', () => {});
    document.addEventListener('click', this._onCaptureClick.bind(this), true);
    document.addEventListener('focus', this._onCaptureFocus.bind(this), true);
    document.addEventListener('keydown', this._onCaptureKeyDown.bind(this), true);
  }

  /**
   * The shared backdrop element.
   * @return {!OverlayBackdrop} backdropElement
   */
  get backdropElement() {
    if (!this._backdropElement) {
      this._backdropElement = document.createElement('arc-overlay-backdrop');
    }
    return this._backdropElement;
  }

  /**
   * The deepest active element.
   * @return {!Element} activeElement the active element
   */
  get deepActiveElement() {
    let active = document.activeElement;
    // document.activeElement can be null
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
    // In IE 11, it can also be an object when operating in iframes.
    // In these cases, default it to document.body.
    if (!active || active instanceof Element === false) {
      active = document.body;
    }
    while (active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  /**
   * Brings the overlay at the specified index to the front.
   * @param {number} i
   * @private
   */
  _bringOverlayAtIndexToFront(i) {
    const overlay = this._overlays[i];
    if (!overlay) {
      return;
    }
    let lastI = this._overlays.length - 1;
    const currentOverlay = this._overlays[lastI];
    // Ensure always-on-top overlay stays on top.
    if (currentOverlay &&
        this._shouldBeBehindOverlay(overlay, currentOverlay)) {
      lastI--;
    }
    // If already the top element, return.
    if (i >= lastI) {
      return;
    }
    // Update z-index to be on top.
    const minimumZ = Math.max(this.currentOverlayZ(), this._minimumZ);
    if (this._getZ(overlay) <= minimumZ) {
      this._applyOverlayZ(overlay, minimumZ);
    }

    // Shift other overlays behind the new on top.
    while (i < lastI) {
      this._overlays[i] = this._overlays[i + 1];
      i++;
    }
    this._overlays[lastI] = overlay;
  }

  /**
   * Adds the overlay and updates its z-index if it's opened, or removes it if
   * it's closed. Also updates the backdrop z-index.
   * @param {HTMLElement} overlay
   */
  addOrRemoveOverlay(overlay) {
    // @ts-ignore
    if (overlay.opened) {
      this.addOverlay(overlay);
    } else {
      // @ts-ignore
      this.removeOverlay(overlay);
    }
  }

  /**
   * Tracks overlays for z-index and focus management.
   * Ensures the last added overlay with always-on-top remains on top.
   * @param {HTMLElement} overlay
   */
  addOverlay(overlay) {
    const i = this._overlays.indexOf(overlay);
    if (i >= 0) {
      this._bringOverlayAtIndexToFront(i);
      this.trackBackdrop();
      return;
    }
    let insertionIndex = this._overlays.length;
    const currentOverlay = this._overlays[insertionIndex - 1];
    let minimumZ = Math.max(this._getZ(currentOverlay), this._minimumZ);
    const newZ = this._getZ(overlay);

    // Ensure always-on-top overlay stays on top.
    if (currentOverlay &&
        this._shouldBeBehindOverlay(overlay, currentOverlay)) {
      // This bumps the z-index of +2.
      this._applyOverlayZ(currentOverlay, minimumZ);
      insertionIndex--;
      // Update minimumZ to match previous overlay's z-index.
      const previousOverlay = this._overlays[insertionIndex - 1];
      minimumZ = Math.max(this._getZ(previousOverlay), this._minimumZ);
    }

    // Update z-index and insert overlay.
    if (newZ <= minimumZ) {
      this._applyOverlayZ(overlay, minimumZ);
    }
    this._overlays.splice(insertionIndex, 0, overlay);

    this.trackBackdrop();
  }

  /**
   * @param {HTMLElement} overlay
   */
  removeOverlay(overlay) {
    const i = this._overlays.indexOf(overlay);
    if (i === -1) {
      return;
    }
    this._overlays.splice(i, 1);

    this.trackBackdrop();
  }

  /**
   * Returns the current overlay.
   * @return {HTMLElement|undefined}
   */
  currentOverlay() {
    const i = this._overlays.length - 1;
    return this._overlays[i];
  }

  /**
   * Returns the current overlay z-index.
   * @return {number}
   */
  currentOverlayZ() {
    return this._getZ(this.currentOverlay());
  }

  /**
   * Ensures that the minimum z-index of new overlays is at least `minimumZ`.
   * This does not effect the z-index of any existing overlays.
   * @param {number} minimumZ
   */
  ensureMinimumZ(minimumZ) {
    this._minimumZ = Math.max(this._minimumZ, minimumZ);
  }

  focusOverlay() {
    const current = /** @type {?} */ (this.currentOverlay());
    if (current) {
      current._applyFocus();
    }
  }

  /**
   * Updates the backdrop z-index.
   */
  trackBackdrop() {
    const overlay = this._overlayWithBackdrop();
    // Avoid creating the backdrop if there is no overlay with backdrop.
    if (!overlay && !this._backdropElement) {
      return;
    }
    this.backdropElement.style.zIndex = String(this._getZ(overlay) - 1);
    this.backdropElement.opened = !!overlay;
    // Property observers are not fired until element is attached
    // in Polymer 2.x, so we ensure element is attached if needed.
    // https://github.com/Polymer/polymer/issues/4526
    this.backdropElement.prepare();
  }

  /**
   * @return {!Array<!Element>}
   */
  getBackdrops() {
    const backdrops = [];
    for (let i = 0; i < this._overlays.length; i++) {
      if (this._overlays[i].withBackdrop) {
        backdrops.push(this._overlays[i]);
      }
    }
    return backdrops;
  }

  /**
   * Returns the z-index for the backdrop.
   * @return {number}
   */
  backdropZ() {
    return this._getZ(this._overlayWithBackdrop()) - 1;
  }

  /**
   * Returns the top opened overlay that has a backdrop.
   * @return {!HTMLElement|undefined}
   * @private
   */
  _overlayWithBackdrop() {
    for (let i = this._overlays.length - 1; i >= 0; i--) {
      if (this._overlays[i].withBackdrop) {
        return this._overlays[i];
      }
    }
    return undefined;
  }

  /**
   * Calculates the minimum z-index for the overlay.
   *
   * @param {HTMLElement=} overlay
   * @return {number}
   * @private
   */
  _getZ(overlay) {
    let z = this._minimumZ;
    if (overlay) {
      const z1 = Number(overlay.style.zIndex || window.getComputedStyle(overlay).zIndex);
      // Check if is a number
      // Number.isNaN not supported in IE 10+
      if (!Number.isNaN(z1)) {
        z = z1;
      }
    }
    return z;
  }

  /**
   * @param {!HTMLElement} element
   * @param {number|string} z
   * @private
   */
  _setZ(element, z) {
    element.style.zIndex = String(z);
  }

  /**
   * @param {!HTMLElement} overlay
   * @param {number} aboveZ
   * @private
   */
  _applyOverlayZ(overlay, aboveZ) {
    this._setZ(overlay, aboveZ + 2);
  }

  /**
   * Returns the deepest overlay in the path.
   * @param {!Array<!HTMLElement>=} path
   * @return {!Element|undefined}
   * @suppress {missingProperties}
   * @private
   */
  _overlayInPath(path) {
    path = path || [];
    for (let i = 0; i < path.length; i++) {
      // @ts-ignore
      if (path[i]._manager === this) {
        return path[i];
      }
    }
    return undefined;
  }

  /**
   * Ensures the click event is delegated to the right overlay.
   * @param {MouseEvent} e
   * @private
   */
  _onCaptureClick(e) {
    let i = this._overlays.length - 1;
    if (i === -1) {
      return;
    }
    const cp = e.composedPath && e.composedPath();
    // @ts-ignore
    const path = /** @type {!Array<!EventTarget>} */ cp || e.path;
    let overlay;
    // Check if clicked outside of overlay.
    while ((overlay = /** @type {?} */ (this._overlays[i])) &&
           this._overlayInPath(path) !== overlay) {
      if (this._clickIsInsideOverlay(e, overlay)) {
        i--;
        continue
      }
      overlay._onCaptureClick(e);
      if (overlay.allowClickThrough) {
        i--;
      } else {
        break;
      }
    }
  }

  _clickIsInsideOverlay(clickEvent, element) {
    const { clientX, clientY } = clickEvent;
    const { top, left, right, bottom} = element.getBoundingClientRect();
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      return false;
    }
    return true;
  }

  /**
   * Ensures the focus event is delegated to the right overlay.
   * @param {!Event} event
   * @private
   */
  _onCaptureFocus(event) {
    const overlay = /** @type {?} */ (this.currentOverlay());
    if (overlay) {
      overlay._onCaptureFocus(event);
    }
  }

  /**
   * Ensures TAB and ESC keyboard events are delegated to the right overlay.
   * @param {KeyboardEvent} e
   * @private
   */
  _onCaptureKeyDown(e) {
    const overlay = /** @type {?} */ (this.currentOverlay());
    if (overlay) {
      if (this._keyboardEventMatchesKeys(e, 'Escape')) {
        overlay._onCaptureEsc(e);
      } else if (this._keyboardEventMatchesKeys(e, 'Tab')) {
        overlay._onCaptureTab(e);
      }
    }
  }

  _keyboardEventMatchesKeys(e, key) {
    if (e.key && e.key === key) {
      return true;
    }
    if (e.detail && e.detail.key === key) {
      return true;
    }
    return false;
  }

  /**
   * Returns if the overlay1 should be behind overlay2.
   * @param {!HTMLElement} overlay1
   * @param {!HTMLElement} overlay2
   * @return {boolean}
   * @suppress {missingProperties}
   * @private
   */
  _shouldBeBehindOverlay(overlay1, overlay2) {
    // @ts-ignore
    return !overlay1.alwaysOnTop && overlay2.alwaysOnTop;
  }
}

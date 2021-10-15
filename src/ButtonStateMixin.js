/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/

import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class ButtonStateMixinImpl extends base {
    static get properties() {
      return {
        /**
         * If true, the button toggles the active state with each click or press
         * of the space bar.
         * @attribute
         */
        toggles: { type: Boolean, reflect: true },
        /**
         * If true, the button is a toggle and is currently in the active state.
         * @attribute
         */
        active: { type: Boolean, reflect: true },
        /**
         * The aria attribute to be set if the button is a toggle and in the
         * active state.
         * @attribute
         */
        ariaActiveAttribute: { type: String, reflect: true },

        _pointerDown: { type: Boolean },
        _receivedFocusFromKeyboard: { type: Boolean },
        /**
         * @attribute 
         */
        _pressed: { type: Boolean, reflect: true, attribute: 'pressed' },
      };
    }

    /**
     * @return {Boolean} True when the element is currently being pressed as
     * the user is holding down the button on the element.
     */
    get pressed() {
      return this._pressed;
    }

    get _pressed() {
      return this.__pressed || false;
    }

    set _pressed(value) {
      const old = this._pressed;
      if (old === value) {
        return;
      }
      this.__pressed = value;
      this.dispatchEvent(new Event('pressedchange'));
      // deprecate this event
      this.dispatchEvent(
        new CustomEvent('pressed-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
      this._pressedChanged();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('_pressed', old);
      }
    }

    get active() {
      return this._active || false;
    }

    set active(value) {
      const old = this._active;
      if (old === value) {
        return;
      }
      this._active = value;
      this.dispatchEvent(new Event('activechange'));
      this.dispatchEvent(
        new CustomEvent('active-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
      this._activeChanged();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('active', old);
      }
    }

    /**
     * @return {Boolean} True when the a pointer device is currently pointing on the element
     * and is in "down" state.
     */
    get pointerDown() {
      return this._pointerDown;
    }

    /**
     * @return {Boolean} True when the element received focus from the keyboard.
     */
    get receivedFocusFromKeyboard() {
      return this._receivedFocusFromKeyboard || false;
    }

    get ariaActiveAttribute() {
      return this._ariaActiveAttribute;
    }

    set ariaActiveAttribute(value) {
      const old = this._ariaActiveAttribute;
      if (old === value) {
        return;
      }
      this._ariaActiveAttribute = value;
      if (old && this.hasAttribute(old)) {
        this.removeAttribute(old);
      }
      this._activeChanged();
    }

    /**
     * @deprecated Do not use this function.
     * @param {String} prop
     * @param {any} value
     */
    _setChanged(prop, value) {
      const key = `_${prop}`;
      const old = this[key];
      if (value === old) {
        return false;
      }
      this[key] = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate(prop, old);
      }
      return true;
    }

    /**
     * @constructor
     */
    constructor() {
      super();
      this.ariaActiveAttribute = 'aria-pressed';
      this._downHandler = this._downHandler.bind(this);
      this._upHandler = this._upHandler.bind(this);
      this._clickHandler = this._clickHandler.bind(this);
      this._keyDownHandler = this._keyDownHandler.bind(this);
      this._keyUpHandler = this._keyUpHandler.bind(this);
      this._blurHandler = this._blurHandler.bind(this);
      this._focusHandler = this._focusHandler.bind(this);

      this.toggles = false;
    }

    /**
     * Registers hover listeners
     */
    connectedCallback() {
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this.addEventListener('mousedown', this._downHandler);
      this.addEventListener('mouseup', this._upHandler);
      this.addEventListener('click', this._clickHandler);
      this.addEventListener('keydown', this._keyDownHandler);
      this.addEventListener('keyup', this._keyUpHandler);
      this.addEventListener('blur', this._blurHandler);
      this.addEventListener('focus', this._focusHandler);
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }
    }

    /**
     * Removes hover listeners
     */
    disconnectedCallback() {
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.removeEventListener('mousedown', this._downHandler);
      this.removeEventListener('mouseup', this._upHandler);
      this.removeEventListener('click', this._clickHandler);
      this.removeEventListener('keydown', this._keyDownHandler);
      this.removeEventListener('keyup', this._keyUpHandler);
      this.removeEventListener('blur', this._blurHandler);
      this.removeEventListener('focus', this._focusHandler);
    }

    /**
     * Handler for pointer down event
     */
    _downHandler() {
      this._pointerDown = true;
      this._pressed = true;
      this._receivedFocusFromKeyboard = false;
    }

    /**
     * Handler for pointer up event
     */
    _upHandler() {
      this._pointerDown = false;
      this._pressed = false;
    }

    /**
     * Handler for pointer click event
     */
    _clickHandler() {
      if (this.toggles) {
        // a click is needed to toggle the active state
        this.active = !this.active;
      } else {
        this.active = false;
      }
    }

    /**
     * Handler for keyboard down event
     * @param {KeyboardEvent} e
     */
    _keyDownHandler(e) {
      if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.keyCode === 13) {
        this._asyncClick();
      } else if (e.code === 'Space' || e.keyCode === 32) {
        this._spaceKeyDownHandler(e);
      }
    }

    /**
     * Handler for keyboard up event
     * @param {KeyboardEvent} e
     */
    _keyUpHandler(e) {
      if (e.code === 'Space' || e.keyCode === 32) {
        this._spaceKeyUpHandler(e);
      }
    }

    _blurHandler() {
      this._detectKeyboardFocus(false);
      this._pressed = false;
    }

    _focusHandler() {
      this._detectKeyboardFocus(true);
    }

    _detectKeyboardFocus(focused) {
      this._receivedFocusFromKeyboard = !this.pointerDown && focused;
    }

    _isLightDescendant(node) {
      return node !== this && this.contains(node);
    }

    _spaceKeyDownHandler(e) {
      const { target } = e;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(/** @type {Node} */ (target))) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      this._pressed = true;
    }

    _spaceKeyUpHandler(e) {
      const { target } = e;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(/** @type {Node} */ (target))) {
        return;
      }
      if (this.pressed) {
        this._asyncClick();
      }
      this._pressed = false;
    }

    _asyncClick() {
      setTimeout(() => this.click(), 1);
    }

    _pressedChanged() {
      this._changedButtonState();
    }

    _changedButtonState() {
      // @ts-ignore
      if (this._buttonStateChanged) {
        // @ts-ignore
        this._buttonStateChanged(); // abstract
      }
    }

    _activeChanged() {
      const { active, ariaActiveAttribute } = this;
      if (this.toggles) {
        this.setAttribute(ariaActiveAttribute, active ? 'true' : 'false');
      } else {
        this.removeAttribute(ariaActiveAttribute);
      }
      this._changedButtonState();
    }

    /**
     * This function is called when `ControlStateMixin` is also applied to the element.
     */
    _controlStateChanged() {
      // @ts-ignore
      if (this.disabled) {
        this._pressed = false;
      } else {
        this._changedButtonState();
      }
    }
  }
  return ButtonStateMixinImpl;
};

/**
 * Use `ButtonStateMixin` to implement an element that can be pressed and active when toggles.
 *
 * @mixin
 */
export const ButtonStateMixin = dedupeMixin(mxFunction);

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
  class ControlStateMixinImpl extends base {
    static get properties() {
      return {
        /**
         * If true, the button is a toggle and is currently in the active state.
         * @attribute
         */
        disabled: { type: Boolean, reflect: true },
        /**
         * If true, the element currently has focus.
         * @attribute
         */
        focused: { type: Boolean, reflect: true },
      };
    }

    /**
     * @return {Boolean} True when the element is currently being pressed as
     * the user is holding down the button on the element.
     */
    get focused() {
      return this._focused;
    }

    set focused(value) {
      const old = this._focused;
      if (old === value) {
        return;
      }
      this._focused = value;
      this._notifyFocus(value);
      this._changedControlState();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('focused', old);
      }
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      const old = this._disabled;
      if (old === value) {
        return;
      }
      this._disabled = value;
      this._notifyDisabled(value);
      this._disabledChanged(value);
      this._changedControlState();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('disabled', old);
      }
    }

    constructor() {
      super();
      this._focusBlurHandler = this._focusBlurHandler.bind(this);
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
      this.addEventListener('focus', this._focusBlurHandler);
      this.addEventListener('blur', this._focusBlurHandler);
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
      this.removeEventListener('focus', this._focusBlurHandler);
      this.removeEventListener('blur', this._focusBlurHandler);
    }

    /**
     * A handler for the focus and blur events
     * @param {FocusEvent} e
     */
    _focusBlurHandler(e) {
      if (this.disabled) {
        if (this.focused) {
          this.focused = false;
          this.blur();
        }
        return;
      }
      this.focused = e.type === 'focus';
    }

    /**
     * Updates aria attribute for disabled state.
     * @param {boolean} disabled Current state of disabled.
     */
    _disabledChanged(disabled) {
      this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      this.style.pointerEvents = disabled ? 'none' : '';
      if (disabled) {
        // Read the `tabindex` attribute instead of the `tabIndex` property.
        // The property returns `-1` if there is no `tabindex` attribute.
        // This distinction is important when restoring the value because
        // leaving `-1` hides shadow root children from the tab order.
        this._oldTabIndex = this.getAttribute('tabindex');
        this.focused = false;
        this.setAttribute('tabindex', '-1');
        this.blur();
      } else if (this._oldTabIndex !== undefined) {
        if (this._oldTabIndex === null) {
          this.removeAttribute('tabindex');
        } else {
          this.setAttribute('tabindex', this._oldTabIndex);
        }
      }
    }

    /**
     * Calls `_controlStateChanged()` method if it is defined in the
     * prototype chain.
     */
    _changedControlState() {
      // _controlStateChanged is abstract, follow-on mixins may implement it
      // @ts-ignore
      if (this._controlStateChanged) {
        // @ts-ignore
        this._controlStateChanged();
      }
    }

    _notifyFocus(value) {
      // this is the legacy event
      this.dispatchEvent(
        new CustomEvent('focused-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
      // this is the correct event
      this.dispatchEvent(
        new CustomEvent('focusedchange', {
          composed: true,
          detail: {
            value,
          },
        })
      );
    }

    _notifyDisabled(value) {
      // this is the legacy event
      this.dispatchEvent(
        new CustomEvent('disabled-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
      // this is the correct event
      this.dispatchEvent(
        new CustomEvent('disabledchange', {
          composed: true,
          detail: {
            value,
          },
        })
      );
    }
  }
  return ControlStateMixinImpl;
};

/**
 * Use `ControlStateMixin` to implement an element that can be disabled or focused.
 *
 * @mixin
 */
export const ControlStateMixin = dedupeMixin(mxFunction);

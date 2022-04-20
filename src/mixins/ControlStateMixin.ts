/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Use `ControlStateMixin` to implement an element that can be disabled or focused.
 *
 * @mixin
 * 
 * @attr {boolean} focused
 * @prop {boolean | undefined} focused
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 */
export interface ControlStateMixinInterface {
  /**
   * If true, the element currently has focus.
   * @attribute
   */
  focused?: boolean;

  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attribute
   */
  disabled?: boolean;

  _focused?: boolean;

  _disabled?: boolean;

  _oldTabIndex?: string | null;

  /**
   * Calls `_controlStateChanged()` method if it is defined in the
   * prototype chain.
   */
  _changedControlState(): void;

  /**
   * @deprecated Use `_changedControlState()`
   */
  _controlStateChanged(): void;

  /**
   * Updates aria attribute for disabled state.
   * @param disabled Current state of disabled.
   */
  _disabledChanged(disabled?: boolean): void;

  /**
   * A handler for the focus and blur events
   */
  _focusBlurHandler(e: FocusEvent): void;
}

/**
 * Use `ControlStateMixin` to implement an element that can be disabled or focused.
 *
 * @mixin
 * 
 * @attr {boolean} focused
 * @prop {boolean | undefined} focused
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 */
export function ControlStateMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<ControlStateMixinInterface> & T {
  class MyMixinClass extends superClass {
    _focused?: boolean;

    _disabled?: boolean;

    _oldTabIndex?: string | null;

    /**
     * If true, the element currently has focus.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get focused(): boolean | undefined {
      return this._focused || false;
    }

    set focused(value: boolean | undefined) {
      const old = this._focused;
      if (old === value) {
        return;
      }
      this._focused = value;
      this._notifyFocus(!!value);
      this._changedControlState();
      if (this.requestUpdate) {
        this.requestUpdate('focused', old);
      }
    }

    /**
     * If true, the button is a toggle and is currently in the active state.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get disabled(): boolean | undefined {
      return this._disabled || false;
    }

    set disabled(value: boolean | undefined) {
      const old = this._disabled;
      if (old === value) {
        return;
      }
      this._disabled = value;
      this._notifyDisabled(!!value);
      this._disabledChanged(value);
      this._changedControlState();
      if (this.requestUpdate) {
        this.requestUpdate('disabled', old);
      }
    }

    constructor(...args: any[]) {
      super(...args);
      this._focusBlurHandler = this._focusBlurHandler.bind(this);
    }

    /**
     * Registers hover listeners
     */
    connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('focus', this._focusBlurHandler);
      this.addEventListener('blur', this._focusBlurHandler);
    }

    /**
     * Removes hover listeners
     */
    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener('focus', this._focusBlurHandler);
      this.removeEventListener('blur', this._focusBlurHandler);
    }

    /**
     * A handler for the focus and blur events
     */
    _focusBlurHandler(e: FocusEvent): void {
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
     * @param disabled Current state of disabled.
     */
    _disabledChanged(disabled?: boolean): void {
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
    _changedControlState(): void {
      this._controlStateChanged();
    }

    _controlStateChanged(): void {
      // 
    }

    _notifyFocus(value: boolean): void {
      this.dispatchEvent(new CustomEvent('focusedchange', { detail: { value, } }));
    }

    _notifyDisabled(value: boolean): void {
      this.dispatchEvent(new CustomEvent('disabledchange', { detail: { value } }));
    }
  }
  return MyMixinClass as Constructor<ControlStateMixinInterface> & T;
}

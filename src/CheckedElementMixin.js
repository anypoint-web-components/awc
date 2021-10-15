/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/

import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { ValidatableMixin } from './ValidatableMixin.js';

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class CheckedElementMixinImpl extends ValidatableMixin(base) {
    static get properties() {
      return {
        /**
         * Gets or sets the state, `true` is checked and `false` is unchecked.
         * @attribute
         */
        checked: { type: Boolean, reflect: true },
        /**
         * If true, the button toggles the active state with each click or press
         * of the space bar.
         * @attribute
         */
        toggles: { type: Boolean },
        /**
         * The name of this form element.
         * @attribute
         */
        name: { type: String },
        /**
         * The value of this form control
         * @attribute
         */
        value: { type: String },
        /**
         * Set to true to mark the input as required. If used in a form, a
         * custom element that uses this mixin should also use
         * AnypointValidatableMixin and define a custom validation method.
         * Otherwise, a `required` element will always be considered valid.
         * It's also strongly recommended to provide a visual style for the element
         * when its value is invalid.
         * @attribute
         */
        required: { type: Boolean },
        /**
         * Disabled state of the control
         * @attribute
         */
        disabled: { type: Boolean, reflect: true },
      };
    }

    get required() {
      return this._required || false;
    }

    set required(value) {
      const old = this._required;
      if (old === value) {
        return;
      }
      this._required = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('required', old);
      }
      this._requiredChanged(value);
    }

    get value() {
      return this._value || false;
    }

    set value(value) {
      const old = this._value;
      if (old === value) {
        return;
      }
      this._value = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('value', old);
      }
      this._valueChanged(value);
    }

    get checked() {
      return this._checked || false;
    }

    set checked(value) {
      const old = this._checked;
      if (old === value) {
        return;
      }
      this._checked = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('checked', old);
      }
      this._checkedChanged(value);
    }

    /**
     * @returns {EventListener} Previously registered event listener or null
     */
    get oncheckedchange() {
      return this._oncheckedchange || null;
    }

    /**
     * @param {EventListener} value An event listener for the `change` event or null to unregister
     */
    set oncheckedchange(value) {
      const old = this._oncheckedchange;
      if (old === value) {
        return;
      }
      if (old) {
        this.removeEventListener('checkedchange', old);
      }
      if (typeof value !== 'function') {
        this._oncheckedchange = null;
      } else {
        this._oncheckedchange = value;
        this.addEventListener('checkedchange', value);
      }
    }

    constructor() {
      super();
      this.value = 'on';
      this.disabled = false;
    }

    /**
     * @return {boolean} false if the element is required and not checked, and true
     * otherwise.
     */
    _getValidity() {
      return this.disabled || !this.required || this.checked;
    }

    /**
     * Updates the `aria-required` label when `required` is changed.
     * @param {boolean} required
     */
    _requiredChanged(required) {
      if (required) {
        this.setAttribute('aria-required', 'true');
      } else {
        this.removeAttribute('aria-required');
      }
    }

    /**
     * Fire `iron-changed`for compatibility with iron elements, `change` event
     * for consistency with HTML elements, and `checked-changed` for Polymer.
     * @param {boolean} value
     */
    _checkedChanged(value) {
      this.active = value;
      // this event to be moved to a specific implementation to notify on user interaction.
      // this.dispatchEvent(new CustomEvent('change'));
      this.dispatchEvent(new CustomEvent('checkedchange'));
      this.dispatchEvent(new CustomEvent('iron-change'));
      this.dispatchEvent(
        new CustomEvent('checked-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
    }

    /**
     * Reset value to 'on' if it is set to `undefined`.
     * @param {*} value
     */
    _valueChanged(value) {
      if (value === undefined || value === null) {
        this.value = 'on';
      }
    }
  }
  return CheckedElementMixinImpl;
};

/**
 * Use `CheckedElementMixin` to implement an element that can be pressed and active when toggles.
 *
 * @mixin
 */
export const CheckedElementMixin = dedupeMixin(mxFunction);

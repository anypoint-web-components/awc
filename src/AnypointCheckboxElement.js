import { LitElement, html } from 'lit-element';
import checkboxStyles from './styles/Checkbox.js';
import { CheckedElementMixin } from './mixins/CheckedElementMixin.js';
import { ButtonStateMixin } from './mixins/ButtonStateMixin.js';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-checkbox`
 * Anypoint styled checkbox
 *
 * `<anypoint-checkbox>` is a button that can be either checked or unchecked.
 * User can tap the checkbox to check or uncheck it.  Usually you use checkboxes
 * to allow user to select multiple options from a set.
 * Avoid using a single checkbox as an option selector and use toggle button instead.
 */
export default class AnypointCheckboxElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(LitElement))) {
  get styles() {
    return checkboxStyles;
  }

  render() {
    const { checked, invalid, indeterminate } = this;
    return html`<style>${this.styles}</style>
      <div class="checkboxContainer">
        <div class="checkbox ${this._computeCheckboxClass(checked, invalid)}">
          <div class="checkmark ${this._computeCheckmarkClass(checked, indeterminate)}"></div>
        </div>
      </div>
      <label class="checkboxLabel"><slot></slot></label>`;
  }

  static get formAssociated() {
    return true;
  }

  get form() {
    return this._internals && this._internals.form;
  }

  /**
   * @returns {EventListener} Previously registered event listener or null
   */
  get onchange() {
    return this._onchange || null;
  }

  /**
   * @param {EventListener} value An event listener for the `change` event or null to unregister
   */
  set onchange(value) {
    const old = this._onchange;
    if (old === value) {
      return;
    }
    if (old) {
      this.removeEventListener('change', old);
    }
    if (typeof value !== 'function') {
      this._onchange = null;
    } else {
      this._onchange = value;
      this.addEventListener('change', value);
    }
  }

  static get properties() {
    return {
      ariaActiveAttribute: { type: String },

      indeterminate: { type: Boolean, reflect: true },

      formDisabled: { type: Boolean, reflect: true }
    };
  }

  constructor() {
    super();
    this.ariaActiveAttribute = 'aria-checked';
    this.checked = false;
    /* to work with iron-form */
    this._hasIronCheckedElementBehavior = true;
    // @ts-ignore
    if (this.attachInternals) {
      // @ts-ignore
      this._internals = this.attachInternals();
    }
  }

  connectedCallback() {
    // button state mixin sets role to checkbox
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'checkbox');
    }
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    if (!this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', 'false');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  _computeCheckboxClass(checked, invalid) {
    let className = '';
    if (checked) {
      className += 'checked ';
    }
    if (invalid) {
      className += 'invalid';
    }
    return className.trim();
  }

  _computeCheckmarkClass(checked, indeterminate) {
    if (!checked && indeterminate) {
      return '';
    }
    return checked ? '' : 'hidden';
  }

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged() {
    if (this.disabled || this.indeterminate) {
      return;
    }
    this.checked = this.active;
  }

  _clickHandler() {
    if (this.disabled) {
      return;
    }
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.active = !this.active;
    this.dispatchEvent(new Event('change'));
  }

  _checkedChanged(value) {
    super._checkedChanged(value);
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.setAttribute('aria-checked', value ? 'true' : 'false');
    if (this._internals && this._internals.setFormValue) {
      this._internals.setFormValue(value ? this.value : '');

      if (!this.matches(':disabled') && this.hasAttribute('required') && !value) {
        this._internals.setValidity({
          customError: true
        }, 'This field is required.');
      } else {
        this._internals.setValidity({});
      }
    } else {
      this.validate(this.checked);
    }
  }

  _spaceKeyDownHandler(e) {
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    super._spaceKeyDownHandler(e);
  }

  checkValidity() {
    if (this._internals && this._internals.checkValidity) {
      return this._internals.checkValidity();
    }
    return this.required ? this.checked : true;
  }

  formDisabledCallback(disabled) {
    this.formDisabled = disabled;
  }

  formResetCallback() {
    this.checked = false;
    this._internals.setFormValue('');
  }

  formStateRestoreCallback(state) {
    this._internals.setFormValue(state);
    this.checked = !!state;
  }
}

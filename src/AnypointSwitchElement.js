/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit-element';
import { CheckedElementMixin } from './mixins/CheckedElementMixin.js';
import { ButtonStateMixin } from './mixins/ButtonStateMixin.js';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';
import { onIcon, offIcon } from './AnypointSwitchIcons.js';
import styles from './styles/Switch.js';


/**
 * `anypoint-switch`
 */
export default class AnypointSwitchElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(LitElement))) {
  get styles() {
    return styles;
  }

  static get properties() {
    return {
      formDisabled: { type: Boolean, reflect: true },
      /**
       * Enables Anypoint theme.
       */
      anypoint: { type: Boolean, reflect: true }
    };
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

  constructor() {
    super();
    this.ariaActiveAttribute = 'aria-checked';
    this.checked = false;
    this.anypoint = false;
    this.toggles = true;
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

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged() {
    if (this.disabled) {
      return;
    }
    this.checked = this.active;
  }

  /**
   * @param {MouseEvent} e 
   */
  _clickHandler(e) {
    if (this.disabled) {
      return;
    }
    super._clickHandler(e);
    this.dispatchEvent(new Event('change'));
  }

  /**
   * @param {boolean} value
   */
  _checkedChanged(value) {
    super._checkedChanged(value);
    this.setAttribute('aria-checked', value ? 'true' : 'false');
    if (this._internals) {
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

  checkValidity() {
    if (this._internals) {
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

  _disabledChanged(disabled) {
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('tabindex', disabled ? '-1' : '0');
  }

  _mdContent() {
    return html`<div class="track"></div>
    <div class="toggle-container">
      <div class="button"></div>
    </div>`;
  }

  _compatibleContent() {
    const { checked } = this;
    const icon = checked ? onIcon : offIcon;
    return html`
    <div class="anypoint container">
      <div class="tracker">
        <div class="toggle">
          <span class="icon">${icon}</span>
        </div>
      </div>
    </div>`;
  }

  render() {
    const { anypoint } = this;
    return html`
    <style>${this.styles}</style>
    ${anypoint ?
      this._compatibleContent() :
      this._mdContent()}
    <div class="label"><slot></slot></div>
    `;
  }
}

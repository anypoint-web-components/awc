import { CSSResult, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';
import checkboxStyles from '../styles/Checkbox.js';
import { CheckedElementMixin } from '../mixins/CheckedElementMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-checkbox`
 * Anypoint styled checkbox
 *
 * `<anypoint-checkbox>` is a button that can be either checked or unchecked.
 * User can tap the checkbox to check or uncheck it.  Usually you use checkboxes
 * to allow user to select multiple options from a set.
 * Avoid using a single checkbox as an option selector and use toggle button instead.
 * 
 * @attr {boolean} focused
 * @prop {boolean | undefined} focused
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @attr {boolean} toggles
 * @prop {boolean | undefined} toggles
 * 
 * @attr {boolean} active
 * @prop {boolean | undefined} active
 * 
 * @attr {string} ariaActiveAttribute
 * @prop {string | undefined} ariaActiveAttribute
 * 
 * @prop {readonly boolean | undefined} pressed
 * @prop {readonly boolean | undefined} pointerDown
 * @prop {readonly boolean | undefined} receivedFocusFromKeyboard
 * 
 * @attr {boolean} toggles
 * @prop {boolean | undefined} toggles
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @attr {boolean} required
 * @prop {boolean | undefined} required
 * 
 * @attr {boolean} checked
 * @prop {boolean | undefined} checked
 * 
 * @attr {string} name
 * @prop {string | undefined} name
 * 
 * @attr {string} value
 * @prop {string | undefined} value
 * 
 * @fires invalidchange
 * @fires validationstateschange
 *
 * @attr {string} validator
 * @prop {string | undefined} validator
 *
 * @attr {boolean} invalid
 * @prop {boolean | undefined} invalid
 */
export default class AnypointCheckboxElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(AnypointElement))) {
  static get styles(): CSSResult {
    return checkboxStyles;
  }

  render(): TemplateResult {
    const { checked, invalid, indeterminate } = this;
    return html`
      <div class="checkboxContainer">
        <div class="checkbox ${this._computeCheckboxClass(checked, invalid)}">
          <div class="checkmark ${this._computeCheckmarkClass(checked, indeterminate)}"></div>
        </div>
      </div>
      <label class="checkboxLabel"><slot></slot></label>`;
  }

  static get formAssociated(): boolean {
    return true;
  }

  private _internals?: ElementInternals;

  get form(): HTMLFormElement | undefined {
    // @ts-ignore
    return this._internals && this._internals.form;
  }

  /**
   * @returns Previously registered event listener or null
   */
  get onchange(): EventListener {
    return getListener('change', this)!;
  }

  /**
   * @param value An event listener for the `change` event or null to unregister
   */
  set onchange(value: EventListener) {
    addListener('change', value, this);
  }

  @property()
  ariaActiveAttribute = 'aria-checked';

  @property({ type: Boolean, reflect: true })
  indeterminate?: boolean;

  @property({ type: Boolean, reflect: true })
  formDisabled?: boolean;

  constructor() {
    super();
    this.checked = false;
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback(): void {
    // button state mixin sets role to checkbox
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'checkbox');
    }
    super.connectedCallback();
    if (!this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', 'false');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  _computeCheckboxClass(checked?: boolean, invalid?: boolean): string {
    let className = '';
    if (checked) {
      className += 'checked ';
    }
    if (invalid) {
      className += 'invalid';
    }
    return className.trim();
  }

  _computeCheckmarkClass(checked?: boolean, indeterminate?: boolean): string {
    if (!checked && indeterminate) {
      return '';
    }
    return checked ? '' : 'hidden';
  }

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged(): void {
    if (this.disabled || this.indeterminate) {
      return;
    }
    this.checked = !!this.active;
  }

  _clickHandler(): void {
    if (this.disabled) {
      return;
    }
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.active = !this.active;
    this.dispatchEvent(new Event('change'));
  }

  _checkedChanged(value: boolean): void {
    super._checkedChanged(value);
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.setAttribute('aria-checked', value ? 'true' : 'false');
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue(value ? this.value : '');

      if (!this.matches(':disabled') && this.hasAttribute('required') && !value) {
        // @ts-ignore
        this._internals.setValidity({
          customError: true
        }, 'This field is required.');
      } else {
        // @ts-ignore
        this._internals.setValidity({});
      }
    } else {
      this.validate(this.checked);
    }
  }

  _spaceKeyDownHandler(e: KeyboardEvent): void {
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    super._spaceKeyDownHandler(e);
  }

  checkValidity(): boolean {
    // @ts-ignore
    if (this._internals && this._internals.checkValidity) {
      // @ts-ignore
      return this._internals.checkValidity();
    }
    return this.required ? this.checked : true;
  }

  formDisabledCallback(disabled?: boolean): void {
    this.formDisabled = disabled;
  }

  formResetCallback(): void {
    this.checked = false;
    // @ts-ignore
    this._internals?.setFormValue('');
  }

  formStateRestoreCallback(formState?: string): void {
    // @ts-ignore
    this._internals?.setFormValue(formState);
    this.checked = !!formState;
  }
}

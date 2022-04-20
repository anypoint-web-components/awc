/* eslint-disable class-methods-use-this */
import { html, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';
import { CheckedElementMixin } from '../mixins/CheckedElementMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { onIcon, offIcon } from '../resources/AnypointSwitchIcons.js';
import styles from '../styles/Switch.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/**
 * `anypoint-switch`
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
export default class AnypointSwitchElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(AnypointElement))) {
  static get styles(): CSSResult {
    return styles;
  }

  @property({ type: Boolean, reflect: true })
  formDisabled?: boolean;

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

  constructor() {
    super();
    this.toggles = true;
    this.ariaActiveAttribute = 'aria-checked';
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

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged(): void {
    if (this.disabled) {
      return;
    }
    this.checked = !!this.active;
  }

  _clickHandler(e: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    super._clickHandler(e);
    this.dispatchEvent(new Event('change'));
  }

  _checkedChanged(value?: boolean): void {
    super._checkedChanged(value);
    this.setAttribute('aria-checked', value ? 'true' : 'false');
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue(value ? this.value : '');

      if (!this.matches(':disabled') && this.hasAttribute('required') && !value) {
        // @ts-ignore
        this._internals.setValidity({ customError: true }, 'This field is required.');
      } else {
        // @ts-ignore
        this._internals.setValidity({});
      }
    } else {
      this.validate(this.checked);
    }
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
    this._internals.setFormValue('');
  }

  formStateRestoreCallback(state: string): void {
    // @ts-ignore
    this._internals.setFormValue(state);
    this.checked = !!state;
  }

  _disabledChanged(disabled?: boolean): void {
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.setAttribute('tabindex', disabled ? '-1' : '0');
  }

  _mdContent(): TemplateResult {
    return html`<div class="track"></div>
    <div class="toggle-container">
      <div class="button"></div>
    </div>`;
  }

  _compatibleContent(): TemplateResult {
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

  render(): TemplateResult {
    const { anypoint } = this;
    return html`
    ${anypoint
      ? this._compatibleContent()
      : this._mdContent()}
    <div class="label"><slot></slot></div>
    `;
  }
}

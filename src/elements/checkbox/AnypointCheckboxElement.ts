import { CSSResult, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import checkboxStyles from '../../styles/Checkbox.js';
import { addListener, getListener } from '../../lib/ElementEventsRegistry.js';
import CheckedElement from './CheckedElement.js';

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
 * @fires change
 * @slot - The label slot
 */
export default class AnypointCheckboxElement extends CheckedElement {
  static get styles(): CSSResult {
    return checkboxStyles;
  }

  render(): TemplateResult {
    const { checked, invalid = false, indeterminate = false } = this;
    const box = {
      checkbox: true,
      checked,
      invalid,
    };
    const mark = {
      checkmark: true,
      hidden: !checked && !indeterminate,
    };
    return html`
      <div class="checkboxContainer">
        <div class="${classMap(box)}">
          <div class="${classMap(mark)}"></div>
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

  /**
   * @attr
   */
  @property({ type: Boolean, reflect: true }) indeterminate?: boolean;

  /**
   * @attr
   */
  @property({ type: Boolean, reflect: true }) formDisabled?: boolean;

  constructor() {
    super();
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback(): void {
    // button base sets the role to button
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
    this.checked = !this.checked;
    this.dispatchEvent(new Event('change'));
  }

  override _checkedChanged(): void {
    super._checkedChanged();
    const { checked } = this;
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    this.setAttribute('aria-checked', checked ? 'true' : 'false');
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue(checked ? this.value : '');

      if (!this.matches(':disabled') && this.hasAttribute('required') && !checked) {
        // @ts-ignore
        this._internals.setValidity({
          customError: true
        }, 'This field is required.');
      } else {
        // @ts-ignore
        this._internals.setValidity({});
      }
    } else {
      this.checkValidity();
    }
  }

  override _spaceKeyDownHandler(e: KeyboardEvent): void {
    if (this.indeterminate) {
      this.indeterminate = false;
    }
    super._spaceKeyDownHandler(e);
  }

  override _getValidity(): boolean {
    let result = super._getValidity();
    // @ts-ignore
    if (result && this._internals && this._internals.checkValidity) {
      // @ts-ignore
      result = this._internals.checkValidity();
    }
    return result;
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

import { LitElement, CSSResult, TemplateResult, html } from 'lit';
import { CheckedElementMixin } from '../mixins/CheckedElementMixin.js';
import '../colors.js';
import radioStyles from '../styles/RadioButton.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-radio-button`
 *
 * Anypoint styled radio button.
 *
 * ## Usage
 *
 * Install element:
 *
 * ```
 * npm i --save @anypoint-components/anypoint-radio-button
 * ```
 *
 * Import into your app:
 *
 * ```html
 * <script type="module" src="node_modules/@anypoint-components/anypoint-radio-button.js"></script>
 * ```
 *
 * Or into another component
 *
 * ```javascript
 * import '@anypoint-components/anypoint-radio-button.js';
 * ```
 *
 * Use it:
 *
 * ```html
 * <paper-radio-group selectable="anypoint-radio-button">
 *  <anypoint-radio-button name="a">Apple</anypoint-radio-button>
 *  <anypoint-radio-button name="b">Banana</anypoint-radio-button>
 *  <anypoint-radio-button name="c">Orange</anypoint-radio-button>
 * </paper-radio-group>
 * ```
 */
export default class AnypointRadioButtonElement extends CheckedElementMixin(LitElement) {
  static get styles(): CSSResult {
    return radioStyles;
  }

  render(): TemplateResult {
    return html`
      <div class="radio-container">
        <div class="state-container">
          <div id="offRadio"></div>
          <div id="onRadio"></div>
        </div>
      </div>
      <label class="radioLabel"><slot></slot></label>`;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'radio');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (this.checked === undefined) {
      this.checked = false;
    } else {
      this._updateCheckedAria(this.checked);
    }
    this.addEventListener('keydown', this._keyDownHandler);
    this.addEventListener('click', this._clickHandler);
    this._disabledChanged(this.disabled);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._keyDownHandler);
    this.removeEventListener('click', this._clickHandler);
  }

  /**
   * Dispatches the `checkedchange` event
   */
  _checkedChanged(value: boolean): void {
    this._updateCheckedAria(value);
    super._checkedChanged(value);
  }

  _updateCheckedAria(checked = false): void {
    this.setAttribute('aria-checked', String(checked));
  }

  /**
   * Handler for keyboard down event
   */
  _keyDownHandler(e: KeyboardEvent): void {
    if (['Enter', 'NumpadEnter', 'Space'].includes(e.code)) {
      e.preventDefault();
      this._clickHandler();
    }
  }

  /**
   * Handler for pointer click event
   */
  _clickHandler(): void {
    if (this.disabled) {
      return;
    }
    if (this.checked) {
      return;
    }
    this.checked = true;
    this.dispatchEvent(new Event('change'));
  }

  protected _oldTabIndex?: string | null;

  /**
   * Handles `disable` property state change and manages `aria-disabled`
   * and `tabindex` attributes.
   */
  _disabledChanged(disabled?: boolean): void {
    super._disabledChanged(disabled);
    if (this.parentElement === null) {
      return;
    }
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    if (disabled) {
      // Read the `tabindex` attribute instead of the `tabIndex` property.
      // The property returns `-1` if there is no `tabindex` attribute.
      // This distinction is important when restoring the value because
      // leaving `-1` hides shadow root children from the tab order.
      this._oldTabIndex = this.getAttribute('tabindex');
      
      // why is it here? This has no use in the radio logic.
      // this.focused = false;

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
}

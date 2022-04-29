import { CSSResult, TemplateResult, html } from 'lit';
import '../../colors.js';
import radioStyles from '../../styles/RadioButton.js';
import CheckedElement from '../checkbox/CheckedElement.js';

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
 * 
 * @fires change
 * @slot - The label to render
 */
export default class AnypointRadioButtonElement extends CheckedElement {
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
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'radio');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    super.connectedCallback();
  }

  protected _spaceKeyDownHandler(e: KeyboardEvent): void {
    super._spaceKeyDownHandler(e);
    this._clickHandler();
  }

  /**
   * Handler for pointer click event
   */
  override _clickHandler(): void {
    if (this.disabled) {
      return;
    }
    if (this.checked) {
      return;
    }
    this.checked = true;
    this.dispatchEvent(new Event('change'));
  }
}

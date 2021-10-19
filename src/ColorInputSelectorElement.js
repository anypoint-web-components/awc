import { html, LitElement } from 'lit-element';
import elementStyles from './styles/ColorInputSelectorElement.styles.js';
import '../anypoint-checkbox.js';
import '../color-selector.js';

/** @typedef {import('lit-element').TemplateResult} TemplateResult */
/** @typedef {import('../').AnypointCheckboxElement} AnypointCheckboxElement */
/** @typedef {import('./ColorSelectorElement').default} ColorSelectorElement */

export const checkedHandler = Symbol('checkedHandler');
export const colorHandler = Symbol('colorHandler');
export const toggleHandler = Symbol('toggleHandler');
export const keydownHandler = Symbol('keydownHandler');
export const notify = Symbol('notify');
export const checkboxTemplate = Symbol('checkboxTemplate');
export const selectorTemplate = Symbol('selectorTemplate');
export const labelTemplate = Symbol('labelTemplate');

export default class ColorInputSelectorElement extends LitElement {
  static get styles() {
    return elementStyles;
  }

  static get properties() {
    return {
      /**
       * Selected color
       */
      value: { type: String, reflect: true },
      /**
       * Whether the color is enabled or not
       */
      enabled: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    /**
     * @type {string}
     */
    this.value = undefined;
    /**
     * @type {boolean}
     */
    this.enabled = undefined;
  }

  [notify]() {
    this.dispatchEvent(new CustomEvent('change'));
  }

  /**
   * @param {CustomEvent} e
   */
  [checkedHandler](e) {
    const input = /** @type AnypointCheckboxElement */ (e.target);
    if (this.enabled === input.checked) {
      return;
    }
    this.enabled = input.checked;
    this[notify]();
  }

  /**
   * A handler for the color change. Updates color property value.
   * @param {CustomEvent} e
   */
  [colorHandler](e) {
    const picker = /** @type ColorSelectorElement */ (e.target);
    this.value = picker.value;
    if (!this.enabled) {
      this.enabled = true;
    }
    this.requestUpdate();
    this[notify]();
  }

  /**
   * A handler for the label click. Toggles enabled property.
   */
  [toggleHandler]() {
    this.enabled = !this.enabled;
    this.requestUpdate();
    this[notify]();
  }

  /**
   * @param {KeyboardEvent} e 
   */
  [keydownHandler](e) {
    if (['Enter', 'Space', 'NumEnter'].includes(e.code)) {
      this[toggleHandler]();
    }
  }

  render() {
    return html`
    ${this[checkboxTemplate]()}
    ${this[selectorTemplate]()}
    ${this[labelTemplate]()}
    `;
  }

  /**
   * @returns {TemplateResult} Template for the checkbox element
   */
  [checkboxTemplate]() {
    const { enabled } = this;
    return html`
    <anypoint-checkbox
      aria-label="Enable or disable this color"
      ?checked="${enabled}"
      aria-describedby="bgColorLabel"
      @change="${this[checkedHandler]}"
    ></anypoint-checkbox>
    `;
  }

  /**
   * @returns {TemplateResult} Template for the color selector element
   */
  [selectorTemplate]() {
    const { value } = this;
    return html`
    <color-selector
      class="color-box"
      .value="${value}"
      @change="${this[colorHandler]}"
    ></color-selector>
    `;
  }

  /**
   * @returns {TemplateResult} Template for the label element
   */
  [labelTemplate]() {
    return html`
    <span
      class="checkbox-label"
      id="bgColorLabel"
      @click="${this[toggleHandler]}"
      @keydown="${this[keydownHandler]}"
    ><slot></slot></span>
    `;
  }
}

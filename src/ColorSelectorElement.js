import { html, LitElement } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';
import elementStyles from './styles/ColorSelectorElement.styles.js';

export const colorValue = Symbol('colorValue');
export const colorTriggerHandler = Symbol('colorTriggerHandler');
export const inputHandler = Symbol('inputHandler');

export default class ColorSelectorElement extends LitElement {
  static get styles() {
    return elementStyles;
  }

  get [colorValue]() {
    return this.value || '#ffffff';
  }

  static get properties() {
    return {
      /**
       * Selected color
       */
      value: { type: String, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = undefined;

    this[colorTriggerHandler] = this[colorTriggerHandler].bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this[colorTriggerHandler]);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this[colorTriggerHandler]);
  }

  /**
   * Triggers the native color picker.
   */
  [colorTriggerHandler]() {
    const input = /** @type HTMLInputElement */ (this.shadowRoot.querySelector('input'));
    input.click();
  }

  /**
   * @param {Event} e
   */
  [inputHandler](e) {
    this.value = /** @type HTMLInputElement */ (e.target).value;
    this.dispatchEvent(new CustomEvent('change'));
  }

  render() {
    const color = this[colorValue];
    const visStyles = {
      backgroundColor: color,
    };
    return html`
    <input type="color" class="picker" .value="${color}" @change="${this[inputHandler]}" aria-label="Select a color" />
    <div class="box" style="${styleMap(visStyles)}"></div>
    `;
  }
}

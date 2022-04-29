import { html, LitElement, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import elementStyles from '../styles/ColorSelectorElement.styles.js';

export const colorValue = Symbol('colorValue');
export const colorTriggerHandler = Symbol('colorTriggerHandler');
export const inputHandler = Symbol('inputHandler');

/**
 * @fires change
 */
export default class ColorSelectorElement extends LitElement {
  static get styles(): CSSResult {
    return elementStyles;
  }

  get [colorValue](): string {
    return this.value || '#ffffff';
  }
  
  /**
   * Selected color
   * @attribute
   */
  @property({ type: String, reflect: true })
  value?: string;
  
  constructor() {
    super();
    this[colorTriggerHandler] = this[colorTriggerHandler].bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this[colorTriggerHandler]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this[colorTriggerHandler]);
  }

  /**
   * Triggers the native color picker.
   */
  [colorTriggerHandler](): void {
    const input = this.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.click();
  }

  [inputHandler](e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new Event('change'));
  }

  render(): TemplateResult {
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

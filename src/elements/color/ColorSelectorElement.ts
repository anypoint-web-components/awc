import { html, LitElement, CSSResult, TemplateResult, css } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

export const colorValue = Symbol('colorValue');
export const colorTriggerHandler = Symbol('colorTriggerHandler');
export const inputHandler = Symbol('inputHandler');

/**
 * @fires change
 */
export default class ColorSelectorElement extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      cursor: pointer;
      position: relative;
    }
    
    .picker,
    .box {
      width: var(--color-selector-width, 34px);
      height: var(--color-selector-height, 24px);
    }
    
    .picker {
      opacity: 0;
      position: absolute;
      cursor: pointer;
    }
    
    .box {
      border: 1px solid var(--color-selector-border-color, #E5E5E5);
    }
    `;
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

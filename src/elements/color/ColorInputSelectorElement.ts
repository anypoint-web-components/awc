import { html, LitElement, TemplateResult, CSSResult, css } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointCheckboxElement from '../checkbox/AnypointCheckboxElement.js';
import ColorSelectorElement from './ColorSelectorElement.js';
import '../../define/anypoint-checkbox.js';
import '../../define/color-selector.js';

export const checkedHandler = Symbol('checkedHandler');
export const colorHandler = Symbol('colorHandler');
export const toggleHandler = Symbol('toggleHandler');
export const keydownHandler = Symbol('keydownHandler');
export const notify = Symbol('notify');
export const checkboxTemplate = Symbol('checkboxTemplate');
export const selectorTemplate = Symbol('selectorTemplate');
export const labelTemplate = Symbol('labelTemplate');

/**
 * @fires change
 * @slot - The label to render
 */
export default class ColorInputSelectorElement extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-flex;
      align-items: center;
    }
    
    .type-trigger {
      cursor: pointer;
    }
    
    .color-box {
      margin-right: 8px;
    }
    
    .checkbox-label {
      cursor: pointer;
    }
    `;
  }
  
  /**
   * Selected color
   * @attr
   */
  @property({ type: String, reflect: true })
  value?: string;

  /**
   * Whether the color is enabled or not
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  enabled?: boolean;

  [notify](): void {
    this.dispatchEvent(new Event('change'));
  }

  [checkedHandler](e: CustomEvent): void {
    const input = e.target as AnypointCheckboxElement;
    if (this.enabled === input.checked) {
      return;
    }
    this.enabled = input.checked;
    this[notify]();
  }

  /**
   * A handler for the color change. Updates color property value.
   */
  [colorHandler](e: CustomEvent): void {
    const picker = e.target as ColorSelectorElement;
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
  [toggleHandler](): void {
    this.enabled = !this.enabled;
    this.requestUpdate();
    this[notify]();
  }

  [keydownHandler](e: KeyboardEvent): void {
    if (['Enter', 'Space', 'NumEnter'].includes(e.code)) {
      this[toggleHandler]();
    }
  }

  render(): TemplateResult {
    return html`
    ${this[checkboxTemplate]()}
    ${this[selectorTemplate]()}
    ${this[labelTemplate]()}
    `;
  }

  /**
   * @returns Template for the checkbox element
   */
  [checkboxTemplate](): TemplateResult {
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
   * @returns Template for the color selector element
   */
  [selectorTemplate](): TemplateResult {
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
   * @returns Template for the label element
   */
  [labelTemplate](): TemplateResult {
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

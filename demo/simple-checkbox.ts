import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { CheckedElementMixin } from '../src/mixins/CheckedElementMixin.js';
import '../src/define/anypoint-button.js';

class SimpleCheckbox extends CheckedElementMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
      }

      :host([invalid]) span {
        color: red;
      }

      #labelText {
        display: inline-block;
        width: 100px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
    <input type="checkbox" id="checkbox" @click="${this._onCheckClick}"/>
    <span id="labelText">${this.label}</span>
    <anypoint-button emphasis="high" @click="${this._onClick}">validate</anypoint-button>
    `;
  }

  @property({ type: String })
  label?: string;

  constructor() {
    super();
    this.label = 'Not validated';
  }

  _onCheckClick(e: any): void {
    this.checked = e.target.checked;
  }

  _onClick(): void {
    this.validate(this.value);
    this.label = this.invalid ? 'is invalid' : 'is valid';
  }
}
window.customElements.define('simple-checkbox', SimpleCheckbox);

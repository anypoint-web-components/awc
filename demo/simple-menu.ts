import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { MenuMixin } from '../index.js';

export class SimpleMenu extends MenuMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
      :host > ::slotted(a) {
        display: block;
      }

      :host > ::slotted(.selected) {
        color: white;
        background-color: #2196f3;
      }

      :host > ::slotted([disabled]) {
        pointer-events: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-menu', SimpleMenu);

declare global {
  interface HTMLElementTagNameMap {
    "simple-menu": SimpleMenu;
  }
}

import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { MenubarMixin } from '../src/index.js';

class SimpleMenubar extends MenubarMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
      :host > ::slotted(a) {
        display: inline-block;
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
window.customElements.define('simple-menubar', SimpleMenubar);

declare global {
  interface HTMLElementTagNameMap {
    "simple-menubar": SimpleMenubar;
  }
}

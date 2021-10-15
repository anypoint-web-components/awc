import { LitElement, html, css } from 'lit-element';
import { MenubarMixin } from '../index.js';

class SimpleMenubar extends MenubarMixin(LitElement) {
  static get styles() {
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

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-menubar', SimpleMenubar);

import { LitElement, html, css } from 'lit-element';
import { MenuMixin } from '../index.js';

class SimpleMenu extends MenuMixin(LitElement) {
  static get styles() {
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

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-menu', SimpleMenu);

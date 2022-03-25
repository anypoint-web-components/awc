import Element from './DemoIconElement.js';

window.customElements.define('demo-icon', Element);

declare global {
  interface HTMLElementTagNameMap {
    "demo-icon": Element;
  }
}

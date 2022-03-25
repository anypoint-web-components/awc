import Element from './DemoHelperElement.js';

window.customElements.define('demo-helper', Element);

declare global {
  interface HTMLElementTagNameMap {
    "demo-helper": Element;
  }
}

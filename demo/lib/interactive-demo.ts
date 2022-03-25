import Element from './InteractiveDemoElement.js';

window.customElements.define('interactive-demo', Element);

declare global {
  interface HTMLElementTagNameMap {
    "interactive-demo": Element;
  }
}

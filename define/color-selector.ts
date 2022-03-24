import Element from '../src/elements/ColorSelectorElement.js';

window.customElements.define('color-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "color-selector": Element;
  }
}

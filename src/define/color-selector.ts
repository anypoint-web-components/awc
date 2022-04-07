import Element from '../elements/ColorSelectorElement.js';

window.customElements.define('color-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "color-selector": Element;
  }
}

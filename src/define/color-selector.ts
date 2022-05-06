import Element from '../elements/color/ColorSelectorElement.js';

window.customElements.define('color-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "color-selector": Element;
  }
}

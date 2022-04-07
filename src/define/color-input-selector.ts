import Element from '../elements/ColorInputSelectorElement.js';

window.customElements.define('color-input-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "color-input-selector": Element;
  }
}

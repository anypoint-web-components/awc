import Element from '../src/elements/AnypointSelectorElement.js';

window.customElements.define('anypoint-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-selector": Element;
  }
}

import Element from '../elements/lists/AnypointSelectorElement.js';

window.customElements.define('anypoint-selector', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-selector": Element;
  }
}

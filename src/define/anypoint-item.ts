import Element from '../elements/lists/AnypointItemElement.js';

window.customElements.define('anypoint-item', Element);
declare global {
  interface HTMLElementTagNameMap {
    "anypoint-item": Element;
  }
}

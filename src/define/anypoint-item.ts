import Element from '../elements/AnypointItemElement.js';

window.customElements.define('anypoint-item', Element);
declare global {
  interface HTMLElementTagNameMap {
    "anypoint-item": Element;
  }
}

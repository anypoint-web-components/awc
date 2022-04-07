import Element from '../elements/AnypointIconItemElement.js';

window.customElements.define('anypoint-icon-item', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-icon-item": Element;
  }
}

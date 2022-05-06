import Element from '../elements/lists/AnypointItemBodyElement.js';

window.customElements.define('anypoint-item-body', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-item-body": Element;
  }
}

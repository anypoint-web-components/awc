import Element from '../elements/tabs/AnypointTabElement.js';

window.customElements.define('anypoint-tab', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-tab": Element;
  }
}

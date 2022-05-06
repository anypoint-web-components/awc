import Element from '../elements/tabs/AnypointTabsElement.js';

window.customElements.define('anypoint-tabs', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-tabs": Element;
  }
}

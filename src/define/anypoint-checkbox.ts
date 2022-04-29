import Element from '../elements/checkbox/AnypointCheckboxElement.js';

window.customElements.define('anypoint-checkbox', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-checkbox": Element;
  }
}

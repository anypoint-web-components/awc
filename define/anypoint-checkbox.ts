import Element from '../src/elements/AnypointCheckboxElement.js';

window.customElements.define('anypoint-checkbox', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-checkbox": Element;
  }
}

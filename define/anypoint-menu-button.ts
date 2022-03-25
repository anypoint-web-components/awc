import Element from '../src/elements/AnypointMenuButtonElement.js';

window.customElements.define('anypoint-menu-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-menu-button": Element;
  }
}

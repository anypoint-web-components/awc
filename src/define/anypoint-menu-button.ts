import Element from '../elements/button/AnypointMenuButtonElement.js';

window.customElements.define('anypoint-menu-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-menu-button": Element;
  }
}

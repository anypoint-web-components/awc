import Element from '../elements/button/AnypointIconButtonElement.js';

window.customElements.define('anypoint-icon-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-icon-button": Element;
  }
}

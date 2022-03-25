import Element from '../src/elements/AnypointIconButtonElement.js';

window.customElements.define('anypoint-icon-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-icon-button": Element;
  }
}

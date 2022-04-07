import Element from '../elements/AnypointProgressElement.js';

window.customElements.define('anypoint-progress', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-progress": Element;
  }
}

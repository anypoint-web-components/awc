import Element from '../elements/range/AnypointProgressElement.js';

window.customElements.define('anypoint-progress', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-progress": Element;
  }
}

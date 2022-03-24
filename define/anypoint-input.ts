import Element from '../src/elements/AnypointInputElement.js';

window.customElements.define('anypoint-input', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-input": Element;
  }
}

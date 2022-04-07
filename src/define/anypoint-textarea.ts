import Element from '../elements/AnypointTextareaElement.js';

window.customElements.define('anypoint-textarea', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-textarea": Element;
  }
}

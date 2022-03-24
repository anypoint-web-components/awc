import Element from '../src/elements/AnypointCollapseElement.js';

window.customElements.define('anypoint-collapse', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-collapse": Element;
  }
}

import Element from '../elements/collapse/AnypointCollapseElement.js';

window.customElements.define('anypoint-collapse', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-collapse": Element;
  }
}

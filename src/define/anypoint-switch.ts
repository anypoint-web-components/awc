import Element from '../elements/AnypointSwitchElement.js';

window.customElements.define('anypoint-switch', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-switch": Element;
  }
}

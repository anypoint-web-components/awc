import Element from '../elements/checkbox/AnypointSwitchElement.js';

window.customElements.define('anypoint-switch', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-switch": Element;
  }
}

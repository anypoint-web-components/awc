import Element from '../src/elements/AnypointDropdownMenuElement.js';

window.customElements.define('anypoint-dropdown-menu', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-dropdown-menu": Element;
  }
}

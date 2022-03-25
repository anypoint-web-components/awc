import Element from '../src/elements/AnypointDropdownElement.js';

window.customElements.define('anypoint-dropdown', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-dropdown': Element;
  }
}

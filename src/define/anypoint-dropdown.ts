import Element from '../elements/AnypointDropdownElement.js';

window.customElements.define('anypoint-dropdown', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-dropdown': Element;
  }
}

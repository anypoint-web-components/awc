import Element from '../elements/drop-down/AnypointDropdownElement.js';

window.customElements.define('anypoint-dropdown', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-dropdown': Element;
  }
}

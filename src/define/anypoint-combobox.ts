import Element from '../elements/AnypointComboboxElement.js';

window.customElements.define('anypoint-combobox', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-combobox': Element;
  }
}

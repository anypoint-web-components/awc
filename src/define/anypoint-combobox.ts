import Element from '../elements/input/AnypointComboboxElement.js';

window.customElements.define('anypoint-combobox', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-combobox': Element;
  }
}

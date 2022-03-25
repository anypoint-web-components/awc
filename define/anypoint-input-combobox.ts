import Element from '../src/elements/AnypointInputComboboxElement.js';

window.customElements.define('anypoint-input-combobox', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-input-combobox": Element;
  }
}

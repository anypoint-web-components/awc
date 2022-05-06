import Element from '../elements/input/AnypointInputComboboxElement.js';

window.customElements.define('anypoint-input-combobox', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-input-combobox": Element;
  }
}

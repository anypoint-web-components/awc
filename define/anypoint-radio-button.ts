import Element from '../src/elements/AnypointRadioButtonElement.js';

window.customElements.define('anypoint-radio-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-radio-button": Element;
  }
}

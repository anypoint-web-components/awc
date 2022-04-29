import Element from '../elements/button/AnypointRadioButtonElement.js';

window.customElements.define('anypoint-radio-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-radio-button": Element;
  }
}

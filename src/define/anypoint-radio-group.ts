import Element from '../elements/button/AnypointRadioGroupElement.js';

window.customElements.define('anypoint-radio-group', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-radio-group": Element;
  }
}

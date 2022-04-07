import Element from '../elements/AnypointRadioGroupElement.js';

window.customElements.define('anypoint-radio-group', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-radio-group": Element;
  }
}

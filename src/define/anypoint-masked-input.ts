import Element from '../elements/AnypointMaskedInput.js';

window.customElements.define('anypoint-masked-input', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-masked-input": Element;
  }
}

import Element from '../elements/input/AnypointMaskedInput.js';

window.customElements.define('anypoint-masked-input', Element);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-masked-input": Element;
  }
}

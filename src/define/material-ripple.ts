import Element from '../elements/MaterialRippleElement.js';

window.customElements.define('material-ripple', Element);

declare global {
  interface HTMLElementTagNameMap {
    "material-ripple": Element;
  }
}

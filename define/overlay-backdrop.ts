import Element from '../src/elements/OverlayBackdropElement.js';

window.customElements.define('arc-overlay-backdrop', Element);

declare global {
  interface HTMLElementTagNameMap {
    "arc-overlay-backdrop": Element;
  }
}

import Element from '../src/elements/ScrollThresholdElement.js';

window.customElements.define('scroll-threshold', Element);

declare global {
  interface HTMLElementTagNameMap {
    "scroll-threshold": Element;
  }
}

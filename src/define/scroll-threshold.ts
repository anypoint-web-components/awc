import Element from '../elements/scroll/ScrollThresholdElement.js';

window.customElements.define('scroll-threshold', Element);

declare global {
  interface HTMLElementTagNameMap {
    "scroll-threshold": Element;
  }
}

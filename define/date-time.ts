import Element from '../src/elements/DateTimeElement.js';

window.customElements.define('date-time', Element);

declare global {
  interface HTMLElementTagNameMap {
    "date-time": Element;
  }
}

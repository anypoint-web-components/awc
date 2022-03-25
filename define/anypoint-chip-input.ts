import Element from '../src/elements/AnypointChipInputElement.js';

window.customElements.define('anypoint-chip-input', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-chip-input': Element;
  }
}

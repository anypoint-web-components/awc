import Element from '../elements/chips/AnypointChipInputElement.js';

window.customElements.define('anypoint-chip-input', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-chip-input': Element;
  }
}

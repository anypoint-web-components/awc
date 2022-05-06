import Element from '../elements/chips/AnypointChipElement.js';

window.customElements.define('anypoint-chip', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-chip': Element;
  }
}

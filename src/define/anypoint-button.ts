import Element from '../elements/AnypointButtonElement.js';

window.customElements.define('anypoint-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-button': Element;
  }
}

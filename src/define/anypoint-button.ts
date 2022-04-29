import Element from '../elements/button/AnypointButtonElement.js';

window.customElements.define('anypoint-button', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-button': Element;
  }
}

import Element from '../elements/dialog/AnypointDialogElement.js';

window.customElements.define('anypoint-dialog', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-dialog': Element;
  }
}

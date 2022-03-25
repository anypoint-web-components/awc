import Element from '../src/elements/AnypointDialogScrollableElement.js';

window.customElements.define('anypoint-dialog-scrollable', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-dialog-scrollable': Element;
  }
}

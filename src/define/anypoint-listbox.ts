import Element from '../elements/lists/AnypointListboxElement.js';

window.customElements.define('anypoint-listbox', Element);

declare global {
  interface HTMLElementTagNameMap {
    'anypoint-listbox': Element;
  }
}

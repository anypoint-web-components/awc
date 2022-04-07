import { LitElement } from 'lit';
import { CheckedElementMixin } from '../../src/index.js';

export class SimpleCheckbox extends CheckedElementMixin(LitElement) {}
window.customElements.define('simple-checkbox', SimpleCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    "simple-checkbox": SimpleCheckbox
  }
}

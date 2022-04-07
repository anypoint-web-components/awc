import { LitElement } from 'lit';
import { ValidatorMixin } from '../../src/index.js';

export class SimpleValidator extends ValidatorMixin(LitElement) {}
window.customElements.define('simple-validator', SimpleValidator);

declare global {
  interface HTMLElementTagNameMap {
    "simple-validator": SimpleValidator
  }
}

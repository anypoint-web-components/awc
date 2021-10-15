import { LitElement } from 'lit-element';
import { ValidatorMixin } from '../src/ValidatorMixin.js';

export class NumberRequired extends ValidatorMixin(LitElement) {
  static get properties() {
    return {
      // Error message to display
      message: { type: String }
    };
  }

  constructor() {
    super();
    this.message = 'Must have number';
  }

  validate(value) {
    return /\d/.test(value);
  }
}
window.customElements.define('number-required', NumberRequired);

import { LitElement } from 'lit-element';
import { ValidatorMixin } from '../src/mixins/ValidatorMixin.js';

export class MinimumMaximumLength extends ValidatorMixin(LitElement) {
  static get properties() {
    return {
      // Error message to display
      message: { type: String },
      // Min value for the string value.
      min: {
        type: Number
      },
      // Max value for the string value.
      max: {
        type: Number
      }
    };
  }

  constructor() {
    super();
    this.message = 'Value too short or too long';
    this.min = 4;
    this.max = 12;
  }

  validate(value) {
    if (!value || value.length < this.min) {
      this.message = 'Value is too short.';
      return false;
    }
    if (value.length > this.max) {
      this.message = 'Value is too long.';
      return false;
    }
    return true;
  }
}
window.customElements.define('minimum-maximum-length', MinimumMaximumLength);

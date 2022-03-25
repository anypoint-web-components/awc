import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ValidatorMixin } from '../src/mixins/ValidatorMixin.js';

export class MinimumMaximumLength extends ValidatorMixin(LitElement) {
  // Error message to display
  @property({ type: String })
  message = 'Value too short or too long';

  // Min value for the string value.
  @property({ type: Number })
  min = 4;

  // Max value for the string value.
  @property({ type: Number })
  max = 12;
  
  validate(value: any): boolean {
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

declare global {
  interface HTMLElementTagNameMap {
    "minimum-maximum-length": MinimumMaximumLength;
  }
}

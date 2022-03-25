import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ValidatorMixin } from '../src/mixins/ValidatorMixin.js';

export class NumberRequired extends ValidatorMixin(LitElement) {
  // Error message to display
  @property({ type: String })
  message = 'Must have number';

  validate(value: string): boolean {
    return /\d/.test(value);
  }
}
window.customElements.define('number-required', NumberRequired);

declare global {
  interface HTMLElementTagNameMap {
    "number-required": NumberRequired;
  }
}

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ValidatorMixin } from '../src/mixins/ValidatorMixin.js';

export class UppercaseRequired extends ValidatorMixin(LitElement) {
  // Error message to display
  @property({ type: String })
  message = 'Must have uppercase letter';

  validate(value: string): boolean {
    return /[A-Z]/.test(value);
  }
}
window.customElements.define('uppercase-required', UppercaseRequired);

declare global {
  interface HTMLElementTagNameMap {
    "uppercase-required": UppercaseRequired;
  }
}

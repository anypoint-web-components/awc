import { LitElement } from 'lit';
import { ValidatorMixin } from '../src/mixins/ValidatorMixin.js';

class MinimumLength extends ValidatorMixin(LitElement) {
  static get observedAttributes(): string[] {
    return ['message'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    // @ts-ignore
    this[name] = newValue;
  }

  validateObject(obj: any): boolean {
    let result = true;
    Object.keys(obj).forEach(key => {
      if (result && obj[key].length < 4) {
        result = false;
      }
    });
    return result;
  }

  validateArray(value: any[]): boolean {
    return !value.some(v => v.length < 4);
  }

  validate(values: any): boolean {
    if (Array.isArray(values)) {
      return this.validateArray(values);
    }
    if (typeof values === 'object') {
      return this.validateObject(values);
    }
    return values.length >= 4;
  }
}
window.customElements.define('minimum-length', MinimumLength);

declare global {
  interface HTMLElementTagNameMap {
    "minimum-length": MinimumLength;
  }
}

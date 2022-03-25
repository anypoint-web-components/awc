import { LitElement } from 'lit';
import { ValidatorMixin } from '../index.js';

class CatsOnly extends ValidatorMixin(LitElement) {
  validateObject(obj: any): boolean {
    return !Object.keys(obj).some(
      key => obj[key].match(/^(c|ca|cat|cats)?$/) === null
    );
  }

  validateArray(value: string[]): boolean {
    return !value.some(v => v.match(/^(c|ca|cat|cats)?$/) === null);
  }

  validate(values: any): boolean {
    if (Array.isArray(values)) {
      return this.validateArray(values);
    }
    if (typeof values === 'object') {
      return this.validateObject(values);
    }
    return values.match(/^(c|ca|cat|cats)?$/) !== null;
  }
}
window.customElements.define('cats-only', CatsOnly);

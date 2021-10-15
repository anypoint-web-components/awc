import { ValidatorMixin } from '@anypoint-web-components/validator-mixin/validator-mixin.js';

class MinimumLength extends ValidatorMixin(HTMLElement) {
  static get observedAttributes() {
    return ['message'];
  }

  /* istanbul ignore next */
  attributeChangedCallback(name, oldValue, newValue) {
    /* istanbul ignore next */
    this[name] = newValue;
  }

  validateObject(obj) {
    let result = true;
    Object.keys(obj).forEach(key => {
      /* istanbul ignore next */
      if (result && obj[key].length < 4) {
        /* istanbul ignore next */
        result = false;
      }
    });
    return result;
  }

  /* istanbul ignore next */
  validateArray(value) {
    /* istanbul ignore next */
    return !value.some(v => v.length < 4);
  }

  validate(values) {
    /* istanbul ignore next */
    if (Array.isArray(values)) {
      /* istanbul ignore next */
      return this.validateArray(values);
    }
    /* istanbul ignore next */
    if (typeof values === 'object') {
      /* istanbul ignore next */
      return this.validateObject(values);
    }
    /* istanbul ignore next */
    return values.length >= 4;
  }
}
window.customElements.define('minimum-length', MinimumLength);

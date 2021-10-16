/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import * as ValidatorStore from './ValidatorStore.js';

/** @typedef {import('./ValidatorMixin').ValidatorMixin} ValidatorMixin */
/** @typedef {import('./ValidatableMixin').ValidationResult} ValidationResult */
/**
 * Performs `value` validation on the `node` as an object implementing `ValidatorMixin`.
 *
 * @param {any} value The value to validate
 * @param {ValidatorMixin} node A node implementing `ValidatorMixin`
 * @return {ValidationResult} Validation report
 */
function createValidationReport(value, node) {
  const asNode = /** @type HTMLElement */ (/** @type unknown */ (node));
  const { message } = node;
  const { nodeName } = asNode;
  // @ts-ignore
  const validator = (nodeName && nodeName.toLowerCase()) || asNode.constructor.is;
  let valid;
  if (!node.validate(value)) {
    valid = false;
  } else {
    valid = true;
  }
  const validatorResult = {
    validator,
    message,
    valid,
  };
  return validatorResult;
}

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class ValidatableMixinImpl extends base {
    static get properties() {
      return {
        /**
         * Name of the validator or validators to use.
         * If the element should be validated by more than one validator then separate names with
         * space. See docs for `ValidatorMixin` for description of how to define a
         * validator.
         */
        validator: { type: String },

        /**
         * After calling `validate()` this is be populated by latest result of the
         * test for each validator. Result item contains following properties:
         *
         * - validator `string` Name of the validator
         * - valid `boolean` Result of the test
         * - message `string` Error message
         *
         * This property is `undefined` if `validator` is not set.
         */
        validationStates: { type: Array },

        /**
         * True if the last call to `validate` is invalid.
         */
        invalid: { reflect: true, type: Boolean },
      };
    }

    /**
     * @return {ValidatorMixin[]} A list of validators to use to validate
     * this element.
     */
    get _validator() {
      const { validator } = this;
      if (!validator) {
        return null;
      }
      const validatorsNames = validator.split(' ');
      if (validatorsNames.length === 0) {
        return null;
      }
      const result = [];
      validatorsNames.forEach(name => {
        const v = ValidatorStore.get(name);
        if (v) {
          result.push(v);
        }
      });
      return result;
    }

    get invalid() {
      return this._invalid;
    }

    set invalid(value) {
      const old = this._invalid;
      if (old === value) {
        return;
      }
      this._invalid = value;
      this._invalidChanged(value);
      this.dispatchEvent(new Event('invalidchange'));
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('invalid', old);
      }
    }

    /**
     * @return {ValidationResult[]} Last validation result
     */
    get validationStates() {
      return this._validationStates;
    }

    /**
     * @param {ValidationResult[]} value Validation result to set.
     */
    set validationStates(value) {
      const old = this._validationStates;
      if (old === value) {
        return;
      }
      this._validationStates = value;
      this.dispatchEvent(
        new CustomEvent(`validationstateschange`, {
          composed: true,
          detail: {
            value,
          },
        })
      );

      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('validationStates', old);
      }
    }

    /**
     * @return {EventListener} Previously registered handler for `invalid` event
     */
    get oninvalid() {
      return this._oninvalid;
    }

    /**
     * Registers a callback function for `invalid` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set oninvalid(value) {
      if (this._oninvalid) {
        this.removeEventListener('invalidchange', this._oninvalid);
      }
      if (typeof value !== 'function') {
        this._oninvalid = null;
        return;
      }
      this._oninvalid = value;
      this.addEventListener('invalidchange', value);
    }

    /**
     * @constructor
     */
    constructor() {
      super();
      this.invalid = false;
      this.validator = undefined;
    }

    /**
     * Updates the `aria-invalid` attribute when the invalid state change.
     * @param {Boolean} invalid
     */
    _invalidChanged(invalid) {
      if (invalid) {
        this.setAttribute('aria-invalid', 'true');
      } else {
        this.removeAttribute('aria-invalid');
      }
    }

    /**
     * Returns true if the `value` is valid, and updates `invalid`. If you want
     * your element to have custom validation logic, do not override this method;
     * override `_getValidity(value)` instead.
     * @param {any} value The value to be validated. By default, it is passed
     * to the validator's `validate()` function, if a validator is set.
     * @return {boolean} True if `value` is valid.
     */
    validate(value) {
      const state = this._getValidity(value);
      this.invalid = !state;
      return state;
    }

    /**
     * Returns true if `value` is valid.  By default, it is passed
     * to the validator's `validate()` function, if a validator is set. You
     * should override this method if you want to implement custom validity
     * logic for your element.
     *
     * @param {any} value The value to be validated.
     * @return {boolean} True if the `value` is valid.
     */
    _getValidity(value) {
      const { _validator } = this;

      if (_validator && _validator.length) {
        let result = true;
        const states = [];
        _validator.forEach(node => {
          const report = createValidationReport(value, node);
          if (!report.valid) {
            result = false;
          }
          states.push(report);
        });
        this.validationStates = states;
        return result;
      }
      return true;
    }
  }
  return ValidatableMixinImpl;
};

/**
 * This validatable supports multiple validators.
 *
 * Use `ValidatableMixin` to implement an element that validates user input.
 * Use the related `ArcValidatorBehavior` to add custom validation logic
 * to an iron-input or other wrappers around native inputs.
 *
 * By default, an `<iron-form>` element validates its fields when the user presses the submit
 * button.
 * To validate a form imperatively, call the form's `validate()` method, which in turn will
 * call `validate()` on all its children. By using `ValidatableMixin`, your
 * custom element will get a public `validate()`, which will return the validity
 * of the element, and a corresponding `invalid` attribute, which can be used for styling.
 *
 * To implement the custom validation logic of your element, you must override
 * the protected `_getValidity()` method of this behaviour, rather than `validate()`.
 * See [this](https://github.com/PolymerElements/iron-form/blob/master/demo/simple-element.html)
 * for an example.
 *
 * ### Accessibility
 *
 * Changing the `invalid` property, either manually or by calling `validate()` will update the
 * `aria-invalid` attribute.
 *
 * @mixin
 */
export const ValidatableMixin = dedupeMixin(mxFunction);

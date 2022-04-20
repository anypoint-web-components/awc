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
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import * as ValidatorStore from './ValidatorStore.js';
import { ValidatorMixinInterface } from './ValidatorMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

export interface ValidationResult {
  /**
   * Name of the validator
   */
  validator: string;
  /**
   * Validation message
   */
  message?: string;
  /**
   * Whether the value is valid or no
   */
  valid: boolean;
}

/**
 * Performs `value` validation on the `node` as an object implementing `ValidatorMixin`.
 *
 * @param value The value to validate
 * @param node A node implementing `ValidatorMixin`
 * @return Validation report
 */
function createValidationReport(value: any, node: ValidatorMixinInterface & LitElement): ValidationResult {
  const { nodeName, message } = node;
  const validator = nodeName.toLowerCase();
  let valid: boolean;
  if (!node.validate(value)) {
    valid = false;
  } else {
    valid = true;
  }
  const validatorResult: ValidationResult = {
    validator,
    message,
    valid,
  };
  return validatorResult;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ValidatableMixinInterface {
  /**
   * Name of the validator or validators to use.
   * If the element should be validated by more than one validator then separate names with
   * space. See docs for `ValidatorMixin` for description of how to define a
   * validator.
   */
  validator?: string;
  /**
   * True if the last call to `validate` is invalid.
   */
  invalid: boolean | undefined;
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
  validationStates: ValidationResult[] | undefined;
  /**
   * @return Previously registered handler for `invalid` event
   */
  oninvalid: EventListener | undefined
  /**
   * Returns true if the `value` is valid, and updates `invalid`. If you want
   * your element to have custom validation logic, do not override this method;
   * override `_getValidity(value)` instead.
   * @param value The value to be validated. By default, it is passed
   * to the validator's `validate()` function, if a validator is set.
   * @return True if `value` is valid.
   */
  validate(value?: any): boolean;
  /**
   * Returns true if `value` is valid.  By default, it is passed
   * to the validator's `validate()` function, if a validator is set. You
   * should override this method if you want to implement custom validity
   * logic for your element.
   *
   * @param value The value to be validated.
   * @return True if the `value` is valid.
   */
  _getValidity(value: any): boolean;
  
  /**
   * Updates the `aria-invalid` attribute when the invalid state change.
   */
  _invalidChanged(invalid?: boolean): void;
}

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
 * 
 * @fires invalidchange
 * @fires validationstateschange
 *
 * @attr {string} validator
 * @prop {string | undefined} validator
 *
 * @attr {boolean} invalid
 * @prop {boolean | undefined} invalid
 */
export function ValidatableMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<ValidatableMixinInterface> & T {
  class MyMixinClass extends superClass {
    /**
     * Name of the validator or validators to use.
     * If the element should be validated by more than one validator then separate names with
     * space. See docs for `ValidatorMixin` for description of how to define a
     * validator.
     */
    @property({ type: String, reflect: true })
    validator?: string;

    /**
     * @return A list of validators to use to validate
     * this element.
     */
    get _validator(): (ValidatorMixinInterface & LitElement)[] | null {
      const { validator } = this;
      if (!validator) {
        return null;
      }
      const validatorsNames = validator.split(' ');
      if (validatorsNames.length === 0) {
        return null;
      }
      const result: (ValidatorMixinInterface & LitElement)[] = [];
      validatorsNames.forEach(name => {
        const v = ValidatorStore.get(name);
        if (v) {
          result.push(v as ValidatorMixinInterface & LitElement);
        }
      });
      return result;
    }

    _invalid: boolean | undefined;

    /**
     * True if the last call to `validate` is invalid.
     */
    @property({ reflect: true, type: Boolean })
    get invalid(): boolean | undefined {
      return this._invalid;
    }

    set invalid(value: boolean | undefined) {
      const old = this._invalid;
      if (old === value) {
        return;
      }
      this._invalid = value;
      this._invalidChanged(value);
      this.dispatchEvent(new Event('invalidchange'));
      if (this.requestUpdate) {
        this.requestUpdate('invalid', old);
      }
    }

    _validationStates: ValidationResult[] | undefined;

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
    @property({ type: Array })
    get validationStates(): ValidationResult[] | undefined {
      return this._validationStates;
    }

    /**
     * @param value Validation result to set.
     */
    set validationStates(value: ValidationResult[] | undefined) {
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
      if (this.requestUpdate) {
        this.requestUpdate('validationStates', old);
      }
    }

    /**
     * @return Previously registered handler for `invalid` event
     */
    // @ts-ignore
    get oninvalid(): EventListener | undefined {
      return getListener('invalidchange', this);
    }

    /**
     * Registers a callback function for `invalid` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    // @ts-ignore
    set oninvalid(value: EventListener | undefined) {
      addListener('invalidchange', value, this);
    }

    /**
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.invalid = false;
    }

    /**
     * Updates the `aria-invalid` attribute when the invalid state change.
     */
    _invalidChanged(invalid?: boolean): void {
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
     * @param value The value to be validated. By default, it is passed
     * to the validator's `validate()` function, if a validator is set.
     * @return True if `value` is valid.
     */
    validate(value?: any): boolean {
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
     * @param value The value to be validated.
     * @return True if the `value` is valid.
     */
    _getValidity(value: any): boolean {
      const { _validator } = this;
      if (_validator && _validator.length) {
        let result = true;
        const states: ValidationResult[] = [];
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
  return MyMixinClass as Constructor<ValidatableMixinInterface> & T;
}

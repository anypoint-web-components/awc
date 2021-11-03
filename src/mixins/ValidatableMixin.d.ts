import { ValidatorMixin } from './ValidatorMixin';

declare function ValidatableMixin<T extends new (...args: any[]) => {}>(base: T): T & ValidatableMixinConstructor;
interface ValidatableMixinConstructor {
  new(...args: any[]): ValidatableMixin;
}

export declare interface ValidationResult {
  /**
   * Name of the validator
   */
  validator: string;
  /**
   * Validation message
   */
  message: string;
  /**
   * Whether the value is valid or no
   */
  valid: boolean;
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
 * the protected `_getValidity()` method of this behavior, rather than `validate()`.
 * See [this](https://github.com/PolymerElements/iron-form/blob/master/demo/simple-element.html)
 * for an example.
 *
 * ### Accessibility
 *
 * Changing the `invalid` property, either manually or by calling `validate()` will update the
 * `aria-invalid` attribute.
 * 
 * @fires invalidchange
 * @fires validationstateschange
 */
interface ValidatableMixin {
  /**
   * Name of the validator or validators to use.
   * If the element should be validated by more than one validator then separate names with
   * space. See docs for `ValidatorMixin` for description of how to define a
   * validator.
   * @attribute
   */
  validator: string;

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
  validationStates: ValidationResult[];

  /**
   * True if the last call to `validate` is invalid.
   * @attribute
   */
  invalid: boolean;

  /**
   * A list of validators to use to validate this element.
   */
  readonly _validator: ValidatorMixin[];

  /**
   * Updates the `aria-invalid` attribute when the invalid state change.
   */
  _invalidChanged(invalid: boolean): void;

  /**
   * Returns true if the `value` is valid, and updates `invalid`. If you want
   * your element to have custom validation logic, do not override this method;
   * override `_getValidity(value)` instead.
   *
   * @param value The value to be validated. By default, it is passed
   * to the validator's `validate()` function, if a validator is set.
   * @returns True if `value` is valid.
   */
  validate(value: any): boolean;

  /**
   * Returns true if `value` is valid.  By default, it is passed
   * to the validator's `validate()` function, if a validator is set. You
   * should override this method if you want to implement custom validity
   * logic for your element.
   *
   * @param value The value to be validated.
   * @returns True if the `value` is valid.
   */
  _getValidity(value: any): boolean;
}

export {ValidatableMixinConstructor};
export {ValidatableMixin};

import { ValidatableMixin } from './ValidatableMixin.js';
import { ControlStateMixin } from './ControlStateMixin.js';
import { SupportedAutocapitalize, SupportedAutocomplete, SupportedInputTypes } from '../types';

declare function AnypointInputMixin<T extends new (...args: any[]) => {}>(base: T): T & AnypointInputMixinConstructor;
interface AnypointInputMixinConstructor {
  new(...args: any[]): AnypointInputMixin;
}

/**
 * This validatable supports multiple validators.
 *
 * Use `AnypointInputMixin` to implement an element that validates user input.
 * Use the related `ArcValidatorBehavior` to add custom validation logic
 * to an iron-input or other wrappers around native inputs.
 *
 * By default, an `<iron-form>` element validates its fields when the user presses the submit
 * button.
 * To validate a form imperatively, call the form's `validate()` method, which in turn will
 * call `validate()` on all its children. By using `AnypointInputMixin`, your
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
 * @fires change When the input value change
 * @fires input On user input
 * @fires iron-announce When requesting a11y announcement
 * @fires value-changed When the `value` property has changed
 * @fires hasvalidationmessage-changed When the `hasValidationMessage` property has changed
 */
interface AnypointInputMixin extends ValidatableMixin, ControlStateMixin {
  /**
   * The value for this input. If you're using PaperInputBehavior to
   * implement your own paper-input-like element, bind this to
   * the `<input>`'s `bindValue`
   * property, or the value property of your input that is `notify:true`.
   * @attribute
   */
  value: any;

  /**
   * Set to true to prevent the user from entering invalid input.
   * @attribute
   */
  preventInvalidInput: boolean;

  /**
   * Set this to specify the pattern allowed by `preventInvalidInput`.
   * @attribute
   */
  allowedPattern: string;

  /**
   * The type of the input. The supported types are `text`, `number` and `password`.
   * @attribute
   */
  type: SupportedInputTypes;

  /**
   * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
   * @attribute
   */
  list: string;

  /**
   * A pattern to validate the `input` with.
   * @attribute
   */
  pattern: string;

  /**
   * Sets the input as required.
   * @attribute
   */
  required: boolean;

  /**
   * The error message to display when the input is invalid.
   * @attribute
   */
  invalidMessage: string;

  /**
   * Assistive text value.
   * Rendered below the input.
   * @attribute
   */
  infoMessage: string;

  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  _hasValidationMessage: boolean;

  /**
   * Set to true to auto-validate the input value.
   * @attribute
   */
  autoValidate: boolean;

  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   * @attribute
   */
  autocomplete: SupportedAutocomplete;

  /**
   * Binds this to the `<input>`'s `autofocus` property.
   * @attribute
   */
  autofocus: boolean;

  /**
   * Binds this to the `<input>`'s `inputMode` property.
   * @attribute
   */
  inputMode: string;

  /**
   * The minimum length of the input value.
   * Binds this to the `<input>`'s `minLength` property.
   * @attribute
   */
  minLength: number;

  /**
   * The maximum length of the input value.
   * Binds this to the `<input>`'s `maxLength` property.
   * @attribute
   */
  maxLength: number;

  /**
   * The minimum (numeric or date-time) input value.
   * Binds this to the `<input>`'s `min` property.
   * @attribute
   */
  min: string;

  /**
   * The maximum (numeric or date-time) input value.
   * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
   * Binds this to the `<input>`'s `max` property.
   * @attribute
   */
  max: string;

  /**
   * Limits the numeric or date-time increments.
   *
   * Binds this to the `<input>`'s `step` property.
   * @attribute
   */
  step: number;

  /**
   * Binds this to the `<input>`'s `name` property.
   * @attribute
   */
  name: string;

  /**
   * A placeholder string in addition to the label. If this is set, the label will always float.
   * Please, use with careful.
   * @attribute
   */
  placeholder: string;

  /**
   * Binds this to the `<input>`'s `readonly` property.
   * @default false
   * @attribute
   */
  readOnly: boolean;

  /**
   * Binds this to the `<input>`'s `size` property.
   * @attribute
   */
  size: number;

  // /**
  //  * Binds this to the `<input>`'s `spellcheck` property.
  //  */
  // spellcheck: string;

  /**
   * Binds this to the `<input>`'s `autocapitalize` property.
   *
   * Possible values are:
   *
   * - `off` or `none`: No autocapitalization is applied (all letters default to lowercase)
   * - `on` or `sentences`: The first letter of each sentence defaults to a capital letter;
   *  all other letters default to lowercase
   * - `words`: The first letter of each word defaults to a capital letter; all other letters default to lowercase
   * - `characters`: All letters should default to uppercase
   *
   * @default none
   */
  autocapitalize: SupportedAutocapitalize;

  /**
   * Binds this to the `<input>`'s `autocorrect` property.
   * @default off
   * @attribute
   */
  autocorrect: string;

  /**
   * Binds this to the `<input>`'s `results` property,
   * used with type=search.
   *
   * The maximum number of items that should be displayed in the
   * drop-down list of previous search queries. Safari only.
   * @attribute
   */
  results: number;

  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   * @attribute
   */
  accept: string;

  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   * @attribute
   */
  multiple: boolean;

  _ariaLabelledBy: string;

  /**
   * Enables outlined theme.
   * @attribute
   */
  outlined: boolean;

  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;

  /**
   * When set, it reduces height of the button and hides
   * the label when the value is provided.
   *
   * Use it carefully as user should be able to recognize the input
   * when the value is predefined.
   * @attribute
   */
  noLabelFloat: boolean;

  /**
   * A reference to the input element.
   */
  readonly inputElement: HTMLInputElement|HTMLTextAreaElement;

  checkValidity(): boolean;

  _invalidChanged(value: boolean): void;

  _ensureInvalidAlertSate(invalid: boolean): void;

  /**
   * Forwards focus to inputElement. Overridden from ControlStateMixin.
   * @param {FocusEvent} event
   */
  _focusBlurHandler(event: FocusEvent): void;

  /**
   * Handler for the keydown event.
   *
   * @param e Event handled.
   */
  _onKeydown(e: KeyboardEvent): void;

  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   *
   * @param e Event handled.
   */
  _onShiftTabDown(e: KeyboardEvent): void;

  /**
   * Calls when `autoValidate` changed
   */
  _autoValidateChanged(value: boolean): void;

  /**
   * Restores the cursor to its original position after updating the value.
   * @param newValue The value that should be saved.
   */
  updateValueAndPreserveCaret(newValue: string): void;

  _updateAriaLabelledBy(): void;

  _onChange(e: Event): void;

  _onInput(e: Event): void;

  /**
   * Checks validity for pattern, if any
   * @param {String=} value The value to test for pattern
   * @return {Boolean}
   */
  _checkPatternValidity(value?: string): boolean;

  _announceInvalidCharacter(message: string): void;

  /**
   * Called when `autofocus` property changed.
   * @param value Current `autofocus` value
   */
  _autofocusChanged(value: boolean): void;
  /**
   * Returns true if `value` is valid. The validator provided in `validator`
   * will be used first, then any constraints.
   * @returns True if the value is valid.
   */
  validate(): boolean;

  /**
   * Because of the `value` property binding to the input element the value on
   * input element changes programmatically which renders input element's validation
   * valid even if it isn't. This function runs the steps as the regular input
   * validation would, including input validation.
   * @returns True if the element is valid.
   */
  _checkInputValidity(): boolean;

  /**
   * Called when validation states changed.
   * Validation states are set by validatable mixin and is a result of calling
   * a custom validator. Each validator returns an object with `valid` and `message`
   * properties.
   *
   * See `ValidatableMixin` for more information.
   */
  _validationStatesHandler(e: CustomEvent): void;
}

export {AnypointInputMixinConstructor};
export {AnypointInputMixin};

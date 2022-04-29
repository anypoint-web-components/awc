import { PropertyValueMap } from 'lit';
import { property, query } from 'lit/decorators.js';
import ValidatableElement from "../ValidatableElement.js";
import { SupportedAutocomplete, SupportedInputTypes, SupportedAutocapitalize } from '../../types.js';
import { isPrintable } from '../../lib/InputValidator.js';
import { stringAndNumberConverter } from '../../lib/AttributeConverters.js';

const floatTypes = [
  'date',
  'color',
  'datetime-local',
  'file',
  'month',
  'time',
  'week',
];

/**
 * Base class for Anypoint and Material Design styled input element.
 */
export default class InputElement extends ValidatableElement {
  /**
   * For form-associated custom elements. Marks this custom element
   * as form enabled element.
   */
  static get formAssociated(): boolean {
    return true;
  }

  private _internals?: ElementInternals;

  /**
   * When form-associated custom elements are supported in the browser it
   * returns `<form>` element associated with this control.
   */
  get form(): HTMLFormElement | undefined {
    // @ts-ignore
    return this._internals && this._internals.form;
  }

  /**
   * If true, the element currently has focus.
   */
  @property({ reflect: true, type: Boolean }) focused?: boolean;

  /**
   * If true, the button is a toggle and is currently in the active state.
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * The value for this input.
   */
  @property({ type: String, converter: stringAndNumberConverter }) value?: string;

  /**
   * The type of the input. The supported types are `text`, `number` and `password`.
   */
  @property({ type: String, reflect: true }) type?: SupportedInputTypes = 'text';

  /**
   * The input label.
   * 
   * Note, for compatibility with the old version of the component,
   * the element will search for a `[slot='label']` child and will update this 
   * value if defined.
   */
  @property({ type: String }) label?: string;

  /**
   * When set, it reduces height of the button and hides
   * the label when the value is provided.
   *
   * Use it carefully as user should be able to recognize the input
   * when the value is predefined.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) noLabelFloat?: boolean;

  /**
   * Automatically calls `checkValidity()` function when input changes.
   */
  @property({ reflect: true, type: Boolean }) autoValidate?: boolean;

  /**
   * The error message to display when the input is invalid.
   */
  @property({ type: String }) invalidMessage?: string;

  /**
   * Assistive text value. Rendered below the input.
   */
  @property({ type: String }) infoMessage?: string;

  /**
   * Set to true to prevent the user from entering invalid input.
   */
  @property({ reflect: true, type: Boolean }) preventInvalidInput?: boolean;

  /**
   * Set this to specify the pattern allowed by `preventInvalidInput`.
   */
  @property({ type: String }) allowedPattern?: string;

  /**
   * A pattern to validate the `input` with.
   */
  @property({ type: String }) pattern?: string;

  /**
   * Sets the input as required.
   */
  @property({ type: Boolean }) required?: boolean;

  // HTMLInputElement attributes for binding if needed

  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   * @attribute
   */
  @property({ type: String }) autocomplete: SupportedAutocomplete = 'off';

  /**
   * Binds this to the `<input>`'s `inputMode` property.
   * @attribute
   */
  @property({ type: String }) inputMode: string = '';

  /**
   * The minimum length of the input value.
   * Binds this to the `<input>`'s `minLength` property.
   * @attribute
   */
  @property({ type: Number }) minLength?: number;

  /**
   * The maximum length of the input value.
   * Binds this to the `<input>`'s `maxLength` property.
   * @attribute
   */
  @property({ type: Number }) maxLength?: number;

  /**
   * The minimum (numeric or date-time) input value.
   * Binds this to the `<input>`'s `min` property.
   * @attribute
   */
  @property({ type: Number }) min?: number;

  /**
   * The maximum (numeric or date-time) input value.
   * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
   * Binds this to the `<input>`'s `max` property.
   * @attribute
   */
  @property({ type: Number }) max?: number;

  /**
   * Limits the numeric or date-time increments.
   *
   * Binds this to the `<input>`'s `step` property.
   * @attribute
   */
  @property({ type: String }) step?: string;

  /**
   * Binds this to the `<input>`'s `name` property.
   * @attribute
   */
  @property({ type: String }) name?: string;

  /**
   * A placeholder string in addition to the label. If this is set, the label will always float.
   * Please, use with careful.
   * @attribute
   */
  @property({ type: String }) placeholder?: string;

  /**
   * Binds this to the `<input>`'s `readonly` property.
   * @attribute
   * @default false
   */
  @property({ type: Boolean }) readOnly?: boolean;

  /**
   * Binds this to the `<input>`'s `size` property.
   * @attribute
   */
  @property({ type: Number }) size?: number;

  /**
   * Binds this to the `<input>`'s `spellcheck` property.
   * @attribute
   */
  @property({ type: Boolean }) spellcheck = false;

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
   * @default off
   */
  autocapitalize: SupportedAutocapitalize = 'off';

  // Nonstandard attributes for binding if needed

  /**
   * Binds this to the `<input>`'s `autocorrect` property.
   * @default off
   * @attribute
   */
  @property({ type: String }) autocorrect = 'off';

  /**
   * Binds this to the `<input>`'s `results` property,
   * used with type=search.
   *
   * The maximum number of items that should be displayed in the
   * drop-down list of previous search queries. Safari only.
   * @attribute
   */
  @property({ type: Number }) results?: number;

  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: String }) accept?: string;

  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: Boolean }) multiple?: boolean;

  /**
   * @return Returns a reference to the input element.
   */
  @query('input,textarea')
  inputElement: HTMLInputElement | HTMLTextAreaElement | null | undefined;

  get _isFloating(): boolean {
    const { value, anypoint } = this;
    if (anypoint) {
      return false;
    }
    if (!!value || String(value) === '0') {
      return true;
    }
    if (floatTypes.includes(this.type || '')) {
      return true;
    }
    return !!this.placeholder || !!this.focused;
  }

  protected _shiftTabPressed: boolean = false;

  protected _previousValidInput?: string;

  get _patternRegExp(): RegExp | undefined {
    let pattern: RegExp | undefined;
    if (this.allowedPattern) {
      pattern = new RegExp(this.allowedPattern);
    } else {
      switch (this.type) {
        case 'number':
          pattern = /[0-9.,e-]/;
          break;
        default:
          pattern = undefined;
      }
    }
    return pattern;
  }

  /**
   * A flag that determines whether the pattern was checked in the 
   * `keydown` event so the input handler won't check it again.
   */
  protected _patternAlreadyChecked = false;

  constructor() {
    super();
    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
    this.addEventListener('keydown', this._keydownHandler);
    this.addEventListener('focus', this._focusHandler);
    this.addEventListener('blur', this._blurHandler);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param disabled Form disabled state
   */
  formDisabledCallback(disabled?: boolean): void {
    this.disabled = disabled;
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback(): void {
    this.value = '';
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param formState Restored value
   */
  formStateRestoreCallback(formState?: string): void {
    this.value = formState;
  }

  protected firstUpdated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(cp);
    requestAnimationFrame(() => {
      this._upgradeLegacy();
    });
  }

  protected _upgradeLegacy(): void {
    // For compatibility, search for a `[slot="label"]` and set the label value.
    const node = this.querySelector('[slot="label"]') as HTMLElement | null;
    if (node) {
      const label = node.textContent?.trim();
      if (label) {
        this.label = label;
      }
    }
  }

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(cp);
    if (cp.has('focused')) {
      if (this.focused) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', '0');
      }
    }
    if (cp.has('value')) {
      // @ts-ignore
      if (this._internals && typeof this._internals.setFormValue === 'function') {
        // @ts-ignore
        this._internals.setFormValue(this.value);
      }
    }
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('autoValidate') && this.autoValidate) {
      this.checkValidity();
    }
    if (cp.has('disabled')) {
      this._disabledChanged();
    }
  }

  /**
   * When focusing on this element, moves focus to the input element.
   * Note, the template should set the `tabindex` on the input depending on the `focus`.
   * When this element is focused then the input's tabindex should be `0`.
   */
  protected async _focusHandler(): Promise<void> {
    const { disabled, _shiftTabPressed } = this;
    if (disabled || _shiftTabPressed) {
      return;
    }
    this.focused = true;
    await this.updateComplete;
    // forward focus.
    const { type, inputElement } = this;
    if (!inputElement) {
      return;
    }
    inputElement.focus();
    const { value } = inputElement;
    if (value && (type === 'text' || type === undefined)) {
      const index = value.length;
      inputElement.selectionStart = index;
      inputElement.selectionEnd = index;
    }
  }

  /**
   * Restores the `focus` and performs auto validation.
   */
  protected _blurHandler(): void {
    const { disabled } = this;
    this.focused = false;
    if (disabled) {
      this.blur();
      return;
    }
    if (this.autoValidate) {
      this.checkValidity();
    }
  }

  protected _keydownHandler(e: KeyboardEvent): void {
    if (e.isComposing || e.keyCode === 229) {
      return;
    }
    if (e.key === 'Tab' && e.shiftKey) {
      this._onShiftTabDown();
      return;
    }
    const { type, preventInvalidInput } = this;
    if (!preventInvalidInput || ['number', 'file'].includes(type || '')) {
      return;
    }
    
    // Ignore for non printable keys.
    if (e.metaKey || e.ctrlKey || !isPrintable(e)) {
      return;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return;
    }
    
    // Check the pattern either here or in `_onInput`, but not in both.
    this._patternAlreadyChecked = true;
    if (!regexp.test(e.key)) {
      e.preventDefault();
    }
  }

  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   */
  protected _onShiftTabDown(): void {
    this._shiftTabPressed = true;
    setTimeout(() => {
      this._shiftTabPressed = false;
    }, 1);
  }

  protected _inputHandler(e: Event): void {
    const targetNode = e.target as HTMLInputElement;
    let { value } = targetNode;
    // Need to validate each of the characters pasted if they haven't
    // been validated inside `_keydownHandler` already.
    let valid = true;
    if ((this.preventInvalidInput || this.allowedPattern) && !this._patternAlreadyChecked) {
      valid = this._checkPatternValidity(value);
      if (!valid) {
        value = this._previousValidInput || '';
      }
    }
    this._patternAlreadyChecked = false;
    this._previousValidInput = value;
    const isNotFile = targetNode.type !== 'file';
    if (isNotFile && targetNode.value !== value) {
      targetNode.value = value;
    }
    if (isNotFile) {
      this.value = value;
    }
    if (this.autoValidate) {
      this.checkValidity();
    }
  }

  /**
   * Checks validity for pattern, if any
   * @param value The value to test for pattern
   */
  protected _checkPatternValidity(value?: string): boolean {
    if (!value) {
      return true;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return true;
    }
    const typedValue = String(value);
    for (let i = 0; i < typedValue.length; i++) {
      if (!regexp.test(typedValue[i])) {
        return false;
      }
    }
    return true;
  }

  protected _getValidity(): boolean {
    const input = this.inputElement;
    if (!input) {
      return true;
    }
    let valid = this._checkInputValidity(input);
    // Only do extra checking if the browser thought this was valid.
    if (valid) {
      // Empty, required input is invalid
      if (this.required && this.value === '') {
        valid = false;
      }
    }
    if (valid && this._internals) {
      // @ts-ignore
      valid = this._internals.checkValidity();
    }
    return valid;
  }

  /**
   * Because of the `value` property binding to the input element the value on
   * input element changes programmatically which renders input element's validation
   * valid even if it isn't. This function runs the steps as the regular input
   * validation would, including input validation.
   * @return True if the element is valid.
   */
  protected _checkInputValidity(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const { type, required, value } = this;
    const emptyValue = value === undefined || value === null || value === '';
    let valid = !required || (!!required && !emptyValue);
    if (!valid) {
      return valid;
    }
    if (type === 'file') {
      return true;
    }
    if (!input) {
      return true;
    }
    
    valid = input.checkValidity();
    if (!valid) {
      return valid;
    }
    valid = this._checkPatternValidity(value);
    if (!valid) {
      return valid;
    }
    const strValue = String(value);
    const { minLength, maxLength } = this;
    if (minLength && strValue.length < minLength) {
      return false;
    }
    if (maxLength && strValue.length > maxLength) {
      return false;
    }
    return true;
  }

  /**
   * Updates aria attribute for disabled state.
   */
  protected _disabledChanged(): void {
    const { disabled } = this;
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';
    if (disabled) {
      this.focused = false;
      this.setAttribute('tabindex', '-1');
      this.blur();
    } else {
      this.setAttribute('tabindex', '0');
    }
  }
}

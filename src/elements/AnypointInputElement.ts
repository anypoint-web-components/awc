import { html, css, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';
import commonStyles from '../styles/anypoint-input-styles.js';
import { ValidatableMixin } from '../mixins/ValidatableMixin.js';
import { SupportedAutocomplete, SupportedInputTypes, SupportedAutocapitalize } from '../types';

/* eslint-disable class-methods-use-this */

const floatTypes = [
  'date',
  'color',
  'datetime-local',
  'file',
  'month',
  'time',
  'week',
];

let nextLabelID = 0;

function isPrintable(event: KeyboardEvent): boolean {
  // What a control/printable character is varies wildly based on the browser.
  // - most control characters (arrows, backspace) do not send a `keypress` event
  //   in Chrome, but they *do* on Firefox
  // - in Firefox, when they do send a `keypress` event, control chars have
  //   a charCode = 0, keyCode = xx (for ex. 40 for down arrow)
  // - printable characters always send a keypress event.
  // - in Firefox, printable chars always have a keyCode = 0. In Chrome, the keyCode
  //   always matches the charCode.
  // None of this makes any sense.

  // For these keys, ASCII code == browser keycode.
  const anyNonPrintable = event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Enter' || event.key === 'Escape';

  // For these keys, make sure it's a browser keycode and not an ASCII code.
  const mozNonPrintable = event.keyCode === 19 // pause
    || event.key === 'CapsLock'
    || event.key === 'Insert'
    || event.key === 'Delete'
    || event.key === 'NumLock'
    || event.key === 'ContextMenu'
    || event.key === 'ScrollLock' // scroll lock
    || (event.keyCode > 32 && event.keyCode < 41) // page up/down, end, home, arrows
    || (event.keyCode > 111 && event.keyCode < 124); // fn keys

  return !anyNonPrintable && !(event.charCode === 0 && mozNonPrintable);
}

/**
 * @fires invalidchange
 * @fires validationstateschange
 *
 * @attr {string} validator
 * @prop {string | undefined} validator
 *
 * @attr {boolean} invalid
 * @prop {boolean | undefined} invalid
 * 
 * @attr {boolean} anypoint
 * @prop {boolean | undefined} anypoint
 * 
 * @attr {boolean} outlined
 * @prop {boolean | undefined} outlined
 */
export default class AnypointInputElement extends ValidatableMixin(AnypointElement) {
  static get styles(): CSSResult[] {
    return [
      commonStyles,
      css`
        .input-element[type='datetime-local'] {
          /* For default 200px width this type expands outside the border */
          width: calc(100% - 40px);
          margin: 0 8px;
          padding: 0;
        }

        .prefixes ::slotted(*) {
          margin: 0 0 0 8px;
        }

        .suffixes ::slotted(*) {
          margin: 0 8px 0 0;
        }

        :host([nolabelfloat]) {
          height: 40px;
        }
      `,
    ];
  }

  _disabled?: boolean;

  _oldTabIndex?: string | null;

  /**
   * If true, the element currently has focus.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) focused: boolean | undefined;

  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  get disabled(): boolean | undefined {
    return this._disabled || false;
  }

  set disabled(value: boolean | undefined) {
    const old = this._disabled;
    if (old === value) {
      return;
    }
    this._disabled = value;
    this._notifyDisabled(!!value);
    this._disabledChanged(value);
    this.requestUpdate('disabled', old);
  }

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

  _value: any;

  /**
   * The value for this input.
   * @attribute
   */
  @property()
  get value(): any {
    return this._value;
  }

  set value(value: any) {
    const old = this._value;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._value = value;
    this.requestUpdate('value', old);
    /* istanbul ignore else */
    // @ts-ignore
    if (this._internals && typeof this._internals.setFormValue === 'function') {
      // @ts-ignore
      this._internals.setFormValue(value);
    }
    this.dispatchEvent(
      new CustomEvent('valuechange', {
        detail: {
          value,
        },
      })
    );
  }

  get hasValidationMessage(): boolean | undefined {
    return this._hasValidationMessage;
  }

  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  @state()
  _hasValidationMessage?: boolean;

  _autofocus = false;

  /**
   * Binds this to the `<input>`'s `autofocus` property.
   * @attribute
   */
  @property({ type: Boolean })
  get autofocus(): boolean {
    return this._autofocus;
  }

  set autofocus(value: boolean) {
    const old = this._autofocus;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._autofocus = value;
    this.requestUpdate('autofocus', old);
    this._autofocusChanged(value);
  }

  _autoValidate?: boolean;

  /**
   * Automatically calls `validate()` function when input changes.
   */
  @property({ type: Boolean, reflect: true })
  get autoValidate(): boolean | undefined {
    return this._autoValidate;
  }

  set autoValidate(value: boolean | undefined) {
    const old = this._autoValidate;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._autoValidate = value;
    this._autoValidateChanged(value);
  }

  @state()
  _invalidMessage?: string;

  /**
   * The error message to display when the input is invalid.
   * @attribute
   */
  @property({ type: String })
  get invalidMessage(): string | undefined {
    return this._invalidMessage;
  }

  set invalidMessage(value: string | undefined) {
    const old = this._invalidMessage;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._invalidMessage = value;
    this._hasValidationMessage = this.invalid && !!value;
    this.requestUpdate('invalidMessage', old);
  }

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
   * @return Returns a reference to the input element.
   */
  get inputElement(): HTMLInputElement | HTMLTextAreaElement | undefined {
    if (!this.shadowRoot) {
      return undefined;
    }
    return this.shadowRoot.querySelector('input,textarea') as HTMLInputElement | HTMLTextAreaElement;
  }

  /**
   * Set to true to prevent the user from entering invalid input.
   * @attribute
   */
  @property({ type: Boolean })
  preventInvalidInput?: boolean;

  /**
   * Set this to specify the pattern allowed by `preventInvalidInput`.
   * @attribute
   */
  @property({ type: String })
  allowedPattern?: string;

  /**
   * The type of the input. The supported types are `text`, `number` and `password`.
   * @attribute
   */
  @property({ type: String })
  type: SupportedInputTypes = 'text';

  /**
   * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
   * @attribute
   */
  @property({ type: String })
  list?: string;

  /**
   * A pattern to validate the `input` with.
   * @attribute
   */
  @property({ type: String })
  pattern?: string;

  /**
   * Sets the input as required.
   * @attribute
   */
  @property({ type: Boolean })
  required?: boolean;

  /**
   * Assistive text value.
   * Rendered below the input.
   * @attribute
   */
  @property({ type: String })
  infoMessage?: string;

  /**
   * Name of the validator to use.
   * @attribute
   */
  @property({ type: String })
  validator?: string;

  // HTMLInputElement attributes for binding if needed
  /**
   * Bind the `<input>`'s `autocomplete` property.
   * @default off
   * @attribute
   */
  @property({ type: String })
  autocomplete: SupportedAutocomplete = 'off';

  /**
   * Binds this to the `<input>`'s `inputMode` property.
   * @attribute
   */
  @property({ type: String })
  inputMode: string = '';

  /**
   * The minimum length of the input value.
   * Binds this to the `<input>`'s `minLength` property.
   * @attribute
   */
  @property({ type: Number })
  minLength?: number;

  /**
   * The maximum length of the input value.
   * Binds this to the `<input>`'s `maxLength` property.
   * @attribute
   */
  @property({ type: Number })
  maxLength?: number;

  /**
   * The minimum (numeric or date-time) input value.
   * Binds this to the `<input>`'s `min` property.
   * @attribute
   */
  @property({ type: Number })
  min?: number;

  /**
   * The maximum (numeric or date-time) input value.
   * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
   * Binds this to the `<input>`'s `max` property.
   * @attribute
   */
  @property({ type: Number })
  max?: number;

  /**
   * Limits the numeric or date-time increments.
   *
   * Binds this to the `<input>`'s `step` property.
   * @attribute
   */
  @property({ type: String })
  step?: string;

  /**
   * Binds this to the `<input>`'s `name` property.
   * @attribute
   */
  @property({ type: String })
  name?: string;

  /**
   * A placeholder string in addition to the label. If this is set, the label will always float.
   * Please, use with careful.
   * @attribute
   */
  @property({ type: String })
  placeholder?: string;

  /**
   * Binds this to the `<input>`'s `readonly` property.
   * @attribute
   * @default false
   */
  @property({ type: Boolean })
  readOnly?: boolean;

  /**
   * Binds this to the `<input>`'s `size` property.
   * @attribute
   */
  @property({ type: Number })
  size?: number;

  /**
   * Binds this to the `<input>`'s `spellcheck` property.
   * @attribute
   */
  @property({ type: Boolean })
  spellcheck = false;

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
  autocapitalize: SupportedAutocapitalize = 'off';

  // Nonstandard attributes for binding if needed

  /**
   * Binds this to the `<input>`'s `autocorrect` property.
   * @default off
   * @attribute
   */
  @property({ type: String })
  autocorrect = 'off';

  /**
   * Binds this to the `<input>`'s `results` property,
   * used with type=search.
   *
   * The maximum number of items that should be displayed in the
   * drop-down list of previous search queries. Safari only.
   * @attribute
   */
  @property({ type: Number })
  results?: number;

  /**
   * Binds this to the `<input>`'s `accept` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: String })
  accept?: string;

  /**
   * Binds this to the`<input>`'s `multiple` property,
   * used with type=file.
   * @attribute
   */
  @property({ type: Boolean })
  multiple?: boolean;

  @state()
  _ariaLabelledBy = '';

  /**
   * When set, it reduces height of the button and hides
   * the label when the value is provided.
   *
   * Use it carefully as user should be able to recognize the input
   * when the value is predefined.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  noLabelFloat?: boolean;

  _previousValidInput = '';

  _patternAlreadyChecked = false;

  _shiftTabPressed = false;

  get _prefixed(): HTMLSlotElement | null {
    return this.querySelector('[slot=prefix]');
  }

  get _isFloating(): boolean {
    const { value } = this;
    if (!!value || value === 0) {
      return true;
    }
    if (floatTypes.includes(this.type)) {
      return true;
    }
    return !!this.placeholder || !!this.focused;
  }

  get _labelClass(): string {
    const labelFloating = this._isFloating;
    let result = 'label';
    if (this._prefixed) {
      result += ' with-prefix';
    }
    if (labelFloating && this.noLabelFloat) {
      result += ' hidden';
    } else {
      result += labelFloating ? ' floating' : ' resting';
    }
    if (this.anypoint) {
      result += ' anypoint';
    }
    return result;
  }

  get _infoAddonClass(): string {
    let result = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      result += ' label-hidden';
    }
    return result;
  }

  get _errorAddonClass(): string {
    let result = 'invalid';
    if (!this.invalid) {
      result += ' label-hidden';
    }
    if (this.infoMessage) {
      result += ' info-offset';
    }
    return result;
  }

  get _inputType(): SupportedInputTypes {
    if (this.type) {
      return this.type as SupportedInputTypes;
    }
    return 'text';
  }

  get bindValue(): string {
    const { value, type } = this;
    if (value === undefined || value === null) {
      return '';
    }
    if (type === 'number') {
      const parsed = parseInt(value, 10);
      if (Number.isNaN(parsed)) {
        return '';
      }
    }
    return value;
  }

  constructor() {
    super();
    this._onKeydown = this._onKeydown.bind(this);
    this._validationStatesHandler = this._validationStatesHandler.bind(this);
    this._focusBlurHandler = this._focusBlurHandler.bind(this);

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('validationstateschange', this._validationStatesHandler);
    this.addEventListener('focus', this._focusBlurHandler);
    this.addEventListener('blur', this._focusBlurHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('validationstateschange', this._validationStatesHandler);
    this.removeEventListener('focus', this._focusBlurHandler);
    this.removeEventListener('blur', this._focusBlurHandler);
  }

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(cp);
    if (cp.has('focused')) {
      this._notifyFocus(!!this.focused);
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

  firstUpdated(): void {
    requestAnimationFrame(() => {
      this._updateAriaLabelledBy();
    });
  }

  checkValidity(): boolean {
    return (
      this._getValidity(this.value)
      // @ts-ignore
      && ((this._internals && this._internals.checkValidity()) || true)
    );
  }

  /**
   * From `ValidatableMixin`
   * @param value Current invalid sate
   */
  _invalidChanged(value: boolean): void {
    super._invalidChanged(value);
    this._hasValidationMessage = value && !!this.invalidMessage;
    this._ensureInvalidAlertSate(value);
  }

  _ensureInvalidAlertSate(invalid?: boolean): void {
    if (!this.invalidMessage) {
      return;
    }
    const root = this.shadowRoot;
    if (!root) {
      return;
    }
    const node = root.querySelector('p.invalid');
    if (!node) {
      return;
    }
    if (invalid) {
      node.setAttribute('role', 'alert');
    } else {
      node.removeAttribute('role');
    }
    setTimeout(() => {
      node.removeAttribute('role');
    }, 1000);
  }

  /**
   * Forwards focus to inputElement.
   */
  _focusBlurHandler(event: FocusEvent): void {
    if (this.disabled) {
      if (this.focused) {
        this.focused = false;
        this.blur();
      }
      return;
    }
    this.focused = event.type === 'focus';

    // Forward the focus to the nested input.
    if (this.focused && !this._shiftTabPressed) {
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
    if (event.type === 'blur' && this.autoValidate) {
      this.validate();
    }
  }

  /**
   * Handler for the keydown event.
   */
  _onKeydown(event: KeyboardEvent): void {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === 'Tab' && event.shiftKey) {
      this._onShiftTabDown(event);
      return;
    }
    const { type, preventInvalidInput } = this;
    if (!preventInvalidInput || ['number', 'file'].indexOf(type) !== -1) {
      return;
    }
    const regexp = this._patternRegExp;
    if (!regexp) {
      return;
    }
    // Handle special keys and backspace
    if (event.metaKey || event.ctrlKey || event.key === 'Backspace') {
      return;
    }
    // Check the pattern either here or in `_onInput`, but not in both.
    this._patternAlreadyChecked = true;
    const thisChar = event.key;
    if (isPrintable(event) && !regexp.test(thisChar)) {
      event.preventDefault();
      this._announceInvalidCharacter(
        `Invalid character ${thisChar} not entered.`
      );
    }
  }

  /**
   * Handler that is called when a shift+tab keypress is detected by the menu.
   */
  _onShiftTabDown(e: KeyboardEvent): void {
    if (e.target !== this) {
      return;
    }
    const oldTabIndex = this.getAttribute('tabindex');
    this._shiftTabPressed = true;
    this.setAttribute('tabindex', '-1');
    setTimeout(() => {
      if (oldTabIndex) {
        this.setAttribute('tabindex', oldTabIndex);
      } else {
        this.removeAttribute('tabindex');
      }
      this._shiftTabPressed = false;
    }, 1);
  }

  /**
   * Calls when `autoValidate` changed
   */
  _autoValidateChanged(value?: boolean): void {
    if (value) {
      this.validate();
    }
  }

  /**
   * Restores the cursor to its original position after updating the value.
   * @param newValue The value that should be saved.
   */
  updateValueAndPreserveCaret(newValue: string): void {
    // Not all elements might have selection, and even if they have the
    // right properties, accessing them might throw an exception (like for
    // <input type=number>)
    const input = this.inputElement;
    if (!input) {
      return;
    }
    try {
      const start = input.selectionStart;
      this.value = newValue;
      input.value = newValue;
      // The cursor automatically jumps to the end after re-setting the value,
      // so restore it to its original position.
      input.selectionStart = start;
      input.selectionEnd = start;
    } catch (e) {
      // Just set the value and give up on the caret.
      this.value = newValue;
    }
  }

  _updateAriaLabelledBy(): void {
    const slot = this.shadowRoot!.querySelector('slot[name="label"]') as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    if (!nodes.length) {
      return;
    }
    let label;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        label = nodes[i] as Element;
        break;
      }
    }
    if (!label) {
      this._ariaLabelledBy = '';
      return;
    }
    let labelledBy;
    if (label.id) {
      labelledBy = label.id;
    } else {
      const nextId = nextLabelID++;
      labelledBy = `anypoint-input-label-${nextId}`;
      label.id = labelledBy;
    }
    this._ariaLabelledBy = labelledBy;
  }

  _onChange(event: Event): void {
    // In the Shadow DOM, the `change` event is not leaked into the
    // ancestor tree, so we must do this manually.
    // See https://w3c.github.io/webcomponents/spec/shadow/
    // #events-that-are-not-leaked-into-ancestor-trees.
    if (this.shadowRoot) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          detail: {
            sourceEvent: event,
          },
          bubbles: event.bubbles,
          cancelable: event.cancelable,
        })
      );
    }
  }

  _onInput(e: Event): void {
    const targetNode = e.target as HTMLInputElement;
    let { value } = targetNode;
    // Need to validate each of the characters pasted if they haven't
    // been validated inside `_onKeydown` already.
    let valid = true;
    if (
      (this.preventInvalidInput || this.allowedPattern)
      && !this._patternAlreadyChecked
    ) {
      valid = this._checkPatternValidity(value);
      if (!valid) {
        this._announceInvalidCharacter(
          'Invalid string of characters entered.'
        );
        value = this._previousValidInput;
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
      this.validate();
    }
  }

  /**
   * Checks validity for pattern, if any
   * @param value The value to test for pattern
   */
  _checkPatternValidity(value?: string): boolean {
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

  _announceInvalidCharacter(message: string): void {
    this.dispatchEvent(
      new CustomEvent('announce', {
        detail: {
          text: message,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Called when `autofocus` property changed.
   * @param value Current `autofocus` value
   */
  _autofocusChanged(value: boolean): void {
    // Firefox doesn't respect the autofocus attribute if it's applied after
    // the page is loaded (Chrome/WebKit do respect it), preventing an
    // autofocus attribute specified in markup from taking effect when the
    // element is upgraded. As a workaround, if the autofocus property is set,
    // and the focus hasn't already been moved elsewhere, we take focus.
    if (value && this.inputElement) {
      // In IE 11, the default document.activeElement can be the page's
      // outermost html element, but there are also cases (under the
      // polyfill?) in which the activeElement is not a real HTMLElement, but
      // just a plain object. We identify the latter case as having no valid
      // activeElement.
      const { activeElement } = document;
      const isActiveElementValid = activeElement instanceof HTMLElement;

      // Has some other element has already taken the focus?
      const isSomeElementActive = isActiveElementValid
        && activeElement !== document.body
        && activeElement !== document.documentElement; /* IE 11 */
      if (!isSomeElementActive) {
        // No specific element has taken the focus yet, so we can take it.
        this.inputElement.focus();
      }
    }
  }

  /**
   * Returns true if `value` is valid. The validator provided in `validator`
   * will be used first, then any constraints.
   * @return True if the value is valid.
   */
  validate(): boolean {
    if (!this.inputElement) {
      this.invalid = false;
      return true;
    }
    let valid = this._checkInputValidity();
    // Only do extra checking if the browser thought this was valid.
    if (valid) {
      // Empty, required input is invalid
      if (this.required && this.value === '') {
        valid = false;
      } else if (this.validator) {
        valid = super.validate(this.value);
      }
    }

    this.invalid = !valid;
    return valid;
  }

  /**
   * Because of the `value` property binding to the input element the value on
   * input element changes programmatically which renders input element's validation
   * valid even if it isn't. This function runs the steps as the regular input
   * validation would, including input validation.
   * @return True if the element is valid.
   */
  _checkInputValidity(): boolean {
    const { type, required, value } = this;
    const emptyValue = value === undefined || value === null || value === '';
    let valid = !required || (!!required && !emptyValue);
    if (!valid) {
      return valid;
    }
    if (type === 'file') {
      return true;
    }
    const input = this.inputElement;
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
   * Called when validation states changed.
   * Validation states are set by validatable mixin and is a result of calling
   * a custom validator. Each validator returns an object with `valid` and `message`
   * properties.
   *
   * See `ValidatableMixin` for more information.
   */
  _validationStatesHandler(e: Event): void {
    const { value } = (e as CustomEvent).detail;
    const hasStates = !!(value && value.length);
    this._hasValidationMessage = hasStates;
    if (!hasStates) {
      return;
    }
    const parts = [];
    for (let i = 0, len = value.length; i < len; i++) {
      if (!value[i].valid) {
        parts[parts.length] = value[i].message;
      }
    }
    this.invalidMessage = parts.join('. ');
  }

  /**
   * Re-targets an event that does not bubble
   *
   * @param e The event to retarget
   */
  _retargetEvent(e: Event): void {
    this.dispatchEvent(new Event(e.type));
  }

  _notifyFocus(value: boolean): void {
    this.dispatchEvent(new CustomEvent('focusedchange', { detail: { value, } }));
  }

  _notifyDisabled(value: boolean): void {
    this.dispatchEvent(new CustomEvent('disabledchange', { detail: { value } }));
  }

  /**
   * Updates aria attribute for disabled state.
   * @param disabled Current state of disabled.
   */
  _disabledChanged(disabled?: boolean): void {
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';
    if (disabled) {
      // Read the `tabindex` attribute instead of the `tabIndex` property.
      // The property returns `-1` if there is no `tabindex` attribute.
      // This distinction is important when restoring the value because
      // leaving `-1` hides shadow root children from the tab order.
      this._oldTabIndex = this.getAttribute('tabindex');
      this.focused = false;
      this.setAttribute('tabindex', '-1');
      this.blur();
    } else if (this._oldTabIndex !== undefined) {
      if (this._oldTabIndex === null) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', this._oldTabIndex);
      }
    }
  }

  render(): TemplateResult {
    return html`
    <div class="input-container">
      ${this._prefixTemplate()}
      <div class="input-label">
        ${this._labelTemplate()} ${this._inputTemplate()}
      </div>
      ${this._suffixTemplate()}
    </div>
    ${this._assistiveTemplate()}
    `;
  }

  _suffixTemplate(): TemplateResult {
    return html`<div class="suffixes">
      <slot name="suffix"></slot>
    </div>`;
  }

  _prefixTemplate(): TemplateResult {
    return html`<div class="prefixes">
      <slot name="prefix"></slot>
    </div>`;
  }

  _assistiveTemplate(): TemplateResult {
    const {
      invalidMessage,
      infoMessage,
      _errorAddonClass,
      _infoAddonClass,
    } = this;
    return html`<div class="assistive-info">
      ${infoMessage
        ? html`<p class="${_infoAddonClass}">${this.infoMessage}</p>`
        : ''}
      ${invalidMessage
        ? html`<p class="${_errorAddonClass}">${invalidMessage}</p>`
        : ''}
    </div>`;
  }

  _labelTemplate(): TemplateResult {
    const { _labelClass, _ariaLabelledBy } = this;
    return html`<div class="${_labelClass}" id="${ifDefined(_ariaLabelledBy)}">
      <slot name="label"></slot>
    </div>`;
  }

  _inputTemplate(): TemplateResult {
    const {
      _ariaLabelledBy,
      disabled,
      pattern,
      required,
      autocomplete,
      autofocus,
      inputMode,
      minLength,
      maxLength,
      min,
      max,
      name,
      placeholder,
      readOnly,
      list,
      size,
      autocapitalize,
      autocorrect,
      results,
      accept,
      multiple,
      spellcheck,
      bindValue,
      _inputType,
    } = this;
    const step = typeof this.step === 'undefined' ? undefined : Number(this.step);
    return html`<input
      class="input-element"
      aria-labelledby="${ifDefined(_ariaLabelledBy)}"
      ?disabled="${disabled}"
      type="${ifDefined(_inputType)}"
      pattern="${ifDefined(pattern)}"
      ?required="${required}"
      autocomplete="${ifDefined(autocomplete)}"
      ?autofocus="${autofocus}"
      inputmode="${ifDefined(inputMode)}"
      minlength="${ifDefined(minLength)}"
      maxlength="${ifDefined(maxLength)}"
      min="${ifDefined(min)}"
      max="${ifDefined(max)}"
      step="${ifDefined(step)}"
      name="${ifDefined(name)}"
      placeholder="${ifDefined(placeholder)}"
      ?readonly="${readOnly}"
      list="${ifDefined(list)}"
      size="${ifDefined(size)}"
      autocapitalize="${ifDefined(autocapitalize)}"
      autocorrect="${ifDefined(autocorrect)}"
      tabindex="-1"
      results="${ifDefined(results)}"
      accept="${ifDefined(accept)}"
      ?multiple="${multiple}"
      spellcheck="${ifDefined(spellcheck)}"
      .value="${bindValue}"
      @change="${this._onChange}"
      @input="${this._onInput}"
      @search="${this._retargetEvent}"
    />`;
  }
}

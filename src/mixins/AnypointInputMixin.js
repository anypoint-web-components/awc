import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { ValidatableMixin } from './ValidatableMixin.js';
import { ControlStateMixin } from './ControlStateMixin.js';

/* eslint-disable no-plusplus */

let nextLabelID = 0;

/**
 * @param {KeyboardEvent} event
 * @return {boolean}
 */
function isPrintable(event) {
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
  const anyNonPrintable =
    event.keyCode === 8 || // backspace
    event.keyCode === 9 || // tab
    event.keyCode === 13 || // enter
    event.keyCode === 27; // escape

  // For these keys, make sure it's a browser keycode and not an ASCII code.
  const mozNonPrintable =
    event.keyCode === 19 || // pause
    event.keyCode === 20 || // caps lock
    event.keyCode === 45 || // insert
    event.keyCode === 46 || // delete
    event.keyCode === 144 || // num lock
    event.keyCode === 145 || // scroll lock
    (event.keyCode > 32 && event.keyCode < 41) || // page up/down, end, home, arrows
    (event.keyCode > 111 && event.keyCode < 124); // fn keys

  return !anyNonPrintable && !(event.charCode === 0 && mozNonPrintable);
}

/**
 * @param {typeof HTMLElement} base
 * @mixes ValidatableMixin
 * @mixes ControlStateMixin
 */
const mxFunction = base => {
  class AnypointInputMixinImpl extends ValidatableMixin(ControlStateMixin(base)) {
    /**
     * For form-associated custom elements. Marks this custom element
     * as form enabled element.
     */
    static get formAssociated() {
      return true;
    }

    /**
     * When form-associated custom elements are supported in the browser it
     * returns `<form>` element associated with this control.
     */
    get form() {
      return (this._internals && this._internals.form) || null;
    }

    get value() {
      return this._value;
    }

    set value(value) {
      const old = this._value;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._value = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('value', old);
      }
      /* istanbul ignore else */
      if (this._internals) {
        this._internals.setFormValue(value);
      }
      this.dispatchEvent(
        new CustomEvent('value-changed', {
          detail: {
            value,
          },
        })
      );
    }

    get hasValidationMessage() {
      return this._hasValidationMessage;
    }

    get _hasValidationMessage() {
      return this.__hasValidationMessage;
    }

    set _hasValidationMessage(value) {
      const old = this.__hasValidationMessage;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__hasValidationMessage = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('hasValidationMessage', old);
      }
      this.__hasValidationMessage = value;
      this.dispatchEvent(
        new CustomEvent('hasvalidationmessage-changed', {
          detail: {
            value,
          },
        })
      );
    }

    get autofocus() {
      return this._autofocus;
    }

    set autofocus(value) {
      const old = this._autofocus;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._autofocus = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('autofocus', old);
      }
      this._autofocusChanged(value);
    }

    get autoValidate() {
      return this._autoValidate;
    }

    set autoValidate(value) {
      const old = this._autoValidate;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._autoValidate = value;
      this._autoValidateChanged(value);
    }

    get invalidMessage() {
      return this._invalidMessage;
    }

    set invalidMessage(value) {
      const old = this._invalidMessage;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._invalidMessage = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('invalidMessage', old);
      }
      this._hasValidationMessage = this.invalid && !!value;
    }

    get _patternRegExp() {
      let pattern;
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
     * @return {HTMLInputElement|HTMLTextAreaElement} Returns a reference to the input element.
     */
    get inputElement() {
      return this.shadowRoot.querySelector('input,textarea');
    }

    static get properties() {
      return {
        /**
         * The value for this input. If you're using PaperInputBehavior to
         * implement your own paper-input-like element, bind this to
         * the `<input>`'s `bindValue`
         * property, or the value property of your input that is `notify:true`.
         * @attribute
         */
        value: { notify: true },
        /**
         * Set to true to prevent the user from entering invalid input.
         * @attribute
         */
        preventInvalidInput: { type: Boolean },
        /**
         * Set this to specify the pattern allowed by `preventInvalidInput`.
         * @attribute
         */
        allowedPattern: { type: String },
        /**
         * The type of the input. The supported types are `text`, `number` and `password`.
         * @attribute
         */
        type: { type: String },
        /**
         * The datalist of the input (if any). This should match the id of an existing `<datalist>`.
         * @attribute
         */
        list: { type: String },
        /**
         * A pattern to validate the `input` with.
         * @attribute
         */
        pattern: { type: String },

        /**
         * Sets the input as required.
         * @attribute
         */
        required: { type: Boolean },
        /**
         * The error message to display when the input is invalid.
         * @attribute
         */
        invalidMessage: { type: String },
        /**
         * Assistive text value.
         * Rendered below the input.
         * @attribute
         */
        infoMessage: { type: String },
        /**
         * Value computed from `invalidMessage`, `invalid` and `validationStates`.
         * True if the validation message should be displayed.
         */
        _hasValidationMessage: { type: Boolean },
        /**
         * Set to true to auto-validate the input value.
         * @attribute
         */
        autoValidate: { type: Boolean },
        /**
         * Name of the validator to use. See `AnypointInputMixin`.
         * @attribute
         */
        validator: { type: String },

        // HTMLInputElement attributes for binding if needed
        /**
         * Bind the `<input>`'s `autocomplete` property.
         * @default off
         * @attribute
         */
        autocomplete: { type: String },
        /**
         * Binds this to the `<input>`'s `autofocus` property.
         * @attribute
         */
        autofocus: { type: Boolean },
        /**
         * Binds this to the `<input>`'s `inputMode` property.
         * @attribute
         */
        inputMode: { type: String },
        /**
         * The minimum length of the input value.
         * Binds this to the `<input>`'s `minLength` property.
         * @attribute
         */
        minLength: { type: Number },
        /**
         * The maximum length of the input value.
         * Binds this to the `<input>`'s `maxLength` property.
         * @attribute
         */
        maxLength: { type: Number },
        /**
         * The minimum (numeric or date-time) input value.
         * Binds this to the `<input>`'s `min` property.
         * @attribute
         */
        min: { type: String },
        /**
         * The maximum (numeric or date-time) input value.
         * Can be a String (e.g. `"2000-01-01"`) or a Number (e.g. `2`).
         * Binds this to the `<input>`'s `max` property.
         * @attribute
         */
        max: { type: String },
        /**
         * Limits the numeric or date-time increments.
         *
         * Binds this to the `<input>`'s `step` property.
         * @attribute
         */
        step: { type: String },
        /**
         * Binds this to the `<input>`'s `name` property.
         * @attribute
         */
        name: { type: String },
        /**
         * A placeholder string in addition to the label. If this is set, the label will always float.
         * Please, use with careful.
         * @attribute
         */
        placeholder: { type: String },
        /**
         * Binds this to the `<input>`'s `readonly` property.
         * @attribute
         * @default false
         */
        readOnly: { type: Boolean },
        /**
         * Binds this to the `<input>`'s `size` property.
         * @attribute
         */
        size: { type: Number },
        /**
         * Binds this to the `<input>`'s `spellcheck` property.
         * @attribute
         */
        spellcheck: { type: String },
        // Nonstandard attributes for binding if needed
        // /**
        //  * Binds this to the `<input>`'s `autocapitalize` property.
        //  *
        //  * Possible values are:
        //  *
        //  * - `off` or `none`: No autocapitalization is applied (all letters default to lowercase)
        //  * - `on` or `sentences`: The first letter of each sentence defaults to a capital letter;
        //  *  all other letters default to lowercase
        //  * - `words`: The first letter of each word defaults to a capital letter; all other letters default to lowercase
        //  * - `characters`: All letters should default to uppercase
        //  *
        //  * @default none
        //  */
        // autocapitalize: { type: String },
        /**
         * Binds this to the `<input>`'s `autocorrect` property.
         * @default off
         * @attribute
         */
        autocorrect: { type: String },
        /**
         * Binds this to the `<input>`'s `results` property,
         * used with type=search.
         *
         * The maximum number of items that should be displayed in the
         * drop-down list of previous search queries. Safari only.
         * @attribute
         */
        results: { type: Number },
        /**
         * Binds this to the `<input>`'s `accept` property,
         * used with type=file.
         * @attribute
         */
        accept: { type: String },
        /**
         * Binds this to the`<input>`'s `multiple` property,
         * used with type=file.
         * @attribute
         */
        multiple: { type: Boolean },

        _ariaLabelledBy: { type: String },
        /**
         * Enables outlined theme.
         * @attribute
         */
        outlined: { type: Boolean, reflect: true },
        /**
         * Enables Anypoint theme.
         * @attribute
         */
        anypoint: { type: Boolean, reflect: true },
        /**
         * When set, it reduces height of the button and hides
         * the label when the value is provided.
         *
         * Use it carefully as user should be able to recognize the input
         * when the value is predefined.
         * @attribute
         */
        noLabelFloat: { type: Boolean, reflect: true },
      };
    }

    constructor() {
      super();
      this.autoValidate = false;
      this.autocomplete = 'off';
      this.autocorrect = 'off';
      this.type = undefined;
      this.required = undefined;
      this.minLength = undefined;
      this.maxLength = undefined;
      this.allowedPattern = undefined;
      this._ariaLabelledBy = '';
      this._previousValidInput = '';
      this._patternAlreadyChecked = false;
      this.preventInvalidInput = false;
      this._onKeydown = this._onKeydown.bind(this);
      this._validationStatesHandler = this._validationStatesHandler.bind(this);

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', '0');
      }
      /* istanbul ignore else */
      // @ts-ignore
      if (this.attachInternals) {
        // @ts-ignore
        this._internals = this.attachInternals();
      }
    }

    connectedCallback() {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this.addEventListener('keydown', this._onKeydown);
      this.addEventListener(
        'validationstates-changed',
        this._validationStatesHandler
      );
    }

    disconnectedCallback() {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.removeEventListener('keydown', this._onKeydown);
      this.removeEventListener(
        'validationstates-changed',
        this._validationStatesHandler
      );
    }

    /**
     * When form-associated custom elements are supported in the browser it
     * is called when for disabled state changed.
     * @param {Boolean} disabled Form disabled state
     */
    formDisabledCallback(disabled) {
      this.disabled = disabled;
    }

    /**
     * When form-associated custom elements are supported in the browser it
     * is called when the form has been reset
     */
    formResetCallback() {
      this.value = '';
    }

    /**
     * When form-associated custom elements are supported in the browser it
     * is called when the form state has been restored
     *
     * @param {String} state Restored value
     */
    formStateRestoreCallback(state) {
      this.value = state;
    }

    firstUpdated() {
      this._updateAriaLabelledBy();
    }

    checkValidity() {
      return (
        this._getValidity(this.value) &&
        ((this._internals && this._internals.checkValidity()) || true)
      );
    }

    /**
     * From `ValidatableMixin`
     * @param {Boolean} value Current invalid sate
     * @override
     */
    _invalidChanged(value) {
      super._invalidChanged(value);
      this._hasValidationMessage = value && !!this.invalidMessage;
      this._ensureInvalidAlertSate(value);
    }

    _ensureInvalidAlertSate(invalid) {
      if (!this.invalidMessage) {
        return;
      }
      const node = this.shadowRoot.querySelector('p.invalid');
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
     * Forwards focus to inputElement. Overridden from ControlStateMixin.
     * @param {FocusEvent} event
     */
    _focusBlurHandler(event) {
      super._focusBlurHandler(event);
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
     * @param {KeyboardEvent} event
     */
    _onKeydown(event) {
      // @ts-ignore
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
     *
     * @param {KeyboardEvent} e Event handled.
     */
    _onShiftTabDown(e) {
      if (e.target !== this) {
        return;
      }
      const oldTabIndex = this.getAttribute('tabindex');
      this._shiftTabPressed = true;
      this.setAttribute('tabindex', '-1');
      setTimeout(() => {
        this.setAttribute('tabindex', oldTabIndex);
        this._shiftTabPressed = false;
      }, 1);
    }

    /**
     * Calls when `autoValidate` changed
     * @param {Boolean} value
     */
    _autoValidateChanged(value) {
      if (value) {
        this.validate();
      }
    }

    /**
     * Restores the cursor to its original position after updating the value.
     * @param {string} newValue The value that should be saved.
     */
    updateValueAndPreserveCaret(newValue) {
      // Not all elements might have selection, and even if they have the
      // right properties, accessing them might throw an exception (like for
      // <input type=number>)
      const input = this.inputElement;
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

    _updateAriaLabelledBy() {
      const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector(
        'slot[name="label"]'
      ));
      const nodes = slot.assignedNodes();
      if (!nodes.length) {
        return;
      }
      let label;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === Node.ELEMENT_NODE) {
          label = /** @type Element */ (nodes[i]);
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

    _onChange(event) {
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

    _onInput(e) {
      let { value } = e.target;
      // Need to validate each of the characters pasted if they haven't
      // been validated inside `_onKeydown` already.
      let valid = true;
      if (
        (this.preventInvalidInput || this.allowedPattern) &&
        !this._patternAlreadyChecked
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
      const isNotFile = e.target.type !== 'file';
      if (isNotFile && e.target.value !== value) {
        e.target.value = value;
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
     * @param {String=} value The value to test for pattern
     * @return {Boolean}
     */
    _checkPatternValidity(value) {
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

    _announceInvalidCharacter(message) {
      this.dispatchEvent(
        new CustomEvent('iron-announce', {
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
     * @param {Boolean} value Current `autofocus` value
     */
    _autofocusChanged(value) {
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
        const isSomeElementActive =
          isActiveElementValid &&
          activeElement !== document.body &&
          activeElement !== document.documentElement; /* IE 11 */
        if (!isSomeElementActive) {
          // No specific element has taken the focus yet, so we can take it.
          this.inputElement.focus();
        }
      }
    }

    /**
     * Returns true if `value` is valid. The validator provided in `validator`
     * will be used first, then any constraints.
     * @return {boolean} True if the value is valid.
     */
    validate() {
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
     * @return {Boolean} True if the element is valid.
     */
    _checkInputValidity() {
      const { type, required, value } = this;
      const emptyValue = value === undefined || value === null || value === '';
      let valid = !required || (!!required && !emptyValue);
      if (!valid) {
        return valid;
      }
      if (type === 'file') {
        return true;
      }
      valid = this.inputElement.checkValidity();
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
     *
     * @param {CustomEvent} e
     */
    _validationStatesHandler(e) {
      const { value } = e.detail;
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
  }
  return AnypointInputMixinImpl;
};

/**
 * Use `AnypointInputMixin` to implement accessible inputs
 *
 * @mixin
 */
export const AnypointInputMixin = dedupeMixin(mxFunction);

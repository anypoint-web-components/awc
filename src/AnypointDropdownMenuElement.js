import { html, LitElement } from 'lit-element';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';
import { ValidatableMixin } from './mixins/ValidatableMixin.js';
import '../anypoint-dropdown.js';
import '../anypoint-icon-button.js';
import { arrowDown } from './AnypointDropdownMenuIcons.js';
import DropdownStyles from './styles/DropdownMenu.js';

/** @typedef {import('./mixins/ValidatableMixin').ValidationResult} ValidationResult */
/** @typedef {import('./AnypointDropdownElement').default} AnypointDropdownElement */
/** @typedef {import('./AnypointListboxElement').default} AnypointListboxElement */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */

/**
 * Accessible dropdown menu for Anypoint platform.
 *
 * The element works perfectly with `anypoint-listbox` which together creates an
 * accessible list of options. The listbox can be replaced by any other element
 * that support similar functionality but make sure it has an appropriate aria
 * support.
 *
 * See README.md file for detailed documentation.
 */
export default class AnypointDropdownMenuElement extends ValidatableMixin(ControlStateMixin(LitElement)) {
  get styles() {
    return DropdownStyles;
  }

  render() {
    const {
      opened,
      horizontalAlign,
      verticalAlign,
      dynamicAlign,
      horizontalOffset,
      verticalOffset,
      noOverlap,
      openAnimationConfig,
      closeAnimationConfig,
      noAnimations,
      allowOutsideScroll,
      restoreFocusOnClose,
      value,
      invalidMessage,
      infoMessage,
      anypoint,
      _labelClass,
      _errorAddonClass,
      _infoAddonClass,
      _triggerClass,
      _inputContainerClass,
      fitPositionTarget,
      name,
    } = this;

    const renderValue = value || '';
    return html`<style>
        ${this.styles}
      </style>
      <div class="${_inputContainerClass}">
        <div class="${_labelClass}" id="${name}">
          <slot name="label"></slot>
        </div>

        <div class="input-wrapper">
          <div class="input">
            ${renderValue}
            <span class="input-spacer">&nbsp;</span>
          </div>
          <anypoint-icon-button
            @click="${this.toggle}"
            aria-label="Toggles dropdown menu"
            tabindex="-1"
            class="${_triggerClass}"
            ?anypoint="${anypoint}"
          >
            <span class="trigger-icon ${opened ? 'opened' : ''}"
              >${arrowDown}</span
            >
          </anypoint-icon-button>
        </div>

        <anypoint-dropdown
          .fitPositionTarget="${fitPositionTarget}"
          .opened="${opened}"
          .horizontalAlign="${horizontalAlign}"
          .verticalAlign="${verticalAlign}"
          .dynamicAlign="${dynamicAlign}"
          .horizontalOffset="${horizontalOffset}"
          .verticalOffset="${verticalOffset}"
          .noOverlap="${noOverlap}"
          .openAnimationConfig="${openAnimationConfig}"
          .closeAnimationConfig="${closeAnimationConfig}"
          .noAnimations="${noAnimations}"
          .allowOutsideScroll="${allowOutsideScroll}"
          .restoreFocusOnClose="${restoreFocusOnClose}"
          @closed="${this._dropdownClosed}"
          @opened="${this._dropdownOpened}"
          @selected="${this._selectHandler}"
          @deselect="${this._deselectHandler}"
          aria-labelledby="${name}"
        >
          <div slot="dropdown-content" class="dropdown-content">
            <slot id="content" name="dropdown-content"></slot>
          </div>
        </anypoint-dropdown>
      </div>
      <div class="assistive-info">
        ${infoMessage
          ? html`<p class="${_infoAddonClass}">${infoMessage}</p>`
          : ''}
        ${invalidMessage
          ? html`<p class="${_errorAddonClass}">${invalidMessage}</p>`
          : ''}
      </div> `;
  }

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

  get validationStates() {
    return this._validationStates;
  }

  set validationStates(value) {
    const old = this._validationStates;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._validationStates = value;
    /* istanbul ignore else */
    if (this.requestUpdate) {
      this.requestUpdate('validationStates', old);
    }
    this._hasValidationMessage = !!(value && value.length);
    this._validationStatesChanged(value);
    this.dispatchEvent(
      new CustomEvent('validationstateschange', {
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
    if (this.requestUpdate) {
      this.requestUpdate('hasValidationMessage', old);
    }
    this.__hasValidationMessage = value;
    this.dispatchEvent(
      new CustomEvent('hasvalidationmessagechange', {
        detail: {
          value,
        },
      })
    );
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
    if (this.requestUpdate) {
      this.requestUpdate('invalidMessage', old);
    }
    this._hasValidationMessage = this.invalid && !!value;
  }

  get _labelClass() {
    const labelFloating = !!this.value;
    let className = 'label';
    if (labelFloating && this.noLabelFloat) {
      className += ' hidden';
    } else {
      className += labelFloating ? ' floating' : ' resting';
    }
    if (this._formDisabled || this.disabled) {
      className += ' form-disabled';
    }
    if (this.anypoint) {
      className += ' anypoint';
    }
    return className;
  }

  get _infoAddonClass() {
    let className = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      className += ' label-hidden';
    }
    return className;
  }

  get _errorAddonClass() {
    let className = 'invalid';
    if (!this.invalid) {
      className += ' label-hidden';
    }
    if (this.infoMessage) {
      className += ' info-offset';
    }
    return className;
  }

  get _triggerClass() {
    let className = 'trigger-button';
    if (this._formDisabled || this.disabled) {
      className += ' form-disabled';
    }
    return className;
  }

  get _inputContainerClass() {
    let className = 'input-container';
    if (this._formDisabled || this.disabled) {
      className += ' form-disabled';
    }
    return className;
  }

  get selectedItem() {
    return this._selectedItem;
  }

  get _selectedItem() {
    return this.__selectedItem;
  }

  set _selectedItem(value) {
    const old = this.__selectedItem;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__selectedItem = value;
    this._selectedItemChanged(value);
  }

  get opened() {
    return this._opened || false;
  }

  set opened(value) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    if (value && (this._disabled || this._formDisabled)) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._openedChanged(value);
    this.dispatchEvent(
      new CustomEvent('openedchange', {
        detail: {
          value,
        },
      })
    );
  }

  /**
   * @return {HTMLElement|null} The content element that is contained by the dropdown menu, if any.
   */
  get contentElement() {
    const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector(
      'slot[name="dropdown-content"]'
    ));
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return /** @type HTMLElement */ (nodes[i]);
      }
    }
    return null;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const old = this._value;
    if (old === value) {
      return;
    }
    this._value = value;
    this.requestUpdate('value', old);
    /* istanbul ignore else */
    if (this._internals) {
      this._internals.setFormValue(value);
    }
  }

  get disabled() {
    return this._disabled || false;
  }

  set disabled(value) {
    const old = this._disabled;
    if (old === value) {
      return;
    }
    this._disabled = value;
    this.requestUpdate('disabled', old);
    if (this.opened) {
      this.opened = false;
    }
  }

  static get properties() {
    return {
      /**
       * An animation config. If provided, this will be used to animate the
       * opening of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      openAnimationConfig: { type: Object },

      /**
       * An animation config. If provided, this will be used to animate the
       * closing of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      closeAnimationConfig: { type: Object },
      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: { type: Boolean, reflect: true },
      /**
       * By default, the dropdown will constrain scrolling on the page
       * to itself when opened.
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       * This property is a shortcut to set `scrollAction` to lock or refit.
       * Prefer directly setting the `scrollAction` property.
       */
      allowOutsideScroll: { type: Boolean, reflect: true },
      /**
       * The orientation against which to align the element vertically
       * relative to the `positionTarget`. Possible values are "top", "bottom",
       * "middle", "auto".
       */
      verticalAlign: { type: String },
      /**
       * The orientation against which to align the element horizontally
       * relative to the `positionTarget`. Possible values are "left", "right",
       * "center", "auto".
       */
      horizontalAlign: { type: String },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `verticalAlign`, in the direction of alignment. You can think
       * of it as increasing or decreasing the distance to the side of the
       * screen given by `verticalAlign`.
       *
       * If `verticalAlign` is "top" or "middle", this offset will increase or
       * decrease the distance to the top side of the screen: a negative offset
       * will move the dropdown upwards; a positive one, downwards.
       *
       * Conversely if `verticalAlign` is "bottom", this offset will increase
       * or decrease the distance to the bottom side of the screen: a negative
       * offset will move the dropdown downwards; a positive one, upwards.
       */
      verticalOffset: { type: Number },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `horizontalAlign`, in the direction of alignment. You can think
       * of it as increasing or decreasing the distance to the side of the
       * screen given by `horizontalAlign`.
       *
       * If `horizontalAlign` is "left" or "center", this offset will increase or
       * decrease the distance to the left side of the screen: a negative offset
       * will move the dropdown to the left; a positive one, to the right.
       *
       * Conversely if `horizontalAlign` is "right", this offset will increase
       * or decrease the distance to the right side of the screen: a negative
       * offset will move the dropdown to the right; a positive one, to the left.
       */
      horizontalOffset: { type: Number },
      /**
       * If true, it will use `horizontalAlign` and `verticalAlign` values as
       * preferred alignment and if there's not enough space, it will pick the
       * values which minimize the cropping.
       */
      dynamicAlign: { type: Boolean, reflect: true },
      /**
       * True if the list is currently displayed.
       */
      opened: { type: Boolean, reflect: true },
      /**
       * Selected item value calculated as it's (in order) label property, label
       * attribute, and `innerText` value.
       */
      value: { type: String },
      /**
       * Name of the form control.
       * Note, form-associated custom elements may not be supported as first
       * implementation was released in Chrome M77 in July 2019. It may require
       * using custom form element to gather form data.
       */
      name: { type: String },
      /**
       * When set it marks the element as required. Calling the `validate`
       * function will mark this control as invalid when no value is selected.
       */
      required: { type: Boolean, reflect: true },
      /**
       * Automatically calls `validate()` function when dropdown closes.
       */
      autoValidate: { type: Boolean, reflect: true },
      /**
       * The error message to display when the input is invalid.
       */
      invalidMessage: { type: String },
      /**
       * Assistive text value.
       * Rendered below the input.
       */
      infoMessage: { type: String },
      /**
       * After calling `validate()` this will be populated by latest result of the test for each
       * validator. Result item will contain following properties:
       *
       * - validator {String} Name of the validator
       * - valid {Boolean} Result of the test
       * - message {String} Error message, populated only if `valid` equal `false`
       *
       * This property is `undefined` if `validator` is not set.
       */
      validationStates: { type: Array },
      /**
       * Value computed from `invalidMessage`, `invalid` and `validationStates`.
       * True if the validation message should be displayed.
       */
      _hasValidationMessage: { type: Boolean },
      /**
       * Will position the list around the button without overlapping
       * it.
       */
      noOverlap: { type: Boolean },
      /**
       * Enables outlined theme.
       */
      outlined: { type: Boolean, reflect: true },
      /**
       * Enables Anypoint theme.
       */
      anypoint: { type: Boolean, reflect: true },
      /**
       * When set the label is rendered only when not selected state.
       * It is useful when using the dropdown in an application menu bar.
       */
      noLabelFloat: { type: Boolean, reflect: true },
      /**
       * When set the control is rendered as disabled form control.
       */
      disabled: { type: Boolean, reflect: true },
      /**
       * Fits the dropdown content width to the dropdown selector. Default to `false`.
       */
      fitPositionTarget: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.noAnimations = false;
    this.allowOutsideScroll = false;
    this.dynamicAlign = false;
    this.noOverlap = false;
    this.horizontalOffset = 0;
    this.verticalOffset = 0;
    this.restoreFocusOnClose = false;
    this.value = '';
    this.name = undefined;

    this.openAnimationConfig = undefined;
    this.closeAnimationConfig = undefined;
    this.infoMessage = undefined;
    this.noLabelFloat = false;
    this.required = false;
    this.fitPositionTarget = false;
    this.anypoint = false;

    this._clickHandler = this._clickHandler.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._focusHandler = this._focusHandler.bind(this);
    /* istanbul ignore else */
    // @ts-ignore
    if (this.attachInternals) {
      // @ts-ignore
      this._internals = this.attachInternals();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'listbox');
    }
    // aria-expanded is set with `opened` flag which is initialized in the constructor.
    this.addEventListener('click', this._clickHandler);
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('focus', this._focusHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._clickHandler);
    this.removeEventListener('keydown', this._onKeydown);
    this.removeEventListener('focus', this._focusHandler);
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param {Boolean} disabled Form disabled state
   */
  formDisabledCallback(disabled) {
    const old = this._formDisabled;
    this._formDisabled = disabled;
    if (disabled && this.opened) {
      this.opened = false;
    }
    this.requestUpdate('_formDisabled', old);
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback() {
    this.value = '';
    const node = this.contentElement;
    /* istanbul ignore else */
    if (node) {
      // @ts-ignore
      node.selected = undefined;
    }
    this._internals.setFormValue('');
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param {String} state Restored value
   */
  formStateRestoreCallback(state) {
    this._internals.setFormValue(state);
  }

  firstUpdated() {
    this._openedChanged(this.opened);
    const { contentElement } = this;
    // @ts-ignore
    const item = contentElement && contentElement.selectedItem;
    if (item) {
      this._selectedItem = item;
    }
  }

  /**
   * Handler for `click` event.
   * Opens the list of the click originated from the shadow DOM.
   * @param {MouseEvent} e
   */
  _clickHandler(e) {
    // @ts-ignore
    const path = e.path || (e.composedPath && e.composedPath());
    /* istanbul ignore if */
    if (!path) {
      return;
    }
    /* istanbul ignore else */
    if (path.indexOf(this) !== -1 && !this.opened) {
      this.opened = true;
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Focuses on the listbox, if available.
   */
  _focusContent() {
    const node = this.contentElement;
    if (node) {
      node.focus();
    }
  }

  /**
   * Handler for the `focus` event.
   * Focuses on the listbox when opened.
   */
  _focusHandler() {
    if (this.opened) {
      this._focusContent();
    }
  }

  /**
   * Handler for the keydown event.
   * @param {KeyboardEvent} e
   */
  _onKeydown(e) {
    if (e.code === 'ArrowDown') {
      this._onDownKey(e);
    } else if (e.code === 'ArrowUp') {
      this._onUpKey(e);
    } else if (e.code === 'Escape') {
      this._onEscKey();
    }
  }

  /**
   * Handler for ArrowDown button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   *
   * @param {KeyboardEvent} e
   */
  _onDownKey(e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      this._focusContent();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Handler for ArrowUp button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   *
   * @param {KeyboardEvent} e
   */
  _onUpKey(e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      this._focusContent();
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Handler for Escape button press.
   * Closes the list if it's open.
   */
  _onEscKey() {
    if (this.opened) {
      this.opened = false;
    }
  }

  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param {Element} selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged(selectedItem) {
    let value = '';
    if (selectedItem) {
      value =
      // @ts-ignore
        selectedItem.label ||
        selectedItem.getAttribute('label') ||
        selectedItem.getAttribute('data-label') ||
        selectedItem.textContent.trim();
    }
    this.value = value;
  }

  /**
   * Toggles `opened` state.
   *
   * @param {MouseEvent=} e When set it cancels the event
   */
  toggle(e) {
    if (this.disabled || this._formDisabled) {
      return;
    }
    this.opened = !this.opened;
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Show the dropdown content.
   */
  open() {
    if (this.disabled || this._formDisabled) {
      return;
    }
    this.opened = true;
  }

  /**
   * Hide the dropdown content.
   */
  close() {
    if (this.disabled || this._formDisabled) {
      return;
    }
    this.opened = false;
  }

  _dropdownClosed() {
    this.opened = false;
    if (this.autoValidate) {
      this.validate(this.value);
      this._updateNativeValidationState();
    }
    this.focus();
  }

  _updateNativeValidationState() {
    if (!this._internals) {
      return;
    }
    if (this.invalid) {
      this._internals.setValidity(
        {
          customError: true,
        },
        'Please select a value.'
      );
    } else {
      this._internals.setValidity({});
    }
  }

  _dropdownOpened() {
    this._focusContent();
  }

  /**
   * @param {Event} e
   */
  _selectHandler(e) {
    this.opened = false;
    const node = /** @type AnypointListboxElement */ (e.target);
    this._selectedItem = node.selectedItem;
  }

  _deselectHandler() {
    this._selectedItem = null;
  }

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   *
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity() {
    return (
      this.disabled ||
      this._formDisabled ||
      !this.required ||
      (this.required && !!this.value)
    );
  }

  _openedChanged(opened) {
    const openState = opened ? 'true' : 'false';
    this.setAttribute('aria-expanded', openState);
    const e = this.contentElement;
    if (e) {
      e.setAttribute('aria-expanded', openState);
    }
  }

  checkValidity() {
    return (
      this._getValidity() &&
      ((this._internals && this._internals.checkValidity()) || true)
    );
  }

  /**
   * Called when validation states changed.
   * Validation states are set by validatable mixin and is a result of calling
   * a custom validator. Each validator returns an object with `valid` and `message`
   * properties.
   *
   * See `ValidatableMixin` for more information.
   *
   * @param {ValidationResult[]} states
   */
  _validationStatesChanged(states) {
    if (!states || !states.length) {
      return;
    }
    const parts = [];
    for (let i = 0, len = states.length; i < len; i++) {
      if (!states[i].valid) {
        parts[parts.length] = states[i].message;
      }
    }
    this.invalidMessage = parts.join('. ');
  }

  /**
   * Calls when `autoValidate` changed
   * @param {Boolean} value
   */
  _autoValidateChanged(value) {
    if (value) {
      this.validate(this.value);
    }
  }

  /**
   * From `ValidatableMixin`
   * @param {Boolean} value Current invalid sate
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
}

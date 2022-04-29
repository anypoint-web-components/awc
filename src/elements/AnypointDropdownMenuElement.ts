import { html, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { HorizontalAlign, VerticalAlign } from './overlay/FitElement.js';
import { arrowDown } from '../resources/Icons.js';
import AnypointListboxElement from './AnypointListboxElement.js';
import DropdownStyles from '../styles/DropdownMenu.js';
import { IAnimationConfig, DefaultListOpenAnimation, DefaultListCloseAnimation } from '../lib/Animations.js';
import { retarget, retargetHandler } from '../lib/Events.js';
import '../define/anypoint-dropdown.js';
import '../define/anypoint-icon-button.js';
import ValidatableElement from './ValidatableElement.js';

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
 * 
 * @fires openedchange
 * 
 * @slot label - The label slot
 * @slot dropdown-content - The slot for the content
 */
export default class AnypointDropdownMenuElement extends ValidatableElement {
  static get styles(): CSSResult {
    return DropdownStyles;
  }

  render(): TemplateResult {
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
    const iconClasses = {
      'trigger-icon': true,
      opened,
    };
    return html`
      <div class="${_inputContainerClass}">
        <div class="${_labelClass}" id="${ifDefined(name)}">
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
            <span class="${classMap(iconClasses)}">${arrowDown}</span>
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
          .openAnimationConfig="${openAnimationConfig || DefaultListOpenAnimation}"
          .closeAnimationConfig="${closeAnimationConfig || DefaultListCloseAnimation}"
          .noAnimations="${noAnimations}"
          .allowOutsideScroll="${allowOutsideScroll}"
          .restoreFocusOnClose="${restoreFocusOnClose}"
          @closed="${this._dropdownClosed}"
          @opened="${this._dropdownOpened}"
          @select="${this._selectHandler}"
          @deselect="${this._deselectHandler}"
          @cancel="${retargetHandler}"
          aria-labelledby="${ifDefined(name)}"
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

  get hasValidationMessage(): boolean | undefined {
    return this._hasValidationMessage;
  }

  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  @state()
  _hasValidationMessage?: boolean;

  _autoValidate?: boolean;

  /**
   * Automatically calls `validate()` function when dropdown closes.
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
    this.requestUpdate();
  }

  get _labelClass(): string {
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

  get _infoAddonClass(): string {
    let className = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      className += ' label-hidden';
    }
    return className;
  }

  get _errorAddonClass(): string {
    let className = 'invalid';
    if (!this.invalid) {
      className += ' label-hidden';
    }
    if (this.infoMessage) {
      className += ' info-offset';
    }
    return className;
  }

  get _triggerClass(): string {
    let className = 'trigger-button';
    if (this._formDisabled || this.disabled) {
      className += ' form-disabled';
    }
    return className;
  }

  get _inputContainerClass(): string {
    let className = 'input-container';
    if (this._formDisabled || this.disabled) {
      className += ' form-disabled';
    }
    return className;
  }

  private __selectedItem: HTMLElement | null | undefined;

  get selectedItem(): HTMLElement | null | undefined {
    return this._selectedItem;
  }

  get _selectedItem(): HTMLElement | null | undefined {
    return this.__selectedItem;
  }

  set _selectedItem(value: HTMLElement | null | undefined) {
    const old = this.__selectedItem;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__selectedItem = value;
    this._selectedItemChanged(value);
  }

  _opened?: boolean;

  /**
   * True if the list is currently displayed.
   */
  @property({ type: Boolean, reflect: true })
  get opened(): boolean {
    return this._opened || false;
  }

  set opened(value: boolean) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    if (value && (this.disabled || this._formDisabled)) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
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
  get contentElement(): HTMLElement | null {
    const { shadowRoot } = this;
    if (!shadowRoot) {
      return null
    }
    const slot = shadowRoot.querySelector('slot[name="dropdown-content"]') as HTMLSlotElement;
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return (nodes[i] as HTMLElement);
      }
    }
    return null;
  }

  _value?: string;

  /**
    * Selected item value calculated as it's (in order) label property, label
    * attribute, and `innerText` value.
    */
  @property({ type: String })
  get value(): string {
    return this._value || '';
  }

  set value(value: string) {
    const old = this._value;
    if (old === value) {
      return;
    }
    this._value = value;
    this.requestUpdate('value', old);
    /* istanbul ignore else */
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue(value);
    }
  }

  /**
   * When set the control is rendered as disabled form control.
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  @property({ type: Array })
  openAnimationConfig?: IAnimationConfig[];

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  @property({ type: Array })
  closeAnimationConfig?: IAnimationConfig[];

  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   */
  @property({ type: Boolean })
  noAnimations?: boolean;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * This property is a shortcut to set `scrollAction` to lock or refit.
   * Prefer directly setting the `scrollAction` property.
   */
  @property({ type: Boolean, reflect: true })
  allowOutsideScroll?: boolean;

  /**
   * The orientation against which to align the element vertically
   * relative to the `positionTarget`. Possible values are "top", "bottom",
   * "middle", "auto".
   */
  @property({ type: String, reflect: true })
  verticalAlign: VerticalAlign = 'top';

  /**
   * The orientation against which to align the element horizontally
   * relative to the `positionTarget`. Possible values are "left", "right",
   * "center", "auto".
   */
  @property({ type: String, reflect: true })
  horizontalAlign: HorizontalAlign = 'left';

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
  @property({ type: Number, reflect: true })
  verticalOffset = 0;

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
  @property({ type: Number, reflect: true })
  horizontalOffset = 0;

  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as
   * preferred alignment and if there's not enough space, it will pick the
   * values which minimize the cropping.
   */
  @property({ type: Boolean, reflect: true })
  dynamicAlign?: boolean;

  /**
   * Name of the form control.
   * Note, form-associated custom elements may not be supported as first
   * implementation was released in Chrome M77 in July 2019. It may require
   * using custom form element to gather form data.
   */
  @property({ type: String })
  name?: string;

  /**
   * When set it marks the element as required. Calling the `validate`
   * function will mark this control as invalid when no value is selected.
   */
  @property({ type: Boolean, reflect: true })
  required?: boolean;

  /**
   * Assistive text value.
   * Rendered below the input.
   */
  @property({ type: String })
  infoMessage?: string;

  /**
   * Will position the list around the button without overlapping it.
   */
  @property({ type: Boolean, reflect: true })
  noOverlap?: boolean;

  /**
   * When set the label is rendered only when not selected state.
   * It is useful when using the dropdown in an application menu bar.
   */
  @property({ type: Boolean, reflect: true })
  noLabelFloat?: boolean;

  /**
   * Fits the dropdown content width to the dropdown selector. Default to `false`.
   */
  @property({ type: Boolean })
  fitPositionTarget?: boolean;

  @property({ type: Boolean })
  restoreFocusOnClose?: boolean;

  private _formDisabled?: boolean;

  constructor() {
    super();
    this.value = '';

    this.addEventListener('click', this._clickHandler.bind(this));
    this.addEventListener('keydown', this._onKeydown.bind(this));
    this.addEventListener('focus', this._focusHandler.bind(this));

    /* istanbul ignore else */
    if (this.attachInternals) {
      this._internals = this.attachInternals();
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'listbox');
    }
  }

  protected willUpdate(up: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(up);
    if (up.has('disabled') && this.disabled && this.opened) {
      this.opened = false;
    }
    if (up.has('invalid')) {
      this._invalidChanged();
    }
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param disabled Form disabled state
   */
  formDisabledCallback(disabled?: boolean): void {
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
  formResetCallback(): void {
    this.value = '';
    const node = this.contentElement;
    /* istanbul ignore else */
    if (node) {
      // @ts-ignore
      node.selected = undefined;
    }
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue('');
    }
  }

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param formState Restored value
   */
  formStateRestoreCallback(formState: string): void {
    // @ts-ignore
    if (this._internals && this._internals.setFormValue) {
      // @ts-ignore
      this._internals.setFormValue(formState);
    }
  }

  firstUpdated(): void {
    requestAnimationFrame(() => {
      this._assignContentElement();
    });
  }

  _assignContentElement(): void {
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
   */
  _clickHandler(e: MouseEvent): void {
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
  _focusContent(): void {
    const node = this.contentElement;
    if (node) {
      node.focus();
    }
  }

  /**
   * Handler for the `focus` event.
   * Focuses on the listbox when opened.
   */
  _focusHandler(): void {
    if (this.opened) {
      this._focusContent();
    }
  }

  /**
   * Handler for the keydown event.
   */
  _onKeydown(e: KeyboardEvent): void {
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
   */
  _onDownKey(e: KeyboardEvent): void {
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
   */
  _onUpKey(e: KeyboardEvent): void {
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
  _onEscKey(): void {
    if (this.opened) {
      this.opened = false;
    }
  }

  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged(selectedItem?: Element | null): void {
    let value = '';
    if (selectedItem) {
      // @ts-ignore
      value = selectedItem.label
        || selectedItem.getAttribute('label')
        || selectedItem.getAttribute('data-label')
        || selectedItem.textContent!.trim();
    }
    this.value = value;
  }

  /**
   * Toggles `opened` state.
   *
   * @param e When set it cancels the event
   */
  toggle(e?: MouseEvent): void {
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
  open(): void {
    if (this.disabled || this._formDisabled) {
      return;
    }
    this.opened = true;
  }

  /**
   * Hide the dropdown content.
   */
  close(): void {
    if (this.disabled || this._formDisabled) {
      return;
    }
    this.opened = false;
  }

  _dropdownClosed(e: Event): void {
    retarget(e, this);
    this.opened = false;
    if (this.autoValidate) {
      this.checkValidity();
      this._updateNativeValidationState();
    }
    this.focus();
  }

  _updateNativeValidationState(): void {
    // @ts-ignore
    if (!this._internals || !this._internals.setValidity) {
      return;
    }
    if (this.invalid) {
      // @ts-ignore
      this._internals.setValidity(
        {
          customError: true,
        },
        'Please select a value.'
      );
    } else {
      // @ts-ignore
      this._internals.setValidity({});
    }
  }

  _dropdownOpened(e: Event): void {
    retarget(e, this);
    this._focusContent();
  }

  _selectHandler(e: Event): void {
    retarget(e, this);
    this.opened = false;
    const node = e.target as AnypointListboxElement;
    this._selectedItem = node.selectedItem;
  }

  _deselectHandler(e: Event): void {
    retarget(e, this);
    this._selectedItem = null;
  }

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   *
   * @return {boolean} true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity(): boolean {
    let result = (!!this.disabled || !!this._formDisabled || !this.required || (!!this.required && !!this.value));
    // @ts-ignore
    if (result && this._internals && !!this._internals.checkValidity && !this._internals.checkValidity()) {
      result = false;
    }
    return result;
  }

  /**
   * Calls when `autoValidate` changed
   */
  _autoValidateChanged(value?: boolean): void {
    if (value) {
      this.checkValidity();
    }
  }

  _invalidChanged(): void {
    const { invalid } = this;
    this._hasValidationMessage = !!invalid && !!this.invalidMessage;
    this._ensureInvalidAlertSate(invalid);
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
}

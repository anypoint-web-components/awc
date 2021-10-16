import { TemplateResult, LitElement, CSSResult } from 'lit-element';
import { ControlStateMixin } from './mixins/ControlStateMixin';
import { ValidatableMixin, ValidationResult } from './mixins/ValidatableMixin';

export type VerticalAlign = 'top' | 'bottom' | 'middle' | 'auto';
export type HorizontalAlign = 'left' | 'right' | 'center' | 'auto';

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
 * @fires validationstateschange
 * @fires hasvalidationmessagechange
 * @fires openedchange
 */
export default class AnypointDropdownMenuElement extends ValidatableMixin(ControlStateMixin(LitElement)) {
  readonly styles: CSSResult;

  render(): TemplateResult;

  /**
   * For form-associated custom elements. Marks this custom element
   * as form enabled element.
   */
  static get formAssociated(): true;

  /**
   * When form-associated custom elements are supported in the browser it
   * returns `<form>` element associated with this control.
   */
  get form(): HTMLFormElement|null;

  get hasValidationMessage(): boolean;

  get _labelClass(): string;

  get _infoAddonClass(): string;

  get _errorAddonClass(): string;

  get _triggerClass(): string;

  get _inputContainerClass(): string;

  get selectedItem(): HTMLElement|undefined;

  _selectedItem: HTMLElement|undefined;

  /**
   * @returns The content element that is contained by the dropdown menu, if any.
   */
  get contentElement(): HTMLElement|null;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  openAnimationConfig: Object;

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  closeAnimationConfig: Object;
  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   * @attribute
   */
  noAnimations: boolean;
  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * This property is a shortcut to set `scrollAction` to lock or refit.
   * Prefer directly setting the `scrollAction` property.
   * @attribute
   */
  allowOutsideScroll: boolean;
  /**
   * The orientation against which to align the element vertically
   * relative to the `positionTarget`. Possible values are "top", "bottom",
   * "middle", "auto".
   * @attribute
   */
  verticalAlign: VerticalAlign;
  /**
   * The orientation against which to align the element horizontally
   * relative to the `positionTarget`. Possible values are "left", "right", "center", "auto".
   * @attribute
   */
  horizontalAlign: HorizontalAlign;
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
   * @attribute
   */
  verticalOffset: number;
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
   * @attribute
   */
  horizontalOffset: number;
  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as
   * preferred alignment and if there's not enough space, it will pick the
   * values which minimize the cropping.
   * @attribute
   */
  dynamicAlign: boolean;
  /**
   * True if the list is currently displayed.
   * @attribute
   */
  opened: boolean;
  /**
   * Selected item value calculated as it's (in order) label property, label
   * attribute, and `innerText` value.
   * @attribute
   */
  value: string;
  /**
   * Name of the form control.
   * Note, form-associated custom elements may not be supported as first
   * implementation was released in Chrome M77 in July 2019. It may require
   * using custom form element to gather form data.
   * @attribute
   */
  name: string;
  /**
   * When set it marks the element as required. Calling the `validate`
   * function will mark this control as invalid when no value is selected.
   * @attribute
   */
  required: boolean;
  /**
   * Automatically calls `validate()` function when dropdown closes.
   * @attribute
   */
  autoValidate: boolean;
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
   * After calling `validate()` this will be populated by latest result of the test for each
   * validator. Result item will contain following properties:
   *
   * - validator {String} Name of the validator
   * - valid {Boolean} Result of the test
   * - message {String} Error message, populated only if `valid` equal `false`
   *
   * This property is `undefined` if `validator` is not set.
   */
  validationStates: ValidationResult[];
  /**
   * Value computed from `invalidMessage`, `invalid` and `validationStates`.
   * True if the validation message should be displayed.
   */
  _hasValidationMessage: boolean;
  /**
   * Will position the list around the button without overlapping
   * it.
   * @attribute
   */
  noOverlap: boolean;
  /**
   * Enables outlined theme.
   * @attribute
   */
  outlined: boolean;
  /**
   * Enables Anypoint theme.
   * @attribute
   */
  anypoint: boolean;
  /**
   * When set the label is rendered only when not selected state.
   * It is useful when using the dropdown in an application menu bar.
   * @attribute
   */
  noLabelFloat: boolean;
  /**
   * When set the control is rendered as disabled form control.
   * @attribute
   */
  disabled: boolean;
  /**
   * Fits the dropdown content width to the dropdown selector. Default to `false`.
   * @attribute
   */
  fitPositionTarget: boolean;

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when for disabled state changed.
   * @param disabled Form disabled state
   */
  formDisabledCallback(disabled: boolean): void;

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form has been reset
   */
  formResetCallback(): void;

  /**
   * When form-associated custom elements are supported in the browser it
   * is called when the form state has been restored
   *
   * @param state Restored value
   */
  formStateRestoreCallback(state: string): void;

  firstUpdated(): void;

  /**
   * Handler for `click` event.
   * Opens the list of the click originated from the shadow DOM.
   */
  _clickHandler(e: MouseEvent): void;

  /**
   * Focuses on the listbox, if available.
   */
  _focusContent(): void;

  /**
   * Handler for the `focus` event.
   * Focuses on the listbox when opened.
   */
  _focusHandler(): void;

  /**
   * Handler for the keydown event.
   */
  _onKeydown(e: KeyboardEvent): void;

  /**
   * Handler for ArrowDown button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   */
  _onDownKey(e: KeyboardEvent): void;

  /**
   * Handler for ArrowUp button press.
   * Opens the list if it's not open and focuses on the list otherwise.
   *
   * The event should be cancelled or it may cause unwanted behavior.
   */
  _onUpKey(e: KeyboardEvent): void;

  /**
   * Handler for Escape button press.
   * Closes the list if it's open.
   */
  _onEscKey(): void;

  /**
   * Compute the label for the dropdown given a selected item.
   *
   * @param selectedItem A selected Element item, with an
   * optional `label` property.
   */
  _selectedItemChanged(selectedItem: HTMLElement): void;

  /**
   * Toggles `opened` state.
   *
   * @param e When set it cancels the event
   */
  toggle(e?: MouseEvent): void;

  /**
   * Show the dropdown content.
   */
  open(): void;

  /**
   * Hide the dropdown content.
   */
  close(): void;

  _dropdownClosed(): void;

  _updateNativeValidationState(): void;

  _dropdownOpened(): void;

  _selectHandler(e: CustomEvent): void;

  _deselectHandler(): void;

  /**
   * Returns false if the element is required and does not have a selection,
   * and true otherwise.
   *
   * @returns true if `required` is false, or if `required` is true
   * and the element has a valid selection.
   */
  _getValidity(): boolean;

  _openedChanged(opened: boolean): void;

  checkValidity(): boolean;

  /**
   * Called when validation states changed.
   * Validation states are set by validatable mixin and is a result of calling
   * a custom validator. Each validator returns an object with `valid` and `message`
   * properties.
   *
   * See `ValidatableMixin` for more information.
   */
  _validationStatesChanged(states: ValidationResult[]): void;

  /**
   * Calls when `autoValidate` changed
   */
  _autoValidateChanged(value: boolean): void;

  /**
   * From `ValidatableMixin`
   * @param value Current invalid sate
   */
  _invalidChanged(value: boolean): void;

  _ensureInvalidAlertSate(invalid: boolean): void;
}

// export declare interface AnypointDropdownMenu extends ValidatableMixin, ControlStateMixin, LitElement {

// }

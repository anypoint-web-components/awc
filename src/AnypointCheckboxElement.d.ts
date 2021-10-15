import { TemplateResult, LitElement } from 'lit-element';
import { ButtonStateMixin } from './ButtonStateMixin';
import { ControlStateMixin } from './ControlStateMixin';
import { CheckedElementMixin } from './CheckedElementMixin';

/**
 * `anypoint-checkbox`
 * Anypoint styled checkbox
 *
 * `<anypoint-checkbox>` is a button that can be either checked or unchecked.
 * User can tap the checkbox to check or uncheck it.  Usually you use checkboxes
 * to allow user to select multiple options from a set.
 * Avoid using a single checkbox as an option selector and use toggle button instead.
 *
 * ### Example
 *
 * ```html
 * <anypoint-checkbox>label</anypoint-checkbox>
 * <anypoint-checkbox checked>label</anypoint-checkbox>
 * ```
 * 
 * @fires change Fired when the checked state changes due to user interaction.
 */
export default class AnypointCheckboxElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(LitElement))) {

  render(): TemplateResult;

  static get formAssociated(): boolean;

  get form(): HTMLFormElement | null;

  onchange: EventListener;

  /**
   * @attribute
   */
  ariaActiveAttribute: string;
  /**
   * @attribute
   */
  indeterminate: boolean;
  /**
   * @attribute
   */
  formDisabled: boolean;

  constructor();

  connectedCallback(): void;

  _computeCheckboxClass(checked: boolean, invalid: boolean): string;

  _computeCheckmarkClass(checked: boolean, indeterminate: boolean): void;

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged(): void;

  _clickHandler(): void;

  _checkedChanged(value: boolean): void;

  _spaceKeyDownHandler(e: KeyboardEvent): void;

  checkValidity(): boolean;

  formDisabledCallback(disabled: boolean): void;

  formResetCallback(): void;

  formStateRestoreCallback(state: any): void;
}

import { TemplateResult, LitElement } from 'lit-element';
import { CheckedElementMixin } from './mixins/CheckedElementMixin.js';
import { ButtonStateMixin } from './mixins/ButtonStateMixin.js';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';

/**
 * `anypoint-switch`
 * @fires change Dispatched when the selection change due to a user interaction.
 */
export default class AnypointSwitchElement extends ButtonStateMixin(ControlStateMixin(CheckedElementMixin(LitElement))) {

  /**
   * @attribute
   */
  formDisabled: boolean;
  /**
   * Enables Anypoint compatibility
   * @attribute
   */
  compatibility: boolean;

  static get formAssociated(): boolean;

  get form(): HTMLFormElement;

  onchange: EventListener;

  constructor();

  connectedCallback(): void;

  /**
   * Synchronizes the element's `active` and `checked` state.
   */
  _buttonStateChanged(): void;

  _clickHandler(e: MouseEvent): void;

  _checkedChanged(value: boolean): void;

  checkValidity(): boolean;

  formDisabledCallback(disabled: boolean): void;

  formResetCallback(): void;

  formStateRestoreCallback(state: boolean): void;

  _disabledChanged(disabled: boolean): void;

  _mdContent(): TemplateResult;

  _compatibleContent(): TemplateResult;

  render(): TemplateResult;
}

import { ValidatableMixin } from './ValidatableMixin';
declare function CheckedElementMixin<T extends new (...args: any[]) => {}>(base: T): T & CheckedElementMixinConstructor;
interface CheckedElementMixinConstructor {
  new(...args: any[]): CheckedElementMixin;
}

/**
 * @fires checkedchange Dispatched when the `checked` property change regardless of the source of the change.
 */
interface CheckedElementMixin extends ValidatableMixin {
  /**
   * Gets or sets the state, `true` is checked and `false` is unchecked.
   * @attribute
   */
  checked: boolean;
  /**
   * An event listener for the `change` event or null to unregister
   */
  oncheckedchange: EventListener;
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar.
   * @attribute
   */
  toggles: boolean;
  /**
   * The name of this form element.
   * @attribute
   */
  name: string;
  /**
   * The value of this form control
   * @attribute
   */
  value: any;
  /**
   * Set to true to mark the input as required. If used in a form, a
   * custom element that uses this mixin should also use
   * AnypointValidatableMixin and define a custom validation method.
   * Otherwise, a `required` element will always be considered valid.
   * It's also strongly recommended to provide a visual style for the element
   * when its value is invalid.
   * @attribute
   */
  required: boolean;
  /**
   * Disabled state of the control
   * @attribute
   */
  disabled: boolean;

  /**
   * @returns false if the element is required and not checked, and true
   * otherwise.
   */
  _getValidity(): boolean;

  /**
   * Updates the `aria-required` label when `required` is changed.
   */
  _requiredChanged(required: boolean): void;

  /**
   * Dispatches the `checkedchange` event
   */
  _checkedChanged(value: boolean): void;

  /**
   * Reset value to 'on' if it is set to `undefined`.
   */
  _valueChanged(value: any): void;
}
export {CheckedElementMixinConstructor};
export {CheckedElementMixin};

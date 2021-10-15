declare function ValidatorMixin<T extends new (...args: any[]) => {}>(base: T): T & ValidatorMixinConstructor;
interface ValidatorMixinConstructor {
  new(...args: any[]): ValidatorMixin;
}

/**
 * Use `ValidatorMixin` to implement a custom input/form validator.
 * Element instances implementing this behavior will be registered for use
 * in elements that implement `ValidatableMixin`.
 *
 * ## Validator name
 *
 * By default it takes lower case name of current HTML element. If this class
 * is used outside custom elements environment then it uses static `is` property
 * to get the name of the validator.
 *
 * ```
 * static get is() {
 *  return 'my-validator';
 * }
 * ```
 */
interface ValidatorMixin {
  /**
   * Validation message for invalid state
   * @attribute
   */
  message: string;

  /**
   * To be used to manually remove the validator instance from memory.
   * After registering the validator in the global store it is not tied to
   * component's lifecycle methods (it can extend an Object instead of HTMLElement).
   * Also, usually validator stays in the document for the entire lifecycle of the
   * web app. But if you need to unregister the validator then call this function
   * and detach this element from the DOM or remove references to the object so
   * it can be GC'd.
   */
  unregister(): void;

  /**
   * Implement custom validation logic in this function.
   *
   * @param value A value to validate
   * @returns `true` if `values` is valid.
   */
  validate(value?: any): boolean;
}

export {ValidatorMixinConstructor};
export {ValidatorMixin};

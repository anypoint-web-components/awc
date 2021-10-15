/**
 * Registers a new validator element in the store.
 * The validator can be accessed by the `get(validatorName)` function.
 *
 * @param validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 * @param name Validator name used in the global validators registry.
 */
export declare function register(validator: HTMLElement|Object, name: string): void;

/**
 * Removes the validator from the store.
 * This intentionally uses an instance of validator instead of the name to remove
 * the ref from the object when the instance of an element is being removed from
 * the DOM.
 *
 * @param validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 */
export function unregister(validator: HTMLElement|Object): void;

/**
 * Registers a new validator element in the store.
 * The validator can be accessed by the `get(validatorName)` function.
 *
 * @param {string} name Validator name used in the global validators registry.
 * @return {typeof HTMLElement|Object} An instance of the validator.
 */
export function get(name: string): HTMLElement|Object;

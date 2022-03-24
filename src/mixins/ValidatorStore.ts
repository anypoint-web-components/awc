/**
 * The store.
 */
const store = new Map<string, HTMLElement | Object>();

/**
 * Registers a new validator element in the store.
 * The validator can be accessed by the `get(validatorName)` function.
 *
 * @param validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 * @param name Validator name used in the global validators registry.
 */
export function register(validator: typeof HTMLElement|Object, name: string): void {
  store.set(name, validator);
}

/**
 * Removes the validator from the store.
 * This intentionally uses an instance of validator instead of the name to remove
 * the ref from the object when the instance of an element is being removed from
 * the DOM.
 *
 * @param validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 */
export function unregister(validator: typeof HTMLElement|Object): void {
  for (const [key, value] of store) {
    if (value === validator) {
      store.delete(key);
      return;
    }
  }
}

/**
 * Registers a new validator element in the store.
 * The validator can be accessed by the `get(validatorName)` function.
 *
 * @param name Validator name used in the global validators registry.
 * @returns An instance of the validator.
 */
export function get(name: string): typeof HTMLElement | Object | undefined {
  return store.get(name);
}

/**
 * The store.
 * This to be turned into a WeakMap when the proposal for iterable WeakMaps become
 * available as standard.
 *
 * https://github.com/tc39/proposal-weakrefs#iterable-weakmaps
 *
 * @type {Map}
 */
const store = new Map();

/**
 * Registers a new validator element in the store.
 * The validator can be accessed by the `get(validatorName)` function.
 *
 * @param {typeof HTMLElement|Object} validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 * @param {string} name Validator name used in the global validators registry.
 */
export function register(validator, name) {
  store.set(name, validator);
}

/**
 * Removes the validator from the store.
 * This intentionally uses an instance of validator instead of the name to remove
 * the ref from the object when the instance of an element is being removed from
 * the DOM.
 *
 * @param {typeof HTMLElement|Object} validator An instance of the validator. It expects to be a
 * type of an HTMLElement, LitElement etc but can also be an object.
 */
export function unregister(validator) {
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
 * @param {string} name Validator name used in the global validators registry.
 * @return {typeof HTMLElement|Object} An instance of the validator.
 */
export function get(name) {
  return store.get(name);
}

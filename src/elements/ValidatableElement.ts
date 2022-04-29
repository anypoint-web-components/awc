import { PropertyValueMap } from "lit";
import { property } from "lit/decorators.js";
import AnypointElement from "./AnypointElement.js";

/**
 * A base class for elements that can be validated.
 * Do not overwrite the `checkValidity()` method. Instead, implement the validator
 * in the `_getValidity()` method.
 */
export default class ValidatableElement extends AnypointElement {
  /**
   * True if the last call to `validate` is invalid.
   */
  @property({ reflect: true, type: Boolean }) invalid?: boolean;

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('invalid')) {
      if (this.invalid) {
        this.setAttribute('aria-invalid', 'true');
        
      } else {
        this.removeAttribute('aria-invalid');
      }
    }
  }

  /**
   * The AnypointElement.checkValidity() method returns a boolean value which indicates validity 
   * of the value of the element. If the value is invalid, this method also fires the `invalid` event 
   * on the element.
   * @return Returns `true` if the value of the element has no validity problems; otherwise returns false.
   */
  checkValidity(): boolean {
    const state = this._getValidity();
    const { invalid } = this;
    if (state === invalid || invalid === undefined) {
      this.invalid = !state;
      this.dispatchEvent(new Event('invalid'));
    }
    return state;
  }

  /**
   * Returns true if `value` is valid.  
   * You should override this method to implement validity logic for your element.
   * @returns True if the `value` is valid.
   */
  protected _getValidity(): boolean {
    return true;
  }

  /**
   * @deprecated Use `checkValidity()` instead.
   */
  validate(): boolean {
    return this.checkValidity();
  }
}

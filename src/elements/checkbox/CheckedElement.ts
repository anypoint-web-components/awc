import { PropertyValueMap } from "lit";
import { property } from "lit/decorators.js";
import ButtonElement from "../button/ButtonElement.js";

export default class CheckedElement extends ButtonElement {
  /**
   * The name of this form element.
   * @attribute
   */
  @property({ type: String }) name?: string;

  /**
   * Set to true to mark the input as required. 
   */
  @property({ reflect: true, type: Boolean }) required?: boolean;

  /**
   * The value of this form control
   * @attribute
   */
  @property({ type: String }) value: string = 'on';

  /**
   * Gets or sets the state, `true` is checked and `false` is unchecked.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) checked: boolean = false;

  constructor() {
    super();
    this.ariaActiveAttribute = 'aria-checked';
    this.toggles = true;
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('required')) {
      this._requiredChanged();
    }
    if (cp.has('checked')) {
      this._checkedChanged();
    }
    if (cp.has('value')) {
      this._valueChanged();
    }
  }

  /**
   * @returns false if the element is required and not checked, and true
   * otherwise.
   */
  override _getValidity(): boolean {
    return this.disabled || !this.required || this.checked;
  }

  /**
   * Updates the `aria-required` label when `required` is changed.
   */
  protected _requiredChanged(): void {
    if (this.required) {
      this.setAttribute('aria-required', 'true');
    } else {
      this.removeAttribute('aria-required');
    }
  }

  protected _checkedChanged(): void {
    this.active = !!this.checked;
  }

  /**
   * Reset value to 'on' if it is set to `undefined`.
   */
  protected _valueChanged(): void {
    const v = this.value as any;
    if (v === undefined || v === null) {
      this.value = 'on';
    }
  }
}

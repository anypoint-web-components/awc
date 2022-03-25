/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/

import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { ValidatableMixin, ValidatableMixinInterface } from './ValidatableMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface CheckedElementMixinInterface extends ValidatableMixinInterface {
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar.
   * @attribute
   */
  toggles?: boolean;

  /**
  * The name of this form element.
  * @attribute
  */
  name?: string;

  /**
  * Disabled state of the control
  * @attribute
  */
  disabled?: boolean;

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
   * The value of this form control
   * @attribute
   */
  value: string;

  /**
   * Gets or sets the state, `true` is checked and `false` is unchecked.
   * @attribute
   */
  checked: boolean;

  /**
   * @returns Previously registered event listener or null
   */
  oncheckedchange: EventListener | undefined;

  /**
   * Dispatches the `checkedchange` event
   */
  _checkedChanged(value?: boolean): void;

  _disabledChanged(disabled?: boolean): void;

  /**
   * Updates the `aria-required` label when `required` is changed.
   */
  _requiredChanged(required: boolean): void;

  /**
   * Reset value to 'on' if it is set to `undefined`.
   */
  _valueChanged(value: any): void;
}

/**
 * Use `CheckedElementMixin` to implement an element that can be pressed and active when toggles.
 *
 * @mixin
 */
export const CheckedElementMixin = dedupeMixin(<T extends Constructor<LitElement>>(superClass: T): Constructor<CheckedElementMixinInterface> & T => {
  class MyMixinClass extends ValidatableMixin(superClass) {
    /**
     * If true, the button toggles the active state with each click or press
     * of the space bar.
     * @attribute
     */
    @property({ type: Boolean })
    toggles?: boolean;

    /**
     * The name of this form element.
     * @attribute
     */
    @property({ type: String })
    name?: string;

    protected _disabled?: boolean;

    protected _required?: boolean;

    protected _value?: string;

    protected _checked?: boolean;

    /**
     * Disabled state of the control
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get disabled(): boolean | undefined {
      return this._disabled;
    }

    set disabled(value: boolean | undefined) {
      const old = this._disabled;
      if (old === value) {
        return;
      }
      this._disabled = value;
      if (this.requestUpdate) {
        this.requestUpdate('disabled', old);
      }
      this._disabledChanged(value);
    }

    /**
     * Set to true to mark the input as required. If used in a form, a
     * custom element that uses this mixin should also use
     * AnypointValidatableMixin and define a custom validation method.
     * Otherwise, a `required` element will always be considered valid.
     * It's also strongly recommended to provide a visual style for the element
     * when its value is invalid.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get required(): boolean {
      return this._required || false;
    }

    set required(value: boolean) {
      const old = this._required;
      if (old === value) {
        return;
      }
      this._required = value;
      if (this.requestUpdate) {
        this.requestUpdate('required', old);
      }
      this._requiredChanged(value);
    }

    /**
     * The value of this form control
     * @attribute
     */
    @property()
    get value(): string {
      return this._value || 'on';
    }

    set value(value: string) {
      const old = this._value;
      if (old === value) {
        return;
      }
      this._value = value;
      if (this.requestUpdate) {
        this.requestUpdate('value', old);
      }
      this._valueChanged(value);
    }

    /**
     * Gets or sets the state, `true` is checked and `false` is unchecked.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get checked(): boolean {
      return this._checked || false;
    }

    set checked(value: boolean) {
      const old = this._checked;
      if (old === value) {
        return;
      }
      this._checked = value;
      if (this.requestUpdate) {
        this.requestUpdate('checked', old);
      }
      this._checkedChanged(value);
    }

    /**
     * @returns Previously registered event listener or null
     */
    get oncheckedchange(): EventListener | undefined {
      return getListener('checkedchange', this);
    }

    /**
     * @param value An event listener for the `change` event or null to unregister
     */
    set oncheckedchange(value: EventListener | undefined) {
      addListener('checkedchange', value, this);
    }

    constructor() {
      super();
      this.value = 'on';
      // this.disabled = false;
    }

    /**
     * @return {boolean} false if the element is required and not checked, and true
     * otherwise.
     */
    _getValidity(): boolean {
      return this.disabled || !this.required || this.checked;
    }

    /**
     * Updates the `aria-required` label when `required` is changed.
     */
    _requiredChanged(required: boolean): void {
      if (required) {
        this.setAttribute('aria-required', 'true');
      } else {
        this.removeAttribute('aria-required');
      }
    }

    /**
     * Dispatches the `checkedchange` event
     */
    _checkedChanged(value?: boolean): void {
      // @ts-ignore
      this.active = !!value;
      // this event to be moved to a specific implementation to notify on user interaction.
      this.dispatchEvent(new CustomEvent('checkedchange'));
    }

    /**
     * Reset value to 'on' if it is set to `undefined`.
     */
    _valueChanged(value: any): void {
      if (value === undefined || value === null) {
        this.value = 'on';
      }
    }

    _disabledChanged(disabled?: boolean): void {
      // 
    }
  }
  return MyMixinClass as Constructor<CheckedElementMixinInterface> & T;
});

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/
import { property } from 'lit/decorators.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ButtonStateMixinInterface {
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar.
   * @attribute
   */
  toggles?: boolean;
  /**
   * @returns True when the element is currently being pressed as
   * the user is holding down the button on the element.
   */
  pressed: boolean | undefined;
  _pressed: boolean | undefined;

  _pointerDown?: boolean;

  _receivedFocusFromKeyboard?: boolean;

  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attribute
   */
  active: boolean | undefined;

  /**
   * @return True when the a pointer device is currently pointing on the element
   * and is in "down" state.
   */
  get pointerDown(): boolean | undefined;

  /**
   * @return True when the element received focus from the keyboard.
   */
  get receivedFocusFromKeyboard(): boolean;
  /**
   * The aria attribute to be set if the button is a toggle and in the
   * active state.
   * @attribute
   */
  ariaActiveAttribute: string;

  /**
   * Handler for pointer down event
   */
  _downHandler(): void;

  /**
   * Handler for pointer up event
   */
  _upHandler(): void;

  /**
   * Handler for pointer click event
   */
  _clickHandler(e?: MouseEvent): void;

  _spaceKeyDownHandler(e: KeyboardEvent): void;

  _spaceKeyUpHandler(e: KeyboardEvent): void;

  /**
     * Handler for keyboard down event
     */
  _keyDownHandler(e: KeyboardEvent): void;

  /**
   * Handler for keyboard up event
   */
  _keyUpHandler(e: KeyboardEvent): void;

  _blurHandler(): void;

  _focusHandler(): void;

  _pressedChanged(): void;

  _activeChanged(): void;
}

/**
 * Use `ButtonStateMixin` to implement an element that can be pressed and active when toggles.
 *
 * @mixin
 */
export const ButtonStateMixin = dedupeMixin(<T extends Constructor<HTMLElement>>(superClass: T): Constructor<ButtonStateMixinInterface> & T => {
  class MyMixinClass extends superClass {
    /**
     * If true, the button toggles the active state with each click or press
     * of the space bar.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    toggles?: boolean;

    _pointerDown?: boolean;

    _receivedFocusFromKeyboard?: boolean;

    __pressed?: boolean;

    /**
     * @returns True when the element is currently being pressed as
     * the user is holding down the button on the element.
     */
    get pressed(): boolean | undefined {
      return this._pressed;
    }

    @property({ type: Boolean, reflect: true, attribute: 'pressed' })
    get _pressed(): boolean | undefined {
      return this.__pressed || false;
    }

    set _pressed(value) {
      const old = this._pressed;
      if (old === value) {
        return;
      }
      this.__pressed = value;
      this.dispatchEvent(new Event('pressedchange'));
      this._pressedChanged();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('_pressed', old);
      }
    }

    _active: boolean | undefined;

    /**
     * If true, the button is a toggle and is currently in the active state.
     * @attribute
     */
    @property({ reflect: true, type: Boolean })
    get active(): boolean | undefined {
      return this._active || false;
    }

    set active(value: boolean | undefined) {
      const old = this._active;
      if (old === value) {
        return;
      }
      this._active = value;
      this.dispatchEvent(new Event('activechange'));
      this._activeChanged();
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('active', old);
      }
    }

    /**
     * @return True when the a pointer device is currently pointing on the element
     * and is in "down" state.
     */
    get pointerDown(): boolean | undefined {
      return this._pointerDown;
    }

    /**
     * @return True when the element received focus from the keyboard.
     */
    get receivedFocusFromKeyboard(): boolean {
      return this._receivedFocusFromKeyboard || false;
    }

    _ariaActiveAttribute = '';

    /**
     * The aria attribute to be set if the button is a toggle and in the
     * active state.
     * @attribute
     */
    @property({ reflect: true, type: String })
    get ariaActiveAttribute(): string {
      return this._ariaActiveAttribute;
    }

    set ariaActiveAttribute(value: string) {
      const old = this._ariaActiveAttribute;
      if (old === value) {
        return;
      }
      this._ariaActiveAttribute = value;
      if (old && this.hasAttribute(old)) {
        this.removeAttribute(old);
      }
      this._activeChanged();
    }

    constructor(...args: any[]) {
      super(...args);
      this.ariaActiveAttribute = 'aria-pressed';
      this._downHandler = this._downHandler.bind(this);
      this._upHandler = this._upHandler.bind(this);
      this._clickHandler = this._clickHandler.bind(this);
      this._keyDownHandler = this._keyDownHandler.bind(this);
      this._keyUpHandler = this._keyUpHandler.bind(this);
      this._blurHandler = this._blurHandler.bind(this);
      this._focusHandler = this._focusHandler.bind(this);

      this.toggles = false;
    }

    /**
     * Registers hover listeners
     */
    connectedCallback(): void {
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this.addEventListener('mousedown', this._downHandler);
      this.addEventListener('mouseup', this._upHandler);
      this.addEventListener('click', this._clickHandler);
      this.addEventListener('keydown', this._keyDownHandler);
      this.addEventListener('keyup', this._keyUpHandler);
      this.addEventListener('blur', this._blurHandler);
      this.addEventListener('focus', this._focusHandler);
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'button');
      }
    }

    /**
     * Removes hover listeners
     */
    disconnectedCallback(): void {
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.removeEventListener('mousedown', this._downHandler);
      this.removeEventListener('mouseup', this._upHandler);
      this.removeEventListener('click', this._clickHandler);
      this.removeEventListener('keydown', this._keyDownHandler);
      this.removeEventListener('keyup', this._keyUpHandler);
      this.removeEventListener('blur', this._blurHandler);
      this.removeEventListener('focus', this._focusHandler);
    }

    /**
     * Handler for pointer down event
     */
    _downHandler(): void {
      this._pointerDown = true;
      this._pressed = true;
      this._receivedFocusFromKeyboard = false;
    }

    /**
     * Handler for pointer up event
     */
    _upHandler(): void {
      this._pointerDown = false;
      this._pressed = false;
    }

    /**
     * Handler for pointer click event
     */
    _clickHandler(e?: MouseEvent): void {
      if (this.toggles) {
        // a click is needed to toggle the active state
        this.active = !this.active;
      } else {
        this.active = false;
      }
    }

    /**
     * Handler for keyboard down event
     */
    _keyDownHandler(e: KeyboardEvent): void {
      if (['Enter', 'NumpadEnter'].includes(e.code)) {
        this._asyncClick();
      } else if (e.code === 'Space' || e.key === ' ') {
        this._spaceKeyDownHandler(e);
      }
    }

    /**
     * Handler for keyboard up event
     */
    _keyUpHandler(e: KeyboardEvent): void {
      if (e.code === 'Space') {
        this._spaceKeyUpHandler(e);
      }
    }

    _blurHandler(): void {
      this._detectKeyboardFocus(false);
      this._pressed = false;
    }

    _focusHandler(): void {
      this._detectKeyboardFocus(true);
    }

    _detectKeyboardFocus(focused: boolean): void {
      this._receivedFocusFromKeyboard = !this.pointerDown && focused;
    }

    _isLightDescendant(node: Element): boolean {
      return node !== this && this.contains(node);
    }

    _spaceKeyDownHandler(e: KeyboardEvent): void {
      const { target } = e;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(target as Element)) {
        return;
      }
      e.preventDefault();
      e.stopImmediatePropagation();
      this._pressed = true;
    }

    _spaceKeyUpHandler(e: KeyboardEvent): void {
      const { target } = e;
      // Ignore the event if this is coming from a focused light child, since that
      // element will deal with it.
      if (!target || this._isLightDescendant(target as Element)) {
        return;
      }
      if (this.pressed) {
        this._asyncClick();
      }
      this._pressed = false;
    }

    _asyncClick(): void {
      setTimeout(() => this.click(), 1);
    }

    _pressedChanged(): void {
      this._changedButtonState();
    }

    /** To be implemented by the child classes. */
    _buttonStateChanged(): void {
      // ...
    }

    _changedButtonState(): void {
      this._buttonStateChanged();
    }

    _activeChanged(): void {
      const { active, ariaActiveAttribute } = this;
      if (this.toggles) {
        this.setAttribute(ariaActiveAttribute, active ? 'true' : 'false');
      } else {
        this.removeAttribute(ariaActiveAttribute);
      }
      this._changedButtonState();
    }

    /**
     * This function is called when `ControlStateMixin` is also applied to the element.
     */
    _controlStateChanged(): void {
      // @ts-ignore
      if (this.disabled) {
        this._pressed = false;
      } else {
        this._changedButtonState();
      }
    }
  }
  return MyMixinClass as Constructor<ButtonStateMixinInterface> & T;
});

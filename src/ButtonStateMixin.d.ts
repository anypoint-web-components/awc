declare function ButtonStateMixin<T extends new (...args: any[]) => {}>(base: T): T & ButtonStateMixinConstructor;
interface ButtonStateMixinConstructor {
  new(...args: any[]): ButtonStateMixin;
}

/**
 * @fires pressedchange When the `pressed` property has changed
 * @fires activechange When the `active` property has changed
 * @fires pressed-changed This event is deprecated
 * @fires active-changed This event is deprecated
 */
interface ButtonStateMixin {
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar.
   * @attribute
   */
  toggles: boolean;
  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attribute
   */
  active: boolean;
  /**
   * True when the element is currently being pressed as
   * the user is holding down the button on the element.
   * @attribute
   */
  pressed: boolean;
  /**
   * True when the a pointer device is currently pointing on the element
   * and is in "down" state.
   */
  readonly pointerDown: boolean;
  /**
   * True when the element received focus from the keyboard.
   */
  readonly receivedFocusFromKeyboard: boolean;
  /**
   * The aria attribute to be set if the button is a toggle and in the
   * active state.
   * @attribute
   */
  ariaActiveAttribute: string;

  /**
   * @deprecated Do not use this function.
   * @param prop
   * @param value
   */
  _setChanged(prop: string, value: any): void;

  _downHandler(e: MouseEvent): void;
  _upHandler(e: MouseEvent): void;
  _clickHandler(e: MouseEvent): void;
  _keyDownHandler(e: KeyboardEvent): void;
  _keyUpHandler(e: KeyboardEvent): void;
  _blurHandler(e: Event): void;
  _focusHandler(e: FocusEvent): void;
  _detectKeyboardFocus(focused: boolean): void;
  _isLightDescendant(node: Node): boolean;
  _spaceKeyDownHandler(e: KeyboardEvent): void;
  _spaceKeyUpHandler(e: KeyboardEvent): void;
  _asyncClick(): void;
  _pressedChanged(): void;
  _changedButtonState(): void;
  _activeChanged(): void;
  _controlStateChanged(): void;
}

export {ButtonStateMixinConstructor};
export {ButtonStateMixin};

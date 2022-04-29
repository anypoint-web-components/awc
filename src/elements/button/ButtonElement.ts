/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import ValidatableElement from '../ValidatableElement.js';

/**
 * A button-like base element.
 */
export default class ButtonElement extends ValidatableElement {
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar.
   * @attribute
   */
  @property({ reflect: true, type: Boolean }) toggles?: boolean;

  /**
   * @returns True when the element is currently being pressed as
   * the user is holding down the button on the element.
   */
  get pressed(): boolean | undefined {
    return this._pressed;
  }

  @state() protected _pressed?: boolean;

  /**
   * If true, the button is a toggle and is currently in the active state.
   */
  @property({ reflect: true, type: Boolean }) active?: boolean;

  /**
   * The aria attribute to be set if the button is a toggle and in the
   * active state.
   */
  @property({ reflect: true, type: String }) ariaActiveAttribute: string = 'aria-pressed';

  /**
   * If true, the element currently has focus.
   */
  @property({ reflect: true, type: Boolean }) focused?: boolean;
  
  /**
   * If true, the button is a toggle and is currently in the active state.
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  protected _pointerDown?: boolean;

  protected _receivedFocusFromKeyboard?: boolean;

  protected _oldTabIndex?: string | null;

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

  constructor() {
    super();
    this.addEventListener('focus', this._focusHandler.bind(this));
    this.addEventListener('blur', this._blurHandler.bind(this));
    this.addEventListener('click', this._clickHandler.bind(this));
    this.addEventListener('mousedown', this._downHandler.bind(this));
    this.addEventListener('mouseup', this._upHandler.bind(this));
    this.addEventListener('keydown', this._keyDownHandler.bind(this));
    this.addEventListener('keyup', this._keyUpHandler.bind(this));
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('ariaActiveAttribute')) {
      const old = cp.get('ariaActiveAttribute');
      if (old && this.hasAttribute(old)) {
        this.removeAttribute(old);
      }
    }
    if (cp.has('disabled')) {
      this._disabledChanged();
    }
    if (cp.has('disabled') || cp.has('focused')) {
      this._controlStateChanged();
    }
  }
  
  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(cp);
    if (cp.has('pressed')) {
      if (this.pressed) {
        this.setAttribute('pressed', '');
      } else {
        this.removeAttribute('pressed');
      }
    }
    if (cp.has('active') || cp.has('ariaActiveAttribute')) {
      this._activeChanged();
    }
  }

  protected _activeChanged(): void {
    const { active, ariaActiveAttribute } = this;
    if (this.toggles) {
      this.setAttribute(ariaActiveAttribute, active ? 'true' : 'false');
    } else {
      this.removeAttribute(ariaActiveAttribute);
    }
  }

  protected _blurHandler(): void {
    this.focused = false;
    this._detectKeyboardFocus(false);
    this._pressed = false;
  }

  protected _focusHandler(): void {
    const { disabled } = this;
    if (disabled) {
      this.focused = false;
      this.blur();
      return;
    }
    this.focused = true;
    this._detectKeyboardFocus(true);
  }

  /**
   * Handler for pointer down event
   */
  protected _downHandler(): void {
    this._pointerDown = true;
    this._pressed = true;
    this._receivedFocusFromKeyboard = false;
  }

  /**
   * Handler for pointer up event
   */
  protected _upHandler(): void {
    this._pointerDown = false;
    this._pressed = false;
  }

  /**
   * Handler for pointer click event
   */
  protected _clickHandler(e?: MouseEvent): void {
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
  protected _keyDownHandler(e: KeyboardEvent): void {
    if (['Enter', 'NumpadEnter'].includes(e.code)) {
      this._asyncClick();
    } else if (e.code === 'Space' || e.key === ' ') {
      this._spaceKeyDownHandler(e);
    }
  }

  /**
   * Handler for keyboard up event
   */
  protected _keyUpHandler(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this._spaceKeyUpHandler(e);
    }
  }

  /**
   * Updates aria attribute for disabled state.
   */
  protected _disabledChanged(): void {
    const { disabled } = this;
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';
    if (disabled) {
      // Read the `tabindex` attribute instead of the `tabIndex` property.
      // The property returns `-1` if there is no `tabindex` attribute.
      // This distinction is important when restoring the value because
      // leaving `-1` hides shadow root children from the tab order.
      this._oldTabIndex = this.getAttribute('tabindex');
      this.focused = false;
      this.setAttribute('tabindex', '-1');
      this.blur();
    } else if (this._oldTabIndex !== undefined) {
      if (this._oldTabIndex === null) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', this._oldTabIndex);
      }
    }
  }

  protected _detectKeyboardFocus(focused: boolean): void {
    this._receivedFocusFromKeyboard = !this.pointerDown && focused;
  }

  protected _isLightDescendant(node: Element): boolean {
    return node !== this && this.contains(node);
  }

  protected _spaceKeyDownHandler(e: KeyboardEvent): void {
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

  protected _spaceKeyUpHandler(e: KeyboardEvent): void {
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

  protected _asyncClick(): void {
    setTimeout(() => this.click(), 1);
  }

  protected _controlStateChanged(): void {
    if (this.disabled) {
      this._pressed = false;
    }
  }
}

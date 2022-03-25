import { html, CSSResult, TemplateResult } from 'lit';
import { AnypointButtonBase } from './AnypointButtonBase.js';
import MaterialRippleElement from './MaterialRippleElement.js';
import elementStyles from '../styles/ButtonIcon.js';
import '../../define/material-ripple.js';

/**
 * Checks whether a KeyboardEvent originates from any Enter keys.
 * 
 * @return True if the event was triggered by the Enter key.
 */
const isEnterKey = (e: KeyboardEvent): boolean => e.code === 'Enter' || e.code === 'NumpadEnter' || e.keyCode === 13;

/**
 * `anypoint-button`
 * Anypoint styled button.
 */
export default class AnypointIconButtonElement extends AnypointButtonBase {
  static get styles(): CSSResult {
    return elementStyles;
  }

  /**
   * @returns A reference to the PaperRippleElement in the local DOM.
   */
  get _ripple(): MaterialRippleElement {
    return this.shadowRoot!.querySelector('material-ripple') as MaterialRippleElement;
  }

  render(): TemplateResult {
    return html`
    <div class="icon">
      <slot></slot>
      <material-ripple class="circle" center .noink="${this.noink}" @transitionend="${this._transitionEndHandler}"></material-ripple>
    </div> `;
  }

  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    super.connectedCallback();
  }

  /** @override */
  _spaceKeyDownHandler(e: KeyboardEvent): void {
    super._spaceKeyDownHandler(e);
    this._enterDownHandler();
  }

  /** @override */
  _spaceKeyUpHandler(e: KeyboardEvent): void {
    super._spaceKeyUpHandler(e);
    this._enterUpHandler();
  }

  _buttonStateChanged(): void {
    this._calculateElevation();
  }

  /** @override */
  _keyDownHandler(e: KeyboardEvent): void {
    super._keyDownHandler(e);
    if (isEnterKey(e)) {
      this._enterDownHandler();
    }
  }

  /** @override */
  _keyUpHandler(e: KeyboardEvent): void {
    super._keyUpHandler(e);
    if (isEnterKey(e)) {
      this._enterUpHandler();
    }
  }

  _enterDownHandler(): void {
    this._calculateElevation();
    const { _ripple } = this;
    if (!_ripple.animating) {
      _ripple.down();
    }
  }

  _enterUpHandler(): void {
    this._calculateElevation();
    this._ripple.up();
  }
}

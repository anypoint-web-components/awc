import { html } from 'lit-element';
import { AnypointButtonBase } from './AnypointButtonBase.js';
import elementStyles from './styles/ButtonIcon.js';
import '../material-ripple.js';

/** @typedef {import('..').MaterialRippleElement} MaterialRippleElement */

/**
 * Checks whether a KeyboardEvent originates from any Enter keys.
 * @param {KeyboardEvent} e
 * @return {Boolean} True if the event was triggered by the Enter key.
 */
const isEnterKey = e => e.code === 'Enter' || e.code === 'NumpadEnter' || e.keyCode === 13;

/**
 * `anypoint-button`
 * Anypoint styled button.
 *
 * @extends AnypointButtonBase
 */
export default class AnypointIconButtonElement extends AnypointButtonBase {
  /* eslint-disable class-methods-use-this */
  get styles() {
    return elementStyles;
  }

  /**
   * @return {MaterialRippleElement} A reference to the PaperRippleElement in the local DOM.
   */
  get _ripple() {
    return this.shadowRoot.querySelector('material-ripple');
  }

  render() {
    return html`<style>${this.styles}</style>
    <div class="icon">
      <slot></slot>
      <material-ripple class="circle" center .noink="${this.noink}" @transitionend="${this._transitionEndHandler}"></material-ripple>
    </div> `;
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  /** @override */
  _spaceKeyDownHandler(e) {
    super._spaceKeyDownHandler(e);
    this._enterDownHandler();
  }

  /** @override */
  _spaceKeyUpHandler(e) {
    super._spaceKeyUpHandler(e);
    this._enterUpHandler();
  }

  _buttonStateChanged() {
    this._calculateElevation();
  }

  /** @override */
  _keyDownHandler(e) {
    super._keyDownHandler(e);
    if (isEnterKey(e)) {
      this._enterDownHandler();
    }
  }

  /** @override */
  _keyUpHandler(e) {
    super._keyUpHandler(e);
    if (isEnterKey(e)) {
      this._enterUpHandler();
    }
  }

  _enterDownHandler() {
    this._calculateElevation();
    const { _ripple } = this;
    if (!_ripple.animating) {
      _ripple.down();
    }
  }

  _enterUpHandler() {
    this._calculateElevation();
    this._ripple.up();
  }
}

import { html } from 'lit-element';
import { AnypointButtonBase } from './AnypointButtonBase.js';
import elementStyles from './styles/Button.js';
import '../material-ripple.js';

/** @typedef {import('..').MaterialRippleElement} MaterialRippleElement */

/**
 * `anypoint-button`
 * Anypoint styled button.
 *
 * @demo demo/index.html
 */
export default class AnypointButton extends AnypointButtonBase {
  /* eslint-disable class-methods-use-this */
  get styles() {
    return elementStyles;
  }

  render() {
    const { noink, anypoint, styles } = this;
    const stopRipple = !!noink || !!anypoint;
    return html`<style>${styles}</style><slot></slot><material-ripple .noink="${stopRipple}" @transitionend="${this._transitionEndHandler}"></material-ripple>`;
  }

  /**
   * @return {MaterialRippleElement} A reference to the PaperRippleElement in the local DOM.
   */
  get _ripple() {
    return this.shadowRoot.querySelector('material-ripple');
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

  /**
   * @param {KeyboardEvent} e
   */
  _spaceKeyDownHandler(e) {
    super._spaceKeyDownHandler(e);
    this._calculateElevation();
    const { _ripple } = this;
    if (!_ripple.animating) {
      _ripple.down();
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  _spaceKeyUpHandler(e) {
    super._spaceKeyUpHandler(e);
    this._calculateElevation();
    this._ripple.up();
  }
}

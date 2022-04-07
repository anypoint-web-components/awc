import { html, CSSResult, TemplateResult } from 'lit';
import { AnypointButtonBase } from './AnypointButtonBase.js';
import MaterialRippleElement from './MaterialRippleElement.js';
import elementStyles from '../styles/Button.js';
import '../define/material-ripple.js';

/**
 * `anypoint-button`
 * Anypoint styled button.
 *
 * @demo demo/index.html
 */
export default class AnypointButtonElement extends AnypointButtonBase {
  /* eslint-disable class-methods-use-this */
  static get styles(): CSSResult | CSSResult[] {
    return elementStyles;
  }

  render(): TemplateResult {
    const { noink, anypoint } = this;
    const stopRipple = !!noink || !!anypoint;
    return html`<slot></slot><material-ripple .noink="${stopRipple}" @transitionend="${this._transitionEndHandler}"></material-ripple>`;
  }

  /**
   * @return A reference to the PaperRippleElement in the local DOM.
   */
  get _ripple(): MaterialRippleElement {
    return this.shadowRoot!.querySelector('material-ripple') as MaterialRippleElement;
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

  _spaceKeyDownHandler(e: KeyboardEvent): void {
    super._spaceKeyDownHandler(e);
    this._calculateElevation();
    const { _ripple } = this;
    if (!_ripple.animating) {
      _ripple.down();
    }
  }

  _spaceKeyUpHandler(e: KeyboardEvent): void {
    super._spaceKeyUpHandler(e);
    this._calculateElevation();
    this._ripple.up();
  }
}

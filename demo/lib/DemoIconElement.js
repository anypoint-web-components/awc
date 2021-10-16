import { html, css, LitElement } from 'lit-element';
import * as Icons from './Icons.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */

/**
 * An element to render a 24x24 icon.
 * By default it inherits current color. The fill color can be changed by setting
 * the CSS' color property.
 *
 * @extends LitElement
 */
export default class DemoIconElement extends LitElement {
  // eslint-disable-next-line class-methods-use-this
  get styles() {
    return css`
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
    `;
  }

  static get properties() {
    return {
      /**
       * An icon to be rendered from the Icons library.
       * When incorrect icon is referenced nothing is rendered.
       */
      icon: { type: String },
    };
  }

  get icon() {
    return this._icon;
  }

  set icon(value) {
    const old = this._icon;
    if (old === value) {
      return;
    }
    this._icon = value;
    this._updateIcon(value);
    // don't request update here
  }

  /**
   * @return {Boolean} True when the icon was found and is rendered.
   */
  get hasIcon() {
    return this._hasIcon || false;
  }

  /**
   * Maps icon name to it's definition and sets `hasIcon` value.
   *
   * @param {String} name Icon name
   */
  _updateIcon(name) {
    const icon = Icons[name];
    this._hasIcon = !!icon;
    this._iconValue = icon;
    this.requestUpdate();
  }

  /**
   * @return {TemplateResult|string} Template result for an icon
   */
  render() {
    const { hasIcon, _iconValue } = this;
    if (!hasIcon) {
      return html`<style>${this.styles}</style>
      <slot></slot>`;
    }
    return html`<style>${this.styles}</style>
    ${_iconValue}`;
  }
}

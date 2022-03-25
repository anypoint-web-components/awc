/* eslint-disable import/namespace */
import { html, css, LitElement, TemplateResult, CSSResult, SVGTemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import * as Icons from './Icons.js';

/**
 * An element to render a 24x24 icon.
 * By default it inherits current color. The fill color can be changed by setting
 * the CSS' color property.
 *
 * @extends LitElement
 */
export default class DemoIconElement extends LitElement {
  // eslint-disable-next-line class-methods-use-this
  get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
        fill: currentColor;
      }
    `;
  }

  protected _icon?: string;

  protected _hasIcon = false;

  protected _iconValue?: SVGTemplateResult;

  /**
   * An icon to be rendered from the Icons library.
   * When incorrect icon is referenced nothing is rendered.
   */
  @property({ type: String })
  get icon(): string | undefined {
    return this._icon;
  }

  set icon(value: string | undefined) {
    const old = this._icon;
    if (old === value) {
      return;
    }
    this._icon = value;
    this._updateIcon(value);
    // don't request update here
  }

  /**
   * @returns True when the icon was found and is rendered.
   */
  get hasIcon(): boolean {
    return this._hasIcon;
  }

  /**
   * Maps icon name to it's definition and sets `hasIcon` value.
   *
   * @param name Icon name
   */
  _updateIcon(name?: string): void {
    // @ts-ignore
    const icon = Icons[name as string] as SVGTemplateResult;
    this._hasIcon = !!icon;
    this._iconValue = icon;
    this.requestUpdate();
  }

  /**
   * @return Template result for an icon
   */
  render(): TemplateResult {
    const { hasIcon, _iconValue } = this;
    if (!hasIcon) {
      return html`<style>${this.styles}</style><slot></slot>`;
    }
    return html`<style>${this.styles}</style>${_iconValue}`;
  }
}

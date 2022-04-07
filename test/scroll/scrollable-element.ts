/* eslint-disable no-param-reassign */
import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ScrollTargetMixin } from '../../src/index.js';

export class XScrollableElement extends ScrollTargetMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      font: 14px arial;
    }

    .item {
      border-bottom: 1px solid #ccc;
      background-color: white;
      padding: 20px;
      width: 200%;
    }`;
  }

  @property({ type: Number })
  itemCount = 200;
  
  render(): TemplateResult {
    const items = this._getItems(this.itemCount);
    return html`
    ${items.map((item, index) => html`<div class="item">${index}</div>`)}
    `;
  }

  _getItems(itemCount: number): number[] {
    const items = new Array(itemCount);
    while (itemCount > 0) {
      items[--itemCount] = true;
    }
    return items;
  }
}
window.customElements.define('scrollable-element', XScrollableElement);

declare global {
  interface HTMLElementTagNameMap {
    "scrollable-element": XScrollableElement;
  }
}

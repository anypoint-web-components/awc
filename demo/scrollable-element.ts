/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ScrollTargetMixin } from '../index.js';

export class XScrollableElement extends ScrollTargetMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      font: 14px arial;
    }
    .scrollState {
      border-left: 1px solid #ccc;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      font-weight: bold;
      background-color: #eee;
      position: fixed;
      top: 0;
      left: calc(50% - 100px);
      padding: 10px;
      width: 220px;
      text-align: center;
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

  @property({ type: Number })
  xScrollLeft = 0;

  @property({ type: Number })
  xScrollTop = 0;
  
  render(): TemplateResult {
    const items = this._getItems(this.itemCount);
    return html`
    <div class="scrollState">scrollTop: ${this.xScrollTop} - scrollLeft: ${this.xScrollLeft}</div>
    ${items.map((item, index) => html`<div class="item">${index}</div>`)}
    `;
  }

  _scrollHandler(): void {
    this.xScrollTop = this._scrollTop;
    this.xScrollLeft = this._scrollLeft;
  }

  _getItems(itemCount: number): boolean[] {
    const items: boolean[] = new Array(itemCount);
    while (itemCount > 0) {
      items[--itemCount] = true;
    }
    return items;
  }
}
window.customElements.define('scrollable-element', XScrollableElement);

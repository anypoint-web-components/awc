/* eslint-disable no-param-reassign */
import { LitElement, html, css } from 'lit-element';
import { ScrollTargetMixin } from '../index.js';

class XScrollableElement extends ScrollTargetMixin(LitElement) {
  static get styles() {
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

  static get properties() {
    return {
      xScrollTop: { type: Number },

      xScrollLeft: { type: Number },

      itemCount: { type: Number }
    };
  }

  constructor() {
    super();
    this.itemCount = 200;
    this.xScrollLeft = 0;
    this.xScrollTop = 0;
  }

  render() {
    const items = this._getItems(this.itemCount);
    return html`
    <div class="scrollState">scrollTop: ${this.xScrollTop} - scrollLeft: ${this.xScrollLeft}</div>
    ${items.map((item, index) => html`<div class="item">${index}</div>`)}
    `;
  }

  _scrollHandler() {
    this.xScrollTop = this._scrollTop;
    this.xScrollLeft = this._scrollLeft;
  }

  _getItems(itemCount) {
    const items = new Array(itemCount);
    while (itemCount > 0) {
      items[--itemCount] = true;
    }
    return items;
  }
}
window.customElements.define('scrollable-element', XScrollableElement);

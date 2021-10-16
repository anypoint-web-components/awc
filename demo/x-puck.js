/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html, css } from 'lit-element';
import { ResizableMixin } from '../index.js';

class XPuck extends ResizableMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: inline-block;
      border: 3px solid lightblue;
    }`;
  }

  static get properties() {
    return {
      x: { type: Number },
      y: { type: Number }
    };
  }

  get parent() {
    if (this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // @ts-ignore
      return this.parentNode.host;
    }

    return this.parentNode;
  }

  constructor() {
    super();
    this.x = 0;
    this.y = 0;
    this._onIronResize = this._onIronResize.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('resize', this._onIronResize, true);
    setTimeout(() => this.notifyResize(), 1);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('resize', this._onIronResize);
  }

  _onIronResize() {
    this.x = Math.floor(this.parent.offsetWidth / 3);
    this.y = Math.floor(this.parent.offsetHeight / 3);
    this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0px)`;
  }

  render() {
    return html`<b>I'm a resize-aware, thirdifying puck at (<span>${this.x}</span> x <span>${this.y}</span>).</b>`;
  }
}
customElements.define('x-puck', XPuck);

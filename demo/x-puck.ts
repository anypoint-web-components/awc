/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ResizableMixin } from '../index.js';

class XPuck extends ResizableMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      border: 3px solid lightblue;
    }`;
  }

  get parent(): HTMLElement {
    // @ts-ignore
    if (this.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // @ts-ignore
      return this.parentNode.host;
    }

    return this.parentNode! as HTMLElement;
  }

  @property({ type: Number })
  x = 0;

  @property({ type: Number })
  y = 0;

  constructor() {
    super();
    this._onIronResize = this._onIronResize.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('resize', this._onIronResize, true);
    setTimeout(() => this.notifyResize(), 1);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('resize', this._onIronResize);
  }

  _onIronResize(): void {
    this.x = Math.floor(this.parent.offsetWidth / 3);
    this.y = Math.floor(this.parent.offsetHeight / 3);
    this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0px)`;
  }

  render(): TemplateResult {
    return html`<b>I'm a resize-aware, thirdifying puck at (<span>${this.x}</span> x <span>${this.y}</span>).</b>`;
  }
}
customElements.define('x-puck', XPuck);

declare global {
  interface HTMLElementTagNameMap {
    "x-puck": XPuck;
  }
}

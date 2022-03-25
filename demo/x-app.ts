/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { ResizableMixin } from '../index.js';
import './x-puck.js';

class XApp extends ResizableMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }`;
  }

  render(): TemplateResult {
    return html`<x-puck></x-puck>`;
  }
}
customElements.define('x-app', XApp);

declare global {
  interface HTMLElementTagNameMap {
    "x-app": XApp;
  }
}
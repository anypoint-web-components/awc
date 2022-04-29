/* eslint-disable wc/no-invalid-element-name */
import { html, css, TemplateResult, CSSResult } from 'lit';
import ResizableElement from '../src/elements/overlay/ResizableElement.js';
import './x-puck.js';

class XApp extends ResizableElement {
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

import { html, css, TemplateResult, CSSResult } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import FitElement from '../../src/elements/overlay/FitElement.js';

@customElement('test-fit')
export class TestFit extends FitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      background: black;
      color: white;
      padding: 8px;
    }`;
  }
  
  @property({ type: String, attribute: 'my-prop' })
  myProp?: string;
  
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-fit": TestFit
  }
}

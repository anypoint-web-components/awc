/* eslint-disable max-classes-per-file */

import { LitElement, html, TemplateResult } from 'lit';
import { ButtonStateMixin, ControlStateMixin } from '../../index.js';

export class TestControl extends ControlStateMixin(LitElement) {}
window.customElements.define('test-control', TestControl);

declare global {
  interface HTMLElementTagNameMap {
    "test-control": TestControl
  }
}

export class TestButton extends ButtonStateMixin(ControlStateMixin(LitElement)) {
  _buttonStateChanged(): void {}
}
window.customElements.define('test-button', TestButton);

declare global {
  interface HTMLElementTagNameMap {
    "test-button": TestButton
  }
}

export class NestedFocusable extends ControlStateMixin(LitElement) {
  render(): TemplateResult {
    return html`<input id="input" />`;
  }
}
window.customElements.define('nested-focusable', NestedFocusable);

declare global {
  interface HTMLElementTagNameMap {
    "nested-focusable": NestedFocusable
  }
}

export class TestLightDom extends ButtonStateMixin(ControlStateMixin(LitElement)) {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
window.customElements.define('test-light-dom', TestLightDom);

declare global {
  interface HTMLElementTagNameMap {
    "test-light-dom": TestLightDom
  }
}

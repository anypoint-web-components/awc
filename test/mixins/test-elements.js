/* eslint-disable max-classes-per-file */

import { LitElement, html } from 'lit-element';
import { ButtonStateMixin, ControlStateMixin } from '../../index.js';

export class TestControl extends ControlStateMixin(LitElement) {}
window.customElements.define('test-control', TestControl);

export class TestButton extends ButtonStateMixin(ControlStateMixin(LitElement)) {
  _buttonStateChanged() {}
}
window.customElements.define('test-button', TestButton);

export class NestedFocusable extends ControlStateMixin(LitElement) {
  render() {
    return html`<input id="input" />`;
  }
}
window.customElements.define('nested-focusable', NestedFocusable);

export class TestLightDom extends ButtonStateMixin(ControlStateMixin(LitElement)) {
  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('test-light-dom', TestLightDom);

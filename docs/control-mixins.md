# Anypoint control state mixins for web components

A set of components that reflect control state to properties and / or attributes.
It can be used to control behavior of a control depending on user input.

Included controls:

- `hoverable-mixin.js` - A mixin reflecting mouse over state on `hovered` property reflected to an attribute.
- `button-state-mixin.js` - A mixin reflecting button state like `active`, `pressed`, `pointerDown`, or `receivedFocusFromKeyboard`.
- `control-state-mixin.js` - A mixin reflecting `focused` state and handing `disabled` state of the control.

They are designed to handle aria attributes and state management in various state combinations.
Useful for designing custom buttons and other form elements that accept user input.

## Usage

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import { ButtonStateMixin, ControlStateMixin } from '@anypoint-web-components/awc';

class SimpleButton extends ControlStateMixin(ButtonStateMixin(LitElement)) {
  static get styles() {
    return css`
    :host {
      display: inline-block;
      background-color: #4285F4;
      color: #fff;
      min-height: 8px;
      min-width: 8px;
      padding: 16px;
      text-transform: uppercase;
      border-radius: 3px;
      user-select: none;
      cursor: pointer;
    }

    :host([disabled]) {
      opacity: 0.3;
      pointer-events: none;
    }

    :host([active]),
    :host([pressed]) {
      background-color: #3367D6;
      box-shadow: inset 0 3px 5px rgba(0,0,0,.2);
    }

    :host([focused]) {
      box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
                  0  6px 30px 5px rgba(0, 0, 0, 0.12),
                  0  8px 10px -5px rgba(0, 0, 0, 0.4);
    }`;
  }

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-button', SimpleButton);
```

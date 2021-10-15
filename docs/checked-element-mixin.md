# Anypoint form control mixins for web components

## checked-element-mixin

Use `CheckedElementMixin` to implement an element that can be checked like native checkbox.

## Usage

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import { CheckedElementMixin } from '@anypoint-web-components/awc';

class SimpleCheckbox extends CheckedElementMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
    }

    :host([invalid]) span {
      color: red;
    }

    #labelText {
      display: inline-block;
      width: 100px;
    }`;
  }

  render() {
    return html`
    <input type="checkbox" id="checkbox" @click="${this._onCheckClick}">
    <span id="labelText">${this.label}</span>
    <paper-button raised @click="${this._onClick}">validate</paper-button>`;
  }

  static get properties() {
    return {
      label: { type: String }
    };
  }

  constructor() {
    super();
    this.label = 'Not validated';
  }

  _onCheckClick(e) {
    this.checked = e.target.checked;
  }

  _onClick() {
    this.validate();
    this.label = this.invalid ? 'is invalid' : 'is valid';
  }
}
window.customElements.define('simple-checkbox', SimpleCheckbox);
```

# Color selector

A component that is an input specialized with selecting a color. The package contains a `color-selector` that only renders an interactive control to select a color, and `color-input-selector` that contains additional label and enabling checkbox.

## Usage

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/color-selector.js';
import '@anypoint-web-components/awc/color-input-selector.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <color-selector
      .value="${value}"
      @change="${this._valueHandler}"
      slot="content"
    ></color-selector>
    <color-input-selector
      .value="${value}"
      @change="${this._valueHandler}"
      slot="content"
    >
      Select a color
    </color-input-selector>
    `;
  }

  _valueHandler(e) {
    this.value = e.target.value;
  }

  _inputValueHandler(e) {
    this.value = e.target.value;
    this.colorEnabled = e.target.enabled;
  }
}
customElements.define('sample-element', SampleElement);
```

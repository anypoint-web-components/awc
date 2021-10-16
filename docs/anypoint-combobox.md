# anypoint-combobox

A combo box is a combination of a text field and the autocomplete element to provide an
UI of an input field with suggestions.

## Usage

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-combobox.js';

class SampleElement extends PolymerElement {
  render() {
    const suggestions = ['a', 'b', c];
    return html`
    <anypoint-combobox
      .source="${suggestions}"
      @valuechange="${this._valueHandler}">on/off</anypoint-combobox>
    `;
  }

  _valueHandler(e) {
    this.value = e.detail.value;
  }
}
customElements.define('sample-element', SampleElement);
```

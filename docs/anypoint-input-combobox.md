# anypoint-input-combobox

A combo box is a combination of a text field and the dropdown element. It renders a free input element that coexists with a list of predefined values.
The user is not limited to the list of rendered dropdown values but instead it helps choose the right option.

## Usage

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/anypoint-input-combobox/anypoint-input-combobox.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <anypoint-input-combobox @valuechange="${this._valueHandler}" type="number" .value="{this.zoom}">
      <label slot="label">Zoom level</label>
      <anypoint-listbox slot="dropdown-content" tabindex="-1">
        <anypoint-item>1</anypoint-item>
        <anypoint-item>2</anypoint-item>
        <anypoint-item>3</anypoint-item>
      </anypoint-listbox>
    </anypoint-input-combobox>
    `;
  }

  _valueHandler(e) {
    this.zoom = e.detail.value;
  }
}
customElements.define('sample-element', SampleElement);
```

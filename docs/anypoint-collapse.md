# AnypointCollapse

A modern port of iron-collapse element. It creates a collapsible block of content.
By default, the content will be collapsed.  Use `opened` or `toggle()` to show/hide the content.

The element adjusts the max-height/max-width of the collapsible element to show/hide the content.
Avoid putting padding/margin/border on the collapsible directly, and instead put a div inside and style that.

## Usage

### In a HTML document

```html
<script type="module" src="@anypoint-web-components/awc/anypoint-collapse.js"></script>

<anypoint-collapse>
  <div class="content">
    Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea, id minim maiestatis incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est. Vix ad ponderum petentium suavitate, eum
    eu tempor populo, graece sententiae constituam vim ex. Cu torquatos reprimique neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus. Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea,
    id minim maiestatis incorrupte duo. Dolorum verterem ad ius, his et nullam verterem. Eu alia debet usu, an doming tritani est. Vix ad ponderum petentium suavitate, eum eu tempor populo, graece sententiae constituam vim ex. Cu torquatos reprimique
    neglegentur nec, voluptua periculis has ut, at eos discere deleniti sensibus.
  </div>
</anypoint-collapse>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-collapse.js';

class SimpleElement extends LitElement {
  render() {
    return html`
    <anypoint-collapse>
      ${this.content}
    </anypoint-collapse>
    `;
  }
}
window.customElements.define('simple-element', SimpleElement);
```

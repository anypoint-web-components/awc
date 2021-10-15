# anypoint-button

Anypoint and Material Design styled button.

Anypoint button by default is styled for Anypoint platform. Styles can be controlled by using `emphasis` property ans CSS variables.

`emphasis` can be one of `low`, `middle`, or `high`. Styles for each of it can be redefined using CSS variables.
Low emphasis button should be used for less important actions.
Medium emphasis should be used for secondary actions.
High emphasis should be used for primary action, not very often, ideally one per screen.

## Usage

### In a HTML document

```html
<script type="module" src="@anypoint-web-components/awc/anypoint-button.js"></script>
<script type="module" src="@anypoint-web-components/awc/anypoint-icon-button.js"></script>

<anypoint-button emphasis="low">Low emphasis</anypoint-button>
<anypoint-button emphasis="medium">Medium emphasis</anypoint-button>
<anypoint-button emphasis="high">High emphasis</anypoint-button>
<anypoint-button toggles>Button that toggles</anypoint-button>
<anypoint-button disabled>You can't click me</anypoint-button>

<anypoint-icon-button emphasis="low">
  <my-icon icon="alarm-add"></my-icon>
</anypoint-icon-button>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-button.js';
import '@anypoint-web-components/awc/anypoint-icon-button.js';

class SimpleElement extends LitElement {
  render() {
    return html`
    <anypoint-button emphasis="low">Low emphasis</anypoint-button>
    <anypoint-button emphasis="medium">Medium emphasis</anypoint-button>
    <anypoint-button emphasis="high">High emphasis</anypoint-button>
    <anypoint-button toggles>Button that toggles</anypoint-button>
    <anypoint-button disabled>You can't click me</anypoint-button>

    <anypoint-icon-button emphasis="low">
      <my-icon icon="alarm-add"></my-icon>
    </anypoint-icon-button>
    `;
  }
}
window.customElements.define('simple-element', SimpleElement);
```

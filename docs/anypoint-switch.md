# anypoint-switch

Switches toggle the state of a single setting on or off. They are the preferred way to adjust settings on mobile.

This component is based on Material Design switch and adjusted for Anypoint platform components.

Anypoint web components are set of components that allows to build Anypoint enabled UI in open source projects.

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/anypoint-switch.js';
    </script>
  </head>
  <body>
    <anypoint-switch>on/of</anypoint-switch>
    <script>
    {
      document.querySelector('anypoint-switch').onchange = () => {
        // ...
      };
    }
    </script>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-switch.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <anypoint-switch
      .checked="${this.checked}"
      @change="${this._switchHandler}">on/off</anypoint-switch>
    `;
  }

  _switchHandler(e) {
    this.checked = e.detail.value;
  }
}
customElements.define('sample-element', SampleElement);
```

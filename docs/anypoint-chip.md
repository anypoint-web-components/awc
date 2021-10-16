# anypoint-chip

A compact material design element that represent and input, attribute, or action.

## Example

```html
<style>
.avatar {
  background-color: red;
  color: #fff !important;
  width: 24px;
  height: 24px;
}
</style>
<h2>Basics</h2>
<section>
  <anypoint-chip>Simple chip</anypoint-chip>

  <anypoint-chip>
    <span class="avatar" slot="icon">C</span>
    <span>Chip with icon</span>
  </anypoint-chip>

  <anypoint-chip removable>
    <span class="avatar" slot="icon">R</span>
    Chip that can be removed
  </anypoint-chip>

  <anypoint-chip removable disabled>
    <span class="avatar" slot="icon">D</span>
    Disabled chip
  </anypoint-chip>
</section>

<h2>Input chips</h2>
<section>
  <anypoint-chip removable>
    <iron-icon icon="communication:location-on" slot="icon"></iron-icon>
    Portland
  </anypoint-chip>

  <anypoint-chip removable>
    <iron-icon icon="maps:directions-bike" slot="icon"></iron-icon>
    Biking
  </anypoint-chip>
</section>
```

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@anypoint-web-components/awc/anypoint-chip.js';
    </script>
  </head>
  <body>
    <anypoint-chip></anypoint-chip>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-chip.js';

class SampleElement extends PolymerElement {
  render() {
    return html`
    <anypoint-chip></anypoint-chip>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

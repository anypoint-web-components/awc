# date-time

An element to render data and/or time formatted for user locale.

```html
<date-time date="2010-12-10T11:50:45Z" year="numeric" month="narrow" day="numeric"></date-time>
```

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/date-time.js';
    </script>
  </head>
  <body>
    <date-time date="2010-12-10T11:50:45Z" year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit" second="2-digit"></date-time>
  </body>
</html>
```

### In a Polymer 3 element

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/date-time.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <date-time date="2010-12-10T11:50:45Z" year="numeric" month="long" day="numeric" hour="2-digit" minute="2-digit" second="2-digit"></date-time>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

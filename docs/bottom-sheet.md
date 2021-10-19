# bottom-sheet element

Bottom sheets slide up from the bottom of the screen to reveal more content.

## Example

```html
<bottom-sheet nopadding>
  <paper-item>Action #1</paper-item>
  <paper-item>Action #2</paper-item>
  <paper-item>Action #3</paper-item>
</bottom-sheet>
```

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import './node_modules/@advanced-rest-client/bottom-sheet/bottom-sheet.js';
    </script>
  </head>
  <body>
    <bottom-sheet>
      <paper-item>Action #1</paper-item>
      <paper-item>Action #2</paper-item>
      <paper-item>Action #3</paper-item>
    </bottom-sheet>
    <paper-button>Open menu</paper-button>
    <script>
    {
      document.querySelector('paper-button').addEventListener('click', () => {
        document.querySelector('bottom-sheet').opened = true;
      });
    }
    </script>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@advanced-rest-client/bottom-sheet/bottom-sheet.js';

class SampleElement extends LitElement {
  static get properties() {
    return {
      menuOpened: { type: Boolean }
    }
  }
  render() {
    return html`
    <bottom-sheet .opened="${this.menuOpened}">
      <paper-item>Action #1</paper-item>
      <paper-item>Action #2</paper-item>
      <paper-item>Action #3</paper-item>
    </bottom-sheet>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

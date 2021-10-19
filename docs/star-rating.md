# star-rating

A component that renders stars for rating.

```html
<star-rating value="3"></star-rating>
<star-rating value="4" readonly></star-rating>
```

Element can be styled using CSS variables

```html
<star-rating class="theme-blue" value="3"></star-rating>
<style>
.theme-blue {
  --star-rating-unselected-color: #BBDEFB;
  --star-rating-selected-color: #1565C0;
  --star-rating-active-color: #2196F3;
}
</style>
```

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/star-rating.js';
    </script>
  </head>
  <body>
    <label id="ratingLabel">My rating</label>
    <star-rating value="2" arial-labelledby="ratingLabel"></star-rating>
    <script>
    {
      document.querySelector('star-rating').onchange = (e) => {
        console.log(`New rating is ${e.target.value}`);
      };
    }
    </script>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/star-rating.js';

class SampleElement extends LitElement {
  static get properties() {
    return {
      rating: { type: Number }
    }
  }

  _ratingChanged(e) {
    this.rating = e.target.value;
  }

  render() {
    return html`
    <star-rating .value="${this.rating}" @value-changed="${this._ratingChanged}"></star-rating>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

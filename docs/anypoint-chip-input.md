# anypoint-chip-input

A material design input with chips styled for Anypoint platform.

This element extends AnypointInput class.

Chips are compact elements that represent an input, attribute, or action.

## Usage

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/anypoint-chip-input.js';
    </script>
  </head>
  <body>
    <anypoint-chip-input></anypoint-chip-input>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/anypoint-chip-input.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <anypoint-chip-input></anypoint-chip-input>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Input value

The `value` property represents current user input. The input is cleared each time a suggestion is accepted.

Chips value can be read from `chipsValue` property. It also accepts previous values as long as suggestions (`source` property) is set.

You can directly manipulate chips data model by accessing `chips` property. Note that the element does not observe deep changes in the array. Re-assign the array when changing the model. lit-html handles template rendering efficiently in this case.

### Predefined suggestions

The input accepts chips value via `chips` property. It is an array of values to render when the element is initialized or at runtime.

```javascript
const chips = [
  {
    label: 'Chip #1'
  },
  {
    label: 'Chip #2', removable: true
  },
  {
    label: 'Chip #3', icon: svg`...`
  }
];
html`<anypoint-chip-input .chips="${chips}">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

Chips are required to have a `label` property that is used to render the value.

A chip can have a `removable` property that allows the user to remove the chip from the input.

An `icon` property allows to render a chip with an icon.

### Chip suggestions

Chip input accepts `source` array with a list of suggestions to render in a drop down on user input. It can be list of strings or a list of maps with `value` property and optionally `icon` property.

#### Simple suggestions

```javascript

const source = [
  'Apple', 'Apricot', 'Avocado', ...
];

html`<anypoint-chip-input .source="${source}">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

#### Icons suggestions

The icon is rendered in a chip only.

The icon property must be an instance of  `SVGTemplateResult` from `lit-html` element.

```javascript
import { svg } from 'lit-element';

// Creating icons example
const iconWrapper = (tpl) => svg`<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">${tpl}</svg>`;
export const directionsBike = iconWrapper(svg`<path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"></path>`);
export const directionsBoat = iconWrapper(svg`<path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"></path>`);
export const directionsBus = iconWrapper(svg`<path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"></path>`);

const source = [
  {
    value: 'Biking',
    icon: directionsBike
  }, {
    value: 'Boat trip',
    icon: directionsBoat
  }, {
    value: 'Bus trip',
    icon: directionsBus
  }
  ...
];

html`<anypoint-chip-input .source="${source}" infoMessage="Type 'b' in the input">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

### Restoring values from suggestions with icons

Value can be restored by passing previous value to `chipsValue` property.

```javascript
const source = [
  {
    value: 'Biking',
    icon: directionsBike
  }, {
    value: 'Boat trip',
    icon: directionsBoat
  }, {
    value: 'Bus trip',
    icon: directionsBus
  }
  ...
];
const chipsValue = ['Biking', 'Shopping'];

html`<anypoint-chip-input
  .source="${source}"
  .chipsValue="${chipsValue}"
>
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

### Allowed chips

It is possible to limit the input to a set list of values by passing allowed list to the `allowed` property.

```javascript
const allowed = ['apple', 'Orange', 'BANANA`'];
html`<anypoint-chip-input
  .allowed="${allowed}"
  infoMessage="Only: Apple, Orange, and Banana">
  <label slot="label">Only allowed will become chips and value</label>
</anypoint-chip-input>`
```

### Suggestions with IDs

When `source` contains an `id` property on an item, the `id` is returned in the `chipsValue` instead of the `value`.

```javascript
const source = [
  {
    value: 'Biking',
    icon: directionsBike,
    id: 'activity-1'
  }, {
    value: 'Boat trip',
    icon: directionsBoat,
    id: 'activity-2'
  }, {
    value: 'Bus trip',
    icon: directionsBus,
    id: 'activity-3'
  }
  ...
];
html`<anypoint-chip-input
  .source="${source}">
  <label slot="label">Type your favourite fruits</label>
</anypoint-chip-input>`
```

### Restoring from IDs

Value can be restored by passing previous value to `chipsValue` property.

```javascript
const source = [
  {
    value: 'Biking',
    icon: directionsBike,
    id: 'activity-1'
  }, {
    value: 'Boat trip',
    icon: directionsBoat,
    id: 'activity-2'
  }, {
    value: 'Bus trip',
    icon: directionsBus,
    id: 'activity-3'
  }
  ...
];
const value = ['activity-1'];
html`<anypoint-chip-input
  .source="${source}"
  .chipsValue="${value}">
  <label slot="label">Type your favourite fruits</label>
</anypoint-chip-input>`
```

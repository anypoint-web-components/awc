# `<anypoint-radio-button>`

Accessible radio button and radio button group for Anypoint platform.

Radio buttons are used to select one of predefined options.
Radio buttons should be used when the user must see all available options. Consider using a dropdown list if the options can be collapsed.

See [Radio buttons](https://material.io/design/components/selection-controls.html#radio-buttons) documentation in Material Design documentation for principles and anatomy of radio buttons.

## Usage

### In an HTML file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/anypoint-radio-button.js';
      import '@anypoint-web-components/awc/anypoint-radio-group.js';
    </script>
  </head>
  <body>
    <anypoint-radio-group selectable="anypoint-radio-button">
       <anypoint-radio-button name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button name="c">Orange</anypoint-radio-button>
    </anypoint-radio-group>
  </body>
</html>
```

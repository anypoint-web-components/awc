# anypoint-dropdown

An element that displays content inside a fixed-position container, positioned relative to another element.

Partially inspired by [anypoint-dropdown](https://github.com/PolymerElements/anypoint-dropdown)

## Accessibility

The element does not offer `aria-*` or `role` attributes. The elements that uses this element should set an appropriate role and aria to the context.

## Usage

### In an HTML file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/anypoint-dropdown/anypoint-dropdown.js';
    </script>
    <style>
      #container {
        display: inline-block;
      }

      anypoint-dropdown {
        border: 1px solid gray;
        background: white;
        font-size: 2em;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <button onclick="dropdown.open();">open the anypoint-dropdown</button>
      <anypoint-dropdown id="dropdown" noOverlap>
        <div slot="dropdown-content">Hello!</div>
      </anypoint-dropdown>
    </div>
  </body>
</html>
```

# Anypoint Web Components

This module consists of all base Anypoint web components. Use them to build an OSS app UI using Material Design with an ability to switch to Anypoint theme on demand.

[![tests](https://github.com/anypoint-web-components/awc/actions/workflows/deployment.yml/badge.svg)](https://github.com/anypoint-web-components/awc/actions/workflows/deployment.yml)

[![Published on NPM](https://img.shields.io/npm/v/@anypoint-web-components/awc.svg)](https://www.npmjs.com/package/@anypoint-web-components/awc)

## Previous components

All components with `@anypoint-web-components` scope has been consolidate under this module. Use this module instead of installing individual packages.

## Usage

### Installation

```sh
npm install --save @anypoint-web-components/awc
```

### Example use

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/anypoint-item.js';
    </script>
  </head>
  <body>
    <div role="listbox" slot="content">
      <anypoint-item>
        Option 1
      </anypoint-item>
      <anypoint-item>
        Option 2
      </anypoint-item>
      <anypoint-item>
        Option 3
      </anypoint-item>
      <anypoint-item>
        <p>Paragraph as a child</p>
      </anypoint-item>
    </div>
  </body>
</html>
```

Check the `docs/` directory for a readme for each component.

## Development

```sh
git clone https://github.com/anypoint-web-components/awc
cd awc
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

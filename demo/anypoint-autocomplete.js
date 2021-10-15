import { html } from 'lit-html';
import { Word } from '@pawel-up/data-mock';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../colors.js';
import '../anypoint-input.js';
import '../anypoint-checkbox.js';
import '../anypoint-autocomplete.js';

/* eslint-disable no-plusplus */

const suggestions = ['Apple', 'Apricot', 'Avocado',
  'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
  'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya',
  'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit',
  'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry',
  'Grape', 'Grapefruit', 'Guava', 'Huckleberry', 'Jabuticaba', 'Jackfruit',
  'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
  'Lime', 'Loquat', 'Lychee', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
  'Mulberry', 'Nectarine', 'Olive', 'Orange'
];

const fullSuggestions = [
  {
    value: 'apple',
    label: 'Apple',
    description: 'Select apple to be healthy',
  },
  {
    value: 'banana',
    label: 'Banana',
    description: 'Select banana for fun!',
  },
  {
    value: 'blueberry',
    label: 'Blueberry',
    description: 'Select blueberry to kill the hunger',
  },
];

const word = new Word();

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoUseLoader',
      'demoNoAnimation',
      'complexSuggestions'
    ]);

    this.componentName = 'anypoint-autocomplete';
    this.demoUseLoader = false;
    this.darkThemeActive = false;
    this.demoNoAnimation = false;
    this.complexSuggestions = false;
  }

  _demoQuery(e) {
    if (!this.demoUseLoader) {
      return;
    }
    const { value } = e.detail;
    setTimeout(() => {
      const items = [];
      for (let i = 0; i < 25; i++) {
        // @ts-ignore
        const item = `${value} ${word.word()}`;
        items.push({
          label: html`HTML value: <b>${item}</b>`,
          value: item,
        });
      }
      e.target.source = items;
    }, 700);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      outlined,
      anypoint,
      demoUseLoader,
      demoNoAnimation,
      complexSuggestions,
    } = this;

    const items = complexSuggestions ? fullSuggestions : suggestions;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the autocomplete element with various
          configuration options.
        </p>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <div slot="content"
            aria-label="Input field with list suggestions">
            <anypoint-input
              ?outlined="${outlined}"
              ?compatibility="${anypoint}"
              id="fruitsSuggestions1"
              >
              <label slot="label">Enter fruit name</label>
            </anypoint-input>

            <anypoint-autocomplete
              slot="content"
              openOnFocus
              target="fruitsSuggestions1"
              ?compatibility="${anypoint}"
              ?noAnimations="${demoNoAnimation}"
              ?loader="${demoUseLoader}"
              .source="${items}"
              @query="${this._demoQuery}"
              verticalOffset="48"
            >
            </anypoint-autocomplete>
          </div>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoNoAnimation"
            @change="${this._toggleMainOption}"
            >No animation</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoUseLoader"
            @change="${this._toggleMainOption}"
            >Async suggestions</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="complexSuggestions"
            @change="${this._toggleMainOption}"
            >Use complex suggestions</anypoint-checkbox>
        </interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint Autocomplete</h2>
      ${this._demoTemplate()}

      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design lists.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          The element renders accessible list of suggestions for input field.
        </p>
      </section>

      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint button comes with 2 predefined styles:</p>
        <ul>
          <li><b>Regular</b> - The list is styled for Material Design</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>

        <h3>Installation</h3>
        <code>npm install --save @anypoint-web-components/awc</code>
        <details>
          <summary>In a HTML document</summary>
          <code>
            <pre>
      ${`<html>
        <head>
          <script type="module">
            import '@anypoint-web-components/awc/anypoint-autocomplete.js';
            import '@anypoint-web-components/awc/anypoint-input.js';
          </script>
        </head>
        <body>
          <div class="parent">
            <anypoint-input id="targetInput"></anypoint-input>
            <anypoint-autocomplete target="targetInput"></anypoint-autocomplete>
          </div>
        </body>
      </html>`}
            </pre>
          </code>
        </details>

        <h3>Connecting the input</h3>
        <p>
          To connect autocomplete to a text input use <code>target</code> property.
          It accepts a reference to a HTMLElement or a string which is the ID
          of the input element.<br/>
          When using ID attribute the target input has to have the same parent
          as the autocomplete element. It does not query the document for the ID.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
      ${`<div class="parent">
        <anypoint-input id="targetInput"></anypoint-input>
        <anypoint-autocomplete target="targetInput"></anypoint-autocomplete>
      </div>`}
            </pre>
          </code>
        </details>

        <h3>Passing suggestions</h3>

        <h4>Static suggestions</h4>
        <p>
          To pass suggestions to the element use <code>source</code> property.
          Static suggestions are rendered immediately.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
      ${`<div class="parent">
        <anypoint-input id="targetInput"></anypoint-input>
        <anypoint-autocomplete target="targetInput"></anypoint-autocomplete>
        <script>
        {
          document.querySelector('anypoint-autocomplete').source = [
            'a',
            'b',
            'c',
            'd'
          ];
        }
        </script>
      </div>`}
            </pre>
          </code>
        </details>

        <p>
          The list of suggestions can contain either a list of string which are rendered
          in the drop down list, or a list of objects. When rendering objects it expects
          a <code>value</code> property to be set to render this value in the list.
        </p>

        <p>
          When the user select a suggestion it's value is inserted into the text field
          and <code>selected</code> event is dispatched containing the original value of
          the suggestion.
        </p>

        <h4>Asynchronous suggestions</h4>
        <p>
          When the input value changes the autocomplete dispatches <code>query</code>
          event. Your application should handle this event, generate suggestions for the user,
          and set the <code>source</code> property.
        </p>

        <p>
          To indicate to the user that the suggestions are async you may set <code>loader</code>
          property. It renders a progress bar until source property change.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
      ${`<div class="parent">
        <anypoint-input id="targetInput"></anypoint-input>
        <anypoint-autocomplete target="targetInput"></anypoint-autocomplete>
        <script>
        {
          document.querySelector('anypoint-autocomplete').onquery = (e) => {
            const { value } = e.detail;
            const suggestions = await getAsyncSuggestions(value);
            e.target.source = suggestions;
          };
        }
        </script>
      </div>`}
            </pre>
          </code>
        </details>
      </section>

      <section class="documentation-section">
        <h2>Accessibility</h2>
        <p>
          The autocomplete element follows W3C guidelines for
          <a href="https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html">
            ARIA 1.1 Combobox with Listbox Popup
          </a>. The element is enabled to support screen readers.
        </p>

        <p>
          Because of how screen readers parses page content and associate roles, the
          element places suggestions as child elements of the autosuggestion element. This means that
          you may accidentally style list items from your master CSS file.
        </p>

        <p>
          Because autocomplete element and text input requires a parent element with specific role,
          put both elements inside single parent. The element takes care of setting roles and aria
          attributes on all elements.
        </p>

        <details>
          <summary>Code example - Your code</summary>
          <code>
            <pre>
      ${`<div class="parent">
        <anypoint-input id="targetInput"></anypoint-input>
        <anypoint-autocomplete target="targetInput"></anypoint-autocomplete>
      </div>`}
            </pre>
          </code>
        </details>

        <details>
          <summary>Code example - Final structure</summary>
          <code>
            <pre>
      ${`<div
        class="parent"
        role="combobox"
        aria-label="Text input with list suggestions"
        aria-expanded="true"
        aria-owns="paperAutocompleteInput7302"
        aria-haspopup="listbox">
        <anypoint-input
          id="targetInput"
          aria-autocomplete="list"
          autocomplete="off"
          aria-haspopup="true"
          aria-controls="paperAutocompleteInput63418"></anypoint-input>
        <anypoint-autocomplete
          target="targetInput"
          id="paperAutocompleteInput7302"
          aria-controls="paperAutocompleteInput63418"
          >
          <anypoint-dropdown>
            <anypoint-listbox
              aria-label="Use arrows and enter to select list item. Escape to close the list."
              role="listbox"
              aria-activeDescendant=""
              id="paperAutocompleteInput63418"></anypoint-listbox>
          </anypoint-dropdown>
        </anypoint-autocomplete>
      </div>`}
            </pre>
          </code>
        </details>
        <p>
          You can set <code>aria-label</code> on the parent to override default message.
          However other attributes are always changed to comply with accessibility requirements.
        </p>
      </section>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

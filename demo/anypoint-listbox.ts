import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';
import '../src/define/anypoint-item.js';
import '../src/define/anypoint-listbox.js';
import './lib/interactive-demo.js';
import { demoProperty } from './lib/decorators.js';
import { AnypointListboxElement } from '../src/index.js';

class ComponentDemo extends DemoPage {
  fruits: string[] = ['Apple', 'Apricot', 'Avocado',
    'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
    'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya',
    'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit',
    'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry',
    'Grape', 'Grapefruit', 'Guava', 'Huckleberry', 'Jabuticaba', 'Jackfruit',
    'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
    'Lime', 'Loquat', 'Lychee', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
    'Mulberry', 'Nectarine', 'Olive', 'Orange'
  ];

  @demoProperty()
  eventsLog: string[] = [];

  constructor() {
    super();
    this.componentName = 'anypoint-listbox';
  }

  logEvent(e: Event): void {
    const typed = e as CustomEvent;
    const { type } = e;
    let log = `Event: ${type}\n`;
    if (typed.detail) {
      log += `Detail: ${typeof typed.detail} ${JSON.stringify(typed.detail, this.stringifyDetail, 2)}\n\n`;
    }
    this.eventsLog.push(log);
    this.render();

    if (e.type === 'selected') {
      this.selectedHandler(e);
    }
  }

  selectedHandler(e: Event): void {
    const list = e.target as AnypointListboxElement;
    const { selectedItem } = list;
    console.log('selectedItem', selectedItem);
  }

  stringifyDetail(key: string, value: any): any {
    if (!key) {
      if (Array.isArray(value)) {
        return value;
      }
      
      return value;
    }
    if (value instanceof Node) {
      const node = value as Node;
      return `<${node.nodeName.toLowerCase()}>`;
    }
    if (value instanceof MutationRecord) {
      return `[MutationRecord]`;
    }
    return value;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      darkThemeActive,
      anypoint,
    } = this;
    return html`
    <section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the listbox element with various
        configuration options.
      </p>
      <interactive-demo
        .states="${demoStates}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <anypoint-listbox 
          slot="content" 
          ?anypoint="${anypoint}"
          @selected="${this.selectedHandler}"
        >
          <anypoint-item>API project 1</anypoint-item>
          <anypoint-item>API project 2</anypoint-item>
          <anypoint-item>API project 3</anypoint-item>
          <anypoint-item>API project 4</anypoint-item>
        </anypoint-listbox>
      </interactive-demo>
    </section>`;
  }

  _introductionTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design list item and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          An element to render accessible list box with selection options.
          It is to be used in menus, dropdown menus, and lists.
        </p>
        <p>
          The element works best with <code>anypoint-item</code> but can be sued with
          any HTML element.
        </p>
      </section>
    `;
  }

  _usageTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint listbox comes with 2 pre-defied styles:</p>
        <ul>
          <li><b>Normal</b></li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>
        <p>
          Even though the element has no particular styling options for Anypoint style,
          it sets <code>anypoint</code> attribute on children. This way you can
          propagate Anypoint theme without setting the attribute on each element.
        </p>

        <h3>Selection</h3>
        <p>
          Use <code>selected</code> attribute to select an item. By default the index of the
          item is used to make the selection.
        </p>

        <anypoint-listbox selected="1" @selected="${this.selectedHandler}">
          <anypoint-item>API project 1</anypoint-item>
          <anypoint-item>API project 2</anypoint-item>
          <anypoint-item>API project 3</anypoint-item>
          <anypoint-item>API project 4</anypoint-item>
        </anypoint-listbox>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
                &lt;anypoint-listbox selected="1"&gt;
                  &lt;anypoint-item&gt;API project 1&lt;/anypoint-item&gt;
                  &lt;anypoint-item&gt;API project 2&lt;/anypoint-item&gt;
                  &lt;anypoint-item&gt;API project 3&lt;/anypoint-item&gt;
                  &lt;anypoint-item&gt;API project 4&lt;/anypoint-item&gt;
                &lt;/anypoint-listbox&gt;
              </pre>
            </code>
        </details>

        <p>
          Use <code>attrforselected</code> attribute to make a selection based on the attribute value.
        </p>

        <anypoint-listbox attrforselected="data-project-id" selected="p2" @selected="${this.selectedHandler}">
          <anypoint-item data-project-id="p1">API project 1</anypoint-item>
          <anypoint-item data-project-id="p2">API project 2</anypoint-item>
          <anypoint-item data-project-id="p3">API project 3</anypoint-item>
          <anypoint-item data-project-id="p4">API project 4</anypoint-item>
        </anypoint-listbox>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-listbox attrforselected="data-project-id" selected="p2"&gt;
                &lt;anypoint-item data-project-id="p1"&gt;API project 1&lt;/anypoint-item&gt;
                &lt;anypoint-item data-project-id="p2"&gt;API project 2&lt;/anypoint-item&gt;
                &lt;anypoint-item data-project-id="p3"&gt;API project 3&lt;/anypoint-item&gt;
                &lt;anypoint-item data-project-id="p4"&gt;API project 4&lt;/anypoint-item&gt;
              &lt;/anypoint-listbox&gt;
              </pre>
            </code>
        </details>

        <h3>Multi selection</h3>
        <p>
          Use <code>multi</code> attribute to enable multi selection of list items.
        </p>

        <anypoint-listbox multi @selected="${this.selectedHandler}">
          <anypoint-item>API project 1</anypoint-item>
          <anypoint-item>API project 2</anypoint-item>
          <anypoint-item>API project 3</anypoint-item>
          <anypoint-item>API project 4</anypoint-item>
        </anypoint-listbox>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
              &lt;anypoint-listbox multi&gt;
                &lt;anypoint-item&gt;API project 1&lt;/anypoint-item&gt;
                &lt;anypoint-item&gt;API project 2&lt;/anypoint-item&gt;
                &lt;anypoint-item&gt;API project 3&lt;/anypoint-item&gt;
                &lt;anypoint-item&gt;API project 4&lt;/anypoint-item&gt;
              &lt;/anypoint-listbox&gt;
              </pre>
            </code>
        </details>
      </section>

      <h3>Explicit selection</h3>
      <p>
        Use <code>selectable</code> attribute define a css selector of items that can be selected
        on the list. It is helpful if the list contain non-selctable items like horizontal lines.
      </p>

      <anypoint-listbox selectable=".allowed" @selected="${this.selectedHandler}">
      <anypoint-item class="allowed">API project 1</anypoint-item>
      <anypoint-item class="allowed">API project 2</anypoint-item>
      <hr>
      <anypoint-item class="allowed">API project 3</anypoint-item>
      <anypoint-item class="allowed">API project 4</anypoint-item>
      </anypoint-listbox>

      <details>
        <summary>Code example</summary>
        <code>
          <pre>
            &lt;anypoint-listbox selectable=".allowed"&gt;
            &lt;anypoint-item class="allowed"&gt;API project 1&lt;/anypoint-item&gt;
            &lt;anypoint-item class="allowed"&gt;API project 2&lt;/anypoint-item&gt;
            &lt;hr&gt;
            &lt;anypoint-item class="allowed"&gt;API project 3&lt;/anypoint-item&gt;
            &lt;anypoint-item class="allowed"&gt;API project 4&lt;/anypoint-item&gt;
            &lt;/anypoint-listbox&gt;
          </pre>
        </code>
      </details>
    </section>

    <h3>Selection while typing</h3>
    <p>
      When the element is focused after the user start typing item name, the matching item
      becomes focused item. The user can confirm selection via space bar / enter key.
    </p>

    <anypoint-listbox class="scrolled">
    ${this.fruits.map((item) => html`<anypoint-item role="option" aria-selected="false">${item}</anypoint-item>`)}
    </anypoint-listbox>

    ${this._eventsHandlingTemplate()}
    `;
  }

  _eventsHandlingTemplate(): TemplateResult {
    return html`
    <h3>Events handling</h3>

    <anypoint-listbox selectable=".allowed" 
      @activate="${this.logEvent}" 
      @childrenchange="${this.logEvent}" 
      @deselect="${this.logEvent}" 
      @select="${this.logEvent}" 
      @itemschange="${this.logEvent}" 
      @selected="${this.logEvent}"
      @selectedchange="${this.logEvent}"
      @selecteditemschange="${this.logEvent}"
      @selectedvalueschange="${this.logEvent}"
    >
      <anypoint-item class="allowed">API project 1</anypoint-item>
      <anypoint-item class="allowed">API project 2</anypoint-item>
      <hr>
      <anypoint-item class="allowed">API project 3</anypoint-item>
      <anypoint-item class="allowed">API project 4</anypoint-item>
    </anypoint-listbox>

    <pre class="log"><code>${this.eventsLog.join('\n')}</code></pre>
    `;
  }

  contentTemplate(): TemplateResult {
    return html`
    <h2>Anypoint item</h2>
    ${this._demoTemplate()}
    ${this._introductionTemplate()}
    ${this._usageTemplate()}`;
  }

  _contentTemplate(): TemplateResult {
    return html`
      <div class="card">
        <h3>Auto focuses while typing a name</h3>
      </div>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

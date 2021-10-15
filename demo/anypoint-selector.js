import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import '../anypoint-selector.js';
import './lib/demo-helper.js'

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.componentName = 'anypoint-selector';
    this.initObservableProperties();
    this._dynamicItems = ['item 1', 'item 2', 'item 3'];
    this._addDynamicItem = this._addDynamicItem.bind(this);
  }

  initObservableProperties() {
    [
      'dynamicItems'
    ].forEach((item) => {
      Object.defineProperty(this, item, {
        get() {
          return this[`_${  item}`];
        },
        set(newValue) {
          this._setObservableProperty(item, newValue);
        },
        enumerable: true,
        configurable: true
      });
    });
  }

  _addDynamicItem() {
    const items = this.dynamicItems;
    items.push(`item ${  items.length + 1}`);
    this.dynamicItems = [...items];
  }

  contentTemplate() {
    return html`
    <h3>Basic</h3>
    <demo-helper>
      <template>
        <anypoint-selector selected="3">
          <div>Item 0</div>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </anypoint-selector>
      </template>
    </demo-helper>

    <h3>Use <code>multi</code> to enable multiple selection.</h3>
    <demo-helper>
      <template>
        <anypoint-selector multi selectedValues="[0,2]">
          <div>Item 0</div>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </anypoint-selector>
      </template>
    </demo-helper>

    <h3>
      Use <code>attrforselected</code> to specify the attribute of the
      selectable elements containing the selection key.
    </h3>
    <demo-helper>
      <template>
        <anypoint-selector selected="bar" attrforselected="name">
          <div name="foo">Foo</div>
          <div name="bar">Bar</div>
          <div name="baz">Baz</div>
          <div name="qux">Qux</div>
          <div name="quux">Quux</div>
        </anypoint-selector>
      </template>
    </demo-helper>

    <h3>
      Use <code>selectable</code> to specify which elements can be selected
    </h3>
    <demo-helper>
      <template>
        <anypoint-selector selectable=".allowed">
          <div class="allowed">Foo</div>
          <hr>
          <div class="allowed">Baz</div>
          <hr>
          <div class="allowed">Quux</div>
        </anypoint-selector>
      </template>
    </demo-helper>

    <h3>
      Use <code>selectedAttribute</code> add an attribute to selected item
    </h3>
    <demo-helper>
      <template>
        <anypoint-selector selectedAttribute="selected-item">
          <div>Foo</div>
          <div>Bar</div>
          <div>Baz</div>
          <div>Qux</div>
          <div>Quux</div>
        </anypoint-selector>
        <style>
        [selected-item] {
          background-color: #F44336;
        }
        </style>
      </template>
    </demo-helper>

    <h3>
      Use <code>fallbackSelection</code> to instruct which should be selected when selection not sound
    </h3>
    <demo-helper>
      <template>
        <anypoint-selector fallbackSelection="0" selected="10">
          <div>Foo</div>
          <div>Bar</div>
          <div>Baz</div>
          <div>Qux</div>
          <div>Quux</div>
        </anypoint-selector>
        <style>
        [selected-item] {
          background-color: #F44336;
        }
        </style>
      </template>
    </demo-helper>

    <section class="card">
      <h3>
        Works with dynamic lists
      </h3>
      <anypoint-selector selected="0">
        <div>Default</div>
        ${this._dynamicItems.map((item) => html`<div>${item}</div>`)}
      </anypoint-selector>
      <button @click="${this._addDynamicItem}">Add item</button>
    </section>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

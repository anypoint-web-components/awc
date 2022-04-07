/* eslint-disable lit-a11y/anchor-is-valid */
import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';
import '../src/define/anypoint-item.js';
import { SimpleMenu } from './simple-menu.js';
import './simple-menubar.js';

class ComponentDemo extends DemoPage {
  fruits: string[] = [
    'Apple',
    'Apricot',
    'Avocado',
    'Banana',
    'Bilberry',
    'Blackberry',
    'Blackcurrant',
    'Blueberry',
    'Boysenberry',
    'Cantaloupe',
    'Currant',
    'Cherry',
    'Cherimoya',
    'Cloudberry',
    'Coconut',
    'Cranberry',
    'Damson',
    'Date',
    'Dragonfruit',
    'Durian',
    'Elderberry',
    'Feijoa',
    'Fig',
    'Goji berry',
    'Gooseberry',
    'Grape',
    'Grapefruit',
    'Guava',
    'Huckleberry',
    'Jabuticaba',
    'Jackfruit',
    'Jambul',
    'Jujube',
    'Juniper berry',
    'Kiwi fruit',
    'Kumquat',
    'Lemon',
    'Lime',
    'Loquat',
    'Lychee',
    'Mango',
    'Marion berry',
    'Melon',
    'Miracle fruit',
    'Mulberry',
    'Nectarine',
    'Olive',
    'Orange',
  ];

  constructor() {
    super();
    this.componentName = 'anypoint-menu-mixin';
  }

  get highlightElement(): SimpleMenu {
    return document.getElementById('highlight') as SimpleMenu;
  }

  get focusElement(): SimpleMenu {
    return document.getElementById('focus') as SimpleMenu;
  }

  _highlightNextHandler(): void {
    this.highlightElement.highlightNext();
  }

  _highlightPreviousHandler(): void {
    this.highlightElement.highlightPrevious();
  }

  _focusNextHandler(): void {
    this.focusElement.focusNext();
  }

  _focusPreviousHandler(): void {
    this.focusElement.focusPrevious();
  }

  contentTemplate(): TemplateResult {
    return html`
      <div class="card">
        <h3>Simple menu</h3>
        <div class="horizontal-section">
          <simple-menu>
            <a href="javascript:void(0)" role="menuitem">Item 0</a>
            <a href="javascript:void(0)" role="menuitem">Item 1</a>
            <a href="javascript:void(0)" role="menuitem" disabled>Item 2</a>
            <a href="javascript:void(0)" role="menuitem" hidden>Ghost</a>
            <a href="javascript:void(0)" role="menuitem">Item 3</a>
            <a href="javascript:void(0)" role="menuitem" style="display:none"
              >Another ghost</a
            >
          </simple-menu>
        </div>
      </div>

      <div class="card">
        <h3>Multi-select menu</h3>
        <div class="horizontal-section">
          <simple-menu multi>
            <a href="javascript:void(0)" role="menuitem">Item 0</a>
            <a href="javascript:void(0)" role="menuitem" disabled>Item 1</a>
            <a href="javascript:void(0)" role="menuitem" hidden>Ghost</a>
            <a href="javascript:void(0)" role="menuitem">Item 2</a>
            <a href="javascript:void(0)" role="menuitem">Item 3</a>
            <a href="javascript:void(0)" role="menuitem" style="display:none"
              >Another ghost</a
            >
          </simple-menu>
        </div>
      </div>

      <div class="card">
        <h3>Auto focuses while typing a name</h3>
        <simple-menu class="scrolled">
          ${this.fruits.map(
            (item) => html`<anypoint-item role="menuitem">${item}</anypoint-item>`
          )}
        </simple-menu>
      </div>

      <div class="card">
        <h3>Highlighting an item</h3>
        <p>
          Call <code>highlightNext()</code> and
          <code>highlightPrevious()</code> to set a <code>highlight</code> class
          on the next/previous element.
        </p>
        <simple-menu class="scrolled" id="highlight">
          ${this.fruits
            .slice(0, 5)
            .map(
              (item) => html`<anypoint-item role="menuitem">${item}</anypoint-item>`
            )}
        </simple-menu>
        <button @click="${this._highlightNextHandler}">Highlight next</button>
        <button @click="${this._highlightPreviousHandler}">
          Highlight previous
        </button>
      </div>

      <div class="card">
        <h3>Focusing an item</h3>
        <p>
          Call <code>focusNext()</code> and <code>focusPrevious()</code> to set
          a focus on that item.
        </p>
        <simple-menu class="scrolled" id="focus">
          ${this.fruits
            .slice(0, 5)
            .map(
              (item) => html`<anypoint-item role="menuitem">${item}</anypoint-item>`
            )}
        </simple-menu>
        <button @click="${this._focusNextHandler}">Focus next</button>
        <button @click="${this._focusPreviousHandler}">Focus previous</button>
      </div>

      <div class="card">
        <div class="row">
          <h3>Simple menubar</h3>
          <div class="horizontal-section">
            <simple-menubar>
              <a href="javascript:void(0)" role="menuitem">Item 0</a>
              <a href="javascript:void(0)" role="menuitem">Item 1</a>
              <a href="javascript:void(0)" role="menuitem" disabled>Item 2</a>
              <a href="javascript:void(0)" role="menuitem">Item 3</a>
            </simple-menubar>
          </div>
        </div>

        <div class="row">
          <h3>Multi-select menubar</h3>
          <div class="horizontal-section">
            <simple-menubar multi>
              <a href="javascript:void(0)" role="menuitem">Item 0</a>
              <a href="javascript:void(0)" role="menuitem">Item 1</a>
              <a href="javascript:void(0)" role="menuitem">Item 2</a>
              <a href="javascript:void(0)" role="menuitem">Item 3</a>
            </simple-menubar>
          </div>
        </div>
      </div>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

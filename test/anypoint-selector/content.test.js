import { fixture, assert, defineCE, nextFrame } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import '../../anypoint-selector.js';

const tag = defineCE(
  class extends LitElement {
    static get properties() {
      return {
        selectable: { type: String },
        selected: { type: String }
      };
    }

    get selected() {
      return this._selected;
    }

    set selected(value) {
      const old = this._selected;
      this._selected = value;
      this.requestUpdate('selected', old);
      this.dispatchEvent(
        new CustomEvent('selectedchange', {
          detail: {
            value
          }
        })
      );
    }

    get selector() {
      return this.shadowRoot.querySelector('anypoint-selector');
    }

    constructor() {
      super();
      this.selectable = undefined;
    }

    render() {
      return html`
        <anypoint-selector .selected="${this.selected}" .selectable="${this.selectable}" attrforselected="id">
          <slot></slot>
        </anypoint-selector>
      `;
    }
  }
);

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function selector1Fixture() {
    return fixture(`<${tag} selected="item0">
      <div id="item0">item0</div>
      <div id="item1">item1</div>
      <div id="item2">item2</div>
      <div id="item3">item3</div>
    </${tag}>`);
  }

  async function selector2Fixture() {
    return fixture(`<${tag} selected="item0" selectable="item">
      <item id="item0">item0</item>
      <hr>
      <item id="item1">item1</item>
      <item id="item2">item2</item>
      <hr>
      <item id="item3">item3</item>
    </${tag}>`);
  }

  describe('content', () => {
    let s1;
    beforeEach(async () => {
      s1 = await selector1Fixture();
      await nextFrame();
    });

    it('attribute selected', () => {
      // check selected class
      assert.isTrue(s1.querySelector('#item0').classList.contains('selected'));
    });

    it('set selected', async () => {
      // set selected
      s1.selected = 'item1';
      await nextFrame();
      // check selected class
      assert.isTrue(s1.querySelector('#item1').classList.contains('selected'));
    });

    it('get items', () => {
      assert.equal(s1.selector.items.length, 4);
    });

    it('activate event', () => {
      const item = s1.querySelector('#item2');
      item.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      // check selected class
      assert.isTrue(item.classList.contains('selected'));
    });

    it('add item dynamically', async () => {
      const item = document.createElement('div');
      item.id = 'item4';
      item.textContent = 'item4';
      s1.appendChild(item);
      await nextFrame();
      // set selected
      s1.selected = 'item4';
      await nextFrame();
      // check items length
      assert.equal(s1.selector.items.length, 5);
      // check selected class
      assert.isTrue(s1.querySelector('#item4').classList.contains('selected'));
    });
  });

  describe('content with selectable', () => {
    let s2;
    beforeEach(async () => {
      s2 = await selector2Fixture();
    });

    it('attribute selected', () => {
      // check selected class
      assert.isTrue(s2.querySelector('#item0').classList.contains('selected'));
    });

    it('set selected', async () => {
      // set selected
      s2.selected = 'item1';
      await nextFrame();
      // check selected class
      assert.isTrue(s2.querySelector('#item1').classList.contains('selected'));
    });

    it('get items', () => {
      assert.equal(s2.selector.items.length, 4);
    });

    it('activate event', () => {
      const item = s2.querySelector('#item2');
      item.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      // check selected class
      assert.isTrue(item.classList.contains('selected'));
    });

    it('add item dynamically', async () => {
      const item = document.createElement('item');
      item.id = 'item4';
      item.textContent = 'item4';
      s2.appendChild(item);
      await nextFrame();
      // set selected
      s2.selected = 'item4';
      await nextFrame();
      // check items length
      assert.equal(s2.selector.items.length, 5);
      // check selected class
      assert.isTrue(s2.querySelector('#item4').classList.contains('selected'));
    });
  });
});

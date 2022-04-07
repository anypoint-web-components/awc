import { fixture, assert, defineCE, nextFrame } from '@open-wc/testing';
import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointSelector from '../../src/elements/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

class TestClass extends LitElement {
  @property({ type: String })
  selectable?: string;

  _selected?: string;

  @property({ type: String })
  get selected(): string | undefined {
    return this._selected;
  }

  set selected(value: string | undefined) {
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

  get selector(): AnypointSelector {
    return this.shadowRoot!.querySelector('anypoint-selector') as AnypointSelector;
  }

  render(): TemplateResult {
    return html`
      <anypoint-selector .selected="${this.selected}" .selectable="${this.selectable}" attrforselected="id">
        <slot></slot>
      </anypoint-selector>
    `;
  }
}

const tag = defineCE(TestClass);

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function selector1Fixture(): Promise<TestClass> {
    return fixture(`<${tag} selected="item0">
      <div id="item0">item0</div>
      <div id="item1">item1</div>
      <div id="item2">item2</div>
      <div id="item3">item3</div>
    </${tag}>`);
  }

  async function selector2Fixture(): Promise<TestClass> {
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
    let s1: TestClass;
    beforeEach(async () => {
      s1 = await selector1Fixture();
      await nextFrame();
    });

    it('attribute selected', () => {
      // check selected class
      assert.isTrue((s1.querySelector('#item0') as HTMLElement).classList.contains('selected'));
    });

    it('set selected', async () => {
      // set selected
      s1.selected = 'item1';
      await nextFrame();
      // check selected class
      assert.isTrue((s1.querySelector('#item1') as HTMLElement).classList.contains('selected'));
    });

    it('get items', () => {
      assert.equal(s1.selector.items.length, 4);
    });

    it('activate event', () => {
      const item = s1.querySelector('#item2') as HTMLElement;
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
      assert.isTrue((s1.querySelector('#item4') as HTMLElement).classList.contains('selected'));
    });
  });

  describe('content with selectable', () => {
    let s2: TestClass;
    beforeEach(async () => {
      s2 = await selector2Fixture();
    });

    it('attribute selected', () => {
      // check selected class
      assert.isTrue(s2.querySelector('#item0')!.classList.contains('selected'));
    });

    it('set selected', async () => {
      // set selected
      s2.selected = 'item1';
      await nextFrame();
      // check selected class
      assert.isTrue(s2.querySelector('#item1')!.classList.contains('selected'));
    });

    it('get items', () => {
      assert.equal(s2.selector.items.length, 4);
    });

    it('activate event', () => {
      const item = s2.querySelector('#item2') as HTMLElement;
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
      assert.isTrue(s2.querySelector('#item4')!.classList.contains('selected'));
    });
  });
});

import { fixture, assert, defineCE, nextFrame } from '@open-wc/testing';
import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import AnypointSelector from '../../src/elements/lists/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

/* eslint-disable no-plusplus */

class TestElement extends LitElement {
  @property({ type: String, reflect: true })
  someAttr = '';

  render(): TemplateResult {
    return html` <div>${this.someAttr}</div> `;
  }
}

const tag = defineCE(TestElement);

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}

.my-selected {
  background: red;
}`;

describe('AnypointSelector', () => {
  async function inlineAttributesFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector attrforselected="some-attr">
        <div some-attr="value0">Item 0</div>
        <div some-attr="value1">Item 1</div>
        <div some-attr="value2">Item 2</div>
      </anypoint-selector>`);
  }

  async function reflectedPropertiesFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector attrforselected="some-attr">
        <${tag}>Item 0</${tag}>
        <${tag}>Item 1</${tag}>
        <${tag}>Item 2</${tag}>
    </anypoint-selector>`);
  }

  async function mixedPropertiesAndAttributesFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector attrforselected="some-attr">
      <${tag}>Item 0</${tag}>
      <${tag}>Item 1</${tag}>
      <div some-attr="value2">Item 2</div>
      <div some-attr="value3">Item 3</div>
      <${tag}>Item 4</${tag}>
      <div some-attr="value5">Item 5</div>
    </anypoint-selector>`);
  }

  async function defaultAttributeFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector attrforselected="some-attr" fallbackselection="default">
      <div some-attr="value0">Item 0</div>
      <div some-attr="value1">Item 1</div>
      <div some-attr="default">Item 2</div>
    </anypoint-selector>`);
  }

  describe('inline attributes', () => {
    let selector: AnypointSelector;
    let items: HTMLElement[];

    beforeEach(async () => {
      selector = await inlineAttributesFixture();
      items = Array.prototype.slice.apply(
        selector.querySelectorAll('div[some-attr]')
      );
    });

    it('selecting value programmatically selects correct item', async () => {
      selector.select('value1');
      await nextFrame();
      assert.equal(selector.selectedItem, items[1]);
    });

    it('selecting item sets the correct selected value', (done) => {
      MockInteractions.downAndUp(items[2], () => {
        assert.equal(selector.selected, 'value2');
        done();
      });
    });

    it('setting attr-for-selected to null keeps current selection', async () => {
      selector.select('value0');
      await nextFrame();
      assert.equal(selector.selectedItem, items[0]);
      assert.equal(selector.selected, 'value0');
      selector.attrForSelected = undefined;
      await nextFrame();
      assert.equal(selector.selectedItem, items[0]);
      assert.equal(selector.selected, 0);
    });
  });

  describe('reflected properties as attributes', () => {
    let selector: AnypointSelector;
    let items: HTMLElement[];

    beforeEach(async () => {
      selector = await reflectedPropertiesFixture();
      items = Array.prototype.slice.apply(selector.querySelectorAll(tag));
      for (let i = 0; i < items.length; i++) {
        // @ts-ignore
        items[i].someAttr = `value${i}`;
      }
    });

    it('selecting value programmatically selects correct item', async () => {
      selector.select('value1');
      await nextFrame();
      assert.equal(selector.selectedItem, items[1]);
    });

    it('selecting item sets the correct selected value', (done) => {
      MockInteractions.downAndUp(items[2], () => {
        assert.equal(selector.selected, 'value2');
        done();
      });
    });
  });

  describe('mixed properties and inline attributes', () => {
    let selector: AnypointSelector;
    let items: HTMLElement[];

    beforeEach(async () => {
      selector = await mixedPropertiesAndAttributesFixture();
      items = Array.prototype.slice.apply(
        selector.querySelectorAll(`${tag}, div[some-attr]`)
      );
      for (let i = 0; i < items.length; i++) {
        // @ts-ignore
        items[i].someAttr = `value${i}`;
      }
    });

    it('selecting value programmatically selects correct item', async () => {
      for (let i = 0; i < items.length; i++) {
        selector.select(`value${i}`);
        // eslint-disable-next-line no-await-in-loop
        await nextFrame();
        assert.equal(selector.selectedItem, items[i]);
      }
    });

    it('selecting item sets the correct selected value', (done) => {
      function testSelectItem(i: number): void {
        if (i >= items.length) {
          done();
          return;
        }
        MockInteractions.downAndUp(items[i], () => {
          assert.equal(selector.selected, `value${i}`);
          testSelectItem(i + 1);
        });
      }
      testSelectItem(0);
    });
  });

  describe('default attribute', () => {
    let selector: AnypointSelector;
    let items: HTMLElement[];

    beforeEach(async () => {
      selector = await defaultAttributeFixture();
      items = Array.from(selector.querySelectorAll('div[some-attr]'));
    });

    it('setting non-existing value sets default', async () => {
      selector.select('non-existing-value');
      await nextFrame();
      assert.equal(selector.selected, 'default');
      assert.equal(selector.selectedItem, items[2]);
    });

    it('setting non-existing value sets default with multi', async () => {
      selector.multi = true;
      await nextFrame();
      selector.select('non-existing-value');
      await nextFrame();
      assert.deepEqual(selector.selectedValues, ['default', 'non-existing-value']);
      assert.deepEqual(selector.selectedItems, [items[2]]);
    });

    it('default not used when there was at least one match', async () => {
      selector.multi = true;
      await nextFrame();
      selector.selectedValues = ['non-existing-value', 'value0'];
      await nextFrame();
      assert.deepEqual(selector.selectedValues, [
        'non-existing-value',
        'value0',
      ]);
      assert.deepEqual(selector.selectedItems, [items[0]]);
    });

    it('default element not found does not result in infinite loop', async () => {
      selector.fallbackSelection = 'non-existing-fallback';
      selector.select('non-existing-value');
      await nextFrame();
      assert.equal(selector.selectedItem, undefined);
      selector.multi = true;
      selector.selectedValues = ['non-existing-value'];
      await nextFrame();
      assert.deepEqual(selector.selectedItems, []);
      selector.fallbackSelection = 'default';
      await nextFrame();
      assert.deepEqual(selector.selectedItems, [items[2]], 'has the default selection');
    });

    it('selection is updated after fallback is set', async () => {
      selector.fallbackSelection = undefined;
      await nextFrame();
      selector.select('non-existing-value');
      await nextFrame();
      selector.fallbackSelection = 'default';
      await nextFrame();
      assert.equal(selector.selectedItem, items[2]);
    });

    it('multi-selection is updated after fallback is set', async () => {
      selector.fallbackSelection = undefined;
      selector.selectedValues = ['non-existing-value'];
      selector.fallbackSelection = 'default';
      await nextFrame();
      assert.equal(selector.selectedItem, items[2]);
    });
  });
});

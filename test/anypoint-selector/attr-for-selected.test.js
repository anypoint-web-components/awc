import { fixture, assert, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit-element';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../anypoint-selector.js';

/* eslint-disable no-plusplus */

const tag = defineCE(
  class extends LitElement {
    static get properties() {
      return {
        someAttr: { type: String, reflect: true },
      };
    }

    constructor() {
      super();
      this.someAttr = '';
    }

    render() {
      return html` <div>${this.someAttr}</div> `;
    }
  }
);

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}

.my-selected {
  background: red;
}`;

describe('AnypointSelector', () => {
  async function inlineAttributesFixture() {
    return fixture(`<anypoint-selector attrforselected="some-attr">
        <div some-attr="value0">Item 0</div>
        <div some-attr="value1">Item 1</div>
        <div some-attr="value2">Item 2</div>
      </anypoint-selector>`);
  }

  async function reflectedPropertiesFixture() {
    return fixture(`<anypoint-selector attrforselected="some-attr">
        <${tag}>Item 0</${tag}>
        <${tag}>Item 1</${tag}>
        <${tag}>Item 2</${tag}>
    </anypoint-selector>`);
  }

  async function mixedPropertiesAndAttributesFixture() {
    return fixture(`<anypoint-selector attrforselected="some-attr">
      <${tag}>Item 0</${tag}>
      <${tag}>Item 1</${tag}>
      <div some-attr="value2">Item 2</div>
      <div some-attr="value3">Item 3</div>
      <${tag}>Item 4</${tag}>
      <div some-attr="value5">Item 5</div>
    </anypoint-selector>`);
  }

  async function defaultAttributeFixture() {
    return fixture(`<anypoint-selector attrforselected="some-attr" fallbackselection="default">
      <div some-attr="value0">Item 0</div>
      <div some-attr="value1">Item 1</div>
      <div some-attr="default">Item 2</div>
    </anypoint-selector>`);
  }

  describe('inline attributes', () => {
    let selector;
    let items;

    beforeEach(async () => {
      selector = await inlineAttributesFixture();
      items = Array.prototype.slice.apply(
        selector.querySelectorAll('div[some-attr]')
      );
    });

    it('selecting value programatically selects correct item', () => {
      selector.select('value1');
      assert.equal(selector.selectedItem, items[1]);
    });

    it('selecting item sets the correct selected value', (done) => {
      MockInteractions.downAndUp(items[2], () => {
        assert.equal(selector.selected, 'value2');
        done();
      });
    });

    it('setting attr-for-selected to null keeps current selection', () => {
      selector.select('value0');
      assert.equal(selector.selectedItem, items[0]);
      assert.equal(selector.selected, 'value0');
      selector.attrForSelected = null;
      assert.equal(selector.selectedItem, items[0]);
      assert.equal(selector.selected, 0);
    });
  });

  describe('reflected properties as attributes', () => {
    let selector;
    let items;

    beforeEach(async () => {
      selector = await reflectedPropertiesFixture();
      items = Array.prototype.slice.apply(selector.querySelectorAll(tag));
      for (let i = 0; i < items.length; i++) {
        items[i].someAttr = `value${i}`;
      }
    });

    it('selecting value programatically selects correct item', () => {
      selector.select('value1');
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
    let selector;
    let items;

    beforeEach(async () => {
      selector = await mixedPropertiesAndAttributesFixture();
      items = Array.prototype.slice.apply(
        selector.querySelectorAll(`${tag}, div[some-attr]`)
      );
      for (let i = 0; i < items.length; i++) {
        items[i].someAttr = `value${i}`;
      }
    });

    it('selecting value programatically selects correct item', () => {
      for (let i = 0; i < items.length; i++) {
        selector.select(`value${i}`);
        assert.equal(selector.selectedItem, items[i]);
      }
    });

    it('selecting item sets the correct selected value', (done) => {
      function testSelectItem(i) {
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
    let selector;
    let items;

    beforeEach(async () => {
      selector = await defaultAttributeFixture();
      items = Array.from(selector.querySelectorAll('div[some-attr]'));
    });

    it('setting non-existing value sets default', () => {
      selector.select('non-existing-value');
      assert.equal(selector.selected, 'default');
      assert.equal(selector.selectedItem, items[2]);
    });

    it('setting non-existing value sets default with multi', () => {
      selector.multi = true;
      selector.select('non-existing-value');
      assert.deepEqual(selector.selectedValues, [
        'default',
        'non-existing-value',
      ]);
      assert.deepEqual(selector.selectedItems, [items[2]]);
    });

    it('default not used when there was at least one match', () => {
      selector.multi = true;
      selector.selectedValues = ['non-existing-value', 'value0'];
      assert.deepEqual(selector.selectedValues, [
        'non-existing-value',
        'value0',
      ]);
      assert.deepEqual(selector.selectedItems, [items[0]]);
    });

    it('default element not found does not result in infinite loop', () => {
      selector.fallbackSelection = 'non-existing-fallback';
      selector.select('non-existing-value');
      assert.equal(selector.selectedItem, undefined);
      selector.multi = true;
      selector.selectedValues = ['non-existing-value'];
      assert.deepEqual(selector.selectedItems, []);
      selector.fallbackSelection = 'default';
      assert.deepEqual(selector.selectedItems, [items[2]]);
    });

    it('selection is updated after fallback is set', () => {
      selector.fallbackSolution = undefined;
      selector.select('non-existing-value');
      selector.fallbackSelection = 'default';
      assert.equal(selector.selectedItem, items[2]);
    });

    it('multi-selection is updated after fallback is set', () => {
      selector.fallbackSolution = undefined;
      selector.selectedValues = ['non-existing-value'];
      selector.fallbackSolution = 'default';
      assert.equal(selector.selectedItem, items[2]);
    });
  });
});

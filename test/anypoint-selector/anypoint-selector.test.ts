/* eslint-disable no-plusplus */
import { fixture, assert, expect, aTimeout, html, nextFrame, oneEvent } from '@open-wc/testing';
import AnypointSelector from '../../src/elements/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}

.my-selected {
  background: red;
}`;

describe('AnypointSelector', () => {
  async function defaultsFixture(): Promise<AnypointSelector> {
    return fixture(html`<anypoint-selector>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function basicFixture(): Promise<AnypointSelector> {
    return fixture(html`<anypoint-selector selected="item2" attrforselected="id">
      <div id="item0">Item 0</div>
      <div id="item1">Item 1</div>
      <div id="item2">Item 2</div>
      <div id="item3">Item 3</div>
      <div id="item4">Item 4</div>
    </anypoint-selector>`);
  }

  describe('defaults', () => {
    let s1: AnypointSelector;

    beforeEach(async () => {
      s1 = await defaultsFixture();
    });

    it('to nothing selected', () => {
      assert.equal(s1.selected, null);
    });

    it('to selected as selectedClass', () => {
      assert.equal(s1.selectedClass, 'selected');
    });

    it('to false as multi', () => {
      assert.isFalse(s1.multi);
    });

    it('to click as activateEvent', () => {
      assert.equal(s1.activateEvent, 'click');
    });

    it('to nothing as attrForSelected', () => {
      assert.equal(s1.attrForSelected, null);
    });

    it('as many items as children', () => {
      assert.equal(s1.items.length, s1.querySelectorAll('div').length);
    });
  });

  describe('basic', () => {
    let s2: AnypointSelector;

    beforeEach(async () => {
      s2 = await basicFixture();
    });

    it('honors the attrForSelected attribute', async () => {
      await aTimeout(0);
      assert.equal(s2.attrForSelected, 'id');
      assert.equal(s2.selected, 'item2');
      assert.equal(s2.selectedItem, document.querySelector('#item2') as HTMLElement);
    });

    it('allows assignment to selected', async () => {
      // set selected
      s2.selected = 'item4';
      await nextFrame();
      // check selected class
      assert.isTrue(s2.children[4].classList.contains('selected'));
      // check item
      assert.equal(s2.selectedItem, s2.children[4] as HTMLElement);
    });

    it('fire select when selected is set', async () => {
      // setup listener for select event
      let selectedEventCounter = 0;
      s2.addEventListener('select', () => {
        // eslint-disable-next-line no-plusplus
        selectedEventCounter++;
      });
      // set selected
      s2.selected = 'item4';
      await nextFrame();
      // check select event
      assert.equal(selectedEventCounter, 1);
    });

    it('set selected to old value', () => {
      // setup listener for select event
      let selectedEventCounter = 0;
      s2.addEventListener('select', () => {
        // eslint-disable-next-line no-plusplus
        selectedEventCounter++;
      });
      // selecting the same value shouldn't fire select
      s2.selected = 'item2';
      assert.equal(selectedEventCounter, 0);
    });

    describe('`select()` and `selectIndex()`', () => {
      it('`select()` selects an item with the given value', () => {
        s2.select('item1');
        assert.equal(s2.selected, 'item1');
        s2.select('item3');
        assert.equal(s2.selected, 'item3');
        s2.select('item2');
        assert.equal(s2.selected, 'item2');
      });

      it('`selectIndex()` selects an item with the given index', async () => {
        // This selector has attributes `selected` and `attr-for-selected`
        // matching this item.
        assert.equal(s2.selectedItem, s2.items[2]);
        s2.selectIndex(1);
        await nextFrame();
        assert.equal(s2.selected, 'item1');
        assert.equal(s2.selectedItem, s2.items[1]);
        s2.selectIndex(3);
        await nextFrame();
        assert.equal(s2.selected, 'item3');
        assert.equal(s2.selectedItem, s2.items[3]);
        s2.selectIndex(4);
        await nextFrame();
        assert.equal(s2.selected, 'item4');
        assert.equal(s2.selectedItem, s2.items[4]);
      });
    });

    describe('items changing', () => {
      let s1: AnypointSelector;
      beforeEach(async () => {
        s1 = await defaultsFixture();
      });

      it('dispatches the childrenchange event', async () => {
        const newItem = document.createElement('div');
        let changeCount = 0;
        newItem.id = 'item999';

        s2.addEventListener('childrenchange', (event) => {
          changeCount++;
          // @ts-ignore
          const mutations = event.detail;
          assert.typeOf(mutations, 'array');
          assert.notEqual(mutations[0].addedNodes, undefined);
          assert.notEqual(mutations[0].removedNodes, undefined);
        });

        s2.appendChild(newItem);
        await aTimeout(0);
        s2.removeChild(newItem);
        await aTimeout(0);
        expect(changeCount).to.be.equal(2);
      });

      it('updates selected item', async () => {
        s1.selected = 0;
        await nextFrame();
        let { firstElementChild } = s1;
        expect(firstElementChild).to.be.equal(s1.selectedItem);
        expect(firstElementChild!.classList.contains('selected')).to.be.eql(true);

        const p = oneEvent(s1, 'childrenchange');
        s1.removeChild(s1.selectedItem!);
        await p;
        firstElementChild = s1.firstElementChild;
        expect(firstElementChild).to.be.equal(s1.selectedItem);
        expect(firstElementChild!.classList.contains('selected')).to.be.eql(true);
      });
    });

    describe('dynamic selector', () => {
      it('selects dynamically added child automatically', (done) => {
        // Create the selector, set selected, connect to force upgrade.
        const selector = document.createElement('anypoint-selector');
        selector.selected = '0';
        document.body.appendChild(selector);
        // Create and append a new item which should become selected.
        const child = document.createElement('div');
        child.textContent = 'Item 0';
        selector.appendChild(child);
        selector.addEventListener('childrenchange', function onIronItemsChanged() {
          selector.removeEventListener('childrenchange', onIronItemsChanged);
          assert.equal(child.className, 'selected');
          document.body.removeChild(selector);
          done();
        });
      });
    });
  });
});

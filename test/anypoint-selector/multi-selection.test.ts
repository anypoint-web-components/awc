/* eslint-disable no-plusplus */
import { fixture, assert, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import AnypointSelector from '../../src/elements/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function testFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector multi>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function valueByIdFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector multi attrforselected="id">
      <div id="item0">Item 0</div>
      <div id="item1">Item 1</div>
      <div id="item2">Item 2</div>
      <div id="item3">Item 3</div>
      <div id="item4">Item 4</div>
    </anypoint-selector>`);
  }

  describe('multi', () => {
    let s: AnypointSelector;
    beforeEach(async () => {
      s = await testFixture();
    });

    it('honors the multi attribute', () => {
      assert.isTrue(s.multi);
    });

    it('has sane defaults', () => {
      assert.deepEqual(s.selectedValues, []);
      assert.equal(s.selectedClass, 'selected');
      assert.equal(s.items.length, 5);
    });

    it('set multi-selection via selected property', async () => {
      // set selectedValues
      s.selectedValues = [0, 2];
      await nextFrame();
      // check selected class
      assert.isTrue(s.children[0].classList.contains('selected'));
      assert.isTrue(s.children[2].classList.contains('selected'));
      // check selectedItems
      assert.equal(s.selectedItems.length, 2);
      assert.equal(s.selectedItems[0], s.children[0]);
      assert.equal(s.selectedItems[1], s.children[2]);
    });

    it('set multi-selection via tap', async () => {
      // set selectedValues
      (s.children[0] as HTMLElement).click();
      await nextFrame();
      (s.children[2] as HTMLElement).click();
      await nextFrame();
      // check selected class
      assert.isTrue(s.children[0].classList.contains('selected'));
      assert.isTrue(s.children[2].classList.contains('selected'));
      // check selectedItems
      assert.equal(s.selectedItems.length, 2);
      assert.equal(s.selectedItems[0], s.children[0]);
      assert.equal(s.selectedItems[1], s.children[2]);
    });

    it('fire select/deselect events when selectedValues changes', async () => {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', (e) => {
        // @ts-ignore
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', (e) => {
        // @ts-ignore
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      // programmatically select values 0 and 1 (both fire select)
      s.selectedValues = [0, 1];
      await nextFrame();
      // programmatically select values 1 and 2 (2 fires select, 0 fires
      // deselect)
      s.selectedValues = [1, 2];
      await nextFrame();
      // programmatically deselect all values (1 and 2 fire deselect)
      s.selectedValues = [];
      await nextFrame();
      // check events
      assert.equal(selectEventCounters[0], 1, 'first item select dispatched');
      assert.equal(deselectEventCounters[0], 1, 'first item deselect dispatched');
      assert.equal(selectEventCounters[1], 1, 'second item select dispatched');
      assert.equal(deselectEventCounters[1], 1, 'second item unselect dispatched');
      assert.equal(selectEventCounters[2], 1, 'third item select dispatched');
      assert.equal(deselectEventCounters[2], 1, 'third item deselect dispatched');
    });

    it('fire select/deselect events when selectedValues is modified', async () => {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', (e) => {
        // @ts-ignore
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', (e) => {
        // @ts-ignore
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.selectedValues = [];
      await nextFrame();
      // programmatically select value 0
      s.selectedValues.push(0, 1);
      s.selectedValues = [...s.selectedValues];
      await nextFrame();
      // programmatically deselect value 0
      s.selectedValues.shift();
      s.selectedValues = [...s.selectedValues];
      await nextFrame();
      // programmatically select value 2
      s.selectedValues.push(2);
      s.selectedValues = [...s.selectedValues];
      await nextFrame();
      // programmatically deselect value 1
      s.selectedValues.shift();
      s.selectedValues = [...s.selectedValues];
      await nextFrame();
      assert.equal(selectEventCounters[0], 1);
      assert.equal(deselectEventCounters[0], 1);
      assert.equal(selectEventCounters[1], 1);
      assert.equal(deselectEventCounters[1], 1);
      assert.equal(selectEventCounters[2], 1);
      assert.equal(deselectEventCounters[2], 0);
    });

    it('fire select/deselect events when toggling items', async () => {
      // setup listener for select/deselect events
      const items = [s.children[0], s.children[1], s.children[2]];
      const selectEventCounters = [0, 0, 0];
      const deselectEventCounters = [0, 0, 0];
      s.addEventListener('select', (e) => {
        // @ts-ignore
        selectEventCounters[items.indexOf(e.detail.item)]++;
      });
      s.addEventListener('deselect', (e) => {
        // @ts-ignore
        deselectEventCounters[items.indexOf(e.detail.item)]++;
      });
      // tap to select items 0 and 1 (both fire select)
      MockInteractions.tap(items[0]);
      MockInteractions.tap(items[1]);
      await nextFrame();
      // programmatically select values 1 and 2 (2 fires select, 0 fires deselect)
      s.selectedValues = [1, 2];
      await nextFrame();
      // tap to deselect items 1 and 2 (both fire deselect)
      MockInteractions.tap(items[1]);
      MockInteractions.tap(items[2]);
      await nextFrame();
      // check events
      assert.equal(selectEventCounters[0], 1);
      assert.equal(deselectEventCounters[0], 1);
      assert.equal(selectEventCounters[1], 1);
      assert.equal(deselectEventCounters[1], 1);
      assert.equal(selectEventCounters[2], 1);
      assert.equal(deselectEventCounters[2], 1);
    });

    it('toggle selected class when toggling items selection', async () => {
      // setup listener for item-select/deselect events
      const item0 = s.children[0];
      const item1 = s.children[1];
      assert.isFalse(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // tap to select item 0 (add selected class)
      MockInteractions.tap(item0);
      await nextFrame();
      assert.isTrue(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // tap to select item 1 (add selected class)
      MockInteractions.tap(item1);
      await nextFrame();
      assert.isTrue(item0.classList.contains('selected'));
      assert.isTrue(item1.classList.contains('selected'));
      // tap to deselect item 1 (remove selected class)
      MockInteractions.tap(item1);
      await nextFrame();
      assert.isTrue(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
      // programmatically select both values (1 add selected class)
      s.selectedValues = [0, 1];
      await nextFrame();
      assert.isTrue(item0.classList.contains('selected'));
      assert.isTrue(item1.classList.contains('selected'));
      // programmatically deselect all values (both removes selected class)
      s.selectedValues = [];
      await nextFrame();
      assert.isFalse(item0.classList.contains('selected'));
      assert.isFalse(item1.classList.contains('selected'));
    });

    it('dispatches selectedvalueschange when selection changes', () => {
      let counter = 0;
      s.addEventListener('selectedvalueschange', () => {
        counter++;
      });
      MockInteractions.tap(s.children[0]);
      MockInteractions.tap(s.children[0]);
      MockInteractions.tap(s.children[0]);
      assert.isAbove(counter, 0);
    });

    it('updates selection when dom changes', async () => {
      const firstChild = s.querySelector(':first-child') as HTMLElement;
      const lastChild = s.querySelector(':last-child') as HTMLElement;
      MockInteractions.tap(firstChild);
      await nextFrame();
      MockInteractions.tap(lastChild);
      await nextFrame();
      assert.lengthOf(s.selectedItems, 2);
      s.removeChild(lastChild);
      await nextFrame();
      assert.lengthOf(s.selectedItems, 1);
      assert.equal(s.selectedItems[0], firstChild);
    });

    describe('`select()` and `selectIndex()`', () => {
      let selector: AnypointSelector;
      beforeEach(async () => {
        selector = await valueByIdFixture();
      });

      it('`select()` selects an item with the given value', () => {
        selector.select('item1');
        assert.equal(selector.selectedValues.length, 1);
        assert.equal(selector.selectedValues.indexOf('item1'), 0);
        selector.select('item3');
        assert.equal(selector.selectedValues.length, 2);
        assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);
        selector.select('item2');
        assert.equal(selector.selectedValues.length, 3);
        assert.isTrue(selector.selectedValues.indexOf('item2') >= 0);
      });

      it('`selectIndex()` selects an item with the given index', async () => {
        selector.selectIndex(1);
        await nextFrame();
        assert.equal(selector.selectedValues.length, 1);
        assert.isTrue(selector.selectedValues.indexOf('item1') >= 0);
        assert.equal(selector.selectedItems.length, 1);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[1]) >= 0);
        selector.selectIndex(3);
        await nextFrame();
        assert.equal(selector.selectedValues.length, 2);
        assert.isTrue(selector.selectedValues.indexOf('item3') >= 0);
        assert.equal(selector.selectedItems.length, 2);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[3]) >= 0);
        selector.selectIndex(0);
        await nextFrame();
        assert.equal(selector.selectedValues.length, 3);
        assert.isTrue(selector.selectedValues.indexOf('item0') >= 0);
        assert.equal(selector.selectedItems.length, 3);
        assert.isTrue(selector.selectedItems.indexOf(selector.items[0]) >= 0);
      });
    });
    // it('toggle multi from true to false', function() {
    //   // set selected
    //   s.selected = [0, 2];
    //   let first = s.selected[0];
    //   // set multi to false, so to make it single-selection
    //   s.multi = false;
    //   // selected should not be an array
    //   assert.isNotArray(s.selected);
    //   // selected should be the first value from the old array
    //   assert.equal(s.selected, first);
    // });
  });
});

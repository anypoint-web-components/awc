import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import AnypointSelector from '../../src/elements/lists/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function testFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector selected=0>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  async function attrChangeFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector attrforselected="data-x" selected="x-1">
      <div data-x="x-1" data-y="y-1">1</div>
      <div data-x="x-2" data-y="y-2">2</div>
      <div data-x="x-3" data-y="y-3">3</div>
    </anypoint-selector>`);
  }

  async function attrChangeMultiFixture(): Promise<AnypointSelector> {
    const values = ["x-1", "x-2"];
    return fixture(html`
    <anypoint-selector attrForSelected="data-x" .selectedValues=${values} multi>
      <div data-x="x-1" data-y="y-1">1</div>
      <div data-x="x-2" data-y="y-2">2</div>
      <div data-x="x-3" data-y="y-3">3</div>
    </anypoint-selector>`);
  }

  describe('selected attributes', () => {
    let s: AnypointSelector;
    beforeEach(async () => {
      s = await testFixture();
    });

    it('custom selectedAttribute', async () => {
      // set selectedAttribute
      s.selectedAttribute = 'myattr';
      await nextFrame();
      // check selected attribute (should not be there)
      assert.isFalse(s.children[4].hasAttribute('myattr'));
      // set selected
      s.selected = 4;
      await nextFrame();
      // now selected attribute should be there
      assert.isTrue(s.children[4].hasAttribute('myattr'));
    });
  });

  describe('changing attrForSelected', () => {
    let s: AnypointSelector;
    beforeEach(async () => {
      s = await attrChangeFixture();
    });

    it('changing selectedAttribute', async () => {
      s.attrForSelected = 'data-y';
      await nextFrame();
      assert.equal(s.selected, 'y-1');
    });
  });

  describe.skip('changing attrForSelected in multi', () => {
    let s: AnypointSelector;
    beforeEach(async () => {
      s = await attrChangeMultiFixture();
    });

    it('changing selectedAttribute', async () => {
      s.attrForSelected = 'data-y';
      await nextFrame();
      console.log('selectedValues: ', s.selectedValues);
      
      assert.equal(s.selectedValues.length, 2);
      assert.equal(s.selectedValues[0], 'y-1');
      assert.equal(s.selectedValues[1], 'y-2');
    });
  });
});

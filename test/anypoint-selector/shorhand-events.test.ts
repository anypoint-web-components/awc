/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fixture, assert, nextFrame } from '@open-wc/testing';
import AnypointSelector from '../../src/elements/lists/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

describe('AnypointSelector', () => {
  /**
   * @returns {}
   */
  async function singleFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector selected="0">
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  /**
   * @returns {Promise<AnypointSelector>}
   */
  async function multiFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector multi>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  describe('onselectedchange', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('the getter returns previously registered handler', () => {
      assert.equal(element.onselectedchange, null);
      const f = () => {};
      element.onselectedchange = f;
      assert.isTrue(element.onselectedchange === f);
    });

    it('calls the registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedchange = f;
      element._notifySelectedChange();
      await nextFrame();
      element.onselectedchange = null;
      assert.isTrue(called);
    });

    it('unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselectedchange = f1;
      element.onselectedchange = f2;
      element._notifySelectedChange();
      await nextFrame();
      element.onselectedchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselected', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('returns previously registered handler', () => {
      assert.equal(element.onselected, null);
      const f = () => {};
      element.onselected = f;
      assert.isTrue(element.onselected === f);
    });

    it('calls the registered function through the activation event', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselected = f;
      const item = element.querySelectorAll('div')[1];
      item.click();
      await nextFrame();
      element.onselected = null;
      assert.isTrue(called);
    });

    it('ignores the call to the registered function through selection change', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselected = f;
      element.onselected = null;
      element.selected = 1;
      await nextFrame();
      assert.isFalse(called);
    });

    it('unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselected = f1;
      element.onselected = f2;
      // @ts-ignore
      element._itemActivate(1, undefined);
      await nextFrame();
      element.onselected = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onitemschange', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onitemschange, null);
      const f = () => {};
      element.onitemschange = f;
      assert.isTrue(element.onitemschange === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onitemschange = f;
      element.appendChild(document.createElement('div'));
      await nextFrame();
      element.onitemschange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onitemschange = f1;
      element.onitemschange = f2;
      element.appendChild(document.createElement('div'));
      await nextFrame();
      element.onitemschange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselect', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onselect);
      const f = () => {};
      element.onselect = f;
      assert.isTrue(element.onselect === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselect = f;
      element.selected = 1;
      await nextFrame();
      // @ts-ignore
      element.onselect = undefined;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselect = f1;
      element.onselect = f2;
      element.selected = 1;
      await nextFrame();
      // @ts-ignore
      element.onselect = undefined;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('ondeselect', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.ondeselect);
      const f = () => {};
      element.ondeselect = f;
      assert.isTrue(element.ondeselect === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.ondeselect = f;
      element.selected = 1;
      await nextFrame();
      element.ondeselect = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.ondeselect = f1;
      element.ondeselect = f2;
      element.selected = 1;
      await nextFrame();
      element.ondeselect = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onactivate', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onactivate);
      const f = () => {};
      element.onactivate = f;
      assert.isTrue(element.onactivate === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onactivate = f;
      const node = element.querySelector('div') as HTMLElement;
      node.click();
      await nextFrame();
      element.onactivate = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onactivate = f1;
      element.onactivate = f2;
      const node = element.querySelector('div') as HTMLElement;
      node.click();
      await nextFrame();
      element.onactivate = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselectedvalueschange', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselectedvalueschange, null);
      const f = () => {};
      element.onselectedvalueschange = f;
      assert.isTrue(element.onselectedvalueschange === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedvalueschange = f;
      element._notifyValuesChanged();
      element.onselectedvalueschange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselectedvalueschange = f1;
      element.onselectedvalueschange = f2;
      element.selectedValues = [0, 1];
      element._notifyValuesChanged();
      element.onselectedvalueschange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
  
  describe('onselecteditemschange', () => {
    let element: AnypointSelector;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselecteditemschange, null);
      const f = () => {};
      element.onselecteditemschange = f;
      assert.isTrue(element.onselecteditemschange === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselecteditemschange = f;
      element._notifySelectedItems();
      element.onselecteditemschange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselecteditemschange = f1;
      element.onselecteditemschange = f2;
      element._notifySelectedItems();
      element.onselecteditemschange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
});

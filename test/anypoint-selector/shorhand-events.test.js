import { fixture, assert, nextFrame } from '@open-wc/testing';
import '../../anypoint-selector.js';

/** @typedef {import('../../').AnypointSelectorElement} AnypointSelector */

describe('AnypointSelector', () => {
  /**
   * @returns {Promise<AnypointSelector>}
   */
  async function singleFixture() {
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
  async function multiFixture() {
    return fixture(`<anypoint-selector multi>
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  describe('onselectedchanged', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselectedchanged);
      const f = () => {};
      element.onselectedchanged = f;
      assert.isTrue(element.onselectedchanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedchanged = f;
      element.selected = 1;
      element.onselectedchanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselectedchanged = f1;
      element.onselectedchanged = f2;
      element.selected = 1;
      element.onselectedchanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselectedchange', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselectedchange, null);
      const f = () => {};
      element.onselectedchange = f;
      assert.isTrue(element.onselectedchange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedchange = f;
      element.selected = 1;
      element.onselectedchange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      element.selected = 1;
      element.onselectedchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselected', () => {
    let element = /** @type AnypointSelector */ (null);
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('returns previously registered handler', () => {
      assert.equal(element.onselected, null);
      const f = () => {};
      element.onselected = f;
      assert.isTrue(element.onselected === f);
    });

    it('calls the registered function through the activation event', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselected = f;
      const item = element.querySelectorAll('div')[1];
      item.click();
      element.onselected = null;
      assert.isTrue(called);
    });

    it('ignores the call to the registered function through selection change', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselected = f;
      element.selected = 1;
      element.onselected = null;
      assert.isFalse(called);
    });

    it('unregisteres old function', () => {
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
      element._itemActivate(1, undefined);
      element.onselected = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselecteditemchanged', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselecteditemchanged);
      const f = () => {};
      element.onselecteditemchanged = f;
      assert.isTrue(element.onselecteditemchanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselecteditemchanged = f;
      element.selected = 1;
      element.onselecteditemchanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselecteditemchanged = f1;
      element.onselecteditemchanged = f2;
      element.selected = 1;
      element.onselecteditemchanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselecteditemchange', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselecteditemchange, null);
      const f = () => {};
      element.onselecteditemchange = f;
      assert.isTrue(element.onselecteditemchange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselecteditemchange = f;
      element.selected = 1;
      element.onselecteditemchange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselecteditemchange = f1;
      element.onselecteditemchange = f2;
      element.selected = 1;
      element.onselecteditemchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onitemschanged', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onitemschanged);
      const f = () => {};
      element.onitemschanged = f;
      assert.isTrue(element.onitemschanged === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onitemschanged = f;
      element.appendChild(document.createElement('div'));
      await nextFrame();
      element.onitemschanged = null;
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
      element.onitemschanged = f1;
      element.onitemschanged = f2;
      element.appendChild(document.createElement('div'));
      await nextFrame();
      element.onitemschanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onitemschange', () => {
    let element;
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
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselect);
      const f = () => {};
      element.onselect = f;
      assert.isTrue(element.onselect === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselect = f;
      element.selected = 1;
      element.onselect = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      element.onselect = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('ondeselect', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.ondeselect);
      const f = () => {};
      element.ondeselect = f;
      assert.isTrue(element.ondeselect === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.ondeselect = f;
      element.selected = 1;
      element.ondeselect = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      element.ondeselect = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onactivate', () => {
    let element;
    beforeEach(async () => {
      element = await singleFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onactivate);
      const f = () => {};
      element.onactivate = f;
      assert.isTrue(element.onactivate === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onactivate = f;
      const node = element.querySelector('div');
      node.click();
      element.onactivate = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      const node = element.querySelector('div');
      node.click();
      element.onactivate = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselectedvalueschanged', () => {
    let element;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselectedvalueschanged);
      const f = () => {};
      element.onselectedvalueschanged = f;
      assert.isTrue(element.onselectedvalueschanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedvalueschanged = f;
      element.selectedValues = [0, 1];
      element.onselectedvalueschanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselectedvalueschanged = f1;
      element.onselectedvalueschanged = f2;
      element.selectedValues = [0, 1];
      element.onselectedvalueschanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselectedvalueschange', () => {
    let element;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselectedvalueschange, null);
      const f = () => {};
      element.onselectedvalueschange = f;
      assert.isTrue(element.onselectedvalueschange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselectedvalueschange = f;
      element.selectedValues = [0, 1];
      element.onselectedvalueschange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      element.onselectedvalueschange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselecteditemschanged', () => {
    let element;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselecteditemschanged);
      const f = () => {};
      element.onselecteditemschanged = f;
      assert.isTrue(element.onselecteditemschanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselecteditemschanged = f;
      element._selectedItems = [element.querySelectorAll('div')[2]];
      element.onselecteditemschanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselecteditemschanged = f1;
      element.onselecteditemschanged = f2;
      element._selectedItems = [element.querySelectorAll('div')[2]];
      element.onselecteditemschanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselecteditemschange', () => {
    let element;
    beforeEach(async () => {
      element = await multiFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onselecteditemschange, null);
      const f = () => {};
      element.onselecteditemschange = f;
      assert.isTrue(element.onselecteditemschange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselecteditemschange = f;
      element._selectedItems = [element.querySelectorAll('div')[2]];
      element.onselecteditemschange = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
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
      element._selectedItems = [element.querySelectorAll('div')[2]];
      element.onselecteditemschange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
});

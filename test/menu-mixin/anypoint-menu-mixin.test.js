import { fixture, assert, aTimeout, nextFrame, html } from '@open-wc/testing';
import './test-menu.js';
import './test-nested-menu.js';

/** @typedef {import('./test-menu').TestMenu} TestMenu */
/** @typedef {import('./test-nested-menu').TestNestedMenu} TestNestedMenu */

/* eslint-disable no-plusplus */

const style = document.createElement('style');
style.innerHTML = `.ghost, [hidden] {
  display: none;
}
.invisible {
  visibility: hidden;
}`;
document.head.appendChild(style);

describe('AnypointMenuMixin', () => {
  /**
   * @return {Promise<TestMenu>}
   */
  async function basicFixture() {
    return fixture(html`<test-menu>
      <div role="menuitem">item 1</div>
      <div role="menuitem">item 2</div>
      <div role="menuitem">item 3</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function singleItemFixture() {
    return fixture(html`<test-menu>
      <div>item 1</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function disabledFixture() {
    return fixture(`<test-menu>
      <div>a item 1</div>
      <div disabled>item 2</div>
      <div>b item 3</div>
      <div disabled>c item 4</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function invisibleFixture() {
    return fixture(`<test-menu>
      <div>item 1</div>
      <div hidden>item 2</div>
      <div class="ghost">item 3</div>
      <div class="invisible">item 3.1</div>
      <div>item 4</div>
      <div hidden>item 5</div>
      <div class="ghost">item 6</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestNestedMenu>}
   */
  async function nestedInvisibleFixture() {
    return fixture(html`
      <test-nested-menu>
      </test-nested-menu>
  `);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function onlyDisabledFixture() {
    return fixture(`<test-menu>
      <div disabled>disabled item</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function multiFixture() {
    return fixture(html`<test-menu multi>
      <div>item 1</div>
      <div>item 2</div>
      <div>item 3</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function nestedFixture() {
    return fixture(html`<test-menu>
      <test-menu>
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </test-menu>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function emptyFixture() {
    return fixture(`<test-menu></test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function disabledGroupAndOptionsFixture() {
    return fixture(`<test-menu disabled>
      <div disabled>one</div>
      <div disabled>two</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function nonzeroTabindexFixture() {
    return fixture(`<test-menu tabindex="32">
      <div disabled>one</div>
      <div disabled>two</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function countriesFixture() {
    return fixture(html`<test-menu>
      <div>Ghana</div>
      <div>Uganda</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function bogusAttrForItemTitleFixture() {
    return fixture(html`<test-menu attrForItemTitle="totally-does-not-exist">
      <div>Focused by default</div>
      <div>I'm not entitled!</div>
    </test-menu>`);
  }

  /**
   * @return {Promise<TestMenu>}
   */
  async function useAriaSelectedFixture() {
    return fixture(html`<test-menu useAriaSelected>
      <div>item 1</div>
      <div>item 2</div>
    </test-menu>`);
  }
  /**
   * @return {Promise<TestMenu>}
   */
  async function highlightAriaSelectedFixture() {
    return fixture(html`<test-menu useAriaSelected highlightAriaSelected>
      <div>item 1</div>
      <div>item 2</div>
    </test-menu>`);
  }

  describe('menu keyboard tests', async () => {
    it('menu has role="menu"', async () => {
      const menu = await basicFixture();
      assert.equal(menu.getAttribute('role'), 'menu', 'has role="menu"');
    });

    it('first item gets focus when menu is focused', async () => {
      const menu = await basicFixture();
      menu.focus();
      await aTimeout(0);
      const ownerRoot = /** @type Document */ ((menu.firstElementChild.getRootNode && menu.firstElementChild.getRootNode()) || document);
      const { activeElement } = ownerRoot;
      assert.equal(
        activeElement,
        menu.firstElementChild,
        'menu.firstElementChild is focused'
      );
    });

    it('first item gets focus when menu is focused in a single item menu', async () => {
      const menu = await singleItemFixture();
      menu.focus();
      await aTimeout(0);
      const ownerRoot = /** @type Document */ (menu.firstElementChild.getRootNode && menu.firstElementChild.getRootNode()) || document;
      const { activeElement } = ownerRoot;
      assert.equal(
        activeElement,
        menu.firstElementChild,
        'menu.firstElementChild is focused'
      );
    });

    it('selected item gets focus when menu is focused', async () => {
      const menu = await basicFixture();
      menu.selected = 1;
      menu.focus();
      await aTimeout(0);
      const ownerRoot = /** @type Document */ (menu.selectedItem.getRootNode && menu.selectedItem.getRootNode()) || document;
      const { activeElement } = ownerRoot;
      assert.equal(
        activeElement,
        menu.selectedItem,
        'menu.selectedItem is focused'
      );
    });

    it('focusing on next item skips disabled items', async () => {
      const menu = await disabledFixture();
      menu.focus();
      await aTimeout(0);
      // Key press down
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      });
      menu.dispatchEvent(e);

      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on next item skips invisible items', async () => {
      const menu = await invisibleFixture();
      menu.focus();
      await aTimeout(0);
      // Key press down
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on next item skips nested invisible items', async () => {
      const nestedMenu = await nestedInvisibleFixture();
      await aTimeout(0);
      const menu = nestedMenu.actualMenu;
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press down
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on next item in empty menu', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press down
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on next item in all disabled menu', async () => {
      const menu = await onlyDisabledFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on previous item skips disabled items', async () => {
      const menu = await disabledFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press up
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on previous item skips invisible items', async () => {
      const menu = await invisibleFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press up
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on previous item skips nested invisible items', async () => {
      const nestedMenu = await nestedInvisibleFixture();
      const menu = nestedMenu.actualMenu;
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press up
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[4], 'menu.items[4] is focused');
    });

    it('focusing on previous item in empty menu', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press up
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on previous item in all disabled menu', async () => {
      const menu = await onlyDisabledFixture();
      await aTimeout(0);
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press up
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on item using key press skips disabled items', async () => {
      const menu = await disabledFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'b'
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyB',
        key: 'b',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[2], 'menu.items[2] is focused');
    });

    it('focusing on item using key press ignores disabled items', async () => {
      const menu = await disabledFixture();
      await aTimeout(0);
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'c'
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyC',
        key: 'c',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[0], 'menu.items[0] is focused');
    });

    it('focusing on item using key press in all disabled items', async () => {
      const menu = await onlyDisabledFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'c'
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyC',
        key: 'c',
      });
      menu.dispatchEvent(e);
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, undefined, 'no focused item');
    });

    it('focusing on item with multi-char, quick input', async () => {
      const menu = await countriesFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'u'
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyU',
        key: 'u',
      }));
      // Key press 'g'
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyG',
        key: 'g',
      }));
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[1], 'menu.items[1] is focused');
    });

    it('focusing on item with multi-char ignoring modifier keys, quick input', async () => {
      const menu = await countriesFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'u'
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyU',
        key: 'u',
      }));
      // Key press 'Alt', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'AltLeft',
        key: 'Alt',
      }));
      // Key press 'Caps Lock', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'CapsLock',
        key: 'CapsLock',
      }));
      // Key press 'Control', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ControlLeft',
        key: 'Control',
      }));
      // Key press 'Num Lock', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'NumLock',
        key: 'NumLock',
      }));
      // Key press 'Scroll Lock', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ScrollLock',
        key: 'ScrollLock',
      }));
      // Key press 'Shift', should be ignored.
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ShiftLeft',
        key: 'Shift',
      }));
      // Key press 'g'
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyG',
        key: 'g',
      }));
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(focusedItem, menu.items[1], 'menu.items[1] is focused');
    });

    it('focusing on item with bogus attr-for-item-title', async () => {
      const menu = await bogusAttrForItemTitleFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'i'
      menu.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyI',
        key: 'i',
      }));
      await aTimeout(0);
      const { focusedItem } = menu;
      assert.equal(
        focusedItem,
        menu.items[0],
        'menu.items[0] is still focused'
      );
    });

    it('focusing non-item content does not auto-focus an item', async () => {
      const menu = await basicFixture();
      menu.extraContent.focus();
      await aTimeout(0);
      const menuOwnerRoot =
        /** @type Document */ (menu.extraContent.getRootNode && menu.extraContent.getRootNode()) ||
        document;
      const menuActiveElement = menuOwnerRoot.activeElement;
      assert.equal(
        menuActiveElement,
        menu.extraContent,
        'menu.extraContent is focused'
      );
      assert.equal(
        document.activeElement,
        menu,
        'menu is document.activeElement'
      );
    });

    it('last activated item in a multi select menu is focused', async () => {
      const menu = await multiFixture();
      menu.selected = 0;
      menu.items[1].click();
      await aTimeout(0);
      const ownerRoot =
        /** @type Document */ (menu.items[1].getRootNode && menu.items[1].getRootNode()) || document;
      const { activeElement } = ownerRoot;
      assert.equal(activeElement, menu.items[1], 'menu.items[1] is focused');
    });

    it('deselection in a multi select menu focuses deselected item', async () => {
      const menu = await multiFixture();
      menu.selected = 0;
      menu.items[0].click();
      await aTimeout(0);
      const ownerRoot =
        /** @type Document */ (menu.items[0].getRootNode && menu.items[0].getRootNode()) || document;
      const { activeElement } = ownerRoot;
      assert.equal(activeElement, menu.items[0], 'menu.items[0] is focused');
    });

    it('keyboard events should not bubble', async () => {
      const menu = await nestedFixture();
      let keyCounter = 0;
      menu.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          keyCounter++;
        }
        if (event.key === 'ArrowUp') {
          keyCounter++;
        }
        if (event.key === 'ArrowDown') {
          keyCounter++;
        }
      });
      // up
      menu.firstElementChild.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      }));
      // down
      menu.firstElementChild.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      }));
      // esc
      menu.firstElementChild.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'Escape',
        key: 'Escape',
      }));
      await aTimeout(0);
      assert.equal(menu.firstElementChild.tagName, 'TEST-MENU');
      assert.equal(keyCounter, 0);
    });

    it('empty menus do not un-focus themselves', async () => {
      // This menu will not dispatch an 'iron-items-changed' event.
      const menu = await emptyFixture();
      menu.focus();
      await aTimeout(0);
      assert.equal(document.activeElement, menu);
    });

    it('A disabled menu should not be focusable', async () => {
      const menu = await disabledGroupAndOptionsFixture();
      menu.focus();
      await aTimeout(0);
      assert.notEqual(document.activeElement, menu);
      assert.notEqual(document.activeElement, menu.items[0]);
      assert.notEqual(document.activeElement, menu.items[1]);
    });

    it('A disabled menu will not have a tab index.', async () => {
      const menu = await countriesFixture();
      assert.equal(menu.getAttribute('tabindex'), '0');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '0');
    });

    it('Updated tab index of disabled element should remain.', async () => {
      const menu = await countriesFixture();
      assert.equal(menu.getAttribute('tabindex'), '0');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.setAttribute('tabindex', '15');
      assert.equal(menu.getAttribute('tabindex'), '15');
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '15');
    });

    it('A disabled menu will regain its non-zero tab index when re-enabled.', async () => {
      const menu = await nonzeroTabindexFixture();
      assert.equal(menu.getAttribute('tabindex'), '32');
      menu.disabled = true;
      assert.equal(menu.getAttribute('tabindex'), null);
      menu.disabled = false;
      assert.equal(menu.getAttribute('tabindex'), '32');
    });

    it('`tabIndex` properties of all items are updated when items change', async () => {
      const menu = await basicFixture();
      function assertTabIndexCounts(nodes, expected) {
        const tabIndexCounts = {};
        for (let i = 0; i < nodes.length; i++) {
          const { tabIndex } = nodes[i];
          if (tabIndexCounts[tabIndex]) {
            tabIndexCounts[tabIndex]++;
          } else {
            tabIndexCounts[tabIndex] = 1;
          }
        }
        assert.equal(
          Object.keys(tabIndexCounts).length,
          Object.keys(expected).length
        );
        Object.keys(expected).forEach((key) => {
          assert.equal(tabIndexCounts[key], expected[key]);
        });
      }
      function divWithTabIndex(tabIndex) {
        const div = document.createElement('div');
        div.tabIndex = tabIndex;
        return div;
      }
      // Only the selected item will have tabIndex 0.
      menu.select(0);
      assertTabIndexCounts(menu.items, { '-1': 2, '0': 1 });
      menu.appendChild(divWithTabIndex(1));
      menu.appendChild(divWithTabIndex(2));
      menu.appendChild(divWithTabIndex(3));
      await nextFrame();
      // Async wait for `observeNodes`.
      await aTimeout(0);
      assertTabIndexCounts(menu.items, { '-1': 5, '0': 1 });
    });

    it('shift+tab removes focus', async () => {
      const menu = await countriesFixture();
      menu.focus();
      // Wait for async focus
      await aTimeout(0);
      // Key press 'Tab'
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'Tab',
        shiftKey: true,
      });
      menu.dispatchEvent(e);
      assert.equal(menu.getAttribute('tabindex'), '-1');
      assert.isTrue(menu._shiftTabPressed);
      assert.equal(menu._focusedItem, null);
      await aTimeout(1);
      assert.isFalse(menu._shiftTabPressed);
      assert.equal(menu.getAttribute('tabindex'), '0');
    });

    it('sets default aria-selected on children', async () => {
      const menu = await useAriaSelectedFixture();
      const nodes = menu.querySelectorAll('div');
      for (let i = 0; i < nodes.length; i++) {
        assert.equal(nodes[i].getAttribute('aria-selected'), 'false');
      }
    });

    it('updates aria-selected when selection is made', async () => {
      const menu = await useAriaSelectedFixture();
      menu.select(0);
      await aTimeout(0);
      const nodes = menu.querySelectorAll('div');
      assert.equal(
        nodes[0].getAttribute('aria-selected'),
        'true',
        '1st node has aria-selected = true'
      );
      assert.equal(
        nodes[1].getAttribute('aria-selected'),
        'false',
        '2nd node has aria-selected = false'
      );
    });

    it('updates aria-selected when another selection is made', async () => {
      const menu = await useAriaSelectedFixture();
      menu.select(0);
      await aTimeout(0);
      menu.select(1);
      await aTimeout(0);
      const nodes = menu.querySelectorAll('div');
      assert.equal(
        nodes[0].getAttribute('aria-selected'),
        'false',
        '1st node has aria-selected = false'
      );
      assert.equal(
        nodes[1].getAttribute('aria-selected'),
        'true',
        '2nd node has aria-selected = true'
      );
    });
  });

  describe('_clearSearchText()', () => {
    /** @type TestMenu */
    let menu;
    beforeEach(async () => {
      menu = await basicFixture();
    });

    it('clears _searchText', () => {
      // @ts-ignore
      menu._searchText = 'test';
      menu._clearSearchText();
      // @ts-ignore
      assert.equal(menu._searchText, '');
    });
  });

  describe('Items highlighting', () => {
    describe('highlightNext()', () => {
      /** @type TestMenu */
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('sets highlight class on the first item', () => {
        element.highlightNext();
        assert.isTrue(element.items[0].classList.contains('highlight'));
      });

      it('sets highlightedItem', () => {
        element.highlightNext();
        const [item] = element.items;
        assert.isTrue(element.highlightedItem === item);
      });

      it('highlights next item after previous highlighted item', () => {
        element.highlightNext();
        element.highlightNext();
        assert.isTrue(element.items[1].classList.contains('highlight'));
      });

      it('changes highlightedItem', () => {
        element.highlightNext();
        element.highlightNext();
        const item = element.items[1];
        assert.isTrue(element.highlightedItem === item);
      });

      it('removes "highlight" class from previous item', () => {
        element.highlightNext();
        element.highlightNext();
        assert.isFalse(element.items[0].classList.contains('highlight'));
      });

      it('highlights item after current selection', () => {
        const item = element.items[1];
        item.focus();
        element.highlightNext();
        assert.isFalse(element.items[2].classList.contains('highlight'));
      });

      it('highlights item after disabled item', () => {
        const item = element.items[0];
        item.setAttribute('disabled', '');
        element.highlightNext();
        assert.isTrue(element.items[1].classList.contains('highlight'));
      });
    });

    describe('highlightPrevious()', () => {
      /** @type TestMenu */
      let element;
      beforeEach(async () => {
        element = await basicFixture();
      });

      it('sets highlight class on the last item', () => {
        element.highlightPrevious();
        assert.isTrue(element.items[2].classList.contains('highlight'));
      });

      it('sets highlightedItem', () => {
        element.highlightPrevious();
        const item = element.items[2];
        assert.isTrue(element.highlightedItem === item);
      });

      it('highlights previous item before previous highlighted item', () => {
        element.highlightPrevious();
        element.highlightPrevious();
        assert.isTrue(element.items[1].classList.contains('highlight'));
      });

      it('changes highlightedItem', () => {
        element.highlightPrevious();
        element.highlightPrevious();
        const item = element.items[1];
        assert.isTrue(element.highlightedItem === item);
      });

      it('removes "highlight" class from previous item', () => {
        element.highlightPrevious();
        element.highlightPrevious();
        assert.isFalse(element.items[2].classList.contains('highlight'));
      });

      it('highlights item before current selection', () => {
        const item = element.items[1];
        item.focus();
        element.highlightPrevious();
        assert.isFalse(element.items[0].classList.contains('highlight'));
      });

      it('highlights item before disabled item', () => {
        const item = element.items[2];
        item.setAttribute('disabled', '');
        element.highlightPrevious();
        assert.isTrue(element.items[1].classList.contains('highlight'));
      });
    });

    describe('Single item menu', () => {
      /** @type TestMenu */
      let element;
      beforeEach(async () => {
        element = await singleItemFixture();
      });

      it('highlights single item with next', () => {
        element.highlightNext();
        assert.isTrue(element.items[0].classList.contains('highlight'));
      });

      it('highlights single item with previous', () => {
        element.highlightPrevious();
        assert.isTrue(element.items[0].classList.contains('highlight'));
      });
    });

    describe('a11y', () => {
      /** @type TestMenu */
      let element;
      beforeEach(async () => {
        element = await highlightAriaSelectedFixture();
      });

      it('sets aria-selected when highlighting an item', () => {
        element.highlightNext();
        assert.equal(element.items[0].getAttribute('aria-selected'), 'true');
      });

      it('updates aria-selected from de-highlighted item', () => {
        element.highlightNext();
        element.highlightNext();
        assert.equal(element.items[0].getAttribute('aria-selected'), 'false');
        assert.equal(element.items[1].getAttribute('aria-selected'), 'true');
      });
    });
  });

  describe('a11y', async () => {
    it('is accessible without selection', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible with focus', async () => {
      const menu = await basicFixture();
      menu.focus();
      await aTimeout(0);
      await assert.isAccessible(menu);
    });

    it('respects existing role', async () => {
      const menu = await fixture(`<test-menu role="tablist"></test-menu>`);
      assert.equal(menu.getAttribute('role'), 'tablist');
    });
  });
});

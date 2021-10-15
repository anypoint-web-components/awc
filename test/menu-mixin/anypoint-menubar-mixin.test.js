import { fixture, assert, aTimeout, html, nextFrame } from '@open-wc/testing';
import './test-menubar.js';

/** @typedef {import('./test-menubar').TestMenubar} TestMenubar */

describe('AnypointMenubarMixin', () => {
  /**
   * @return {Promise<TestMenubar>}
   */
  async function basicFixture() {
    return fixture(html`<test-menubar>
      <div role="menuitem">item 1</div>
      <div role="menuitem">item 2</div>
      <div role="menuitem">item 3</div>
    </test-menubar>`);
  }

  /**
   * @return {Promise<TestMenubar>}
   */
  async function multiFixture() {
    return fixture(html`<test-menubar multi>
      <div>item 1</div>
      <div>item 2</div>
      <div>item 3</div>
    </test-menubar>`);
  }

  /**
   * @return {Promise<TestMenubar>}
   */
  async function rtlFixture() {
    return fixture(html`
    <div dir="rtl">
      <test-menubar>
        <div>item 1</div>
        <div>item 2</div>
        <div>item 3</div>
      </test-menubar>
    </div>`);
  }

  describe('menubar keyboard tests', () => {
    it('menubar has role="menubar"', async () => {
      const menubar = await basicFixture();
      assert.equal(menubar.getAttribute('role'), 'menubar', 'has role="menubar"');
    });

    it('first item gets focus when menubar is focused', async () => {
      const menubar = await basicFixture();
      menubar.focus();
      await aTimeout(0);
      assert.equal(document.activeElement, menubar.firstElementChild, 'document.activeElement is first item');
    });

    it('selected item gets focus when menubar is focused', async () => {
      const menubar = await basicFixture();
      menubar.selected = 1;
      menubar.focus();
      await aTimeout(0);
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('selects focused item in up arrow', async () => {
      const menubar = await basicFixture();
      menubar.focus();
      await aTimeout(0);
      // Key press up
      menubar.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
      }));

      await aTimeout(0);
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('selects focused item in down arrow', async () => {
      const menubar = await basicFixture();
      menubar.focus();
      await aTimeout(0);
      // Key press up
      menubar.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
      }));
      await aTimeout(0);
      assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
    });

    it('focusing non-item content does not auto-focus an item', async () => {
      const menubar = await basicFixture();
      menubar.extraContent.focus();
      await aTimeout(0);
      const ownerRoot = /** @type Document */ (menubar.extraContent.getRootNode && menubar.extraContent.getRootNode()) || document;
      const {activeElement} = ownerRoot;
      assert.equal(activeElement, menubar.extraContent, 'menubar.extraContent is focused');
      assert.equal(document.activeElement, menubar, 'menubar is document.activeElement');
    });

    it('last activated item in a multi select menubar is focused', async () => {
      const menubar = await multiFixture();
      await aTimeout(0);
      menubar.selected = 0;
      menubar.items[1].click();
      await aTimeout(0);
      assert.equal(document.activeElement, menubar.items[1], 'document.activeElement is last activated item');
    });

    it('deselection in a multi select menubar focuses deselected item', async () => {
      const menubar = await multiFixture();
      menubar.selected = 0;
      menubar.items[0].click();
      await aTimeout(0);
      assert.equal(document.activeElement, menubar.items[0], 'document.activeElement is last activated item');
    });

    describe('left / right keys are reversed when the menubar has RTL directionality', () => {
      it('left key moves to the previous item', async () => {
        const menubar = await basicFixture();
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        menubar.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowLeft',
          key: 'ArrowLeft',
        }));
        await nextFrame();
        menubar.dispatchEvent(new KeyboardEvent('keyup', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowLeft',
          key: 'ArrowLeft',
        }));
        assert.equal(
          document.activeElement,
          menubar.items[0],
          '`document.activeElement` should be the previous item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('right key moves to the next item', async () => {
        const menubar = await basicFixture();
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        menubar.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowRight',
          key: 'ArrowRight',
        }));
        await nextFrame();
        menubar.dispatchEvent(new KeyboardEvent('keyup', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowRight',
          key: 'ArrowRight',
        }));

        assert.equal(
          document.activeElement,
          menubar.items[2],
          '`document.activeElement` should be the previous item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('left key moves to the next item with RTL', async () => {
        const rtlContainer = await rtlFixture();
        const menubar = /** @type TestMenubar */ (rtlContainer.querySelector('test-menubar'));
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        menubar.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowLeft',
          key: 'ArrowLeft',
        }));
        await nextFrame();
        menubar.dispatchEvent(new KeyboardEvent('keyup', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowLeft',
          key: 'ArrowLeft',
        }));
        assert.equal(
          document.activeElement,
          menubar.items[2],
          '`document.activeElement` should be the next item.'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
      });

      it('right key moves to the previous item', async () => {
        const rtlContainer = await rtlFixture();
        const menubar = /** @type TestMenubar */ (rtlContainer.querySelector('test-menubar'));
        menubar.selected = 0;
        menubar.items[1].click();
        assert.equal(document.activeElement, menubar.items[1]);
        menubar.dispatchEvent(new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowRight',
          key: 'ArrowRight',
        }));
        await nextFrame();
        menubar.dispatchEvent(new KeyboardEvent('keyup', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: 'ArrowRight',
          key: 'ArrowRight',
        }));
        assert.equal(
          document.activeElement,
          menubar.items[0],
          '`document.activeElement` should be the previous item'
        );
        assert.equal(menubar.selected, 1, '`menubar.selected` should not change.');
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
      const menu = await fixture(`<test-menubar role="tablist"></test-menubar>`);
      assert.equal(menu.getAttribute('role'), 'tablist');
    });
  });
});

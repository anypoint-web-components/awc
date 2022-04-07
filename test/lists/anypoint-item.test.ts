import { aTimeout, fixture, expect, assert, nextFrame, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/define/anypoint-item.js';
import '../../src/define/anypoint-icon-item.js';
import { AnypointItemElement } from '../../src/index.js';

describe('<anypoint-item>', () => {
  async function itemFixture(): Promise<HTMLDivElement> {
    return fixture(html`<div role="listbox">
      <anypoint-item>item</anypoint-item>
    </div>`);
  }

  async function iconItemFixture(): Promise<HTMLDivElement> {
    return fixture(html`<div role="listbox">
      <anypoint-icon-item>item</anypoint-icon-item>
    </div>`);
  }

  async function itemWithInputFixture(): Promise<HTMLDivElement> {
    return fixture(html`<div role="list">
      <anypoint-item><input></anypoint-item>
    </div>`);
  }

  async function iconItemWithInputFixture(): Promise<HTMLDivElement> {
    return fixture(html`<div role="list">
      <anypoint-icon-item><input></anypoint-icon-item>
    </div>`);
  }

  async function itemRoleFixture(): Promise<AnypointItemElement> {
    return fixture(html`<anypoint-item role="button">item</anypoint-item>`);
  }

  async function itemTabindexFixture(): Promise<AnypointItemElement> {
    return fixture(html`<anypoint-item tabindex="-1">item</anypoint-item>`);
  }

  async function iconItemRoleFixture(): Promise<AnypointItemElement> {
    return fixture(html`<anypoint-icon-item role="button">item</anypoint-icon-item>`);
  }

  async function iconItemTabindexFixture(): Promise<AnypointItemElement> {
    return fixture(html`<anypoint-icon-item tabindex="-1">item</anypoint-icon-item>`);
  }

  describe('anypoint-item basic', () => {
    let item: AnypointItemElement;
    let clickHandler: sinon.SinonSpy<any[], any>;
    beforeEach(async () => {
      const element = await itemFixture();
      item = element.querySelector('anypoint-item')!;
      clickHandler = sinon.spy();
      item.addEventListener('click', clickHandler);
    });

    it('space triggers a click event', async () => {
      const info = {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Space',
        key: ' ',
        keyCode: 32,
      };
      item.dispatchEvent(new KeyboardEvent('keydown', { ...info }));
      await nextFrame();
      item.dispatchEvent(new KeyboardEvent('keyup', { ...info }));
      await aTimeout(1);
      expect(clickHandler.callCount).to.be.equal(1);
    });

    it('enter triggers a click event', async () => {
      const info = {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Enter',
        key: 'Enter',
        keyCode: 13,
      };
      item.dispatchEvent(new KeyboardEvent('keydown', { ...info }));
      await nextFrame();
      item.dispatchEvent(new KeyboardEvent('keyup', { ...info }));
      await aTimeout(1);
      
      expect(clickHandler.callCount).to.be.equal(1);
    });
  });

  describe('anypoint-icon-item basic', () => {
    let item: AnypointItemElement;
    let clickHandler: sinon.SinonSpy<any[], any>;
    beforeEach(async () => {
      const element = await iconItemFixture();
      item = element.querySelector('anypoint-icon-item')!;
      clickHandler = sinon.spy();
      item.addEventListener('click', clickHandler);
    });

    it('space triggers a click event', async () => {
      const info = {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Space',
        key: ' ',
        keyCode: 32,
      };
      item.dispatchEvent(new KeyboardEvent('keydown', { ...info }));
      await nextFrame();
      item.dispatchEvent(new KeyboardEvent('keyup', { ...info }));
      await aTimeout(1);
      expect(clickHandler.callCount).to.be.equal(1);
    });

    it('click triggers a click event', async () => {
      item.click();
      await aTimeout(40);
      expect(clickHandler.callCount).to.be.equal(1);
    });
  });

  describe('clickable element inside item', () => {
    it('anypoint-item: space in child native input does not trigger a click event', async () => {
      const f = await itemWithInputFixture();
      const outerItem = f.querySelector('anypoint-item')!;
      const innerInput = f.querySelector('input')!;
      const itemClickHandler = sinon.spy();
      outerItem.addEventListener('click', itemClickHandler);
      innerInput.focus();

      const info = {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Space',
        key: ' ',
        keyCode: 32,
      };
      innerInput.dispatchEvent(new KeyboardEvent('keydown', { ...info }));
      await nextFrame();
      innerInput.dispatchEvent(new KeyboardEvent('keyup', { ...info }));
      await aTimeout(1);

      expect(itemClickHandler.callCount).to.be.equal(0);
    });

    it('anypoint-icon-item: space in child input does not trigger a click event', async () => {
      const f = await iconItemWithInputFixture();
      const outerItem = f.querySelector('anypoint-icon-item')!;
      const innerInput = f.querySelector('input')!;
      const itemClickHandler = sinon.spy();
      outerItem.addEventListener('click', itemClickHandler);
      
      const info = {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Space',
        key: ' ',
        keyCode: 32,
      };
      innerInput.dispatchEvent(new KeyboardEvent('keydown', { ...info }));
      await nextFrame();
      innerInput.dispatchEvent(new KeyboardEvent('keyup', { ...info }));
      await aTimeout(1);
      
      expect(itemClickHandler.callCount).to.be.equal(0);
    });
  });

  describe('item a11y tests', () => {
    it('item has role="listitem"', async () => {
      const element = await itemFixture();
      const item = element.querySelector('anypoint-item')!;
      assert.equal(item.getAttribute('role'), 'option', 'has role="option"');
    });

    it('icon item has role="listitem"', async () => {
      const element = await iconItemFixture();
      const iconItem = element.querySelector('anypoint-icon-item')!;
      assert.equal(iconItem.getAttribute('role'), 'option', 'has role="option"');
    });

    it('item respects role attribute', async () => {
      const element = await itemRoleFixture();
      assert.equal(element.getAttribute('role'), 'button', 'has role="button"');
    });

    it('icon item has role="listitem"', async () => {
      const element = await iconItemRoleFixture();
      assert.equal(element.getAttribute('role'), 'button', 'has role="button"');
    });

    it('item has tabindex="0"', async () => {
      const element = await itemFixture();
      const iconItem = element.querySelector('anypoint-item')!;
      assert.equal(iconItem.getAttribute('tabindex'), '0', 'has tabindex="0"');
    });

    it('item respects tabindex', async () => {
      const element = await itemTabindexFixture();
      assert.equal(element.getAttribute('tabindex'), '-1', 'has tabindex="-1"');
    });

    it('icon item has tabindex="0"', async () => {
      const element = await iconItemFixture();
      const iconItem = element.querySelector('anypoint-icon-item')!;
      assert.equal(iconItem.getAttribute('tabindex'), '0', 'has tabindex="0"');
    });

    it('icon respects tabindex', async () => {
      const element = await iconItemTabindexFixture();
      assert.equal(element.getAttribute('tabindex'), '-1', 'has tabindex="-1"');
    });

    it('passes a11y for regular item', async () => {
      const element = await fixture(`<div role="listbox" aria-label="test label">
      <anypoint-item>item</anypoint-item>
      </div>`);
      await assert.isAccessible(element);
    });

    it('passes a11y for button item', async () => {
      const element = await fixture(`<div role="listbox" aria-label="test label">
        <button class="anypoint-item" role="option">item</button>
      </div>`);
      await assert.isAccessible(element);
    });

    it('passes a11y for icon item', async () => {
      const element = await fixture(`<div role="listbox" aria-label="test label">
        <anypoint-icon-item>item</anypoint-icon-item>
      </div>`);
      await assert.isAccessible(element);
    });

    it('passes a11y for disabled item', async () => {
      const element = await fixture(`<div role="listbox" aria-label="test label">
        <anypoint-icon-item disabled>item</anypoint-icon-item>
      </div>`);
      await assert.isAccessible(element);
    });
  });
});

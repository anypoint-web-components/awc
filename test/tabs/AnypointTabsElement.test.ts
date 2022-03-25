import {
  html,
  fixture,
  assert,
  aTimeout,
  nextFrame,
} from '@open-wc/testing';
import { TemplateResult } from 'lit';
import '../../define/anypoint-tabs.js';
import '../../define/anypoint-tab.js';
import { keyDown } from '../lib/helpers.js';
import { AnypointTabElement, AnypointTabsElement } from '../../index.js';

describe('AnypointTabsElement', () => {
  function renderTabs(amount: number): TemplateResult[] {
    const items = new Array(amount);
    items.fill(true);
    return items.map((_, index) => html`<anypoint-tab>Tab #${index}</anypoint-tab>`);
  }

  async function basicFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs>
        ${renderTabs(15)}
      </anypoint-tabs>
    `);
  }
  async function selectedFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs selected="1">
        ${renderTabs(15)}
      </anypoint-tabs>
    `);
  }

  async function scrollableFixture(tabsAmount = 15): Promise<AnypointTabsElement> {
    const container = await fixture(html`
      <div style="width: 600px;">
      <anypoint-tabs selected="0" scrollable>
        ${renderTabs(tabsAmount)}
      </anypoint-tabs>
      </div>
    `);
    return container.querySelector('anypoint-tabs')!;
  }

  async function fitContainerFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs fitContainer>
        ${renderTabs(3)}
      </anypoint-tabs>
    `);
  }

  async function noBarFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs noBar>
        ${renderTabs(3)}
      </anypoint-tabs>
    `);
  }

  async function alignBottomFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs alignBottom>
        ${renderTabs(3)}
      </anypoint-tabs>
    `);
  }

  async function anypointFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs anypoint>
        ${renderTabs(3)}
      </anypoint-tabs>
    `);
  }

  async function hiddenFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs hidden>
        ${renderTabs(3)}
      </anypoint-tabs>
    `);
  }

  async function autoselectFixture(): Promise<AnypointTabsElement> {
    return fixture(html`
      <anypoint-tabs autoselect>
        ${renderTabs(4)}
      </anypoint-tabs>
    `);
  }

  function checkSelectionBar(tabs: AnypointTabsElement, tab: AnypointTabElement): void {
    const tabRect = tab.getBoundingClientRect();
    const rect = tabs.shadowRoot!.querySelector('#selectionBar')!.getBoundingClientRect();
    assert.approximately(rect.left, tabRect.left, 5);
    assert.approximately(rect.right, tabRect.right, 5);
  }

  describe('Initialization', () => {
    it('can be initialized with document.createElement', () => {
      const element = document.createElement('anypoint-tabs');
      assert.ok(element);
    });

    it('sets selectable property', async () => {
      const element = await basicFixture();
      assert.equal(element.selectable, 'anypoint-tab');
    });

    it('sets autoselectDelay property', async () => {
      const element = await basicFixture();
      assert.equal(element.autoselectDelay, 0);
    });

    it('sets _step property', async () => {
      const element = await basicFixture();
      assert.equal(element._step, 10);
    });

    it('does not auto select when creating', async () => {
      const element = await basicFixture();
      assert.isUndefined(element.selected);
    });
  });

  describe('a11y', () => {
    async function basicTabsFixture(): Promise<AnypointTabsElement> {
      return fixture(html`
        <anypoint-tabs>
          <anypoint-tab>1</anypoint-tab>
          <anypoint-tab>2</anypoint-tab>
          <anypoint-tab>3</anypoint-tab>
        </anypoint-tabs>
      `);
    }

    it('is accessible', async () => {
      const element = await basicTabsFixture();
      await assert.isAccessible(element);
    });

    it('has role attribute', async () => {
      const element = await basicTabsFixture();
      assert.equal(element.getAttribute('role'), 'tablist');
    });
  });

  describe('_contentClass', () => {
    it('returns "scrollable" name scrollable', async () => {
      const element = await scrollableFixture();
      assert.equal(element._contentClass, 'scrollable');
    });

    it('returns "fit-container" name for fitContainer', async () => {
      const element = await fitContainerFixture();
      assert.equal(element._contentClass, 'fit-container');
    });

    it('returns both names for both properties', async () => {
      const element = await fitContainerFixture();
      element.scrollable = true;
      assert.equal(element._contentClass, 'scrollable fit-container');
    });
  });

  describe('_selectionClass', () => {
    it('returns "hidden" when noBar', async () => {
      const element = await noBarFixture();
      assert.equal(element._selectionClass, 'hidden');
    });

    it('returns "align-bottom" alignBottom', async () => {
      const element = await alignBottomFixture();
      assert.equal(element._selectionClass, 'align-bottom');
    });

    it('returns empty string when no properties', async () => {
      const element = await basicFixture();
      assert.equal(element._selectionClass, '');
    });
  });

  describe('_leftButtonClass', () => {
    it('returns empty string when should render', async () => {
      const element = await scrollableFixture();
      assert.equal(element._leftButtonClass, '');
    });

    it('returns "hidden" when not scrollable', async () => {
      const element = await basicFixture();
      assert.equal(element._leftButtonClass, 'hidden');
    });

    it('should hide buttons if not enough tabs to scroll', async () => {
      const element = await scrollableFixture(1);
      await aTimeout(20);
      assert.isTrue(element.hideScrollButtons);
    });
  });

  describe('_rightButtonClass', () => {
    it('returns empty string when should render', async () => {
      const element = await scrollableFixture();
      assert.equal(element._rightButtonClass, '');
    });

    it('returns "hidden" when not scrollable', async () => {
      const element = await basicFixture();
      assert.equal(element._rightButtonClass, 'hidden');
    });

    it('returns "hidden" when _leftHidden', async () => {
      const element = await scrollableFixture();
      element.hideScrollButtons = true;
      assert.equal(element._rightButtonClass, 'hidden');
    });
  });

  describe('_onRightScrollButtonDown', () => {
    it('defines holdJob when scrolling right', async () => {
      const element = await scrollableFixture()
      element._holdJob = null
      element._onRightScrollButtonDown()
      assert.notEqual(element._holdJob, null)
    })

    it('clears holdJob when rightHidden is true', async () => {
      const element = await scrollableFixture()
      element._holdJob = null
      element._onRightScrollButtonDown()
      element._rightHidden = true
      element._scrollToRight()
      assert.equal(element._holdJob, null)
    })
  })

  describe('_onLeftScrollButtonDown', () => {
    it('defines holdJob when scrolling left ', async () => {
      const element = await scrollableFixture()
      element._holdJob = null
      element._onLeftScrollButtonDown()
      assert.notEqual(element._holdJob, null)
    })

    it('clears holdJob when leftHidden is true', async () => {
      const element = await scrollableFixture()
      element._holdJob = null
      element._onLeftScrollButtonDown()
      element._leftHidden = true
      element._scrollToLeft()
      assert.equal(element._holdJob, null)
    })
  })

  describe('_tabsContainer', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns reference to the container node', async () => {
      assert.equal(element._tabsContainer.id, 'tabsContainer');
    });
  });

  describe('_tabsContent', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns reference to the content node', async () => {
      assert.equal(element._tabsContent.id, 'tabsContent');
    });
  });

  describe('_selectionBar', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns reference to the selection bar node', async () => {
      assert.equal(element._selectionBar.id, 'selectionBar');
    });
  });

  describe('anypoint mode', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await anypointFixture();
    });

    it('sets noink on children', async () => {
      const tab = element.items[0] as AnypointTabElement;
      assert.isTrue(tab.noink);
    });

    it.skip('sets noink on dynamically added child', async () => {
      const tab = document.createElement('anypoint-tab');
      element.appendChild(tab);
      await aTimeout(200);
      assert.isTrue(tab.noink);
    });

    it('removes noink when resetting anypoint', async () => {
      await aTimeout(0);
      element.anypoint = false;
      const tab = element.items[0] as AnypointTabElement;
      assert.isFalse(tab.noink);
    });
  });

  describe('Hidden tabs', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await hiddenFixture();
    });

    it('sets bar position once visible', async () => {
      element.removeAttribute('hidden');
      element.selected = 1;
      await aTimeout(200);
      checkSelectionBar(element, element.items[1] as AnypointTabElement);
    });
  });

  describe('Tab selection', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await selectedFixture();
    });

    it('sets selected value', async () => {
      assert.equal(element.selected, 1);
    });

    it('sets "selected" class on the selected tab', async () => {
      const tab = element.items[1];
      assert.isTrue(tab.classList.contains('selected'));
    });

    it('sets bar position under selected tab', async () => {
      await aTimeout(200);
      const tab = element.items[1] as AnypointTabElement;
      checkSelectionBar(element, tab);
    });

    it('selects tab via click', async () => {
      await aTimeout(20);
      // it has no effect on a merit of the test but will allow to speed it up
      // a bit
      element.noSlide = true;
      const tab = element.items[2] as AnypointTabElement;
      tab.click();
      await aTimeout(200);
      checkSelectionBar(element, tab);
    });

    it('selects a tab when clicking on it', async () => {
      await aTimeout(20);
      const tab = element.items[0];
      keyDown(tab, 'Enter');
      await aTimeout(20);
      assert.equal(element.selected, 0);
    });
  });

  function ensureDocumentHasFocus(): void {
    if (window.top) {
      window.top.focus();
    } else {
      window.focus();
    }
  }

  describe('Auto selection', () => {
    it('does not select a tab when no autoselect', async () => {
      const element = await basicFixture();
      ensureDocumentHasFocus();
      element.select(0);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(1);
      assert.equal(element.selected, 0);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(1);
      assert.equal(element.selected, 0);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(1);
      assert.equal(element.selected, 0);
    });

    it('selects a tab when moving right', async () => {
      const element = await autoselectFixture();
      ensureDocumentHasFocus();
      element.select(1);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(2);
      assert.equal(element.selected, 2);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(2);
      assert.equal(element.selected, 3);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(2);
      assert.equal(element.selected, 0);
    });

    it('selects a tab when moving right & RTL', async () => {
      const element = await autoselectFixture();
      element.setAttribute('dir', 'rtl');
      ensureDocumentHasFocus();
      element.select(1);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(0);
      assert.equal(element.selected, 0);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(0);
      assert.equal(element.selected, 3);
      keyDown(element.selectedItem!, 'ArrowRight');
      await aTimeout(0);
      assert.equal(element.selected, 2);
    });

    it('selects a tab when moving left', async () => {
      const element = await autoselectFixture();
      ensureDocumentHasFocus();
      element.select(1);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 0);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 3);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 2);
    });

    it('selects a tab when moving left & RTL', async () => {
      const element = await autoselectFixture();
      element.setAttribute('dir', 'rtl');
      ensureDocumentHasFocus();
      element.select(1);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 2);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 3);
      keyDown(element.selectedItem!, 'ArrowLeft');
      await aTimeout(0);
      assert.equal(element.selected, 0);
    });
  });

  describe('Scrollable container tracking', () => {
    let element: AnypointTabsElement;
    beforeEach(async () => {
      element = await scrollableFixture();
      await aTimeout(0); // for children to settle
    });

    it('sets __lastTouchX when touch is starting', async () => {
      const tab = element.items[4] as AnypointTabElement;
      // const touch = new Touch({
      //   pageX: 200,
      //   pageY: 200,
      //   clientX: 200,
      //   clientY: 200,
      //   identifier: 0,
      //   target: tab
      // });
      // const ev = new TouchEvent('touchstart', { 
      //   bubbles: true, 
      //   composed: true,
      //   touches: [touch],
      //   changedTouches: [touch],
      // });
      // tab.dispatchEvent(ev);
      const e = new CustomEvent('touchstart', { bubbles: true, composed: true });
      const touches = [{ pageX: 200, pageY: 200, clientX: 200, clientY: 200 }]
      // @ts-ignore
      e.touches = touches;
      // @ts-ignore
      e.changedTouches = touches;
      tab.dispatchEvent(e);
      assert.equal(element.__lastTouchX, 200);
    });

    it('scrolls the container by the amount of track from the last touch', async () => {
      const tab = element.items[4] as AnypointTabElement;
      element.__lastTouchX = 200;
      // const touch = new Touch({
      //   pageX: 200,
      //   pageY: 200,
      //   clientX: 196,
      //   clientY: 200,
      //   identifier: 0,
      //   target: tab
      // });
      // const ev = new TouchEvent('touchmove', { 
      //   bubbles: true, 
      //   composed: true,
      //   touches: [touch],
      //   changedTouches: [touch],
      // });
      // tab.dispatchEvent(ev);
      
      const e = new CustomEvent('touchmove', { bubbles: true, composed: true });
      const touches = [{ pageX: 200, pageY: 200, clientX: 196, clientY: 200 }]
      // @ts-ignore
      e.touches = touches;
      // @ts-ignore
      e.changedTouches = touches;
      tab.dispatchEvent(e);
      const node = element._tabsContainer;
      assert.equal(node.scrollLeft, 4);
    });

    it('scrolls the other way', async () => {
      const tab = element.items[4] as AnypointTabElement;
      element.__lastTouchX = 200;
      const node = element._tabsContainer;
      node.scrollLeft = 100;

      // const touch = new Touch({
      //   pageX: 200,
      //   pageY: 200,
      //   clientX: 204,
      //   clientY: 200,
      //   identifier: 0,
      //   target: tab
      // });
      // const ev = new TouchEvent('touchmove', { 
      //   bubbles: true, 
      //   composed: true,
      //   touches: [touch],
      //   changedTouches: [touch],
      // });
      // tab.dispatchEvent(ev);

      const e = new CustomEvent('touchmove', { bubbles: true, composed: true });
      const touches = [{ pageX: 200, pageY: 200, clientX: 204, clientY: 200 }]
      // @ts-ignore
      e.touches = touches;
      // @ts-ignore
      e.changedTouches = touches;
      tab.dispatchEvent(e);
      assert.equal(node.scrollLeft, 96);
    });

    it('resets __lastTouchX when touch ends', async () => {
      const tab = element.items[4];
      element.__lastTouchX = 200;

      // const touch = new Touch({
      //   pageX: 200,
      //   pageY: 200,
      //   clientX: 204,
      //   clientY: 200,
      //   identifier: 0,
      //   target: tab
      // });
      // const ev = new TouchEvent('touchend', { 
      //   bubbles: true, 
      //   composed: true,
      //   touches: [touch],
      //   changedTouches: [touch],
      // });
      // tab.dispatchEvent(ev);

      const e = new CustomEvent('touchend', { bubbles: true, composed: true });
      const touches = [{ pageX: 200, pageY: 200, clientX: 204, clientY: 200 }]
      // @ts-ignore
      e.touches = touches;
      // @ts-ignore
      e.changedTouches = touches;
      tab.dispatchEvent(e);
      assert.equal(element.__lastTouchX, 0);
    });
  });

  describe('Hiding scroll', () => {
    let element: AnypointTabsElement;

    it('should hide arrows when there are not enough tabs to scroll', async () => {
      element = await scrollableFixture(3)
      element.hideScrollButtons = true;
      await nextFrame();
      element.style.width = '500px';
      await nextFrame();
      assert.isNotEmpty(element.shadowRoot!.querySelectorAll('anypoint-icon-button.hidden'))
    });

    it('should show arrows when the element\'s width decreases enough', async () => {
      element = await scrollableFixture(3)
      element.hideScrollButtons = true;
      await nextFrame();
      element.style.width = '100px';
      await aTimeout(100);
      assert.isEmpty(element.shadowRoot!.querySelectorAll('anypoint-icon-button.hidden'))
    });
  });
});

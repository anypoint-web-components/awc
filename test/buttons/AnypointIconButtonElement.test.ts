import { fixture, assert, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/define/anypoint-icon-button.js';
import '../../demo/lib/demo-icon.js';
import { keyDownUp } from '../lib/helpers.js';
import { AnypointIconButtonElement } from '../../src/index.js';

describe('<anypoint-icon-button>', () => {
  async function basicFixture(): Promise<AnypointIconButtonElement> {
    return fixture(html`<anypoint-icon-button>
        <demo-icon icon="add"></demo-icon>
    </anypoint-icon-button>`);
  }

  async function noinkFixture(): Promise<AnypointIconButtonElement> {
    return fixture(html`<anypoint-icon-button noink>
        <demo-icon icon="add"></demo-icon>
    </anypoint-icon-button>`);
  }

  describe('Basics', () => {
    it('returns _ripple', async () => {
      const element = await basicFixture();
      assert.equal(element._ripple.localName, 'material-ripple');
    });

    it('noink property is passed to the ripple', async () => {
      const element = await noinkFixture();
      assert.isTrue(element._ripple.noink);
    });
  });

  describe('Initialization', () => {
    it('can be constructed with document.createElement', () => {
      const button = document.createElement('anypoint-icon-button');
      assert.ok(button);
    });

    it('has default emphasis', async () => {
      const button = await basicFixture();
      assert.equal(button.emphasis, 'low');
    });
  });

  describe('_spaceKeyDownHandler()', () => {
    let element: AnypointIconButtonElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _enterDownHandler() when changing value', () => {
      const spy = sinon.spy(element as any, '_enterDownHandler');
      element._spaceKeyDownHandler(new KeyboardEvent('keydown'));
      assert.isTrue(spy.calledOnce, 'Function called');
    });
  });

  describe('_spaceKeyUpHandler()', () => {
    let element: AnypointIconButtonElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _enterUpHandler() ', () => {
      const spy = sinon.spy(element as any, '_enterUpHandler');
      element._spaceKeyUpHandler(new KeyboardEvent('keyup'));
      assert.isTrue(spy.called, 'Function called');
    });
  });

  describe('_enterDownHandler()', () => {
    let element: any;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls _calculateElevation() ', () => {
      const spy = sinon.spy(element, '_calculateElevation');
      element._enterDownHandler();
      assert.isTrue(spy.called, 'Function called');
    });

    it('calls down() on the ripple', () => {
      const spy = sinon.spy(element._ripple, 'down');
      element._enterDownHandler();
      assert.isTrue(spy.called, 'Function called');
    });

    it('is called from enter down event', () => {
      const spy = sinon.spy(element, '_enterDownHandler');
      const e = new KeyboardEvent('keydown', {
        cancelable: true,
        code: 'Enter',
      });
      element.dispatchEvent(e);
      assert.isTrue(spy.called, 'Function called');
    });

    it('is called from num enter down event', () => {
      const spy = sinon.spy(element, '_enterDownHandler');
      const e = new KeyboardEvent('keydown', {
        cancelable: true,
        code: 'NumpadEnter',
      });
      element.dispatchEvent(e);
      assert.isTrue(spy.called, 'Function called');
    });

    it('is not called from other down event', () => {
      const spy = sinon.spy(element, '_enterDownHandler');
      const e = new KeyboardEvent('keydown', {
        cancelable: true,
        code: 'ArrowDown',
      });
      element.dispatchEvent(e);
      assert.isFalse(spy.called, 'Function not called');
    });
  });

  describe('_enterUpHandler()', () => {
    let element: any;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls _calculateElevation() ', () => {
      const spy = sinon.spy(element, '_calculateElevation');
      element._enterUpHandler();
      assert.isTrue(spy.called, 'Function called');
    });

    it('calls up() on the ripple', () => {
      const spy = sinon.spy(element._ripple, 'up');
      element._enterUpHandler();
      assert.isTrue(spy.called, 'Function called');
    });

    it('is called from enter up event', () => {
      const spy = sinon.spy(element, '_enterUpHandler');
      const e = new KeyboardEvent('keyup', {
        cancelable: true,
        code: 'Enter',
      });
      element.dispatchEvent(e);
      assert.isTrue(spy.called, 'Function called');
    });

    it('is called from num enter down event', () => {
      const spy = sinon.spy(element, '_enterUpHandler');
      const e = new KeyboardEvent('keyup', {
        cancelable: true,
        code: 'NumpadEnter',
      });
      element.dispatchEvent(e);
      assert.isTrue(spy.called, 'Function called');
    });

    it('is not called from other up event', () => {
      const spy = sinon.spy(element, '_enterUpHandler');
      const e = new KeyboardEvent('keyup', {
        cancelable: true,
        code: 'ArrowDown',
      });
      element.dispatchEvent(e);
      assert.isFalse(spy.called, 'Function not called');
    });
  });

  describe('a11y', () => {
    it('has role set', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'button');
    });

    it('respects existing role', async () => {
      const element = await fixture(
        `<anypoint-icon-button role="test"></anypoint-icon-button>`
      );
      assert.equal(element.getAttribute('role'), 'test');
    });

    it('has tabindex set', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex', async () => {
      const element = await fixture(
        `<anypoint-icon-button tabindex="1"></anypoint-icon-button>`
      );
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('is accessible in normal state', async () => {
      const element = await fixture(`<anypoint-icon-button aria-label="Click me">
        <demo-icon icon="add"></demo-icon>
      </anypoint-icon-button>`);
      await assert.isAccessible(element);
    });

    it('is accessible in disabled state', async () => {
      const element = await fixture(`<anypoint-icon-button disabled  aria-label="Click me">
        <demo-icon icon="add"></demo-icon>
      </anypoint-icon-button>`);
      await assert.isAccessible(element);
    });

    it('is accessible in active state', async () => {
      const element = await fixture(`<anypoint-icon-button toggles active  aria-label="Click me">
        <demo-icon icon="add"></demo-icon>
      </anypoint-icon-button>`);
      await assert.isAccessible(element);
    });
  });

  describe('Ripple effect', () => {
    let element: AnypointIconButtonElement;

    it('dispatched transitionend event on ripple end', async () => {
      element = await basicFixture();
      await keyDownUp(element, 'Space');
      const e = /** @type TransitionEvent */ (/** @type unknown */ (await oneEvent(element, 'transitionend')));
      assert.isUndefined(e.propertyName);
    });
  });
});

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import {
  click,
} from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../src/define/star-rating.js';

import { StarRatingElement } from '../../src/index.js';

describe('<star-rating>', () => {
  async function basicFixture(): Promise<StarRatingElement> {
    return fixture(`<star-rating></star-rating>`);
  }
  async function selectedFixture(): Promise<StarRatingElement> {
    return fixture(`<star-rating value="3"></star-rating>`);
  }
  async function readonlyFixture(): Promise<StarRatingElement> {
    return fixture(`<star-rating readonly></star-rating>`);
  }

  describe('Constructor', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets the __data__ property', () => {
      // @ts-ignore
      assert.typeOf(element.__data__, 'object');
    });

    it('Attaches shadow DOM', () => {
      assert.ok(element.shadowRoot!.querySelector('#container'));
    });
  });

  describe('observedAttributes()', () => {
    ['readonly', 'value'].forEach((attr) => {
      it(`Observes ${attr}`, () => {
        // @ts-ignore
        const list = window.customElements.get('star-rating')!.observedAttributes;
        assert.notEqual(list.indexOf(attr), -1);
      });
    });
  });

  describe('value setter/getter', () => {
    it('Sets value on __data__', async () => {
      const element = await basicFixture();
      element.value = 1;
      // @ts-ignore
      assert.equal(element.__data__.value, 1);
    });

    it('Sets attribute', async () => {
      const element = await basicFixture();
      element.value = 2;
      assert.equal(element.getAttribute('value'), '2');
    });

    it('Convents value to a number', async () => {
      const element = await basicFixture();
      // @ts-ignore
      element.value = '2';
      // @ts-ignore
      assert.equal(element.__data__.value, 2);
    });

    it('Sets 0 when not a number', async () => {
      const element = await basicFixture();
      // @ts-ignore
      element.value = 'test';
      // @ts-ignore
      assert.equal(element.__data__.value, 0);
    });

    it("Won't set attribute value when already set", async () => {
      const element = await selectedFixture();
      const spy = sinon.spy(element, 'setAttribute');
      element.value = 3;
      // @ts-ignore
      element.setAttribute.restore();
      assert.isFalse(spy.called);
    });

    it('Calls _render() when value change', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, '_render');
      element.value = 3;
      // @ts-ignore
      element._render.restore();
      assert.isTrue(spy.called);
    });

    it('Getter returns a value', async () => {
      const element = await selectedFixture();
      element.value = 2;
      assert.equal(element.value, 2);
    });

    it('Removes attribute when value is undefined', async () => {
      const element = await selectedFixture();
      element.value = undefined;
      assert.isFalse(element.hasAttribute('value'));
    });

    it('Removes attribute when value is null', async () => {
      const element = await selectedFixture();
      // @ts-ignore
      element.value = null;
      assert.isFalse(element.hasAttribute('value'));
    });
  });

  describe('readOnly setter/getter', () => {
    it('Attribute sets the property', async () => {
      const element = await readonlyFixture();
      await nextFrame();
      assert.isTrue(element.readOnly);
    });

    it('Getter returns default value', async () => {
      const element = await basicFixture();
      assert.isFalse(element.readOnly);
    });

    it('Setting the property set the attribute', async () => {
      const element = await basicFixture();
      element.readOnly = true;
      assert.isTrue(element.hasAttribute('readonly'));
    });

    it('False removes the attribute', async () => {
      const element = await readonlyFixture();
      element.readOnly = false;
      assert.isFalse(element.hasAttribute('readonly'));
    });

    it('Calls _render() when value change', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, '_render');
      // @ts-ignore
      element.readOnly = true;
      // @ts-ignore
      element._render.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('_render()', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    it('Sets __rendering', () => {
      element._render();
      // @ts-ignore
      assert.isTrue(element.__rendering);
    });

    it('Eventually calls _doRender()', (done) => {
      const spy = sinon.spy(element, '_doRender');
      element._render();
      setTimeout(() => {
        // @ts-ignore
        element._doRender.restore();
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Eventually resets __rendering', (done) => {
      element._render();
      setTimeout(() => {
        // @ts-ignore
        assert.isFalse(element.__rendering);
        done();
      });
    });
  });

  describe('createStar()', () => {
    let star: SVGElement;
    beforeEach(async () => {
      const element = await basicFixture();
      await aTimeout(0);
      star = element.shadowRoot!.querySelector('#container .star')!;
    });

    it('Returns svg element', () => {
      assert.equal(star.nodeName.toLowerCase(), 'svg');
    });

    it('Has viewBox attribute', () => {
      assert.equal(star.getAttribute('viewBox'), '0 0 24 24');
    });

    it('Has tabindex attribute', () => {
      assert.equal(star.getAttribute('tabindex'), '0');
    });
  });

  describe('_ensureStars()', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    // This function is called when the element is attached and later on it
    // won't be executed

    it('Stars are in the shadow DOM', () => {
      const stars = element.shadowRoot!.querySelectorAll('#container .star');
      assert.lengthOf(stars, 5);
    });

    it('Inserts stars only once', () => {
      element._ensureStars();
      const stars = element.shadowRoot!.querySelectorAll('#container .star');
      assert.lengthOf(stars, 5);
    });

    it('Star has class name', () => {
      const star = element.shadowRoot!.querySelector('#container .star')!;
      assert.isTrue(star.classList.contains('star'));
    });

    it('Star has data-index property', () => {
      const star = element.shadowRoot!.querySelector('#container .star') as SVGElement;
      assert.equal(star.dataset.index, '0');
    });
  });

  describe('_doRender()', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _ensureStars()', () => {
      const spy = sinon.spy(element, '_ensureStars');
      element._doRender();
      // @ts-ignore
      element._ensureStars.restore();
      assert.isTrue(spy.called);
    });

    it('Removes selected class', () => {
      element.value = 2;
      element._doRender();
      const stars = element.shadowRoot!.querySelectorAll('#container .star');
      assert.isFalse(stars[2].classList.contains('selected'));
    });

    it('Sets stars selected', () => {
      const stars = element.shadowRoot!.querySelectorAll(
        '#container .star.selected'
      );
      assert.lengthOf(stars, 3);
    });

    it('Updates tabindex', () => {
      element.readOnly = true;
      element._doRender();
      const star = element.shadowRoot!.querySelector('#container .star') as SVGElement;
      assert.equal(star.getAttribute('tabindex'), '-1');
    });
  });

  describe('_clickHandler()', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _selectionFromEvent()', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      element.click();
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it("Won't call _selectionFromEvent() when readOnly", () => {
      element.readOnly = true;
      const spy = sinon.spy(element, '_selectionFromEvent');
      element.click();
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it('star click changes value', () => {
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      click(star);
      assert.equal(element.value, 1);
    });

    it('dispatches the change event', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      click(star);
      assert.isTrue(spy.calledOnce);
    });
  });

  describe('_keydownHandler()', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _selectionFromEvent() for Space', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      const e = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(e);
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it('Calls _selectionFromEvent() for Enter', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      const e = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(e);
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it('ignores function call for other keys', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      const e = new KeyboardEvent('keydown', {
        key: 'S',
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(e);
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it("Won't call _selectionFromEvent() when readOnly", () => {
      element.readOnly = true;
      const spy = sinon.spy(element, '_selectionFromEvent');
      const e = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      });
      element.dispatchEvent(e);
      // @ts-ignore
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it('changes value', () => {
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      const e = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      });
      star.dispatchEvent(e);
      assert.equal(element.value, 1);
    });

    it('dispatches the change event', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      const e = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      });
      star.dispatchEvent(e);
      assert.isTrue(spy.calledOnce);
    });
  });

  describe('onchange', () => {
    let element: StarRatingElement;
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onchange);
      const f = () => {};
      element.onchange = f;
      assert.isTrue(element.onchange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onchange = f;
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      click(star);
      element.onchange = null;
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
      element.onchange = f1;
      element.onchange = f2;
      const star = element.shadowRoot!.querySelector('.star') as SVGElement;
      click(star);
      element.onchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('normal state', async () => {
      const element = await fixture(`<star-rating></star-rating>`);
      await aTimeout(0);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-toggle-field-name'],
      });
    });

    it('selected state', async () => {
      const element = await fixture(`<star-rating value="2"></star-rating>`);
      await aTimeout(0);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-toggle-field-name'],
      });
    });

    it('readOnly state', async () => {
      const element = await fixture(`<star-rating readOnly></star-rating>`);
      await aTimeout(0);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-toggle-field-name'],
      });
    });

    it('readOnly selected state', async () => {
      const element = await fixture(
        `<star-rating readOnly value="2"></star-rating>`
      );
      await aTimeout(0);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-toggle-field-name'],
      });
    });
  });
});

import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import {
  click,
  keyDownOn,
} from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../star-rating.js';

/** @typedef {import('../../index').StarRatingElement} StarRating */

describe('<star-rating>', () => {
  /**
   * @return {Promise<StarRating>} 
   */
  async function basicFixture() {
    return fixture(`<star-rating></star-rating>`);
  }

  /**
   * @return {Promise<StarRating>} 
   */
  async function selectedFixture() {
    return fixture(`<star-rating value="3"></star-rating>`);
  }

  /**
   * @return {Promise<StarRating>} 
   */
  async function readonlyFixture() {
    return fixture(`<star-rating readonly></star-rating>`);
  }

  describe('Constructor', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets __data__ property', () => {
      assert.typeOf(element.__data__, 'object');
    });

    it('Attaches shadow DOM', () => {
      assert.ok(element.shadowRoot.querySelector('#container'));
    });
  });

  describe('observedAttributes()', () => {
    ['readonly', 'value'].forEach((attr) => {
      it(`Observes ${attr}`, () => {
        const list = window.customElements.get('star-rating')
          .observedAttributes;
        assert.notEqual(list.indexOf(attr), -1);
      });
    });
  });

  describe('value setter/getter', () => {
    it('Sets value on __data__', async () => {
      const element = await basicFixture();
      element.value = 1;
      assert.equal(element.__data__.value, 1);
    });

    it('Sets attribute', async () => {
      const element = await basicFixture();
      element.value = 2;
      assert.equal(element.getAttribute('value'), '2');
    });

    it('Convents value to a number', async () => {
      const element = await basicFixture();
      element.value = '2';
      assert.equal(element.__data__.value, 2);
    });

    it('Sets 0 when not a number', async () => {
      const element = await basicFixture();
      element.value = 'test';
      assert.equal(element.__data__.value, 0);
    });

    it("Won't set attribute value when already set", async () => {
      const element = await selectedFixture();
      const spy = sinon.spy(element, 'setAttribute');
      element.value = 3;
      element.setAttribute.restore();
      assert.isFalse(spy.called);
    });

    it('Calls _render() when value change', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, '_render');
      element.value = 3;
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
      element.readOnly = true;
      element._render.restore();
      assert.isTrue(spy.called);
    });
  });

  describe('_render()', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    it('Sets __rendering', () => {
      element._render();
      assert.isTrue(element.__rendering);
    });

    it('Eventually calls _doRender()', (done) => {
      const spy = sinon.spy(element, '_doRender');
      element._render();
      setTimeout(() => {
        element._doRender.restore();
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Eventually resets __rendering', (done) => {
      element._render();
      setTimeout(() => {
        assert.isFalse(element.__rendering);
        done();
      });
    });
  });

  describe('createStar()', () => {
    let star;
    beforeEach(async () => {
      const element = await basicFixture();
      await aTimeout(0);
      star = element.shadowRoot.querySelector('#container .star');
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
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    // This function is called when the element is attached and later on it
    // won't be executed

    it('Stars are in the shadow DOM', () => {
      const stars = element.shadowRoot.querySelectorAll('#container .star');
      assert.lengthOf(stars, 5);
    });

    it('Inserts stars only once', () => {
      element._ensureStars();
      const stars = element.shadowRoot.querySelectorAll('#container .star');
      assert.lengthOf(stars, 5);
    });

    it('Star has class name', () => {
      const star = element.shadowRoot.querySelector('#container .star');
      assert.isTrue(star.classList.contains('star'));
    });

    it('Star has data-index property', () => {
      const star = element.shadowRoot.querySelector('#container .star');
      assert.equal(star.dataset.index, '0');
    });
  });

  describe('_doRender()', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _ensureStars()', () => {
      const spy = sinon.spy(element, '_ensureStars');
      element._doRender();
      element._ensureStars.restore();
      assert.isTrue(spy.called);
    });

    it('Removes selected class', () => {
      element.value = 2;
      element._doRender();
      const stars = element.shadowRoot.querySelectorAll('#container .star');
      assert.isFalse(stars[2].classList.contains('selected'));
    });

    it('Sets stars selected', () => {
      const stars = element.shadowRoot.querySelectorAll(
        '#container .star.selected'
      );
      assert.lengthOf(stars, 3);
    });

    it('Updates tabindex', () => {
      element.readOnly = true;
      element._doRender();
      const star = element.shadowRoot.querySelector('#container .star');
      assert.equal(star.getAttribute('tabindex'), '-1');
    });
  });

  describe('_clickHandler()', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _selectionFromEvent()', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      element.click();
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it("Won't call _selectionFromEvent() when readOnly", () => {
      element.readOnly = true;
      const spy = sinon.spy(element, '_selectionFromEvent');
      element.click();
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it('Star click changes value', () => {
      const star = element.shadowRoot.querySelector('.star');
      click(star);
      assert.equal(element.value, 1);
    });

    it('Dispatches value-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      const star = element.shadowRoot.querySelector('.star');
      click(star);
      assert.equal(spy.args[0][0].detail.value, 1);
    });
  });

  describe('_clickHandler()', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await selectedFixture();
      await aTimeout(0);
    });

    it('Calls _selectionFromEvent() for Space', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      keyDownOn(element, 32, '', ' ');
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it('Calls _selectionFromEvent() for Enter', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      keyDownOn(element, 13, '', 'Enter');
      element._selectionFromEvent.restore();
      assert.isTrue(spy.called);
    });

    it('ignores function call for other keys', () => {
      const spy = sinon.spy(element, '_selectionFromEvent');
      keyDownOn(element, 83, '', 'S');
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it("Won't call _selectionFromEvent() when readOnly", () => {
      element.readOnly = true;
      const spy = sinon.spy(element, '_selectionFromEvent');
      keyDownOn(element, 13, '', 'Enter');
      element._selectionFromEvent.restore();
      assert.isFalse(spy.called);
    });

    it('Changes value', () => {
      const star = element.shadowRoot.querySelector('.star');
      keyDownOn(star, 13, '', 'Enter');
      assert.equal(element.value, 1);
    });

    it('Dispatches value-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('value-changed', spy);
      const star = element.shadowRoot.querySelector('.star');
      keyDownOn(star, 13, '', 'Enter');
      assert.equal(spy.args[0][0].detail.value, 1);
    });
  });

  describe('onchange', () => {
    let element = /** @type StarRating */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      await aTimeout(0);
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onchange);
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
      const star = element.shadowRoot.querySelector('.star');
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
      const star = element.shadowRoot.querySelector('.star');
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

import { fixture, assert, aTimeout, nextFrame, html, oneEvent } from '@open-wc/testing';
import * as sinon from 'sinon';
import '../anypoint-button.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';

/** @typedef {import('..').AnypointButton} AnypointButton */

describe('<anypoint-button>', () => {
  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function basicFixture() {
    return fixture(html`<anypoint-button>Button</anypoint-button>`);
  }

  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function roleFixture() {
    return fixture(
      html`<anypoint-button role="link">Button</anypoint-button>`
    );
  }

  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function tabindexFixture() {
    return fixture(html`<anypoint-button tabindex="-1">Button</anypoint-button>`);
  }

  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function togglesFixture() {
    return fixture(html`<anypoint-button toggles>Button</anypoint-button>`);
  }

  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function noinkFixture() {
    return fixture(html`<anypoint-button noink>Button</anypoint-button>`);
  }

  /**
   * @returns {Promise<AnypointButton>} 
   */
  async function highEmphasisFixture() {
    return fixture(html`<anypoint-button emphasis="high">Button</anypoint-button>`);
  }

  describe('a11y', () => {
    it('Has role set', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'button');
    });

    it('Respects existing role', async () => {
      const element = await roleFixture();
      assert.equal(element.getAttribute('role'), 'link');
    });

    it('Has tabindex set', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('Respects existing tabindex', async () => {
      const element = await tabindexFixture();
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('is accessible in normal state', async () => {
      const element = await fixture(
        `<anypoint-button>Button</anypoint-button>`
      );
      await assert.isAccessible(element);
    });

    it('is accessible in disabled state', async () => {
      const element = await fixture(
        `<anypoint-button disabled>Button</anypoint-button>`
      );
      await assert.isAccessible(element);
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

  describe('High emphasis state', () => {
    let element;
    beforeEach(async () => {
      element = await highEmphasisFixture();
    });

    it('Has elevation default elevation', () => {
      assert.equal(element.elevation, 1);
    });

    it('Has elevation when toggles and active', async () => {
      element.toggles = true;
      element.active = true;
      await nextFrame();
      assert.equal(element.elevation, 2);
    });

    it('pressed and released', async () => {
      MockInteractions.down(element);
      await nextFrame();
      assert.equal(element.elevation, 3);
      MockInteractions.up(element);
      await nextFrame();
      assert.equal(element.elevation, 1);
    });
  });

  describe('Low emphasis state', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Has default elevation', () => {
      assert.equal(element.elevation, 0);
    });

    it('Has default emphasis', () => {
      assert.equal(element.emphasis, 'low');
    });
  });

  describe('A button with toggles', () => {
    let element;
    beforeEach(async () => {
      element = await togglesFixture();
      element.emphasis = 'high';
    });

    it('activated by click', done => {
      MockInteractions.downAndUp(element, () => {
        setTimeout(() => {
          try {
            assert.equal(element.elevation, 2);
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });

    it('receives focused', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      assert.equal(element.elevation, 1);
    });
  });

  describe('Ripple effect', () => {
    /** @type AnypointButton */
    let element;

    it('Ripple has noink set', async () => {
      element = await noinkFixture();
      MockInteractions.down(element);
      MockInteractions.up(element);
      const ripple = element.shadowRoot.querySelector('material-ripple');
      assert.isTrue(ripple.noink);
    });

    it('Resetting noink shows ripple', async () => {
      element = await noinkFixture();
      element.noink = false;
      await aTimeout(0);
      element.noink = true;
      const ripple = element.shadowRoot.querySelector('material-ripple');
      assert.isFalse(ripple.noink);
    });

    it('Space bar runs ripple', async () => {
      element = await highEmphasisFixture();
      MockInteractions.pressSpace(element);
      await aTimeout(40);
      const ripple = element.shadowRoot.querySelector('material-ripple');
      assert.ok(ripple);
    });

    it('dispatched transitionend event on ripple end', async () => {
      element = await basicFixture();
      MockInteractions.pressSpace(element);
      const e = /** @type TransitionEvent */ (/** @type unknown */ (await oneEvent(element, 'transitionend')));
      assert.isUndefined(e.propertyName);
    });
  });

  describe('_spaceKeyDownHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _calculateElevation() when changing value', () => {
      const spy = sinon.spy(element, '_calculateElevation');
      element._spaceKeyDownHandler(new CustomEvent('keydown'));
      assert.isTrue(spy.calledOnce, 'Function called');
    });

    it('Calls down() on ripple effect', () => {
      const spy = sinon.spy(element._ripple, 'down');
      element._spaceKeyDownHandler(new CustomEvent('keydown'));
      assert.isTrue(spy.calledOnce, 'Function called');
    });

    it("Won't call down() on ripple when animating", () => {
      element._spaceKeyDownHandler(new CustomEvent('keydown'));
      const spy = sinon.spy(element._ripple, 'down');
      element._spaceKeyDownHandler(new CustomEvent('keydown'));
      assert.isFalse(spy.called, 'Function called');
    });
  });

  describe('_spaceKeyUpHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _calculateElevation() when changing value', () => {
      const spy = sinon.spy(element, '_calculateElevation');
      element._spaceKeyUpHandler(new CustomEvent('keyup'));
      assert.isTrue(spy.calledOnce, 'Function called');
    });

    it('Calls up() on ripple effect', () => {
      const spy = sinon.spy(element._ripple, 'up');
      element._spaceKeyUpHandler(new CustomEvent('keyup'));
      assert.isTrue(spy.calledOnce, 'Function called');
    });
  });
});

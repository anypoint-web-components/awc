/* eslint-disable no-plusplus */
import { assert, fixture, html, nextFrame, oneEvent } from '@open-wc/testing';
import '../../material-ripple.js';

/** @typedef {import('../..').MaterialRippleElement} MaterialRippleElement */

describe('MaterialRippleElement', () => {
  /**
   * @returns {Promise<HTMLElement>} 
   */
  async function trivialRipple() {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple></material-ripple>
    </div>
    `);
  }
  /**
   * @returns {Promise<HTMLElement>} 
   */
  async function centeringRipple() {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple center></material-ripple>
    </div>
    `);
  }
  /**
   * @returns {Promise<HTMLElement>} 
   */
  async function recenteringRipple() {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple recenters></material-ripple>
    </div>
    `);
  }
  /**
   * @returns {Promise<HTMLElement>} 
   */
  async function noinkTarget() {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple noink></material-ripple>
    </div>
    `);
  }
  /**
   * @returns {Promise<HTMLElement>} 
   */
  async function noRipple() {
    return fixture(html`
    <div id="RippleContainer">
    </div>
    `);
  }

  /**
   * @param {HTMLElement} ripple
   * @param {number=} x
   * @param {number=} y
   */
  function downEvent(ripple, x, y) {
    const box = ripple.getBoundingClientRect();
    const e = new MouseEvent('mousedown', {
      cancelable: true,
      bubbles: true,
      composed: true,
      clientX: typeof x === 'number' ? x : box.left + box.width / 2,
      clientY: typeof y === 'number' ? y : box.top + box.height / 2,
      buttons: 1,
    });
    ripple.dispatchEvent(e);
  }

  /**
   * @param {HTMLElement} ripple
   */
  function upEvent(ripple) {
    const box = ripple.getBoundingClientRect();
    const e = new MouseEvent('mouseup', {
      cancelable: true,
      bubbles: true,
      composed: true,
      clientX: box.left + box.width / 2,
      clientY: box.top + box.height / 2,
      buttons: 1,
    });
    ripple.dispatchEvent(e);
  }

  describe('mouse down event', () => {
    /** @type HTMLElement */
    let container;
    /** @type MaterialRippleElement */
    let ripple;

    beforeEach(async () => {
      container = await trivialRipple();
      ripple = container.querySelector('material-ripple');
    });

    it('creates a ripple', () => {
      assert.lengthOf(ripple.ripples, 0, 'has no ripples initially');
      downEvent(ripple);
      assert.lengthOf(ripple.ripples, 1, 'has the ripple');
    });

    it('may create multiple ripples that overlap', () => {
      assert.lengthOf(ripple.ripples, 0, 'has no ripples initially');
      for (let i = 0; i < 3; ++i) {
        downEvent(ripple);
        assert.lengthOf(ripple.ripples, i + 1);
      }
    });
  });

  describe('#noink', () => {
    /** @type HTMLElement */
    let container;
    /** @type MaterialRippleElement */
    let ripple;

    beforeEach(async () => {
      container = await noinkTarget();
      ripple = container.querySelector('material-ripple');
    });

    it('does not create a ripple', () => {
      assert.lengthOf(ripple.ripples, 0, 'has no ripples initially');
      downEvent(ripple);
      assert.lengthOf(ripple.ripples, 0, 'has the ripple');
    });

    it('creates ripples manually', () => {
      assert.lengthOf(ripple.ripples, 0, 'has no ripples initially');
      ripple.simulatedRipple()
      assert.lengthOf(ripple.ripples, 1);
    });
  });

  describe('#center', () => {
    /** @type HTMLElement */
    let container;
    /** @type MaterialRippleElement */
    let ripple;

    beforeEach(async () => {
      container = await centeringRipple();
      ripple = container.querySelector('material-ripple');
    });

    it('centers the ripple', async () => {
      // let's ask the browser what `translate3d(0px, 0px, 0)` will actually
      // look like
      const div = document.createElement('div');
      div.style.webkitTransform = 'translate3d(0px, 0px, 0px)';
      div.style.transform = 'translate3d(0px, 0px, 0)';
      downEvent(ripple);
      const waveContainerElement = ripple.ripples[0].waveContainer;
      upEvent(ripple);
      
      await nextFrame();
      const currentTransform = waveContainerElement.style.transform;
      assert.ok(div.style.transform);
      assert.ok(currentTransform);
      assert.equal(currentTransform, div.style.transform);
    });
  });

  describe('#recenters', () => {
    /** @type HTMLElement */
    let container;
    /** @type MaterialRippleElement */
    let ripple;

    beforeEach(async () => {
      container = await recenteringRipple();
      ripple = container.querySelector('material-ripple');
    });

    it('gravitates towards the center', async () => {
      downEvent(ripple, 10, 10);
      const waveContainerElement = ripple.ripples[0].waveContainer;
      const waveTranslateString = waveContainerElement.style.transform;
      upEvent(ripple);
      
      await nextFrame();
      assert.ok(waveTranslateString);
      assert.ok(waveContainerElement.style.transform);
      assert.notEqual(waveContainerElement.style.transform, waveTranslateString);
    });
  });

  describe('removing a ripple', () => {
    /** @type HTMLElement */
    let container;

    beforeEach(async () => {
      container = await noRipple();
    });

    it('dispatches the transitionend event', async () => {
      const ripple = document.createElement('material-ripple');
      container.appendChild(ripple);
      await nextFrame();
      ripple.down();
      ripple.up();
      await oneEvent(ripple, 'transitionend');
      assert.ok(ripple.parentNode);
      container.removeChild(ripple);
    });

    it('re-uses the ripple', async () => {
      const ripple = document.createElement('material-ripple');
      container.appendChild(ripple);
      container.removeChild(ripple);

      container.appendChild(ripple);
      await nextFrame();
      ripple.down();
      ripple.up();
      await oneEvent(ripple, 'transitionend');
      assert.ok(ripple.parentNode);
      container.removeChild(ripple);
    });
  });

  describe('avoid double transitionend event', () => {
    /** @type HTMLElement */
    let container;

    beforeEach(async () => {
      container = await noRipple();
    });

    it('dispatches the transitionend event', (done) => {
      const ripple = document.createElement('material-ripple');
      let transitionedEventCount = 0;
      ripple.addEventListener('transitionend', () => {
        ++transitionedEventCount;
        assert.equal(transitionedEventCount, 1);
        container.removeChild(ripple);
        setTimeout(() => { done(); }, 1);
      });
      container.appendChild(ripple);
      window.requestAnimationFrame(() => {
        ripple.down();
        ripple.up();
      });
    });
  });
});

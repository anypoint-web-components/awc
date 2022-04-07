/* eslint-disable no-plusplus */
import { assert, fixture, html, nextFrame, oneEvent } from '@open-wc/testing';
import '../../src/define/material-ripple.js';
import { MaterialRippleElement } from '../../src/index.js';

describe('MaterialRippleElement', () => {
  async function trivialRipple(): Promise<HTMLElement> {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple></material-ripple>
    </div>
    `);
  }
  async function centeringRipple(): Promise<HTMLElement> {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple center></material-ripple>
    </div>
    `);
  }
  async function recenteringRipple(): Promise<HTMLElement> {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple recenters></material-ripple>
    </div>
    `);
  }
  async function noinkTarget(): Promise<HTMLElement> {
    return fixture(html`
    <div id="RippleContainer">
      <material-ripple noink></material-ripple>
    </div>
    `);
  }
  async function noRipple(): Promise<HTMLElement> {
    return fixture(html`
    <div id="RippleContainer">
    </div>
    `);
  }

  function downEvent(ripple: HTMLElement, x?: number, y?: number): void {
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

  function upEvent(ripple: HTMLElement): void {
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
    let container: HTMLElement;
    let ripple: MaterialRippleElement;

    beforeEach(async () => {
      container = await trivialRipple();
      ripple = container.querySelector('material-ripple')!;
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
    let container: HTMLElement;
    let ripple: MaterialRippleElement;

    beforeEach(async () => {
      container = await noinkTarget();
      ripple = container.querySelector('material-ripple')!;
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
    let container: HTMLElement;
    let ripple: MaterialRippleElement;

    beforeEach(async () => {
      container = await centeringRipple();
      ripple = container.querySelector('material-ripple')!;
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
    let container: HTMLElement;
    let ripple: MaterialRippleElement;

    beforeEach(async () => {
      container = await recenteringRipple();
      ripple = container.querySelector('material-ripple')!;
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
    let container: HTMLElement;

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
    let container: HTMLElement;

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

import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import '../../anypoint-progress.js';

/** @typedef {import('../../index').AnypointProgressElement} AnypointProgressElement */

describe('AnypointProgressElement', () => {
  /**
   * @return {Promise<AnypointProgressElement>} 
   */
  async function basicFixture() {
    return fixture(html`<anypoint-progress></anypoint-progress>`);
  }

  /**
   * @return {Promise<AnypointProgressElement>} 
   */
  async function transitingFixture() {
    return fixture(html`<anypoint-progress class="transiting"></anypoint-progress>`);
  }

  describe('basic', () => {
    /** @type AnypointProgressElement */
    let progress;
    beforeEach(async () => {
      progress = await basicFixture();
    });

    it('sets the default values', () => {
      assert.equal(progress.min, 0);
      assert.equal(progress.max, 100);
      assert.equal(progress.value, 0);
    });

    it('set the value', async () => {
      progress.value = 50;
      await nextFrame();
      assert.equal(progress.value, 50);
      // test clamp value
      progress.value = 60.1;
      await nextFrame();
      assert.equal(progress.value, 60);
    });

    it('set the max', async () => {
      progress.max = 10;
      progress.value = 11;
      await nextFrame();
      assert.equal(progress.value, progress.max);
    });

    it('sets the ratio', async () => {
      progress.max = 10;
      progress.value = 5;
      await nextFrame();
      assert.equal(progress.ratio, 50);
    });

    it('sets the secondary ratio', async () => {
      progress.max = 10;
      progress.secondaryProgress = 5;
      await nextFrame();
      assert.equal(progress.secondaryRatio, 50);
    });

    it('set the min', async () => {
      progress.min = 10
      progress.max = 50;
      progress.value = 30;
      await nextFrame();
      assert.equal(progress.ratio, 50);
      progress.value = 0;
      await nextFrame();
      assert.equal(progress.value, progress.min);
    });

    it('set the step', async () => {
      progress.min = 0;
      progress.max = 10;
      progress.value = 5.1;
      await nextFrame();
      assert.equal(progress.value, 5);
      progress.step = 0.1;
      progress.value = 5.1;
      await nextFrame();
      assert.equal(progress.value, 5.1);
    });

    it('has a "aria-valuenow" attribute when `indeterminate` is true.', () => {
      progress.min = 0;
      progress.max = 10;
      progress.value = 5.1;
      assert(progress.hasAttribute('aria-valuenow'));

      progress.indeterminate = true;
      assert(!progress.hasAttribute('aria-valuenow'));

      progress.indeterminate = false;
      assert(progress.hasAttribute('aria-valuenow'));
    });
  });

  describe('transiting class', () => {
    /** @type AnypointProgressElement */
    let progress;
    beforeEach(async () => {
      progress = await transitingFixture();
    });

    it('progress bars', () => {
      const primary = progress.shadowRoot.querySelector('#primaryProgress');
      const secondary = progress.shadowRoot.querySelector('#secondaryProgress');
      const stylesForPrimaryProgress = window.getComputedStyle(primary);
      const stylesForSecondaryProgress = window.getComputedStyle(secondary);
      let transitionProp = stylesForPrimaryProgress['transition-property'];

      assert.isTrue(transitionProp === 'transform' || transitionProp === '-webkit-transform');
      assert.equal(stylesForPrimaryProgress['transition-duration'], '0.08s');

      transitionProp = stylesForSecondaryProgress['transition-property'];

      assert.isTrue(transitionProp === 'transform' ||transitionProp === '-webkit-transform');
      assert.equal(stylesForSecondaryProgress['transition-duration'], '0.08s');
    });
  });
});
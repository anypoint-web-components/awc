import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import '../../src/define/anypoint-progress.js';
import { AnypointProgressElement } from '../../src/index.js';

describe('AnypointProgressElement', () => {
  async function basicFixture(): Promise<AnypointProgressElement> {
    return fixture(html`<anypoint-progress></anypoint-progress>`);
  }

  async function transitingFixture(): Promise<AnypointProgressElement> {
    return fixture(html`<anypoint-progress class="transiting"></anypoint-progress>`);
  }

  describe('basic', () => {
    let progress: AnypointProgressElement;
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

    it('has a "aria-valuenow" attribute when `indeterminate` is true.', async () => {
      progress.min = 0;
      progress.max = 10;
      progress.value = 5.1;
      await nextFrame();
      assert(progress.hasAttribute('aria-valuenow'));

      progress.indeterminate = true;
      await nextFrame();
      assert(!progress.hasAttribute('aria-valuenow'));

      progress.indeterminate = false;
      await nextFrame();
      assert(progress.hasAttribute('aria-valuenow'));
    });
  });

  describe('transiting class', () => {
    let progress: AnypointProgressElement;
    beforeEach(async () => {
      progress = await transitingFixture();
    });

    it('progress bars', () => {
      const primary = progress.shadowRoot!.querySelector('#primaryProgress') as HTMLElement;
      const secondary = progress.shadowRoot!.querySelector('#secondaryProgress') as HTMLElement;
      const stylesForPrimaryProgress = window.getComputedStyle(primary);
      const stylesForSecondaryProgress = window.getComputedStyle(secondary);
      // @ts-ignore
      let transitionProp = stylesForPrimaryProgress['transition-property'] as string;
      
      assert.isTrue(transitionProp === 'transform' || transitionProp === '-webkit-transform');
      // @ts-ignore
      assert.equal(stylesForPrimaryProgress['transition-duration'], '0.08s');
      
      // @ts-ignore
      transitionProp = stylesForSecondaryProgress['transition-property'];
      
      assert.isTrue(transitionProp === 'transform' || transitionProp === '-webkit-transform');
      // @ts-ignore
      assert.equal(stylesForSecondaryProgress['transition-duration'], '0.08s');
    });
  });
});

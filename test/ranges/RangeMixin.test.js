import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import './test-progress.js';

/** @typedef {import('./test-progress').TestProgress} TestProgress */

describe('RangeMixin', () => {
  /**
   * @return {Promise<TestProgress>}
   */
  async function basicFixture() {
    return fixture(html`<test-progress></test-progress>`);
  }

  /** @type {TestProgress} */
  let progress;
  beforeEach(async () => {
    progress = await basicFixture();
  });

  it('sets default values', () => {
    assert.equal(progress.min, 0);
    assert.equal(progress.max, 100);
    assert.equal(progress.value, 0);
  });

  it('sets the value', async () => {
    progress.value = 50;
    await nextFrame();
    assert.equal(progress.value, 50);
    // test clamp value
    progress.value = 60.1;
    await nextFrame();
    assert.equal(progress.value, 60);
  });

  it('sets the max', async () => {
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

  it('sets the min', async () => {
    progress.min = 10
    progress.max = 50;
    progress.value = 30;
    await nextFrame();
    assert.equal(progress.ratio, 50);
    progress.value = 0;
    await nextFrame();
    assert.equal(progress.value, progress.min);
  });

  it('sets the step', async () => {
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

  it('sets a large step', async () => {
    progress.min = 0;
    progress.max = 2625;
    progress.step = 875;
    progress.value = 875;
    await nextFrame();
    assert.equal(progress.value, 875);
  });
  
  it('sets the step with min', async () => {
    progress.min = -0.9;
    progress.max = 1.1;
    progress.step = 0.5;
    progress.value = -0.5;
    await nextFrame();
    assert.equal(progress.value, -0.4);
    progress.value = 0.7;
    await nextFrame();
    assert.equal(progress.value, 0.6);
  });

  it('respects odd values', async () => {
    progress.min = 1;
    progress.max = 7;
    progress.step = 2;
    progress.value = 3;
    await nextFrame();
    assert.equal(progress.value, 3);

    progress.value += progress.step;
    await nextFrame();
    assert.equal(progress.value, 5);

    progress.value += progress.step;
    await nextFrame();
    assert.equal(progress.value, 7);
  });

  it('rounds up negative values', async () => {
    progress.min = -10;
    progress.max = 10;
    progress.step = 0.1;
    progress.value = -8.4252;
    await nextFrame();
    assert.equal(progress.value, -8.4);
  });

  it('round up positive values', async () => {
    progress.min = 10;
    progress.max = 100;
    progress.step = 0.25;
    progress.value = 19.34567;
    await nextFrame();
    assert.equal(progress.value, 19.25);
  });
});

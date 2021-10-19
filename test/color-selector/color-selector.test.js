import { html, fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import '../../color-selector.js';

/** @typedef {import('../../index').ColorSelectorElement} ColorSelectorElement */

describe('ColorSelectorElement', () => {
  /**
   * @param {string=} value
   * @return {Promise<ColorSelectorElement>}
   */
  async function basicFixture(value) {
    return fixture(html`<color-selector .value="${value}"></color-selector>`);
  }

  describe('basic', () => {
    it('has a default color set on the input', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('input');
      assert.equal(input.value, '#ffffff');
    });

    it('has a default color set on the color box', async () => {
      const el = await basicFixture();
      const box = /** @type HTMLDivElement */ (el.shadowRoot.querySelector('.box'));
      const control = document.createElement('div');
      control.style.backgroundColor = '#ffffff';
      assert.equal(box.style.backgroundColor, control.style.backgroundColor);
    });

    it('has a set color set on the input', async () => {
      const el = await basicFixture('#e5e5e5');
      const input = el.shadowRoot.querySelector('input');
      assert.equal(input.value, '#e5e5e5');
    });

    it('has a set color set on the color box', async () => {
      const el = await basicFixture('red');
      const box = /** @type HTMLDivElement */ (el.shadowRoot.querySelector('.box'));
      const control = document.createElement('div');
      control.style.backgroundColor = 'red';
      assert.equal(box.style.backgroundColor, control.style.backgroundColor);
    });

    it('notifies a color change', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('input');
      const spy = sinon.spy();
      el.addEventListener('change', spy);
      input.value = '#e5e5e5';
      input.dispatchEvent(new CustomEvent('change'));
      assert.isTrue(spy.calledOnce);
    });

    it('sets changed color as value', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('input');
      input.value = '#e5e5e5';
      input.dispatchEvent(new CustomEvent('change'));
      assert.equal(el.value, input.value);
    });
  });

  describe('a11y', () => {
    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element, {
        // ignoredRules: ['color-contrast']
      });
    });
  });
});

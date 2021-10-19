import { html, fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import '../../color-input-selector.js';

/** @typedef {import('../../index').ColorInputSelectorElement} ColorInputSelectorElement */

describe('ColorInputSelectorElement', () => {
  /**
   * @param {string=} value
   * @param {boolean=} enabled
   * @return {Promise<ColorInputSelectorElement>}
   */
  async function basicFixture(value, enabled) {
    return fixture(html`<color-input-selector .value="${value}" ?enabled="${enabled}">Select a color</color-input-selector>`);
  }

  describe('basic', () => {
    it('renders unselected checkbox', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('anypoint-checkbox');
      assert.isFalse(input.checked);
    });

    it('selects the checkbox from passed value', async () => {
      const el = await basicFixture('#000', true);
      const input = el.shadowRoot.querySelector('anypoint-checkbox');
      assert.isTrue(input.checked);
    });

    it('renders color selector', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('color-selector');
      assert.ok(input);
    });

    it('sets color from the value', async () => {
      const el = await basicFixture('#000');
      const input = el.shadowRoot.querySelector('color-selector');
      assert.equal(input.value, '#000');
    });

    it('renders the label', async () => {
      const el = await basicFixture();
      const span = el.shadowRoot.querySelector('.checkbox-label');
      assert.ok(span, 'has the label container');
      const slot = span.querySelector('slot');
      const elms = slot.assignedNodes();
      assert.equal(elms[0].textContent, 'Select a color');
    });

    it('notifies enabled state change', async () => {
      const el = await basicFixture();
      const input = el.shadowRoot.querySelector('anypoint-checkbox');
      const spy = sinon.spy();
      el.addEventListener('change', spy);
      input.checked = true;
      input.dispatchEvent(new Event('change'));
      assert.isTrue(spy.calledOnce);
    });

    it('sets enabled when clicking on the label', async () => {
      const el = await basicFixture();
      const span = el.shadowRoot.querySelector('span');
      const spy = sinon.spy();
      el.addEventListener('change', spy);
      span.click();
      assert.isTrue(spy.calledOnce);
    });

    it('sets not enabled when clicking on the label', async () => {
      const el = await basicFixture('#000', true);
      const span = el.shadowRoot.querySelector('span');
      const spy = sinon.spy();
      el.addEventListener('change', spy);
      span.click();
      assert.isTrue(spy.calledOnce);
    });

    it('notifies color change', async () => {
      const el = await basicFixture('#000');
      const input = el.shadowRoot.querySelector('color-selector');
      const spy = sinon.spy();
      el.addEventListener('change', spy);
      input.value = '#e5e5e5';
      input.dispatchEvent(new CustomEvent('change'));
      assert.isTrue(spy.calledOnce);
    });

    it('enables the input when color is selected', async () => {
      const el = await basicFixture('', false);
      const input = el.shadowRoot.querySelector('color-selector');
      input.value = '#e5e5e5';
      input.dispatchEvent(new CustomEvent('change'));
      assert.isTrue(el.enabled);
    });

    it('does not disabled the input when color is selected', async () => {
      const el = await basicFixture('', true);
      const input = el.shadowRoot.querySelector('color-selector');
      input.value = '#e5e5e5';
      input.dispatchEvent(new CustomEvent('change'));
      assert.isTrue(el.enabled);
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

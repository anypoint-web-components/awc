import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import './hoverable-test-element.js';
import './hoverable-test-native.js';

/** @typedef {import('./hoverable-test-element').HoverableTestElement} HoverableTestElement */
/** @typedef {import('./hoverable-test-native').HoverableTestNative} HoverableTestNative */

describe('HoverableMixin', () => {
  /**
   * @returns {Promise<HoverableTestElement>}
   */
  async function hoverableFixture() {
    return fixture(`<hoverable-test-element></hoverable-test-element>`);
  }

  /**
   * @returns {Promise<HoverableTestElement>}
   */
  async function hoverableChildFixture() {
    return fixture(`<hoverable-test-element><input/></hoverable-test-element>`);
  }

  /**
   * @returns {Promise<HoverableTestNative>}
   */
  async function nativeFixture() {
    return fixture(`<hoverable-test-native></hoverable-test-native>`);
  }

  describe('Setters and getters', () => {
    it('Hovered if false by default', async () => {
      const element = await hoverableFixture();
      assert.isFalse(element.hovered);
    });

    it('_hovered if false by default', async () => {
      const element = await hoverableFixture();
      assert.isFalse(element._hovered);
    });

    it('Calls requestUpdate() on LitElement', async () => {
      const element = await hoverableFixture();
      const spy = sinon.spy(element, 'requestUpdate');
      element._hovered = true;
      assert.isTrue(spy.called);
    });

    it('Ignores requestUpdate() on native element', async () => {
      const element = await nativeFixture();
      element._hovered = true;
      // no error
    });

    it('Ignores _hoverable setter when no change', async () => {
      const element = await hoverableFixture();
      element._hovered = true;
      const spy = sinon.spy(element, 'requestUpdate');
      element._hovered = true;
      assert.isFalse(spy.called);
    });

    it('dispatches the hoverchange event', async () => {
      const element = await hoverableFixture();
      const spy = sinon.spy();
      element.addEventListener('hoverchange', spy);
      element._hovered = true;
      assert.isTrue(spy.args[0][0].detail.value);
    });
  });

  describe('Entering hover state', () => {
    it('Adds hover state when mouseover event detected - LitElement', async () => {
      const element = await hoverableFixture();
      element.dispatchEvent(new CustomEvent('mouseover'));
      assert.isTrue(element.hovered);
    });

    it('Adds hover state when mouseover event detected - Native element', async () => {
      const element = await nativeFixture();
      element.dispatchEvent(new CustomEvent('mouseover'));
      assert.isTrue(element.hovered);
    });

    it('Adds hovered attribute', async () => {
      const element = await hoverableFixture();
      element.dispatchEvent(new CustomEvent('mouseover'));
      await nextFrame();
      assert.isTrue(element.hasAttribute('hovered'));
    });

    it('Handles light DOM hover', async () => {
      const element = await hoverableChildFixture();
      const input = element.querySelector('input');
      input.dispatchEvent(
        new CustomEvent('mouseover', {
          // mouseover event bubbles per spec
          bubbles: true,
        })
      );
      assert.isTrue(element.hovered);
    });
  });

  describe('Leaving hover state', () => {
    it('Removes hover state when mouseleave event detected - LitElement', async () => {
      const element = await hoverableFixture();
      element._hovered = true;
      element.dispatchEvent(new CustomEvent('mouseleave'));
      assert.isFalse(element.hovered);
    });

    it('Removes hover state when mouseleave event detected - Native element', async () => {
      const element = await nativeFixture();
      element._hovered = true;
      element.dispatchEvent(new CustomEvent('mouseleave'));
      assert.isFalse(element.hovered);
    });

    it('Adds hovered attribute', async () => {
      const element = await hoverableFixture();
      element._hovered = true;
      element.dispatchEvent(new CustomEvent('mouseleave'));
      await nextFrame();
      assert.isFalse(element.hasAttribute('hovered'));
    });

    it('Handles light DOM mouseleave', async () => {
      const element = await hoverableChildFixture();
      element._hovered = true;
      const input = element.querySelector('input');
      input.dispatchEvent(
        new CustomEvent('mouseleave', {
          // mouseover event bubbles per spec
          bubbles: true,
        })
      );
      assert.isFalse(element.hovered);
    });
  });
});

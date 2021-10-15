import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import { ButtonStateMixin } from '../button-state-mixin.js';

class TestButtonElement extends ButtonStateMixin(HTMLElement) {}
window.customElements.define('test-button-element', TestButtonElement);

describe('ButtonStateMixin', () => {
  async function basicFixture() {
    return fixture(`<test-button-element></test-button-element>`);
  }

  describe('_setChanged()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets private proeprty', () => {
      element._setChanged('a', 'b');
      assert.equal(element._a, 'b');
    });

    it('calls requestUpdate when available', () => {
      let called = false;
      element.requestUpdate = () => {
        called = true;
      };
      element._setChanged('a', 'b');
      assert.isTrue(called);
    });

    it('ignores requestUpdate property is already set', () => {
      let called = false;
      element.requestUpdate = () => {
        called = true;
      };
      element._a = 'b';
      element._setChanged('a', 'b');
      assert.isFalse(called);
    });
  });

  describe('#pressed', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has default value', () => {
      assert.isFalse(element.pressed);
    });

    it('has no setter', () => {
      assert.throws(() => {
        element.pressed = true;
      });
    });

    it('calls _pressedChanged()', () => {
      const spy = sinon.spy(element, '_pressedChanged');
      element._pressed = true;
      assert.isTrue(spy.calledOnce);
    });

    it('ignores private setter when value is already set', () => {
      element._pressed = true;
      const spy = sinon.spy(element, '_pressedChanged');
      element._pressed = true;
      assert.isFalse(spy.called);
    });

    it('dispatches pressed-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('pressed-changed', spy);
      element._pressed = true;
      assert.isTrue(spy.calledOnce);
    });
  });

  describe('#active', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has default value', () => {
      assert.isFalse(element.active);
    });

    it('calls _activeChanged()', () => {
      const spy = sinon.spy(element, '_activeChanged');
      element.active = true;
      assert.isTrue(spy.calledOnce);
    });

    it('ignores private setter when value is already set', () => {
      element.active = true;
      const spy = sinon.spy(element, '_activeChanged');
      element.active = true;
      assert.isFalse(spy.called);
    });

    it('dispatches active-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('active-changed', spy);
      element.active = true;
      assert.isTrue(spy.calledOnce);
    });
  });
});

import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement } from 'lit'
import { ButtonStateMixin } from '../../index.js';

class TestButtonElement extends ButtonStateMixin(LitElement) {

}
window.customElements.define('test-button-element', TestButtonElement);

describe('ButtonStateMixin', () => {
  async function basicFixture(): Promise<TestButtonElement> {
    return fixture(`<test-button-element></test-button-element>`);
  }

  describe('#pressed', () => {
    let element: TestButtonElement;
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

    it('dispatches pressedchange event', () => {
      const spy = sinon.spy();
      element.addEventListener('pressedchange', spy);
      element._pressed = true;
      assert.isTrue(spy.calledOnce);
    });
  });

  describe('#active', () => {
    let element: TestButtonElement;
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

    it('dispatches activechange event', () => {
      const spy = sinon.spy();
      element.addEventListener('activechange', spy);
      element.active = true;
      assert.isTrue(spy.calledOnce);
    });
  });
});

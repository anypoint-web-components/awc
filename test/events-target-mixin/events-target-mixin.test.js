import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import './test-element.js';
import './native-element.js';
import { EventableObject } from './eventable-object.js';

describe('EventsTargetMixin', () => {
  async function basicFixture() {
    return fixture(`<eventable-element></eventable-element>`);
  }

  async function nativeFixture() {
    return fixture(`<eventable-native-element></eventable-native-element>`);
  }

  function fire(type, bubbles, node) {
    const event = new CustomEvent(type, {
      cancelable: true,
      bubbles,
      composed: true,
    });
    (node || document.body).dispatchEvent(event);
    return event;
  }

  describe('Listens on default', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Receives an event from bubbling', () => {
      fire('test-event', true);
      assert.isTrue(element.calledOnce);
    });

    it('Do not receives an event from parent', () => {
      fire('test-event', false, document.body.parentElement);
      assert.isFalse(element.calledOnce);
    });
  });

  describe('Changes event listener', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Receives on body', () => {
      element.eventsTarget = document.body;
      fire('test-event', false, document.body);
      assert.isTrue(element.calledOnce);
    });

    it('Do not receives on parent', () => {
      element.eventsTarget = window;
      fire('test-event', false, document.body);
      assert.isFalse(element.called);
    });

    it('Reseives on self', () => {
      element.eventsTarget = element;
      fire('test-event', false, element);
      assert.isTrue(element.calledOnce);
    });

    it('ignores changes to the same node', () => {
      element.eventsTarget = element;
      const spy = sinon.spy(element, '_eventsTargetChanged');
      element.eventsTarget = element;
      assert.isFalse(spy.called);
    });
  });

  describe('Native WC', () => {
    let element;
    beforeEach(async () => {
      element = await nativeFixture();
    });

    it('Receives on default target', () => {
      fire('test-event', true);
      assert.isTrue(element.calledOnce);
    });

    it('Receives on body', () => {
      element.eventsTarget = document.body;
      fire('test-event', false, document.body);
      assert.isTrue(element.calledOnce);
    });

    it('Removes event listener on detached', () => {
      element.parentNode.removeChild(element);
      fire('test-event', true);
      assert.isFalse(element.called);
    });
  });

  describe('non-element instance', () => {
    it('sets default old events target', () => {
      const instance = new EventableObject();
      // @ts-ignore
      assert.ok(instance._oldEventsTarget);
    });

    it('calls _detachListeners when manually calling detached', () => {
      const instance = new EventableObject();
      const spy = sinon.spy(instance, '_detachListeners');
      // @ts-ignore
      instance.disconnectedCallback();
      assert.isTrue(spy.called);
    });

    it('calls _detachListeners when changing the target', () => {
      const instance = new EventableObject();
      const spy = sinon.spy(instance, '_detachListeners');
      instance.eventsTarget = document.body;
      assert.isTrue(spy.called);
    });

    it('calls _attachListeners when changing the target', () => {
      const instance = new EventableObject();
      const spy = sinon.spy(instance, '_attachListeners');
      instance.eventsTarget = document.body;
      assert.isTrue(spy.called);
    });

    it('passes constructor arguments', () => {
      const instance = new EventableObject('a', 'b');
      assert.equal(instance.value1, 'a');
      assert.equal(instance.value2, 'b');
    });
  });
});

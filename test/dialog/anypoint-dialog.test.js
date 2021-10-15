import { fixture, aTimeout, assert, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import sinon from 'sinon';
import '../../anypoint-button.js';
import '../../anypoint-dialog.js';

/** @typedef {import('../../').AnypointDialogElement} AnypointDialog */

describe('<anypoint-dialog>', () => {
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function basicFixture() {
    return (fixture(html`<anypoint-dialog>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function modalFixture() {
    return (fixture(html`
      <anypoint-dialog modal>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function modalEqualFixture() {
    return (fixture(html`
      <anypoint-dialog noCancelOnEscKey noCancelOnOutsideClick withBackdrop>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function untilOpened(element) {
    return new Promise((resolve) => {
      element.addEventListener('overlay-opened', resolve);
      element.open();
    });
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function openedFixture() {
    const element = /** @type AnypointDialog */ (await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <button extra>extra</button>
          <button dialog-dismiss>dismiss</button>
          <button dialog-confirm>confirm</button>
        </div>
      </anypoint-dialog>`));
    await untilOpened(element);
    return element;
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function openedCustomButtonFixture() {
    const element = /** @type AnypointDialog */ (await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <anypoint-button extra>extra</anypoint-button>
          <anypoint-button dialog-dismiss>dismiss</anypoint-button>
          <anypoint-button dialog-confirm>confirm</anypoint-button>
        </div>
      </anypoint-dialog>`));
    await untilOpened(element);
    return element;
  }
  /**
   * @returns {Promise<AnypointDialog>}
   */
  async function openedDataAttributeFixture() {
    const element = /** @type AnypointDialog */ (await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <anypoint-button extra>extra</anypoint-button>
          <anypoint-button data-dialog-dismiss>dismiss</anypoint-button>
          <anypoint-button data-dialog-confirm>confirm</anypoint-button>
        </div>
      </anypoint-dialog>`));
    await untilOpened(element);
    return element;
  }
  /**
   * @returns {Promise<(AnypointDialog)[]>}
   */
  async function openedNestedFixture() {
    const element = /** @type AnypointDialog */ (await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <button dialog-dismiss>dismiss</button>
          <button dialog-confirm>confirm</button>
        </div>
        <anypoint-dialog>
          <p>Dialog</p>
          <div class="buttons">
            <button dialog-dismiss>dismiss</button>
            <button dialog-confirm>confirm</button>
          </div>
        </anypoint-dialog>
      </anypoint-dialog>`));
    await untilOpened(element);
    const nested = element.querySelector('anypoint-dialog');
    await untilOpened(nested);
    return [element, nested];
  }

  describe('Click event', () => {
    it('does not close the overlay when clicking on a dialog', async () => {
      const element = await openedFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      MockInteractions.tap(element);
      await aTimeout(100);
      assert.isFalse(spy.called);
    });

    it('closes the dialog on dialog-dismiss click', async () => {
      const element = await openedFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-dismiss]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on dialog-dismiss click when custom element', async () => {
      const element = await openedCustomButtonFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-dismiss]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on data-dialog-dismiss click', async () => {
      const element = await openedDataAttributeFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[data-dialog-dismiss]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on dialog-confirm click', async () => {
      const element = await openedFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-confirm]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the dialog on dialog-confirm click when custom element', async () => {
      const element = await openedCustomButtonFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-confirm]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the dialog on data-dialog-confirm click', async () => {
      const element = await openedDataAttributeFixture();
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[data-dialog-confirm]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const {detail} = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the parent dialog only', async () => {
      const [element, nested] = await openedNestedFixture();
      const button = nested.querySelector('[dialog-confirm]');
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isFalse(nested.opened, 'nested dialog is closed');
      assert.isTrue(element.opened, 'outer dialog is opened');
    });
  });

  ['noCancelOnEscKey', 'noCancelOnOutsideClick', 'withBackdrop']
  .forEach((property) => {
    describe(property, () => {
      it(`sets ${property} to true when modal`, async () => {
        const element = await modalFixture();
        assert.isTrue(element[property], property);
      });

      it(`keeps current value of ${property} when modal toggling`, async () => {
        const element = await modalFixture();
        element[property] = false;
        element.modal = false;
        assert.isFalse(element[property], `${property} is false`);
      });

      it(`keeps previous value of ${property} when toggling modal`, async () => {
        const element = await basicFixture();
        element[property] = true;
        element.modal = true;
        element.modal = false;
        assert.isTrue(element[property], `${property} is still true`);
      });

      it(`keeps attribute ${property} value when toggling modal`, async () => {
        const dialog = await modalEqualFixture();
        assert.isTrue(dialog[property], `${property} is true`);
      });
    });
  });

  describe('resize event', () => {
    /** @type AnypointDialog */
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls refit when a child resize', () => {
      const spy = sinon.spy(element, 'refit');
      element.firstElementChild.dispatchEvent(new Event('resize', { bubbles: true }));
      assert.isTrue(spy.called);
    });
  });

  describe('a11y', () => {
    it('is accessible when default', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when modal', async () => {
      const element = await modalFixture();
      await assert.isAccessible(element);
    });
  });
});

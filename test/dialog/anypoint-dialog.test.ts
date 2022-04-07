import { fixture, aTimeout, assert, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import sinon from 'sinon';
import '../../src/define/anypoint-button.js';
import '../../src/define/anypoint-dialog.js';
import { AnypointDialogElement } from '../../src/index.js';

describe('<anypoint-dialog>', () => {
  async function basicFixture(): Promise<AnypointDialogElement> {
    return (fixture(html`<anypoint-dialog>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  async function modalFixture(): Promise<AnypointDialogElement> {
    return (fixture(html`
      <anypoint-dialog modal>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  async function modalEqualFixture(): Promise<AnypointDialogElement> {
    return (fixture(html`
      <anypoint-dialog noCancelOnEscKey noCancelOnOutsideClick withBackdrop>
        <p>Dialog</p>
      </anypoint-dialog>`));
  }
  async function untilOpened(element: AnypointDialogElement): Promise<void> {
    return new Promise((resolve) => {
      element.addEventListener('opened', () => resolve());
      element.open();
    });
  }
  async function openedFixture(): Promise<AnypointDialogElement> {
    const element = await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <button extra>extra</button>
          <button dialog-dismiss>dismiss</button>
          <button dialog-confirm>confirm</button>
        </div>
      </anypoint-dialog>`) as AnypointDialogElement;
    await untilOpened(element);
    return element;
  }
  async function openedCustomButtonFixture(): Promise<AnypointDialogElement> {
    const element = await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <anypoint-button extra>extra</anypoint-button>
          <anypoint-button dialog-dismiss>dismiss</anypoint-button>
          <anypoint-button dialog-confirm>confirm</anypoint-button>
        </div>
      </anypoint-dialog>`) as AnypointDialogElement;
    await untilOpened(element);
    return element;
  }
  async function openedDataAttributeFixture(): Promise<AnypointDialogElement> {
    const element = await fixture(`
      <anypoint-dialog>
        <p>Dialog</p>
        <div class="buttons">
          <anypoint-button extra>extra</anypoint-button>
          <anypoint-button data-dialog-dismiss>dismiss</anypoint-button>
          <anypoint-button data-dialog-confirm>confirm</anypoint-button>
        </div>
      </anypoint-dialog>`) as AnypointDialogElement;
    await untilOpened(element);
    return element;
  }
  async function openedNestedFixture(): Promise<AnypointDialogElement[]> {
    const element = await fixture(`
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
      </anypoint-dialog>`) as AnypointDialogElement;
    await untilOpened(element);
    const nested = element.querySelector('anypoint-dialog')!;
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
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-dismiss]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on dialog-dismiss click when custom element', async () => {
      const element = await openedCustomButtonFixture();
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-dismiss]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on data-dialog-dismiss click', async () => {
      const element = await openedDataAttributeFixture();
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[data-dialog-dismiss]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isFalse(detail.confirmed, 'dialog is not confirmed');
    });

    it('closes the dialog on dialog-confirm click', async () => {
      const element = await openedFixture();
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-confirm]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the dialog on dialog-confirm click when custom element', async () => {
      const element = await openedCustomButtonFixture();
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[dialog-confirm]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the dialog on data-dialog-confirm click', async () => {
      const element = await openedDataAttributeFixture();
      element.noAnimations = true;
      const spy = sinon.spy();
      element.addEventListener('overlay-closed', spy);
      const button = element.querySelector('[data-dialog-confirm]')!;
      MockInteractions.tap(button);
      await aTimeout(100);
      assert.isTrue(spy.called, 'event is called');
      const { detail } = spy.args[0][0];
      assert.isFalse(detail.canceled, 'dialog is not canceled');
      assert.isTrue(detail.confirmed, 'dialog is confirmed');
    });

    it('closes the parent dialog only', async () => {
      const [element, nested] = await openedNestedFixture();
      element.noAnimations = true;
      nested.noAnimations = true;
      const button = nested.querySelector('[dialog-confirm]')!;
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
        // @ts-ignore
        assert.isTrue(element[property], property);
      });

      it(`keeps current value of ${property} when modal toggling`, async () => {
        const element = await modalFixture();
        // @ts-ignore
        element[property] = false;
        element.modal = false;
        // @ts-ignore
        assert.isFalse(element[property], `${property} is false`);
      });

      it(`keeps previous value of ${property} when toggling modal`, async () => {
        const element = await basicFixture();
        // @ts-ignore
        element[property] = true;
        element.modal = true;
        element.modal = false;
        // @ts-ignore
        assert.isTrue(element[property], `${property} is still true`);
      });

      it(`keeps attribute ${property} value when toggling modal`, async () => {
        const dialog = await modalEqualFixture();
        // @ts-ignore
        assert.isTrue(dialog[property], `${property} is true`);
      });
    });
  });

  describe('resize event', () => {
    let element: AnypointDialogElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls refit when a child resize', () => {
      const spy = sinon.spy(element, 'refit');
      element.firstElementChild!.dispatchEvent(new Event('resize', { bubbles: true }));
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

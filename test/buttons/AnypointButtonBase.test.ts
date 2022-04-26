import { assert, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import { AnypointButtonBase } from '../../src/elements/AnypointButtonBase.js';

class TestButton extends AnypointButtonBase {
  render(): any {
    return html`<slot></slot>`;
  }
}
window.customElements.define('anypoint-button-base', TestButton);

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-button-base": TestButton
  }
}

describe('AnypointButtonBase', () => {
  async function basicFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base>Button</anypoint-button-base>`);
  }

  async function mediumFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="medium">Button</anypoint-button-base>`);
  }

  async function highFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="high">Button</anypoint-button-base>`);
  }

  async function activeHighFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="high" toggles active>Button</anypoint-button-base>`);
  }

  async function anypointFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="high" anypoint>Button</anypoint-button-base>`);
  }

  async function flatFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="high" flat>Button</anypoint-button-base>`);
  }

  async function disabledFixture(): Promise<TestButton> {
    return fixture(html`<anypoint-button-base emphasis="high" disabled>Button</anypoint-button-base>`);
  }

  describe('constructor()', () => {
    it('sets the default emphasis value', () => {
      const base = new TestButton();
      assert.equal(base.emphasis, 'low');
    });
  });

  describe('emphasis computation', () => {
    it('computes the elevation for a low emphasis', async () => {
      const element = await basicFixture();
      assert.equal(element.elevation, 0);
    });

    it('computes the elevation for a medium emphasis', async () => {
      const element = await mediumFixture();
      assert.equal(element.elevation, 0);
    });

    it('computes the elevation for a high emphasis', async () => {
      const element = await highFixture();
      assert.equal(element.elevation, 1);
    });

    it('changes the elevation when setting the emphasis property', async () => {
      const element = await basicFixture();
      element.emphasis = 'high';
      await element.updateComplete;
      assert.equal(element.elevation, 1);
    });

    it('does not compute emphasis when setting the same value', async () => {
      const element = await highFixture();
      const spy = sinon.spy(element, '_calculateElevation');
      element.emphasis = 'high';
      await element.updateComplete;
      assert.isFalse(spy.called);
    });

    it('sets elevation when toggles and active and high emphasis', async () => {
      const element = await activeHighFixture();
      assert.equal(element.elevation, 2);
    });

    it('restores elevation when not active anymore', async () => {
      const element = await activeHighFixture();
      element.active = false;
      await element.updateComplete;
      assert.equal(element.elevation, 1);
    });

    it('sets elevation when pressed', async () => {
      const element = await highFixture();
      element.dispatchEvent(new Event('mousedown'));
      await element.updateComplete;
      assert.equal(element.elevation, 3);
    });

    it('sets elevation when anypoint', async () => {
      const element = await anypointFixture();
      assert.equal(element.elevation, 0);
    });

    it('sets elevation when flat', async () => {
      const element = await flatFixture();
      assert.equal(element.elevation, 0);
    });

    it('does not render a shadow when disabled', async () => {
      const element = await disabledFixture();
      assert.equal(element.elevation, 1, 'elevation is still set');
      const shadow = getComputedStyle(element).boxShadow;
      assert.equal(shadow, 'none');
    });
  });
});

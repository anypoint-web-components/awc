import { assert, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
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
  describe('constructor()', () => {
    it('Sets emphasis value', () => {
      const base = new TestButton();
      assert.equal(base.emphasis, 'low');
    });
  });

  describe('emphasis setter and getter', () => {
    let base: TestButton;
    beforeEach(() => {
      base = new TestButton();
    });

    it('Sets other values', async () => {
      base.emphasis = 'medium';
      await nextFrame();
      assert.equal(base.emphasis, 'medium');
    });

    it('Calls _calculateElevation() when changing value', async () => {
      const spy = sinon.spy(base, '_calculateElevation');
      base.emphasis = 'medium';
      await aTimeout(100);
      assert.isTrue(spy.calledOnce, 'Function called');
    });

    it('Ignores _calculateElevation() when not changing value', async () => {
      const spy = sinon.spy(base, '_calculateElevation');
      base.emphasis = 'low';
      await nextFrame();
      assert.isFalse(spy.called);
    });
  });

  describe('toggles setter and getter', () => {
    let base: TestButton;
    beforeEach(() => {
      base = new TestButton();
      base.toggles = false;
    });

    it('Sets other values', () => {
      base.toggles = true;
      assert.isTrue(base._toggles);
    });

    it('Calls _calculateElevation() when changing value', () => {
      const spy = sinon.spy(base, '_calculateElevation');
      base.toggles = true;
      assert.isTrue(spy.calledOnce, 'Function called');
    });

    it('Ignores _calculateElevation() when not changing value', () => {
      const spy = sinon.spy(base, '_calculateElevation');
      base.toggles = false;
      assert.isFalse(spy.called);
    });
  });

  describe('_calculateElevation()', () => {
    let base: TestButton;
    beforeEach(async () => {
      base = await fixture(html` <anypoint-button-base emphasis="high"></anypoint-button-base>`);
    });

    it('Sets elevation to 0 when not high', async () => {
      base.emphasis = 'low';
      await base._calculateElevation();
      assert.equal(base.elevation, 0);
    });

    it('Sets elevation to 2 when toggles and active', async () => {
      base.toggles = true;
      base.active = true;
      await base._calculateElevation();
      assert.equal(base.elevation, 2);
    });

    it('Sets elevation to 3 when pressed', async () => {
      // @ts-ignore
      base._pressed = true;
      await base._calculateElevation();
      assert.equal(base.elevation, 3);
    });

    it('Sets elevation to 1 otherwise', async () => {
      await base._calculateElevation();
      assert.equal(base.elevation, 1);
    });
  });

  describe('_changedControlState()', () => {
    it('Calls _calculateElevation()', () => {
      const base = new TestButton();
      const spy = sinon.spy(base, '_calculateElevation');
      base._changedControlState();
      assert.isTrue(spy.called, 'Function called');
    });
  });

  describe('_buttonStateChanged()', () => {
    it('Calls _calculateElevation()', () => {
      const base = new TestButton();
      const spy = sinon.spy(base, '_calculateElevation');
      base._buttonStateChanged();
      assert.isTrue(spy.called, 'Function called');
    });
  });
});

import { fixture, expect, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import './test-elements.js';

describe('Focused state tests', () => {
  async function trivialFocusedState() {
    return fixture(`<test-control tabindex="-1"></test-control>`);
  }

  async function trivialButtonFixture() {
    return fixture(`<test-button></test-button>`);
  }

  async function nestedFocusedState() {
    return fixture(`<nested-focusable></nested-focusable>`);
  }

  async function lightDOMFixture() {
    return fixture(`<test-light-dom>
        <input id="input">
        <nested-focusable></nested-focusable>
      </test-light-dom>`);
  }

  describe('focused-state', () => {
    let focusTarget;
    beforeEach(async () => {
      focusTarget = await trivialFocusedState();
    });

    describe('when is focused', () => {
      it('receives a focused attribute', async () => {
        expect(focusTarget.hasAttribute('focused')).to.be.eql(false);
        MockInteractions.focus(focusTarget);
        await nextFrame();
        expect(focusTarget.hasAttribute('focused')).to.be.eql(true);
      });

      it('focused property is true', async () => {
        expect(focusTarget.focused).to.not.be.eql(true);
        MockInteractions.focus(focusTarget);
        await nextFrame();
        expect(focusTarget.focused).to.be.eql(true);
      });
    });

    describe('when is blurred', () => {
      it('loses the focused attribute', async () => {
        MockInteractions.focus(focusTarget);
        await nextFrame();
        expect(focusTarget.hasAttribute('focused')).to.be.eql(true);
        MockInteractions.blur(focusTarget);
        await nextFrame();
        expect(focusTarget.hasAttribute('focused')).to.be.eql(false);
      });

      it('focused property is false', async () => {
        MockInteractions.focus(focusTarget);
        await nextFrame();
        expect(focusTarget.focused).to.be.eql(true);
        MockInteractions.blur(focusTarget);
        await nextFrame();
        expect(focusTarget.focused).to.be.eql(false);
      });
    });

    describe('when the focused state is disabled', () => {
      it('will not be focusable', async () => {
        const blurSpy = sinon.spy(focusTarget, 'blur');
        MockInteractions.focus(focusTarget);
        await nextFrame();
        focusTarget.disabled = true;
        expect(focusTarget.getAttribute('tabindex')).to.be.eql('-1');
        expect(blurSpy.called).to.be.eql(true);
      });
    });
  });

  describe('nested focusable', () => {
    let focusable;
    beforeEach(async () => {
      focusable = await nestedFocusedState();
      await nextFrame();
      await nextFrame();
      await nextFrame();
    });

    it('focus/blur events fired on host element', () => {
      let nFocusEvents = 0;
      let nBlurEvents = 0;
      const input = focusable.shadowRoot.querySelector('#input');
      focusable.addEventListener('focus', () => {
        nFocusEvents += 1;
        expect(focusable.focused).to.be.equal(true);
        MockInteractions.blur(input);
      });

      focusable.addEventListener('blur', () => {
        expect(focusable.focused).to.be.equal(false);
        nBlurEvents += 1;
      });
      MockInteractions.focus(input);
      expect(nBlurEvents).to.be.greaterThan(0);
      expect(nFocusEvents).to.be.greaterThan(0);
    });
  });

  describe('elements in the light dom', () => {
    let lightDOM;
    let input;
    let lightDescendantShadowInput;

    beforeEach(async () => {
      lightDOM = await lightDOMFixture();
      input = lightDOM.querySelector('#input');
      lightDescendantShadowInput = lightDOM
        .querySelector('nested-focusable')
        .shadowRoot.querySelector('#input');
    });

    it('should not fire the focus event', () => {
      let nFocusEvents = 0;
      lightDOM.addEventListener('focus', () => {
        nFocusEvents += 1;
      });
      MockInteractions.focus(input);
      expect(nFocusEvents).to.be.equal(0);
    });
    it('should not fire the focus event from shadow descendants', () => {
      let nFocusEvents = 0;
      lightDOM.addEventListener('focus', () => {
        nFocusEvents += 1;
      });
      MockInteractions.focus(lightDescendantShadowInput);
      expect(nFocusEvents).to.be.equal(0);
    });
  });

  describe('receivedFocusFromKeyboard', () => {
    let focusTarget;
    beforeEach(async () => {
      focusTarget = await trivialButtonFixture();
    });

    it('Has default value', () => {
      assert.isFalse(focusTarget.receivedFocusFromKeyboard);
    });

    it('Has _receivedFocusFromKeyboard value', () => {
      focusTarget._receivedFocusFromKeyboard = true;
      assert.isTrue(focusTarget.receivedFocusFromKeyboard);
    });

    it('Sets state when element is focused', () => {
      MockInteractions.focus(focusTarget);
      assert.isTrue(focusTarget.receivedFocusFromKeyboard);
    });

    it('Re-sets state when key down', () => {
      MockInteractions.focus(focusTarget);
      assert.isTrue(focusTarget.receivedFocusFromKeyboard, 'Has true value');
      MockInteractions.down(focusTarget);
      assert.isFalse(focusTarget.receivedFocusFromKeyboard, 'Has false value');
    });
  });
});

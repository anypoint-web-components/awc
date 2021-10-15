import { fixture, expect, nextFrame } from '@open-wc/testing';
import './test-elements.js';

describe('Disabled state tests', () => {
  async function trivialDisabledState() {
    return fixture(`<test-control></test-control>`);
  }
  async function initiallyDisabledState() {
    return fixture(`<test-control disabled></test-control>`);
  }
  async function initiallyWithoutTabIndex() {
    return fixture(`<test-control></test-control>`);
  }
  async function initiallyWithTabIndex() {
    return fixture(`<test-control tabindex="0"></test-control>`);
  }

  describe('disabled-state', () => {
    let disableTarget;

    describe('a trivial disabled state', () => {
      beforeEach(async () => {
        disableTarget = await trivialDisabledState();
      });

      describe('when disabled is true', () => {
        it('receives a disabled attribute', async () => {
          disableTarget.disabled = true;
          await nextFrame();
          expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
        });

        it('receives an appropriate aria attribute', async () => {
          disableTarget.disabled = true;
          await nextFrame();
          expect(disableTarget.getAttribute('aria-disabled')).to.be.eql('true');
        });
      });

      describe('when disabled is false', () => {
        it('loses the disabled attribute', async () => {
          disableTarget.disabled = true;
          await nextFrame();
          expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
          disableTarget.disabled = false;
          await nextFrame();
          expect(disableTarget.hasAttribute('disabled')).to.be.eql(false);
        });
      });
    });

    describe('a state with an initially disabled target', () => {
      beforeEach(async () => {
        disableTarget = await initiallyDisabledState();
      });

      it('preserves the disabled attribute on target', () => {
        expect(disableTarget.hasAttribute('disabled')).to.be.eql(true);
        expect(disableTarget.disabled).to.be.eql(true);
      });

      it('adds `aria-disabled` to the target', () => {
        expect(disableTarget.getAttribute('aria-disabled')).to.be.eql('true');
      });

      it('removes focused state', () => {
        disableTarget._focused = true;
        disableTarget.dispatchEvent(new CustomEvent('focus'));
        expect(disableTarget.focused).to.be.eql(false);
      });

      it('ignores focus event', () => {
        disableTarget.dispatchEvent(new CustomEvent('focus'));
        expect(disableTarget.focused).to.be.eql(false);
      });
    });

    describe('`tabindex` attribute handling', () => {
      describe('without `tabindex`', () => {
        beforeEach(async () => {
          disableTarget = await initiallyWithoutTabIndex();
        });

        it('adds `tabindex = -1` when disabled', () => {
          disableTarget.disabled = true;
          expect(disableTarget.getAttribute('tabindex')).to.be.eql('-1');
        });

        it('removed `tabindex` when re-enabled', () => {
          disableTarget.disabled = true;
          disableTarget.disabled = false;
          expect(disableTarget.getAttribute('tabindex')).to.be.eql(null);
        });
      });

      describe('with `tabindex`', () => {
        beforeEach(async () => {
          disableTarget = await initiallyWithTabIndex();
        });

        it('adds `tabindex = -1` when disabled', () => {
          disableTarget.disabled = true;
          expect(disableTarget.getAttribute('tabindex')).to.be.eql('-1');
        });

        it('restores `tabindex = 0` when re-enabled', () => {
          disableTarget.disabled = true;
          disableTarget.disabled = false;
          expect(disableTarget.getAttribute('tabindex')).to.be.eql('0');
        });
      });
    });
  });
});

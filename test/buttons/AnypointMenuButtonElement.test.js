/* eslint-disable prefer-destructuring */
import { fixture, expect, nextFrame, assert, html } from '@open-wc/testing';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '../../anypoint-menu-button.js';

/** @typedef {import('../..').AnypointMenuButtonElement} AnypointMenuButtonElement */

describe('<anypoint-menu-button>', () => {
  /**
   * @returns {Promise<AnypointMenuButtonElement>}
   */
  async function basicFixture() {
    return (fixture(html`<anypoint-menu-button noAnimations>
        <span slot="dropdown-trigger">trigger</span>
        <span slot="dropdown-content">content</span>
      </anypoint-menu-button>`));
  }

  /**
   * @returns {Promise<HTMLDivElement>}
   */
  async function doubleFixture() {
    return (fixture(html`
      <div>
      <anypoint-menu-button noAnimations>
        <span slot="dropdown-trigger">trigger</span>
        <span slot="dropdown-content">content</span>
      </anypoint-menu-button>
      <anypoint-menu-button noAnimations>
        <span slot="dropdown-trigger">trigger</span>
        <span slot="dropdown-content">content</span>
      </anypoint-menu-button>
      </div>`));
  }

  describe('interactions', () => {
    /** @type AnypointMenuButtonElement */
    let element;
    let trigger;
    let content;

    beforeEach(async () => {
      element = await basicFixture();
      trigger = element.querySelector('[slot="dropdown-trigger"]');
      content = element.querySelector('[slot="dropdown-content"]');
    });

    it('opens when trigger is clicked', (done) => {
      const contentRect = content.getBoundingClientRect();
      expect(contentRect.width).to.be.equal(0);
      expect(contentRect.height).to.be.equal(0);
      element.addEventListener('dropdownopen', () => {
        expect(element.opened).to.be.equal(true);
        done();
      });
      trigger.click();
    });

    it('closes when trigger is clicked again', (done) => {
      element.addEventListener('dropdownopen', () => {
        element.addEventListener('dropdownclose', () => {
          expect(element.opened).to.be.equal(false);
          done();
        });
        setTimeout(() => {
          trigger.click();
        });
      });
      trigger.click();
    });

    it('closes when disabled while open', () => {
      element.opened = true;
      element.disabled = true;
      expect(element.opened).to.be.equal(false);
      const contentRect = content.getBoundingClientRect();
      expect(contentRect.width).to.be.equal(0);
      expect(contentRect.height).to.be.equal(0);
    });

    it('does not open when disabled (click)', () => {
      element.disabled = true;
      trigger.click();
      expect(element.opened).not.to.be.equal(true);
    });

    it('does not open when disabled (open)', () => {
      element.disabled = true;
      element.open();
      expect(element.opened).not.to.be.equal(true);
    });

    it('closes on activate if closeOnActivate is true', (done) => {
      element.closeOnActivate = true;
      element.addEventListener('dropdownopen', () => {
        element.addEventListener('dropdownclose', () => {
          done();
        });
        content.dispatchEvent(
            new CustomEvent('activate', { bubbles: true, cancelable: true }));
      });
      trigger.click();
    });

    it('closes on selected', (done) => {
      element.addEventListener('dropdownopen', () => {
        element.addEventListener('dropdownclose', () => {
          done();
        });
        content.dispatchEvent(new CustomEvent('selected', { bubbles: true, cancelable: true }));
      });
      trigger.click();
    });

    it('does not close on select when ignoreSelect is set', (done) => {
      element.ignoreSelect = true;
      element.addEventListener('dropdownopen', () => {
        setTimeout(() => {
          expect(element.opened).to.be.equal(true);
          done();
        });
        content.dispatchEvent(
            new CustomEvent('select', { bubbles: true, cancelable: true }));
      });
      trigger.click();
    });

    it('allowOutsideScroll propagates to <anypoint-dropdown>', async () => {
      element.allowOutsideScroll = false;
      await nextFrame();
      expect(element.dropdown.allowOutsideScroll).to.be.equal(false);
      element.allowOutsideScroll = true;
      await nextFrame();
      expect(element.dropdown.allowOutsideScroll).to.be.equal(true);
    });

    it('restoreFocusOnClose propagates to <anypoint-dropdown>', async () => {
      element.restoreFocusOnClose = false;
      await nextFrame();
      expect(element.dropdown.restoreFocusOnClose).to.be.equal(false);
      element.restoreFocusOnClose = true;
      await nextFrame();
      expect(element.dropdown.restoreFocusOnClose).to.be.equal(true);
    });
  });

  describe('multiple buttons', () => {
    /** @type AnypointMenuButtonElement */
    let element;
    /** @type AnypointMenuButtonElement */
    let other;
    let trigger;
    let otherTrigger;

    beforeEach(async () => {
      const container = await doubleFixture();
      const elements = container.querySelectorAll('anypoint-menu-button');
      element = elements[0];
      other = elements[1];
      trigger = element.querySelector('[slot="dropdown-trigger"]');
      otherTrigger = other.querySelector('[slot="dropdown-trigger"]');
    });

    it('closes current and opens other', (done) => {
      expect(element.opened).to.be.equal(undefined);
      expect(other.opened).to.be.equal(undefined);
      element.addEventListener('iron-overlay-opened', () => {
        expect(element.opened).to.be.equal(true);
        expect(other.opened).to.be.equal(undefined);

        let firstClosed = false;
        let secondOpened = false;
        element.addEventListener('dropdownclose', () => {
          firstClosed = true;
        });
        other.addEventListener('dropdownopen', () => {
          secondOpened = true;
        });
        setTimeout(() => {
          otherTrigger.click();
        });
        setTimeout(() => {
          expect(firstClosed).to.be.equal(true);
          expect(secondOpened).to.be.equal(true);
          done();
        });
      });
      trigger.click();
    });
  });

  describe('onselect', () => {
    /** @type AnypointMenuButtonElement */
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselect);
      const f = () => {};
      element.onselect = f;
      assert.isTrue(element.onselect === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselect = f;
      element.dispatchEvent(
          new CustomEvent('select', { bubbles: true, cancelable: true }));
      element.onselect = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onselect = f1;
      element.onselect = f2;
      element.dispatchEvent(
          new CustomEvent('select', { bubbles: true, cancelable: true }));
      element.onselect = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('has aria-haspopup attribute', async () => {
      const element = await basicFixture();
      expect(element.hasAttribute('aria-haspopup')).to.be.equal(true);
    });

    it('has role attribute', async () => {
      const element = await basicFixture();
      expect(element.getAttribute('role')).to.be.equal('group');
    });

    it('is accessible', async () => {
      const element = await basicFixture();
      expect(element).to.be.accessible();
    });
  });
});

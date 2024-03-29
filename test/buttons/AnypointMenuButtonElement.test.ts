/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
import { fixture, expect, nextFrame, assert, html, oneEvent } from '@open-wc/testing';
import '../../src/define/anypoint-menu-button.js';
import { AnypointMenuButtonElement } from '../../src/index.js';

describe('<anypoint-menu-button>', () => {
  async function basicFixture(): Promise<AnypointMenuButtonElement> {
    return (fixture(html`<anypoint-menu-button>
        <span slot="dropdown-trigger">trigger</span>
        <span slot="dropdown-content">content</span>
      </anypoint-menu-button>`));
  }

  async function doubleFixture(): Promise<AnypointMenuButtonElement> {
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
    let element: AnypointMenuButtonElement;
    let trigger: HTMLElement;
    let content: HTMLElement;

    beforeEach(async () => {
      element = await basicFixture();
      trigger = element.querySelector('[slot="dropdown-trigger"]')!;
      content = element.querySelector('[slot="dropdown-content"]')!;
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

    it('closes when disabled while open', async () => {
      element.opened = true;
      element.disabled = true;
      await nextFrame();
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

    it('closes on selected', async () => {
      const p1 = oneEvent(element, 'dropdownopen');
      trigger.click();
      await p1;
      await nextFrame();
      const p2 = oneEvent(element, 'dropdownclose');
      content.dispatchEvent(new Event('selected', { bubbles: true, cancelable: true }));
      await p2;
    });

    it('does not close on select when ignoreSelect is set', async () => {
      element.ignoreSelect = true;
      const p1 = oneEvent(element, 'dropdownopen');
      trigger.click();
      await p1;
      content.dispatchEvent(new CustomEvent('select', { bubbles: true, cancelable: true }));
      expect(element.opened).to.be.equal(true);
    });

    it('allowOutsideScroll propagates to <anypoint-dropdown>', async () => {
      element.allowOutsideScroll = false;
      await nextFrame();
      expect(element.dropdown.allowOutsideScroll).to.be.equal(false);
      element.allowOutsideScroll = true;
      await nextFrame();
      expect(element.dropdown.allowOutsideScroll).to.be.equal(true);
    });
  });

  describe('multiple buttons', () => {
    let element: AnypointMenuButtonElement;
    let other: AnypointMenuButtonElement;
    let trigger: HTMLElement;
    let otherTrigger: HTMLElement;

    beforeEach(async () => {
      const container = await doubleFixture();
      const elements = container.querySelectorAll('anypoint-menu-button')!;
      element = elements[0]!;
      other = elements[1]!;
      trigger = element.querySelector('[slot="dropdown-trigger"]')!;
      otherTrigger = other.querySelector('[slot="dropdown-trigger"]')!;
    });

    it('closes current and opens other', (done) => {
      expect(element.opened).to.be.equal(undefined);
      expect(other.opened).to.be.equal(undefined);
      element.addEventListener('opened', () => {
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
    let element: AnypointMenuButtonElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onselect);
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
      element.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
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
      element.dispatchEvent(new Event('select', { bubbles: true, cancelable: true }));
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

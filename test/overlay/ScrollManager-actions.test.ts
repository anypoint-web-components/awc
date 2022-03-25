/* eslint-disable no-param-reassign */
import {fixture, assert, nextFrame, html} from '@open-wc/testing';
import sinon from 'sinon';
import './test-overlay.js';
import { TestOverlay } from './test-overlay.js';
import './test-scrollable.js';
import { TestScrollable } from './test-scrollable.js';
import { ScrollManager } from '../../index.js';

const s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = `
.scrollable {
  overflow: auto;
  width: 200px;
  height: 200px;
}

.big {
  width: 150vmax;
  height: 150vmax;
}
`;
document.getElementsByTagName('head')[0].appendChild(s);

const big = document.createElement('div');
big.className = 'big';
big.innerText = 'This element makes the page scrollable.';
document.body.appendChild(big);

describe('OverlayMixin - scroll actions', () => {
  async function basicFixture(): Promise<TestOverlay> {
    return fixture(html`
      <test-overlay class="scrollable">
        <div class="big">
          This element makes the overlay scrollable.
        </div>
      </test-overlay>`);
  }

  async function scrollableFixture(): Promise<TestScrollable> {
    return fixture(html`
      <test-scrollable>
        <div slot="scrollable-content" class="big">
          This element makes the overlay scrollable.
          <test-overlay>Overlay in light dom</test-overlay>
        </div>
        <div slot="overlay-content" class="big">Overlay in shadow root</div>
      </test-scrollable>`);
  }

  // Need to discover if html or body is scrollable.
  // Here we are sure the page is scrollable.
  let scrollTarget: HTMLElement;
  document.documentElement.scrollTop = 1;
  if (document.documentElement.scrollTop === 1) {
    document.documentElement.scrollTop = 0;
    scrollTarget = document.documentElement;
  } else {
    scrollTarget = document.body;
  }

  async function runAfterOpen(overlay: TestOverlay): Promise<void> {
    return new Promise((resolve) => {
      overlay.addEventListener('iron-overlay-opened', () => resolve());
      overlay.open();
    });
  }

  async function runAfterClose(overlay: TestOverlay): Promise<void> {
    return new Promise((resolve) => {
      overlay.addEventListener('iron-overlay-closed', () => resolve());
      overlay.close();
    });
  }

  function fireWheel(node: EventTarget, deltaX: number, deltaY: number): Event {
    // IE 11 doesn't support WheelEvent, use CustomEvent.
    const event = new CustomEvent('wheel', {
      cancelable: true,
      bubbles: true,
      composed: true,
    });
    // @ts-ignore
    event.deltaX = deltaX;
    // @ts-ignore
    event.deltaY = deltaY;
    node.dispatchEvent(event);
    return event;
  }

  function dispatchScroll(target: HTMLElement, scrollLeft: number, scrollTop: number): void {
    target.scrollLeft = scrollLeft;
    target.scrollTop = scrollTop;
    target.dispatchEvent(new CustomEvent('scroll', {bubbles: true, composed: false}));
  }

  describe('scroll actions', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      // Ensure we always scroll to top.
      dispatchScroll(scrollTarget, 0, 0);
      overlay = await basicFixture();
      await nextFrame();
    });

    it('default: outside scroll not prevented', async () => {
      await runAfterOpen(overlay);
      assert.isFalse(ScrollManager.elementIsScrollLocked(scrollTarget));
      assert.isFalse(fireWheel(scrollTarget, 0, 10).defaultPrevented);
      dispatchScroll(scrollTarget, 0, 10);
      await nextFrame();
      assert.equal(scrollTarget.scrollTop, 10, 'scrollTop ok');
      assert.equal(scrollTarget.scrollLeft, 0, 'scrollLeft ok');
    });

    it('default: outside scroll does NOT trigger refit', async () => {
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(scrollTarget, 0, 10);
      await nextFrame();
      assert.equal(refitSpy.callCount, 0, 'did not refit on scroll');
    });

    it('refit scrollAction does NOT refit the overlay on scroll inside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      // Wait a tick, otherwise this fails in FF/Safari.
      await nextFrame();
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(overlay, 0, 10);
      await nextFrame();
      assert.equal(refitSpy.callCount, 0, 'did not refit on scroll inside');
    });

    it('refit scrollAction refits the overlay on scroll outside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(scrollTarget, 0, 10);
      await nextFrame();
      await nextFrame();
      assert.notEqual(refitSpy.callCount, 0, 'did refit on scroll outside');
    });

    it('cancel scrollAction does NOT close the overlay on scroll inside', async () => {
      overlay.scrollAction = 'cancel';
      await runAfterOpen(overlay);
      dispatchScroll(overlay, 0, 10);
      assert.isTrue(overlay.opened, 'overlay was not closed');
    });

    it('cancel scrollAction closes the overlay on scroll outside', (done) => {
      overlay.scrollAction = 'cancel';
      runAfterOpen(overlay)
      .then(() => {
        overlay.addEventListener('iron-overlay-canceled', (event) => {
          // @ts-ignore
          assert.equal(event.detail.type, 'scroll', 'detail contains original event');
          // @ts-ignore
          assert.equal(event.detail.target, scrollTarget, 'original scroll event target ok');
          overlay.addEventListener('iron-overlay-closed', () => {
            done();
          });
        });
        dispatchScroll(scrollTarget, 0, 10);
      });
    });

    it('lock scrollAction locks scroll', async () => {
      overlay.scrollAction = 'lock';
      await runAfterOpen(overlay);
      assert.isTrue(ScrollManager.elementIsScrollLocked(scrollTarget));
      assert.isTrue(fireWheel(scrollTarget, 0, 10).defaultPrevented);
      dispatchScroll(scrollTarget, 0, 10);
      assert.equal(scrollTarget.scrollTop, 0, 'scrollTop ok');
      assert.equal(scrollTarget.scrollLeft, 0, 'scrollLeft ok');
    });

    it('should lock, only once', async () => {
      let openCount = 0;
      overlay.scrollAction = 'lock';
      await runAfterOpen(overlay);
      assert.isTrue(ScrollManager.elementIsScrollLocked(scrollTarget));
      assert.isTrue(fireWheel(scrollTarget, 0, 10).defaultPrevented);
      assert.equal(ScrollManager._lockingElements.length, 1);
      if (openCount === 0) {
        // This triggers a second `pushScrollLock` with the same element,
        // however that should not add the element to the `ScrollManager._lockingElements`
        // stack twice
        await runAfterClose(overlay);
        assert.isFalse(ScrollManager.elementIsScrollLocked(overlay));
        assert.isFalse(fireWheel(scrollTarget, 0, 10).defaultPrevented);
        overlay.open();
      } else {
        return;
      }
      openCount++;
    });
  });

  describe('scroll actions in shadow root', () => {
    let scrollable: TestScrollable;
    let overlay: TestOverlay;

    beforeEach(async () => {
      const f = await scrollableFixture();
      scrollable = f.shadowRoot!.querySelector('#scrollable')!;
      overlay = f.shadowRoot!.querySelector('#overlay')!;
    });

    it('refit scrollAction does NOT refit the overlay on scroll inside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(overlay, 0, 10);
      await nextFrame();
      assert.equal(refitSpy.callCount, 0, 'did not refit on scroll inside');
    });

    it('refit scrollAction refits the overlay on scroll outside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(scrollable, 0, 10);
      await nextFrame();
      await nextFrame();
      assert.notEqual(refitSpy.callCount, 0, 'did refit on scroll outside');
    });

    it('cancel scrollAction does NOT close the overlay on scroll inside', async () => {
      overlay.scrollAction = 'cancel';
      await runAfterOpen(overlay);
      dispatchScroll(overlay, 0, 10);
      assert.isTrue(overlay.opened, 'overlay was not closed');
    });

    it('cancel scrollAction closes the overlay on scroll outside', (done) => {
      overlay.scrollAction = 'cancel';
      runAfterOpen(overlay)
      .then(() => {
        overlay.addEventListener('iron-overlay-canceled', (event) => {
          // @ts-ignore
          assert.equal(event.detail.type, 'scroll', 'detail contains original event');
          // @ts-ignore
          assert.equal(event.detail.target, scrollable, 'original scroll event target ok');
          overlay.addEventListener('iron-overlay-closed', () => {
            done();
          });
        });
        dispatchScroll(scrollable, 0, 10);
      });
    });
  });

  describe('scroll actions in shadow root, overlay distributed', () => {
    let scrollable: TestScrollable;
    let overlay: TestOverlay;

    beforeEach(async () => {
      const f = await scrollableFixture();
      scrollable = f.shadowRoot!.querySelector('#scrollable')!;
      overlay = f.querySelector('test-overlay')!;
    });

    it('refit scrollAction does NOT refit the overlay on scroll inside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(overlay, 0, 10);
      await nextFrame();
      assert.equal(refitSpy.callCount, 0, 'did not refit on scroll inside');
    });

    it('refit scrollAction refits the overlay on scroll outside', async () => {
      overlay.scrollAction = 'refit';
      await runAfterOpen(overlay);
      const refitSpy = sinon.spy(overlay, 'refit');
      dispatchScroll(scrollable, 0, 10);
      await nextFrame();
      await nextFrame();
      assert.notEqual(refitSpy.callCount, 0, 'did refit on scroll outside');
    });

    it('cancel scrollAction does NOT close the overlay on scroll inside', async () => {
      overlay.scrollAction = 'cancel';
      await runAfterOpen(overlay);
      dispatchScroll(overlay, 0, 10);
      assert.isTrue(overlay.opened, 'overlay was not closed');
    });

    it('cancel scrollAction closes the overlay on scroll outside', (done) => {
      overlay.scrollAction = 'cancel';
      runAfterOpen(overlay)
      .then(() => {
        overlay.addEventListener('iron-overlay-canceled', (event) => {
          // @ts-ignore
          assert.equal(event.detail.type, 'scroll', 'detail contains original event');
          // @ts-ignore
          assert.equal(event.detail.target, scrollable, 'original scroll event target ok');
          overlay.addEventListener('iron-overlay-closed', () => {
            done();
          });
        });
        dispatchScroll(scrollable, 0, 10);
      });
    });
  });
});

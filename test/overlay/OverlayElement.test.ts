/* eslint-disable lit-a11y/no-autofocus */
/* eslint-disable function-paren-newline */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-shadow */
/* eslint-disable lit-a11y/tabindex-no-positive */
/* eslint-disable wc/no-self-class */
import { fixture, html, assert, nextFrame, aTimeout, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import { pressAndReleaseKeyOn, tap, focus } from '@polymer/iron-test-helpers/mock-interactions.js';
import { OverlayManager } from '../../src/define/overlay-manager.js';
import './test-buttons.js';
import './test-menu-button.js';
import { TestMenuButton } from './test-menu-button.js';
import './test-overlay.js';
import './test-overlay2.js';
import { TestOverlay } from './test-overlay.js';

const s = document.createElement('style');
s.innerHTML = `
arc-overlay-backdrop {
  /* For quicker tests */
  --arc-overlay-backdrop-transition: none;
}
`;
document.getElementsByTagName('head')[0].appendChild(s);

const b = document.createElement('test-buttons');
b.id = 'buttons';
document.body.appendChild(b);

const i = document.createElement('input');
i.id = 'focusInput';
i.placeholder = 'focus input';
document.body.appendChild(i);

describe('OverlayElement', () => {
  async function basicFixture(): Promise<TestOverlay> {
    return (fixture(html`<test-overlay>
      <p>Basic Overlay</p>
    </test-overlay>`));
  }

  async function openedFixture(): Promise<TestOverlay> {
    return (fixture(html`<test-overlay opened>
      Basic Overlay
    </test-overlay>`));
  }

  async function autofocusFixture(): Promise<TestOverlay> {
    return (fixture(html`<test-overlay>
      Autofocus
      <button autofocus>button</button>
    </test-overlay>`));
  }

  async function focusablesFixture(): Promise<TestOverlay> {
    return (fixture(html`
    <test-overlay tabindex="-1">
      <h2>Focusables (no tabindex)</h2>
      <div>
        <input class="focusable1" placeholder="1 (nested)">
      </div>
      <button class="focusable2">1</button>
      <button disabled> disabled button</button>
      <div tabindex="-1">not focusable</div>
      <button class="focusable3">2</button>
    </test-overlay>
    <test-overlay tabindex="-1">
      <h2>Focusables (with tabindex)</h2>
      <div tabindex="-1">not focusable</div>
      <div tabindex="3" class="focusable3">3</div>
      <div tabindex="4" class="focusable4">4</div>
      <div tabindex="5" class="focusable5">5</div>
      <div>
        <div tabindex="1" class="focusable1">1 (nested)</div>
        <div tabindex="6" class="focusable6">6 (nested)</div>
      </div>
      <div tabindex="2" class="focusable2">2</div>
    </test-overlay>
    <test-overlay2>
      Overlay with optimized focusableNodes getter
      <button class="focusable1">1</button>
    </test-overlay2>`));
  }

  async function backdropFixture(): Promise<TestOverlay> {
    return (fixture(html`<test-overlay withBackdrop>
      Overlay with backdrop
      <input disabled>
      <input>
      <input disabled>
    </test-overlay>`));
  }
  async function multipleFixture(): Promise<TestOverlay> {
    return (fixture(html`<test-overlay class="overlay-1">
      Test overlay 1
    </test-overlay>
    <test-overlay class="overlay-2">
      Test overlay 2
      <button>Click</button>
    </test-overlay>
    <test-overlay2 class="overlay-3">
      Other overlay 3
    </test-overlay2>`));
  }

  async function composedFixture(): Promise<TestMenuButton> {
    return (fixture(`<test-menu-button></test-menu-button>`));
  }

  async function untilOpen(overlay: TestOverlay): Promise<void> {
    if (overlay.opened) {
      return undefined;
    }

    return new Promise((resolve) => {
      overlay.addEventListener('opened', function f() {
        overlay.removeEventListener('opened', f);
        resolve();
      });
      overlay.open();
    });
  }

  async function untilClose(overlay: TestOverlay): Promise<void> {
    if (!overlay.opened) {
      return undefined;
    }
    return new Promise((resolve) => {
      overlay.addEventListener('closed', function f() {
        overlay.removeEventListener('closed', f);
        resolve();
      });
      overlay.close();
    });
  }

  async function untilCancel(overlay: TestOverlay, type: string): Promise<void> {
    return new Promise((resolve) => {
      overlay.addEventListener(type, function f(e) {
        overlay.removeEventListener(type, f);
        e.preventDefault();
        setTimeout(() => {
          resolve();
        }, 10);
      });
      document.body.click();
    });
  }

  describe('basic overlay', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await basicFixture();
      await nextFrame();
    });

    it('overlay starts hidden', () => {
      assert.isUndefined(overlay.opened, 'overlay starts closed');
      assert.equal(getComputedStyle(overlay).display, 'none', 'overlay starts hidden');
    });

    it('_renderOpened called only after is attached', async () => {
      // const TestOverlay = customElements.get('test-overlay');
      // const overlay = new TestOverlay();
      const overlay = document.createElement('test-overlay');
      await nextFrame();
      // The overlay is ready at this point, but not yet attached.
      const spy = sinon.spy(overlay, '_renderOpened');
      // This triggers _openedChanged.
      // @ts-ignore
      overlay.opened = true;
      // Wait long enough for requestAnimationFrame callback.
      await nextFrame();
      assert.isFalse(spy.called, '_renderOpened not called');
      // Because not attached yet, overlay should not be the current overlay!
      assert.isNotOk(overlay._manager.currentOverlay(), 'currentOverlay not set');
    });

    it('overlay open/close events', (done) => {
      let captured = 0;
      overlay.addEventListener('opened', () => {
        captured += 1;
        overlay.opened = false;
      });
      overlay.addEventListener('closed', () => {
        captured += 1;
        assert.equal(captured, 2, 'opened and closed events fired');
        done();
      });
      overlay.opened = true;
    });

    it('overlay openedchange event', (done) => {
      overlay.addEventListener('openedchange', () => {
        done();
      });
      overlay.opened = true;
    });

    it('open() refits overlay only once', async () => {
      const spy = sinon.spy(overlay, 'refit');
      await untilOpen(overlay);
      assert.equal(spy.callCount, 1, 'overlay did refit only once');
    });

    it('open overlay refits on resize', async () => {
      await untilOpen(overlay);
      const spy = sinon.spy(overlay, 'refit');
      overlay.firstElementChild?.dispatchEvent(new Event('resize', {
        composed: true,
        bubbles: true
      }));
      await nextFrame();
      assert.isTrue(spy.called, 'overlay did refit');
    });
  });

  describe('basic overlay 2', () => {
    async function waitTimeout(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => resolve());
      });
    }
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await basicFixture();
      await nextFrame();
      // ResizableElement requests parents info in setTimeout(() => {...});
      // Because of that some tests below may fail and this need to wait until
      // the function is executed.
      await waitTimeout();
    });

    it('_renderOpened called only after is attached', async () => {
      const overlay = /** @type TestOverlay */ (document.createElement('test-overlay'));
      // The overlay is ready at this point, but not yet attached.
      const spy = sinon.spy(overlay, '_renderOpened');
      // This triggers _openedChanged.
      overlay.opened = true;
      // Wait long enough for requestAnimationFrame callback.
      await aTimeout(100);
      assert.isFalse(spy.called, '_renderOpened not called');
      // Because not attached yet, overlay should not be the current overlay!
      assert.isNotOk(overlay._manager.currentOverlay(), 'currentOverlay not set');
    });

    it('closed overlay does not refit on resize', async () => {
      const spy = sinon.spy(overlay, 'refit');
      overlay.dispatchEvent(new CustomEvent('resize', {
        composed: true,
        bubbles: true
      }));
      await nextFrame();
      assert.isFalse(spy.called, 'overlay should not refit');
    });

    it('open() triggers resize', async () => {
      let callCount = 0;
      overlay.addEventListener('resize', () => {
        callCount++;
      });
      await untilOpen(overlay);
      assert.isAbove(callCount, 0, 'resize called before opened');
    });

    it('close() triggers resize', async () => {
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('resize', spy);
      await untilClose(overlay);
      assert.equal(spy.callCount, 1, 'resize called once before closed event');
    });

    it('closed overlay does not trigger resize when its content changes', async () => {
      // Ignore resize triggered by window resize.
      let callCount = 0;
      window.addEventListener('resize', () => {
        callCount--;
      }, true);
      overlay.addEventListener('resize', () => {
        callCount++;
      });
      overlay.appendChild(document.createElement('div'));
      // Wait for MutationObserver to be executed.
      await aTimeout(0);
      assert.equal(callCount, 0, 'resize should is not called');
    });

    it('open overlay triggers resize when its content changes', async () => {
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('resize', spy);
      overlay.appendChild(document.createElement('div'));
      // Wait for MutationObserver to be executed.
      await aTimeout(0);
      assert.equal(spy.callCount, 1, 'resize should be called once');
    });

    it('close an overlay quickly after open', async () => {
      // first, open the overlay
      overlay.open();
      await aTimeout(0);
      // during the opening transition, close the overlay
      overlay.close();
      // wait for any exceptions to be thrown until the transition is done
      await aTimeout(300);
    });

    it('clicking an overlay does not close it', async () => {
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('closed', spy);
      overlay.click();
      await aTimeout(10);
      assert.isFalse(spy.called, 'closed should not fire');
    });

    it('open overlay on mousedown does not close it', async () => {
      const btn = document.createElement('button');
      btn.addEventListener('mousedown', overlay.open.bind(overlay));
      document.body.appendChild(btn);
      // It triggers mousedown, mouseup, and click.
      btn.click();
      const e = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      btn.dispatchEvent(e);

      document.body.removeChild(btn);
      assert.isTrue(overlay.opened, 'overlay opened');

      await aTimeout(10);
      assert.isTrue(overlay.opened, 'overlay is still open');
    });

    it('clicking outside fires canceled', async () => {
      await untilOpen(overlay);
      setTimeout(() => {
        document.body.click();
      });
      await oneEvent(overlay, 'cancel');
    });

    it('clicking outside closes the overlay', async () => {
      await untilOpen(overlay);
      setTimeout(() => {
        document.body.click();
      });
      const event = await oneEvent(overlay, 'closed');
      assert.isTrue(event.detail.canceled, 'overlay is canceled');
    });

    it('canceled event can be prevented', async () => {
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('closed', spy);
      await untilCancel(overlay, 'cancel');
      assert.isTrue(overlay.opened, 'overlay is still open');
      assert.isFalse(spy.called, 'closed not fired');
    });

    it('cancels an overlay with esc key', async () => {
      await untilOpen(overlay);
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code: 'Escape',
      });
      document.body.dispatchEvent(e);
      await untilCancel(overlay, 'cancel');
    });

    it('close an overlay with esc key', async () => {
      await untilOpen(overlay);
      setTimeout(() => {
        // @ts-ignore
        pressAndReleaseKeyOn(document, 27, '', 'Escape');
      });
      const event = await oneEvent(overlay, 'closed');
      assert.isTrue(event.detail.canceled, 'overlay is canceled');
    });

    it('#noCancelOnOutsideClick property', async () => {
      overlay.noCancelOnOutsideClick = true;
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('closed', spy);
      tap(document.body);

      await aTimeout(10);
      assert.isFalse(spy.called, 'closed should not fire');
    });

    it('#noCancelOnEscKey property', async () => {
      overlay.noCancelOnEscKey = true;
      await untilOpen(overlay);
      const spy = sinon.stub();
      overlay.addEventListener('closed', spy);

      // @ts-ignore
      pressAndReleaseKeyOn(document, 27);

      await aTimeout(10);
      assert.isFalse(spy.called, 'closed should not fire');
    });

    it('#withBackdrop sets tabindex=-1 and removes it', async () => {
      overlay.withBackdrop = true;
      await nextFrame();
      assert.equal(overlay.getAttribute('tabindex'), '-1', 'tabindex is -1');
      overlay.withBackdrop = false;
      await nextFrame();
      assert.isFalse(overlay.hasAttribute('tabindex'), 'tabindex removed');
    });

    it('#withBackdrop does not override tabindex if already set', () => {
      overlay.setAttribute('tabindex', '1');
      overlay.withBackdrop = true;
      assert.equal(overlay.getAttribute('tabindex'), '1', 'tabindex is 1');
      overlay.withBackdrop = false;
      assert.equal(overlay.getAttribute('tabindex'), '1', 'tabindex is still 1');
    });
  });

  describe('keyboard event listener', () => {
    let overlay: TestOverlay;
    const preventKeyDown = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
    };

    before(() => {
      // Worst case scenario: listener with useCapture = true that prevents &
      // stops propagation added before the overlay is initialized.
      document.addEventListener('keydown', preventKeyDown, true);
    });

    beforeEach(async () => {
      overlay = await basicFixture();
      await nextFrame();
    });

    after(() => {
      document.removeEventListener('keydown', preventKeyDown, true);
    });

    it('cancel an overlay with esc key even if event is prevented by other listeners', async () => {
      await untilOpen(overlay);
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code: 'Escape',
      });
      document.body.dispatchEvent(e);
      await untilCancel(overlay, 'cancel');
    });
  });

  describe('click event listener', () => {
    let overlay: TestOverlay;
    const preventTap = (event: Event): void => {
      event.preventDefault();
      event.stopPropagation();
    };

    before(() => {
      // Worst case scenario: listener with useCapture = true that prevents &
      // stops propagation added before the overlay is initialized.
      document.body.addEventListener('click', preventTap);
    });

    after(() => {
      document.removeEventListener('click', preventTap);
    });

    beforeEach(async () => {
      overlay = await basicFixture();
      await nextFrame();
    });

    it('cancel an overlay with tap outside even if event is prevented by other listeners', async () => {
      await untilOpen(overlay);
      document.body.click();
      await untilCancel(overlay, 'cancel');
    });
  });

  describe('opened overlay', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await openedFixture();
    });

    it('overlay open by default', async () => {
      await untilOpen(overlay);
      assert.isTrue(overlay.opened, 'overlay starts opened');
      assert.notEqual(getComputedStyle(overlay).display, 'none', 'overlay starts showing');
    });

    it('overlay positioned & sized properly', async () => {
      await untilOpen(overlay);
      const s = getComputedStyle(overlay);
      assert.closeTo(parseFloat(s.left), (window.innerWidth - overlay.offsetWidth) / 2, 1, 'centered horizontally');
      assert.closeTo(parseFloat(s.top), (window.innerHeight - overlay.offsetHeight) / 2, 1, 'centered vertically');
    });
  });

  describe('focus handling', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      // Ensure focus is set to document.body
      document.body.focus();
      overlay = await autofocusFixture();
      await nextFrame();
    });

    it('node with autofocus is focused', async () => {
      await untilOpen(overlay);
      assert.equal(overlay.querySelector('[autofocus]'), document.activeElement, '<button autofocus> is focused');
    });

    it('#noAutoFocus will not focus node with autofocus', async () => {
      overlay.noAutoFocus = true;
      // In Safari the element with autofocus will immediately receive focus when
      // displayed for the first time http://jsbin.com/woroci/2/ Ensure this is
      // not the case for overlay.
      assert.notEqual(overlay.querySelector('[autofocus]'), document.activeElement, '<button autofocus> not immediately focused');
      await untilOpen(overlay);
      assert.notEqual(overlay.querySelector('[autofocus]'), document.activeElement, '<button autofocus> not focused after opened');
    });

    it('#noCancelOnOutsideClick property: focus stays on overlay when click outside', async () => {
      overlay.noCancelOnOutsideClick = true;
      await untilOpen(overlay);
      tap(document.body);

      await aTimeout(10);
      assert.equal(overlay.querySelector('[autofocus]'), document.activeElement, '<button autofocus> is focused');
    });

    it('#withBackdrop traps the focus within the overlay', async () => {
      const focusSpy = sinon.stub();
      const button = document.createElement('button');
      document.body.appendChild(button);
      button.addEventListener('focus', focusSpy, true);
      overlay.withBackdrop = true;
      await untilOpen(overlay);

      // Try to steal the focus
      focus(button);
      assert.equal(overlay.querySelector('[autofocus]'), document.activeElement, '<button autofocus> is focused');
      assert.equal(focusSpy.callCount, 0, 'button in body did not get the focus');
      document.body.removeChild(button);
    });

    it('overlay #withBackdrop and 1 focusable: prevent TAB and trap the focus', async () => {
      overlay.withBackdrop = true;
      await untilOpen(overlay);
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);

      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, '', 'Tab');
      assert.equal(overlay.querySelector('[autofocus]'), document.activeElement, 'focus stays on button');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
    });

    it('empty overlay #withBackdrop: prevent TAB and trap the focus', async () => {
      const el = await autofocusFixture();
      overlay = el;
      overlay.withBackdrop = true;
      await untilOpen(overlay);
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);

      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, '', 'Tab');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
      assert.isTrue(overlay.contains(document.activeElement), 'focus stays inside overlay');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
    });
  });

  describe('focusable nodes', () => {
    let overlay: TestOverlay;
    let overlayWithTabIndex: TestOverlay;
    let overlayFocusableNodes: TestOverlay;

    beforeEach(async () => {
      overlay = await focusablesFixture();
      overlayWithTabIndex = overlay.nextElementSibling as TestOverlay;
      overlayFocusableNodes = overlayWithTabIndex.nextElementSibling as TestOverlay;
    });

    it('_focusableNodes returns nodes that are focusable', async () => {
      await untilOpen(overlay);
      const focusableNodes = overlay._focusableNodes;
      assert.equal(focusableNodes.length, 3, '3 nodes are focusable');
      assert.equal(focusableNodes[0], overlay.querySelector('.focusable1'));
      assert.equal(focusableNodes[1], overlay.querySelector('.focusable2'));
      assert.equal(focusableNodes[2], overlay.querySelector('.focusable3'));
    });

    it('_focusableNodes includes overlay if it has a valid tabindex', async () => {
      await untilOpen(overlay);
      overlay.setAttribute('tabindex', '0');
      const focusableNodes = overlay._focusableNodes;
      assert.equal(focusableNodes.length, 4, '4 focusable nodes');
      assert.notEqual(focusableNodes.indexOf(overlay), -1, 'overlay is included');
    });

    it('_focusableNodes respects the tabindex order', async () => {
      await untilOpen(overlayWithTabIndex);

      const focusableNodes = overlayWithTabIndex._focusableNodes;
      assert.equal(focusableNodes.length, 6, '6 nodes are focusable');
      assert.equal(focusableNodes[0], overlayWithTabIndex.querySelector('.focusable1'));
      assert.equal(focusableNodes[1], overlayWithTabIndex.querySelector('.focusable2'));
      assert.equal(focusableNodes[2], overlayWithTabIndex.querySelector('.focusable3'));
      assert.equal(focusableNodes[3], overlayWithTabIndex.querySelector('.focusable4'));
      assert.equal(focusableNodes[4], overlayWithTabIndex.querySelector('.focusable5'));
      assert.equal(focusableNodes[5], overlayWithTabIndex.querySelector('.focusable6'));
    });

    it('_focusableNodes can be overridden', async () => {
      await untilOpen(overlayFocusableNodes);
      // It has 1 focusable in the light dom, and 2 in the shadow dom.
      const focusableNodes = overlayFocusableNodes._focusableNodes;
      assert.equal(focusableNodes.length, 2, 'length ok');
      assert.equal(focusableNodes[0], overlayFocusableNodes.shadowRoot!.querySelector('#first'), 'first ok');
      assert.equal(focusableNodes[1], overlayFocusableNodes.shadowRoot!.querySelector('#last'), 'last ok');
    });

    it('with-backdrop: TAB & Shift+TAB wrap focus', async () => {
      overlay.withBackdrop = true;
      await untilOpen(overlay);
      const focusableNodes = overlay._focusableNodes;
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);
      // Go to last element.
      (focusableNodes[focusableNodes.length - 1] as HTMLElement).focus();
      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, '', 'Tab');
      assert.equal(focusableNodes[0], document.activeElement, 'focus wrapped to first focusable');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(focusableNodes[focusableNodes.length - 1], document.activeElement, 'focus wrapped to last focusable');
      assert.isTrue(tabSpy.calledTwice, 'keydown spy called again');
      assert.isTrue(tabSpy.getCall(1).args[0].defaultPrevented, 'keydown default prevented again');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
    });

    it('with-backdrop: TAB & Shift+TAB wrap focus respecting tabindex', async () => {
      overlayWithTabIndex.withBackdrop = true;
      await untilOpen(overlayWithTabIndex);
      const focusableNodes = overlayWithTabIndex._focusableNodes;
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);
      // Go to last element.
      (focusableNodes[focusableNodes.length - 1] as HTMLElement).focus();
      // Simulate TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, '', 'Tab');
      assert.equal(focusableNodes[0], document.activeElement, 'focus wrapped to first focusable');
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(focusableNodes[focusableNodes.length - 1], document.activeElement, 'focus wrapped to last focusable');
    });

    it('with-backdrop: Shift+TAB after open wrap focus', async () => {
      overlay.withBackdrop = true;
      await untilOpen(overlay);
      const focusableNodes = overlay._focusableNodes;
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);
      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(focusableNodes[focusableNodes.length - 1], document.activeElement, 'focus wrapped to last focusable');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
    });

    it('with-backdrop: after open, update last focusable node and then Shift+TAB', async () => {
      overlay.withBackdrop = true;
      await untilOpen(overlay);
      const focusableNodes = overlay._focusableNodes;
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);
      // Before tabbing, make lastFocusable non-tabbable. This will make
      // the one before it (focusableNodes.length - 2), the new last
      // focusable node.
      (focusableNodes[focusableNodes.length - 1] as HTMLElement).setAttribute('tabindex', '-1');
      overlay.invalidateTabbables();
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(
        focusableNodes[focusableNodes.length - 2],
        document.activeElement,
        'focus wrapped correctly');
    });

    it('with-backdrop: Shift+TAB wrap focus in shadowDOM', async () => {
      overlayFocusableNodes.withBackdrop = true;
      await untilOpen(overlayFocusableNodes);
      // 1ms timeout needed by IE10 to have proper focus switching.
      await aTimeout(1);
      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(overlayFocusableNodes.shadowRoot!.querySelector('#last'), OverlayManager.deepActiveElement, 'focus wrapped to last focusable in the shadowDOM');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
    });

    it('#withBackdrop: __firstFocusableNode and __lastFocusableNode are updated after pressing tab.', async () => {
      const TAB = 9;
      overlay = await backdropFixture();
      const inputs = overlay.querySelectorAll('input');
      await untilOpen(overlay);
      // @ts-ignore
      pressAndReleaseKeyOn(document, TAB, '', 'Tab');
      // @ts-ignore
      assert.equal(overlay.__firstFocusableNode, inputs[1]);
      // @ts-ignore
      assert.equal(overlay.__lastFocusableNode, inputs[1]);
      inputs[0].removeAttribute('disabled');
      inputs[2].removeAttribute('disabled');
      // @ts-ignore
      pressAndReleaseKeyOn(document, TAB, '', 'Tab');
      // @ts-ignore
      assert.equal(overlay.__firstFocusableNode, inputs[0]);
      // @ts-ignore
      assert.equal(overlay.__lastFocusableNode, inputs[2]);
    });
  });

  describe('OverlayManager.deepActiveElement', () => {
    it('handles document.body', () => {
      document.body.focus();
      assert.equal(OverlayManager.deepActiveElement, document.body);
    });

    it('handles light dom', () => {
      const focusable = document.getElementById('focusInput') as HTMLElement;
      focusable.focus();
      assert.equal(OverlayManager.deepActiveElement, focusable, 'input is handled');
      focusable.blur();
    });

    it('handles shadow dom', () => {
      const focusable = document.getElementById('buttons')!.shadowRoot!.querySelector('#button0');
      // @ts-ignore
      focusable.focus();
      assert.equal(OverlayManager.deepActiveElement, focusable);
      // @ts-ignore
      focusable.blur();
    });
  });

  describe('restore-focus-on-close', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await autofocusFixture();
      overlay.restoreFocusOnClose = true;
    });

    afterEach(() => {
      // No matter what, return the focus to body!
      document.body.focus();
    });

    it('does not return focus on close by default (restore-focus-on-close=false)', async () => {
      overlay.restoreFocusOnClose = false;
      const focusable = document.getElementById('focusInput') as HTMLElement;
      focusable.focus();
      await untilOpen(overlay);
      await untilClose(overlay);
      assert.notEqual(OverlayManager.deepActiveElement, focusable, 'focus is not restored to focusable');
    });

    it('overlay returns focus on close', async () => {
      const focusable = document.getElementById('focusInput') as HTMLElement;
      focusable.focus();
      await untilOpen(overlay);
      await untilClose(overlay);
      assert.equal(OverlayManager.deepActiveElement, focusable, 'focus restored to focusable');
    });

    it('overlay returns focus on close (ShadowDOM)', async () => {
      const focusable = document.getElementById('buttons')!.shadowRoot!.querySelector('#button0') as HTMLElement;
      focusable.focus();
      await untilOpen(overlay);
      await untilClose(overlay);
      assert.equal(OverlayManager.deepActiveElement, focusable, 'focus restored to focusable');
    });

    it('avoids restoring focus if focus changed', async () => {
      const button0 = document.getElementById('buttons')!.shadowRoot!.querySelector('#button0') as HTMLElement;
      const button1 = document.getElementById('buttons')!.shadowRoot!.querySelector('#button1') as HTMLElement;
      button0.focus();
      await untilOpen(overlay);
      button1.focus();
      await untilClose(overlay);
      assert.equal(OverlayManager.deepActiveElement, button1, 'focus was not modified');
    });

    it('focus restored if overlay detached before closing is done', async () => {
      const focusable = document.getElementById('focusInput') as HTMLElement;
      focusable.focus();
      await untilOpen(overlay);
      const p = untilClose(overlay);
      overlay.parentNode!.removeChild(overlay);
      await p;
      // Close overlay and remove it from the DOM.
      assert.equal(OverlayManager.deepActiveElement, focusable, 'focus restored to focusable');
    });
  });

  describe('overlay with backdrop', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await backdropFixture();
      await nextFrame();
    });

    it('backdrop is opened when overlay is opened', async () => {
      assert.isOk(overlay.backdropElement, 'backdrop is defined');
      await untilOpen(overlay);
      assert.isTrue(overlay.backdropElement.opened, 'backdrop is opened');
      assert.isOk(overlay.backdropElement.parentNode, 'backdrop is inserted in the DOM');
    });

    it('backdrop appears behind the overlay', async () => {
      await untilOpen(overlay);
      const styleZ = parseInt(window.getComputedStyle(overlay).zIndex, 10);
      const backdropStyleZ = parseInt(window.getComputedStyle(overlay.backdropElement).zIndex, 10);
      assert.isTrue(styleZ > backdropStyleZ, 'overlay has higher z-index than backdrop');
    });

    it('backdrop is removed when overlay is closed', async () => {
      await untilOpen(overlay);
      await untilClose(overlay);
      assert.isFalse(overlay.backdropElement.opened, 'backdrop is closed');
      assert.isNotOk(overlay.backdropElement.parentNode, 'backdrop is removed from the DOM');
      assert.lengthOf(document.querySelectorAll('arc-overlay-backdrop'), 0, 'no backdrop elements on body');
    });

    it('backdrop is removed when the element is removed from DOM', async () => {
      await untilOpen(overlay);
      // Ensure detached is executed.
      overlay.parentNode!.removeChild(overlay);
      await nextFrame();
      assert.isFalse(overlay.backdropElement.opened, 'backdrop is closed');
      assert.isNotOk(overlay.backdropElement.parentNode, 'backdrop is removed from the DOM');
      assert.lengthOf(document.querySelectorAll('arc-overlay-backdrop'), 0, 'no backdrop elements on body');
      assert.isNotOk(overlay._manager.currentOverlay(), 'currentOverlay ok');
    });

    it('manager.getBackdrops() updated on opened changes', async () => {
      await untilOpen(overlay);
      assert.equal(OverlayManager.getBackdrops().length, 1, 'overlay added to manager backdrops');
      await untilClose(overlay);
      assert.equal(OverlayManager.getBackdrops().length, 0, 'overlay removed from manager backdrops');
    });

    it('updating with-backdrop to false closes backdrop', async () => {
      await untilOpen(overlay);
      overlay.withBackdrop = false;
      await nextFrame();
      assert.isFalse(overlay.backdropElement.opened, 'backdrop is closed');
      assert.isNotObject(overlay.backdropElement.parentNode, 'backdrop is removed from document');
    });

    it('backdrop is removed when toggling overlay opened', async () => {
      overlay.open();
      await untilClose(overlay);
      assert.isFalse(overlay.backdropElement.opened, 'backdrop is closed');
      assert.isNotOk(overlay.backdropElement.parentNode, 'backdrop is removed from document');
    });

    it('withBackdrop = false does not prevent click outside event', async () => {
      overlay.withBackdrop = false;
      await untilOpen(overlay);
      const spy = sinon.spy();
      overlay.addEventListener('cancel', spy);
      document.body.click();
      assert.isTrue(spy.called);
    });
  });

  describe('multiple overlays', () => {
    let overlay1: TestOverlay;
    let overlay2: TestOverlay;

    beforeEach(async () => {
      overlay1 = await multipleFixture();
      overlay2 = overlay1.nextElementSibling as TestOverlay;
      await nextFrame();
    });

    it('new overlays appear on top', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const styleZ = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const styleZ1 = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      assert.isTrue(styleZ1 > styleZ, 'overlay2 has higher z-index than overlay1');
    });

    it('ESC closes only the top overlay', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      // @ts-ignore
      pressAndReleaseKeyOn(document, 27, '', 'Escape');
      assert.isFalse(overlay2.opened, 'overlay2 was closed');
      assert.isTrue(overlay1.opened, 'overlay1 is still opened');
    });

    it('close an overlay in proximity to another overlay', async () => {
      // Open and close a separate overlay.
      overlay1.open();
      overlay1.close();
      // Open the overlay we care about.
      overlay2.open();
      // Immediately close the first overlay.
      // Wait for infinite recursion, otherwise we win.
      await untilClose(overlay2);
    });

    it('allow-click-through allows overlay below to handle click', async () => {
      overlay2.allowClickThrough = true;
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      document.body.click();
      assert.isFalse(overlay1.opened, 'overlay1 was closed');
      assert.isFalse(overlay2.opened, 'overlay2 was closed');
    });

    it('allow-click-through and no-cancel-on-outside-click combo', async () => {
      overlay2.allowClickThrough = true;
      overlay2.noCancelOnOutsideClick = true;
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      document.body.click();
      assert.isTrue(overlay2.opened, 'overlay2 still open');
      assert.isFalse(overlay1.opened, 'overlay1 was closed');
    });
  });

  describe('Manager overlays in sync', () => {
    let overlays: HTMLElement[];
    let overlay1: TestOverlay;
    let overlay2: TestOverlay;

    beforeEach(async () => {
      overlay1 = await multipleFixture();
      overlay2 = overlay1.nextElementSibling as TestOverlay;
      overlays = OverlayManager._overlays;
      await nextFrame();
    });

    it('no duplicates after attached', async () => {
      overlay1 = document.createElement('test-overlay');
      document.body.appendChild(overlay1);
      await untilOpen(overlay1);
      assert.equal(overlays.length, 1, 'correct count after open and attached');
      document.body.removeChild(overlay1);
    });

    it('call open multiple times handled', async () => {
      overlay1.open();
      overlay1.open();
      await untilOpen(overlay1);
      assert.equal(overlays.length, 1, '1 overlay after open');
    });

    it('close handled', async () => {
      await untilOpen(overlay1);
      await untilClose(overlay1);
      assert.equal(overlays.length, 0, '0 overlays after close');
    });

    it('open/close brings overlay on top', async () => {
      overlay1.open();
      await untilOpen(overlay2);
      assert.equal(overlays.indexOf(overlay1), 0, 'overlay1 at index 0');
      assert.equal(overlays.indexOf(overlay2), 1, 'overlay2 at index 1');
      overlay1.close();
      await untilOpen(overlay1);
      assert.equal(
        overlays.indexOf(overlay1), 1, 'overlay1 moved at index 1');
      assert.isAbove(
        // eslint-disable-next-line radix
        parseInt(overlay1.style.zIndex),
        // eslint-disable-next-line radix
        parseInt(overlay2.style.zIndex), 
        'overlay1 on top of overlay2'
      );
    });
  });

  describe('z-ordering', () => {
    let originalMinimumZ: number;
    let overlay1: TestOverlay;

    beforeEach(async () => {
      overlay1 = await multipleFixture();
      originalMinimumZ = OverlayManager._minimumZ;
      await nextFrame();
    });

    afterEach(() => {
      OverlayManager._minimumZ = originalMinimumZ;
    });

    // for iframes
    it('default z-index is greater than 100', async () => {
      await untilOpen(overlay1);
      const styleZ = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      assert.isTrue(styleZ > 100, 'overlay1 z-index is <= 100');
    });

    it('ensureMinimumZ() effects z-index', async () => {
      OverlayManager.ensureMinimumZ(1000);
      await untilOpen(overlay1);
      const styleZ = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      assert.isTrue(styleZ > 1000, 'overlay1 z-index is <= 1000');
    });

    it('ensureMinimumZ() never decreases the minimum z-index', async () => {
      OverlayManager.ensureMinimumZ(1000);
      OverlayManager.ensureMinimumZ(500);
      await untilOpen(overlay1);
      const styleZ = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      assert.isTrue(styleZ > 1000, 'overlay1 z-index is <= 1000');
    });
  });

  describe('multiple overlays with backdrop', () => {
    let overlay1: TestOverlay;
    let overlay2: TestOverlay;
    let overlay3: TestOverlay;

    beforeEach(async () => {
      overlay1 = await multipleFixture();
      overlay2 = overlay1.nextElementSibling as TestOverlay;
      overlay3 = overlay2.nextElementSibling as TestOverlay;
      overlay1.withBackdrop = true;
      overlay2.withBackdrop = true;
      overlay3.withBackdrop = true;
      await nextFrame();
    });

    it('multiple overlays share the same backdrop', () => {
      assert.isTrue(overlay1.backdropElement === overlay2.backdropElement, 'overlay1 and overlay2 have the same backdrop element');
      assert.isTrue(overlay1.backdropElement === overlay3.backdropElement, 'overlay1 and overlay3 have the same backdrop element');
    });

    it('only one overlay-backdrop in the DOM', async () => {
      // Open them all.
      overlay1.opened = true;
      overlay2.opened = true;
      await untilOpen(overlay3);
      assert.lengthOf(document.querySelectorAll('arc-overlay-backdrop'), 1, 'only one backdrop element in the DOM');
    });

    it('arc-overlay-backdrop is removed from the DOM when all overlays with backdrop are closed', async () => {
      // Open & close them all.
      overlay1.opened = true;
      overlay2.opened = true;
      await untilOpen(overlay3);
      overlay1.opened = false;
      overlay2.opened = false;
      await untilClose(overlay3);
      assert.lengthOf(document.querySelectorAll('arc-overlay-backdrop'), 0, 'backdrop element removed from the DOM');
    });

    it('newest overlay appear on top', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const style1Z = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const style2Z = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      const bgStyleZ = parseInt(window.getComputedStyle(overlay1.backdropElement).zIndex, 10);
      assert.isAbove(style2Z, style1Z, 'overlay2 above overlay1');
      assert.isAbove(style2Z, bgStyleZ, 'overlay2 above backdrop');
      assert.isBelow(style1Z, bgStyleZ, 'overlay1 below backdrop');
    });

    it('updating with-backdrop updates z-index', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      overlay2.withBackdrop = false;
      await nextFrame();
      const style1Z = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const style2Z = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      const bgStyleZ = parseInt(window.getComputedStyle(overlay1.backdropElement).zIndex, 10);
      assert.isAbove(style2Z, bgStyleZ, 'overlay2 above backdrop');
      assert.isAbove(style1Z, bgStyleZ, 'overlay1 below backdrop');
    });

    it('click event handled only by top overlay', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const btn = overlay2.querySelector('button')!;
      btn.addEventListener('click', () => {
        overlay2.close();
      });
      btn.click();
      assert.isFalse(overlay2.opened, 'overlay2 closed');
      assert.isTrue(overlay1.opened, 'overlay1 opened');
    });
  });

  describe('overlay in composed tree', () => {
    let composed: TestMenuButton;
    let overlay: TestOverlay;

    beforeEach(async () => {
      composed = await composedFixture();
      overlay = composed.shadowRoot!.querySelector('#overlay') as TestOverlay;
      overlay.withBackdrop = true;
      await untilOpen(overlay);
    });

    it('click on overlay content does not close it', async () => {
      // Tap on button inside overlay.
      overlay.querySelector('button')!.click();
      await aTimeout(1);
      assert.isTrue(overlay.opened, 'overlay still opened');
    });

    it('with-backdrop wraps the focus within the overlay', () => {
      const buttons = overlay.querySelectorAll('button');
      // Go to last element.
      buttons[buttons.length - 1].focus();
      // Spy keydown.
      const tabSpy = sinon.spy();
      document.addEventListener('keydown', tabSpy);
      // Simulate TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, '', 'Tab');
      assert.equal(buttons[0], OverlayManager.deepActiveElement, 'focus wrapped to first focusable');
      assert.isTrue(tabSpy.calledOnce, 'keydown spy called');
      assert.isTrue(tabSpy.getCall(0).args[0].defaultPrevented, 'keydown default prevented');
      // Simulate Shift+TAB.
      // @ts-ignore
      pressAndReleaseKeyOn(document, 9, ['shift'], 'Tab');
      assert.equal(buttons[buttons.length - 1], OverlayManager.deepActiveElement, 'focus wrapped to last focusable');
      assert.isTrue(tabSpy.calledTwice, 'keydown spy called again');
      assert.isTrue(tabSpy.getCall(1).args[0].defaultPrevented, 'keydown default prevented again');
      // Cleanup.
      document.removeEventListener('keydown', tabSpy);
    });
  });

  describe('always-on-top', () => {
    let overlay1: TestOverlay;
    let overlay2: TestOverlay;

    beforeEach(async () => {
      overlay1 = await multipleFixture();
      overlay2 = overlay1.nextElementSibling as TestOverlay;
      overlay1.alwaysOnTop = true;
      await nextFrame();
    });

    it('stays on top', async () => {
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const zIndex1 = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const zIndex2 = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      assert.isAbove(zIndex1, zIndex2, 'overlay1 on top');
      assert.equal(OverlayManager.currentOverlay(), overlay1, 'currentOverlay ok');
    });

    it('stays on top also if another overlay is with-backdrop', async () => {
      overlay2.withBackdrop = true;
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const zIndex1 = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const zIndex2 = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      assert.isAbove(zIndex1, zIndex2, 'overlay1 on top');
      assert.equal(OverlayManager.currentOverlay(), overlay1, 'currentOverlay ok');
    });

    it('last overlay with always-on-top wins', async () => {
      overlay2.alwaysOnTop = true;
      await untilOpen(overlay1);
      await untilOpen(overlay2);
      const zIndex1 = parseInt(window.getComputedStyle(overlay1).zIndex, 10);
      const zIndex2 = parseInt(window.getComputedStyle(overlay2).zIndex, 10);
      assert.isAbove(zIndex2, zIndex1, 'overlay2 on top');
      assert.equal(OverlayManager.currentOverlay(), overlay2, 'currentOverlay ok');
    });
  });

  describe('animations', () => {
    let overlay: TestOverlay;
    beforeEach(async () => {
      overlay = await basicFixture();
      overlay.animated = true;
      await nextFrame();
    });

    it('overlay animations correctly triggered', (done) => {
      overlay.addEventListener('simple-overlay-open-animation-start', () => {
        // Since animated overlay will transition center + 300px to center,
        // we should not find the element at the center when the open animation
        // starts.
        const centerElement = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
        assert.notEqual(centerElement, overlay, 'overlay should not be centered already');
        done();
      });
      overlay.open();
    });

    // it('overlay detached before opening animation is done', async () => {
    //   await untilOpen(overlay);

    //   // Test will fail if `done` is called more than once.
    //   runAfterOpen(overlay, () => {
    //     assert.equal(overlay.style.display, '', 'overlay displayed');
    //     assert.notEqual(overlay.style.zIndex, '', 'z-index ok');
    //     done();
    //   });
    //   // After some time, but before the animation is completed...
    //   setTimeout(() => {
    //     // Animation is not done yet, but we remove the overlay already.
    //     overlay.parentNode!.removeChild(overlay);
    //   }, 50);
    // });

    // it('overlay detached before closing animation is done', (done) => {
    //   await untilOpen(overlay);
    //   await untilClose(overlay);

    //   runAfterOpen(overlay, () => {
    //     // Test will fail if `done` is called more than once.
    //     runAfterClose(overlay, () => {
    //       assert.equal(overlay.style.display, 'none', 'overlay hidden');
    //       assert.equal(overlay.style.zIndex, '', 'z-index reset');
    //       done();
    //     });
    //     // After some time, but before the animation is completed...
    //     setTimeout(() => {
    //       // Animation is not done yet, but we remove the overlay already.
    //       overlay.parentNode!.removeChild(overlay);
    //     }, 50);
    //   });
    // });
  });

  describe('oncancel', () => {
    let element: TestOverlay;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.oncancel);
      const f = () => { };
      element.oncancel = f;
      assert.isTrue(element.oncancel === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oncancel = f;
      element.cancel();
      element.oncancel = null;
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
      element.oncancel = f1;
      element.oncancel = f2;
      element.cancel();
      element.oncancel = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onopened', () => {
    let element: TestOverlay;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onopened);
      const f = () => { };
      element.onopened = f;
      assert.isTrue(element.onopened === f);
    });

    it('Calls registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onopened = f;
      await untilOpen(element);
      element.onopened = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onopened = f1;
      element.onopened = f2;
      await untilOpen(element);
      element.onopened = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onclosed', () => {
    let element: TestOverlay;
    beforeEach(async () => {
      element = await openedFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isNull(element.onclosed);
      const f = () => { };
      element.onclosed = f;
      assert.isTrue(element.onclosed === f);
    });

    it('calls the registered function', async () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onclosed = f;
      await untilClose(element);
      element.onclosed = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', async () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onclosed = f1;
      element.onclosed = f2;
      await untilClose(element);
      element.onclosed = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('_clickIsInsideOverlay()', () => {
    let element: TestOverlay;

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('should return false if clientX is too far left of bounds', () => {
      const clickEvent = { clientX: 550, clientY: 450 };
      const overlay = { getBoundingClientRect: () => ({ left: 600, right: 700, bottom: 500, top: 400 }) };
      // @ts-ignore
      assert.isFalse(element._manager._clickIsInsideOverlay(clickEvent, overlay));
    });

    it('should return false if clientX is too far right of bounds', () => {
      const clickEvent = { clientX: 750, clientY: 450 };
      const overlay = { getBoundingClientRect: () => ({ left: 600, right: 700, bottom: 500, top: 400 }) };
      // @ts-ignore
      assert.isFalse(element._manager._clickIsInsideOverlay(clickEvent, overlay));
    });

    it('should return false if clientY is too far up of bounds', () => {
      const clickEvent = { clientX: 650, clientY: 350 };
      const overlay = { getBoundingClientRect: () => ({ left: 600, right: 700, bottom: 500, top: 400 }) };
      // @ts-ignore
      assert.isFalse(element._manager._clickIsInsideOverlay(clickEvent, overlay));
    });

    it('should return false if clientY is too far down of bounds', () => {
      const clickEvent = { clientX: 650, clientY: 550 };
      const overlay = { getBoundingClientRect: () => ({ left: 600, right: 700, bottom: 500, top: 400 }) };
      // @ts-ignore
      assert.isFalse(element._manager._clickIsInsideOverlay(clickEvent, overlay));
    });

    it('should return true when clientX and clientY are in bounds', () => {
      const clickEvent = { clientX: 650, clientY: 450 };
      const overlay = { getBoundingClientRect: () => ({ left: 600, right: 700, bottom: 500, top: 400 }) };
      // @ts-ignore
      assert.isTrue(element._manager._clickIsInsideOverlay(clickEvent, overlay));
    });
  });

  describe('a11y', () => {
    it('overlay has aria-hidden=true when opened', async () => {
      const overlay = await basicFixture();
      assert.equal(overlay.getAttribute('aria-hidden'), 'true', 'overlay has aria-hidden="true"');
      overlay.open();
      await nextFrame();
      assert.isFalse(overlay.hasAttribute('aria-hidden'), 'overlay does not have aria-hidden attribute');
      overlay.close();
      await nextFrame();
      assert.equal(overlay.getAttribute('aria-hidden'), 'true', 'overlay has aria-hidden="true"');
    });
  });
});

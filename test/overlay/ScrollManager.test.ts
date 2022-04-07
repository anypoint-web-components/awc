import {fixture, assert} from '@open-wc/testing';
import {keyboardEventFor} from '@polymer/iron-test-helpers/mock-interactions.js';
// import {elementIsScrollLocked, pushScrollLock, removeScrollLock} from '../arc-scroll-manager.js';
import { ScrollManager } from '../../src/index.js';
import './x-scrollable-element.js';
import { XScrollableElement } from './x-scrollable-element.js';

describe('ScrollManager', () => {
  async function basicFixture(): Promise<XScrollableElement> {
    return fixture(`
      <x-scrollable-element id="Parent">
        <div id="LightElement"></div>
      </x-scrollable-element>
    `);
  }

  const scrollEvents = [
    'wheel',
    'mousewheel',
    'DOMMouseScroll',
    'touchstart',
    'touchmove',
  ];

  describe('IronScrollManager', () => {
    let parent: XScrollableElement;
    let childOne: HTMLDivElement;
    let childTwo: HTMLDivElement;
    let grandChildOne: HTMLDivElement;
    let grandChildTwo: HTMLDivElement;
    let ancestor: HTMLElement;
    let lightElement: HTMLDivElement;

    beforeEach(async () => {
      parent = await basicFixture();
      childOne = parent.shadowRoot!.querySelector('#ChildOne') as HTMLDivElement;
      childTwo = parent.shadowRoot!.querySelector('#ChildTwo') as HTMLDivElement;
      grandChildOne = parent.shadowRoot!.querySelector('#GrandchildOne') as HTMLDivElement;
      grandChildTwo = parent.shadowRoot!.querySelector('#GrandchildTwo') as HTMLDivElement;
      lightElement = parent.querySelector('#LightElement') as HTMLDivElement;
      ancestor = document.body;
    });

    describe('constraining scroll in the DOM', () => {
      beforeEach(() => {
        ScrollManager.pushScrollLock(childOne);
      });

      afterEach(() => {
        ScrollManager.removeScrollLock(childOne);
      });

      it('recognizes sibling as locked', () => {
        assert.isTrue(ScrollManager.elementIsScrollLocked(childTwo));
      });

      it('recognizes neice as locked', () => {
        assert.isTrue(ScrollManager.elementIsScrollLocked(grandChildTwo));
      });

      it('recognizes parent as locked', () => {
        assert.isTrue(ScrollManager.elementIsScrollLocked(parent));
      });

      it('recognizes light DOM element as locked', () => {
        assert.isTrue(ScrollManager.elementIsScrollLocked(lightElement));
      });

      it('recognizes ancestor as locked', () => {
        assert.isTrue(ScrollManager.elementIsScrollLocked(ancestor));
      });

      it('recognizes locking child as unlocked', () => {
        assert.isFalse(ScrollManager.elementIsScrollLocked(childOne));
      });

      it('recognizes descendant of locking child as unlocked', () => {
        assert.isFalse(ScrollManager.elementIsScrollLocked(grandChildOne));
      });

      it('unlocks locked elements when there are no locking elements', () => {
        ScrollManager.removeScrollLock(childOne);
        assert.isFalse(ScrollManager.elementIsScrollLocked(parent));
      });

      describe('various scroll events', () => {
        let events: CustomEvent[];

        beforeEach(() => {
          events = scrollEvents.map((scrollEvent) => {
            const event = new CustomEvent(scrollEvent, {bubbles: true, cancelable: true, composed: true });
            // @ts-ignore
            event.deltaX = 0;
            // @ts-ignore
            event.deltaY = 10;
            return event;
          });
        });

        it('prevents wheel events from locked elements', () => {
          events.forEach((event) => {
            childTwo.dispatchEvent(event);
            assert.isTrue(event.defaultPrevented, `${event.type} ok`);
          });
        });

        it('allows wheel events when there are no locking elements', () => {
          ScrollManager.removeScrollLock(childOne);
          events.forEach((event) => {
            childTwo.dispatchEvent(event);
            assert.isFalse(event.defaultPrevented, `${event.type} ok`);
          });
        });

        it('allows wheel events from unlocked elements', () => {
          events.forEach((event) => {
            childOne.dispatchEvent(event);
            assert.isFalse(event.defaultPrevented, `${event.type} ok`);
          });
        });

        it('touchstart is prevented if dispatched by an element outside the locking element', () => {
          const event = new CustomEvent('touchstart', { bubbles: true, cancelable: true, composed: true });
          childTwo.dispatchEvent(event);
          assert.isTrue(event.defaultPrevented, `${event.type} ok`);
        });

        it('touchstart is not prevented if dispatched by an element inside the locking element', () => {
          const event = new CustomEvent('touchstart', { bubbles: true, cancelable: true, composed: true });
          grandChildOne.dispatchEvent(event);
          assert.isFalse(event.defaultPrevented, `${event.type} ok`);
        });

        it('arrow keyboard events not prevented by manager', () => {
          // Even if these events might cause scrolling, they should not be
          // prevented because they might cause a11y issues (e.g. arrow keys
          // used for navigating the content). iron-dropdown is capable of
          // restoring the scroll position of the document if necessary.
          const left = keyboardEventFor('keydown', 37);
          const up = keyboardEventFor('keydown', 38);
          const right = keyboardEventFor('keydown', 39);
          const down = keyboardEventFor('keydown', 40);
          grandChildOne.dispatchEvent(left);
          grandChildOne.dispatchEvent(up);
          grandChildOne.dispatchEvent(right);
          grandChildOne.dispatchEvent(down);
          assert.isFalse(left.defaultPrevented, 'left ok');
          assert.isFalse(up.defaultPrevented, 'up ok');
          assert.isFalse(right.defaultPrevented, 'right ok');
          assert.isFalse(down.defaultPrevented, 'down ok');
        });
      });
    });
  });
});

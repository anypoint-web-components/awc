/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fixture, assert, nextFrame } from "@open-wc/testing";
import sinon from "sinon";
import { TestElement } from "./resize-elements.js";
import "./resize-elements.js";
import './test-elements.js';
import { XResizerParent } from './x-resizer-parent.js';
import { XResizerParentFiltered, XResizableInShadow, XLightResizable, XShadowResizable } from "./resize-elements.js";
import { Xresizable } from './x-resizable.js';

describe("ResizableMixin", () => {
  describe("Basics", () => {
    let pendingNotifications = 0;

    async function basicFixture(): Promise<TestElement> {
      return fixture("<test-element></test-element>");
    }

    function ListenForResize(el: EventTarget, expectsResize?: boolean): any {
      const listener = () => {
        // const target = event.path ? event.path[0] : event.target;
        pendingNotifications--;
      };

      if (expectsResize !== false) {
        pendingNotifications++;
      }
      el.addEventListener("resize", listener);
      return {
        el,
        remove: () => {
          el.removeEventListener("resize", listener);
        },
      };
    }

    function RemoveListeners(listeners: any[]): void {
      listeners.forEach((listener) => {
        listener.remove();
      });
    }

    function $(el: HTMLElement, id: string): HTMLElement {
      const node = el.shadowRoot!.querySelector(id) as HTMLElement;
      assert.ok(node, `"${id}" node not found`);
      return node;
    }

    let testEl: TestElement;
    beforeEach(async () => {
      testEl = await basicFixture();
      await nextFrame();
      pendingNotifications = 0;
    });

    describe("x-resizer-parent", () => {
      it("notify resizables from window", () => {
        const listeners = [
          ListenForResize($(testEl, "#parent")),
          ListenForResize($(testEl, "#child1a")),
          ListenForResize($(testEl, "#child1b")),
          ListenForResize($($(testEl, "#shadow1c"), "#resizable")),
          ListenForResize($($(testEl, "#shadow1d"), "#resizable")),
        ];
        window.dispatchEvent(new CustomEvent("resize", { bubbles: false }));
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });

      it("notify resizables from parent", () => {
        const listeners = [
          ListenForResize($(testEl, "#parent")),
          ListenForResize($(testEl, "#child1a")),
          ListenForResize($(testEl, "#child1b")),
          ListenForResize($($(testEl, "#shadow1c"), "#resizable")),
          ListenForResize($($(testEl, "#shadow1d"), "#resizable")),
        ];
        ($(testEl, "#parent") as XResizerParent).notifyResize();
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });

      it("detach resizables then notify parent", async () => {
        const testElParent = $(testEl, "#parent") as XResizerParent;
        const child1a = $(testEl, "#child1a") as Xresizable;
        const child1b = $(testEl, "#child1b") as Xresizable;
        const shadow1cResizable = $($(testEl, "#shadow1c") as XResizableInShadow, "#resizable") as Xresizable;
        const shadow1bResizable = $($(testEl, "#shadow1d") as XResizableInShadow, "#resizable") as Xresizable;
        const child1aSpy = sinon.spy(child1a, "notifyResize");
        const shadow1cResizableSpy = sinon.spy(shadow1cResizable, "notifyResize");
        const child1bSpy = sinon.spy(child1b, "notifyResize");
        const shadow1bResizableSpy = sinon.spy(shadow1bResizable, "notifyResize");
        const firstElementToRemove = child1a;
        const firstElementParent = child1a.parentNode!;
        const secondElementToRemove = shadow1cResizable;
        const secondElementParent = shadow1cResizable.parentNode!;
        firstElementParent.removeChild(firstElementToRemove);
        secondElementParent.removeChild(secondElementToRemove);
        await nextFrame();
        testElParent.notifyResize();
        assert.equal(child1aSpy.callCount, 0);
        assert.equal(shadow1cResizableSpy.callCount, 0);
        assert.equal(child1bSpy.callCount, 1);
        assert.equal(shadow1bResizableSpy.callCount, 1);
      });

      it("detach parent then notify window", (done) => {
        const listeners = [
          ListenForResize($(testEl, "#parent")),
          ListenForResize($(testEl, "#child1a")),
          ListenForResize($(testEl, "#child1b")),
          ListenForResize($($(testEl, "#shadow1c"), "#resizable")),
          ListenForResize($($(testEl, "#shadow1d"), "#resizable")),
        ];
        const el = $(testEl, "#parent") as XResizerParent;
        el.parentNode!.removeChild(el);
        pendingNotifications = 0;
        setTimeout(() => {
          try {
            window.dispatchEvent(new CustomEvent("resize", { bubbles: false }));
            assert.equal(pendingNotifications, 0);
            RemoveListeners(listeners);
            done();
          } catch (e) {
            RemoveListeners(listeners);
            done(e);
          }
        }, 0);
      });
    });

    describe("x-resizer-parent-filtered", () => {
      it("notify resizables from window", () => {
        const parentFiltered = $(testEl, "#parentFiltered") as XResizerParentFiltered;
        const child2a = $(testEl, "#child2a");
        const listeners = [
          ListenForResize(parentFiltered),
          ListenForResize(child2a),
          ListenForResize($(testEl, "#child2b"), false),
          ListenForResize($($(testEl, "#shadow2c"), "#resizable"), false),
          ListenForResize($($(testEl, "#shadow2d"), "#resizable"), false),
        ];
        parentFiltered.active = child2a;
        window.dispatchEvent(new CustomEvent("resize", { bubbles: false }));
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });

      it("notify resizables from parent", () => {
        const parentFiltered = $(testEl, "#parentFiltered") as XResizerParentFiltered;
        const child2a = $(testEl, "#child2a");
        const listeners = [
          ListenForResize(parentFiltered),
          ListenForResize(child2a),
          ListenForResize($(testEl, "#child2b"), false),
          ListenForResize($($(testEl, "#shadow2c"), "#resizable"), false),
          ListenForResize($($(testEl, "#shadow2d"), "#resizable"), false),
        ];
        parentFiltered.active = child2a;
        parentFiltered.notifyResize();
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });

      it("detach resizables then notify parent", () => {
        const parentFiltered = $(testEl, "#parentFiltered") as XResizerParentFiltered;
        const child2a = $(testEl, "#child2a");
        const shadow2dResizable = $($(testEl, "#shadow2d"), "#resizable");
        const listeners = [
          ListenForResize(parentFiltered),
          ListenForResize(child2a, false),
          ListenForResize($(testEl, "#child2b"), false),
          ListenForResize($($(testEl, "#shadow2c"), "#resizable"), false),
          ListenForResize(shadow2dResizable),
        ];
        child2a.parentNode!.removeChild(child2a);
        const shadow2c = $(testEl, "#shadow2c");
        shadow2c.parentNode!.removeChild(shadow2c);
        parentFiltered.active = shadow2dResizable;
        parentFiltered.notifyResize();
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });
    });
  });

  describe('Advanced', () => {
    let resizable: XLightResizable;
  
    async function basicFixture(): Promise<XLightResizable> {
      return (fixture('<x-light-resizable></x-light-resizable>'));
    }
  
    describe('events across shadow boundaries', () => {
      beforeEach(async () => {
        resizable = await basicFixture();
        await nextFrame();
      });
  
      describe('ancestor\'s resize', () => {
        it('only fires once for a notifying shadow descendent', async () => {
          const initialCount = resizable.ironResizeCount;
          const r1 = resizable.shadowRoot!.querySelector('#childResizable1') as XShadowResizable;
          r1.notifyResize();
          assert.equal(resizable.ironResizeCount - initialCount, 1);
        });
  
        it('only fires once when notifying descendent observables', () => {
          const initialCount = resizable.ironResizeCount;
          resizable.notifyResize();
          assert.equal(resizable.ironResizeCount - initialCount, 1);
        });
      });
  
      describe('descendant\'s "resize"', () => {
        it('only fires once for a notifying shadow root', () => {
          const r1 = resizable.shadowRoot!.querySelector('#childResizable1') as XShadowResizable;
          const r2 = resizable.shadowRoot!.querySelector('#childResizable2') as XShadowResizable;
          const childResizable1InitialCount = r1.ironResizeCount;
          const childResizable2InitialCount = r2.ironResizeCount;
          resizable.notifyResize();
          assert.equal(r1.ironResizeCount - childResizable1InitialCount, 1);
          assert.equal(r2.ironResizeCount - childResizable2InitialCount, 1);
        });
  
        it('only fires once for a notifying descendent observable', () => {
          const r1 = resizable.shadowRoot!.querySelector('#childResizable1') as XShadowResizable;
          const initialCount = r1.ironResizeCount;
          r1.notifyResize();
          assert.equal(r1.ironResizeCount - initialCount, 1);
        });
      });
  
      describe('window\'s resize', () => {
        it('causes all "resize" events to fire once', async () => {
          const rootInitialCount = resizable.ironResizeCount;
          const r1 = resizable.shadowRoot!.querySelector('#childResizable1') as XShadowResizable;
          const r2 = resizable.shadowRoot!.querySelector('#childResizable2') as XShadowResizable;
          const childResizable1InitialCount = r1.ironResizeCount;
          const childResizable2InitialCount = r2.ironResizeCount;
          window.dispatchEvent(new CustomEvent('resize'));
          await nextFrame();
          assert.equal(resizable.ironResizeCount - rootInitialCount, 1);
          assert.equal(r1.ironResizeCount - childResizable1InitialCount, 1);
          assert.equal(r2.ironResizeCount - childResizable2InitialCount, 1);
        });
      });
    });
  });
});

import { fixture, assert, nextFrame } from "@open-wc/testing";
import sinon from "sinon";
import "./resize-elements.js";
import './test-elements.js';

describe("ResizableMixin", () => {
  describe("Basics", () => {
    let pendingNotifications;

    async function basicFixture() {
      return fixture("<test-element></test-element>");
    }

    function ListenForResize(el, expectsResize) {
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

    function RemoveListeners(listeners) {
      listeners.forEach((listener) => {
        listener.remove();
      });
    }

    function $(el, id) {
      const node = el.shadowRoot.querySelector(id);
      assert.ok(node, `"${id}" node not found`);
      return node;
    }

    let testEl;
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
        $(testEl, "#parent").notifyResize();
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });

      it("detach resizables then notify parent", async () => {
        const testElParent = $(testEl, "#parent");
        const child1a = $(testEl, "#child1a");
        const child1b = $(testEl, "#child1b");
        const shadow1cResizable = $($(testEl, "#shadow1c"), "#resizable");
        const shadow1bResizable = $($(testEl, "#shadow1d"), "#resizable");
        sinon.spy(child1a, "notifyResize");
        sinon.spy(shadow1cResizable, "notifyResize");
        sinon.spy(child1b, "notifyResize");
        sinon.spy(shadow1bResizable, "notifyResize");
        const firstElementToRemove = child1a;
        const firstElementParent = child1a.parentNode;
        const secondElementToRemove = shadow1cResizable;
        const secondElementParent = shadow1cResizable.parentNode;
        firstElementParent.removeChild(firstElementToRemove);
        secondElementParent.removeChild(secondElementToRemove);
        await nextFrame();
        testElParent.notifyResize();
        assert.equal(child1a.notifyResize.callCount, 0);
        assert.equal(shadow1cResizable.notifyResize.callCount, 0);
        assert.equal(child1b.notifyResize.callCount, 1);
        assert.equal(shadow1bResizable.notifyResize.callCount, 1);
      });

      it("detach parent then notify window", (done) => {
        const listeners = [
          ListenForResize($(testEl, "#parent")),
          ListenForResize($(testEl, "#child1a")),
          ListenForResize($(testEl, "#child1b")),
          ListenForResize($($(testEl, "#shadow1c"), "#resizable")),
          ListenForResize($($(testEl, "#shadow1d"), "#resizable")),
        ];
        const el = $(testEl, "#parent");
        el.parentNode.removeChild(el);
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
        const parentFiltered = $(testEl, "#parentFiltered");
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
        const parentFiltered = $(testEl, "#parentFiltered");
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
        const parentFiltered = $(testEl, "#parentFiltered");
        const child2a = $(testEl, "#child2a");
        const shadow2dResizable = $($(testEl, "#shadow2d"), "#resizable");
        const listeners = [
          ListenForResize(parentFiltered),
          ListenForResize(child2a, false),
          ListenForResize($(testEl, "#child2b"), false),
          ListenForResize($($(testEl, "#shadow2c"), "#resizable"), false),
          ListenForResize(shadow2dResizable),
        ];
        child2a.parentNode.removeChild(child2a);
        const shadow2c = $(testEl, "#shadow2c");
        shadow2c.parentNode.removeChild(shadow2c);
        parentFiltered.active = shadow2dResizable;
        parentFiltered.notifyResize();
        assert.equal(pendingNotifications, 0);
        RemoveListeners(listeners);
      });
    });
  });

  describe('Advanced', () => {
    let resizable;
  
    async function basicFixture() {
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
          const r1 = resizable.shadowRoot.querySelector('#childResizable1');
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
          const r1 = resizable.shadowRoot.querySelector('#childResizable1');
          const r2 = resizable.shadowRoot.querySelector('#childResizable2');
          const childResizable1InitialCount = r1.ironResizeCount;
          const childResizable2InitialCount = r2.ironResizeCount;
          resizable.notifyResize();
          assert.equal(r1.ironResizeCount - childResizable1InitialCount, 1);
          assert.equal(r2.ironResizeCount - childResizable2InitialCount, 1);
        });
  
        it('only fires once for a notifying descendent observable', () => {
          const r1 = resizable.shadowRoot.querySelector('#childResizable1');
          const initialCount = r1.ironResizeCount;
          r1.notifyResize();
          assert.equal(r1.ironResizeCount - initialCount, 1);
        });
      });
  
      describe('window\'s resize', () => {
        it('causes all "resize" events to fire once', async () => {
          const rootInitialCount = resizable.ironResizeCount;
          const r1 = resizable.shadowRoot.querySelector('#childResizable1');
          const r2 = resizable.shadowRoot.querySelector('#childResizable2');
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

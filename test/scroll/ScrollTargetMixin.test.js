import { fixture, assert, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';


import './scrollable-element.js';
import './nested-scrollable-element.js';

const s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = `
#temporaryScrollingRegion,
#region {
  overflow: auto;
  width: 100px;
  height: 100px;
}
`;
document.getElementsByTagName('head')[0].appendChild(s);

describe('ScrollTargetMixin', () => {
  async function trivialScrollableFixture() {
    return fixture(`<div id="temporaryScrollingRegion">
      <scrollable-element></scrollable-element>
    </div>`);
  }

  async function trivialScrollingRegionFixture() {
    return fixture(`<div id="region">
      <scrollable-element scrollTarget="region"></scrollable-element>
    </div>`);
  }

  async function trivialNestedScrollingRegionFixture() {
    return fixture(`<nested-scrollable-element id="nestedScrollingRegion"></nested-scrollable-element>`);
  }

  async function trivialDocumentScrollFixture() {
    return fixture(`<scrollable-element scrollTarget="document"></scrollable-element>`);
  }

  async function legacyFixture() {
    return fixture(`<div id="region">
      <scrollable-element scroll-target="region"></scrollable-element>
    </div>`);
  }

  describe('basic features', () => {
    let scrollingRegion;
    let xScroll;
    beforeEach(async () => {
      scrollingRegion = await trivialScrollableFixture();
      xScroll = scrollingRegion.querySelector('scrollable-element');
      await nextFrame();
    });

    it('default', () => {
      assert.equal(xScroll._scrollTop, 0, '_scrollTop');
      assert.equal(xScroll._scrollLeft, 0, '_scrollLeft');
      assert.equal(xScroll._scrollTargetWidth, window.innerWidth, '_scrollTargetWidth');
      assert.equal(xScroll._scrollTargetHeight, window.innerHeight, '_scrollTargetHeight');
      assert.equal(xScroll.scrollTarget, xScroll._defaultScrollTarget, 'scrollTarget');
      assert.equal(
          xScroll._defaultScrollTarget,
          xScroll.scrollTarget,
          '_defaultScrollTarget');
    });

    it('invalid `scrollTarget` selector', async () => {
      await nextFrame();
      xScroll.scrollTarget = 'invalid-id';
      assert.equal(xScroll.scrollTarget, null);
    });

    it('valid `scrollTarget` selector', () => {
      xScroll.scrollTarget = 'temporaryScrollingRegion';
      assert.equal(xScroll.scrollTarget, scrollingRegion);
    });

    it('toggleScrollListener', (done) => {
      const spy = sinon.spy(xScroll, '_scrollHandler');
      xScroll.scrollTarget = 'temporaryScrollingRegion';
      xScroll.scroll(0, 100);
      xScroll.toggleScrollListener(true);
      setTimeout(() => {
        assert.isTrue(spy.called, '_scrollHandler should be called');
        spy.resetHistory();
        xScroll.toggleScrollListener(false);
        xScroll.scroll(0, 200);
        setTimeout(() => {
          xScroll._scrollHandler.restore();
          assert.isFalse(spy.called, '_scrollHandler should not be called');
          done();
        }, 100);
      }, 100);
    });
  });

  describe('scrolling region', () => {
    let scrollingRegion;
    let xScrollable;

    beforeEach(async () => {
      scrollingRegion = await trivialScrollingRegionFixture();
      xScrollable = scrollingRegion.querySelector('scrollable-element');
      await nextFrame();
    });

    afterEach(() => {
      xScrollable._scrollTop = 0;
      xScrollable._scrollLeft = 0;
    });

    it('scrollTarget reference', () => {
      assert.equal(xScrollable.scrollTarget, scrollingRegion);
    });

    it('invalid scrollTarget', () => {
      assert.equal(xScrollable.scrollTarget, scrollingRegion);
    });

    it('setters', () => {
      xScrollable._scrollTop = 100;
      xScrollable._scrollLeft = 100;
      assert.equal(scrollingRegion.scrollTop, 100);
      assert.equal(scrollingRegion.scrollLeft, 100);
    });

    it('getters', () => {
      scrollingRegion.scrollTop = 50;
      scrollingRegion.scrollLeft = 50;
      assert.equal(xScrollable._scrollTop, 50, '_scrollTop');
      assert.equal(xScrollable._scrollLeft, 50, '_scrollLeft');
      assert.equal(xScrollable._scrollTargetWidth, scrollingRegion.offsetWidth, '_scrollTargetWidth');
      assert.equal(xScrollable._scrollTargetHeight, scrollingRegion.offsetHeight, '_scrollTargetHeight');
    });

    it('scroll method', () => {
      xScrollable.scroll(110, 110);
      assert.equal(xScrollable._scrollTop, 110);
      assert.equal(xScrollable._scrollLeft, 110);
      xScrollable.scroll(0, 0);
      assert.equal(xScrollable._scrollTop, 0);
      assert.equal(xScrollable._scrollLeft, 0);
    });
  });

  describe('document scroll', () => {
    let xScrollable;

    beforeEach(async () => {
      xScrollable = await trivialDocumentScrollFixture();
      await nextFrame();
    });

    afterEach(() => {
      xScrollable._scrollTop = 0;
      xScrollable._scrollLeft = 0;
    });

    it('scrollTarget reference', () => {
      assert.equal(xScrollable.scrollTarget, document.documentElement);
    });

    it('setters', () => {
      xScrollable._scrollTop = 100;
      xScrollable._scrollLeft = 100;
      assert.equal(window.pageXOffset, 100);
      assert.equal(window.pageYOffset, 100);
    });

    it('getters', () => {
      window.scrollTo(50, 50);
      assert.equal(xScrollable._scrollTop, 50, '_scrollTop');
      assert.equal(xScrollable._scrollLeft, 50, '_scrollLeft');
      assert.equal(xScrollable._scrollTargetWidth, window.innerWidth, '_scrollTargetWidth');
      assert.equal(xScrollable._scrollTargetHeight, window.innerHeight, '_scrollTargetHeight');
    });

    it('scroll method', () => {
      xScrollable.scroll(1, 2);
      assert.equal(xScrollable._scrollLeft, 1);
      assert.equal(xScrollable._scrollTop, 2);
      xScrollable.scroll(3, 4);
      assert.equal(xScrollable._scrollLeft, 3);
      assert.equal(xScrollable._scrollTop, 4);
    });
  });

  describe('legacy scroll-target', () => {
    let scrollingRegion;
    let xScrollable;

    beforeEach(async () => {
      scrollingRegion = await legacyFixture();
      xScrollable = scrollingRegion.querySelector('scrollable-element');
      await nextFrame();
    });

    afterEach(() => {
      xScrollable._scrollTop = 0;
      xScrollable._scrollLeft = 0;
    });

    it('scrollTarget reference', () => {
      assert.equal(xScrollable.scrollTarget, scrollingRegion);
    });

    it('invalid scrollTarget', () => {
      assert.equal(xScrollable.scrollTarget, scrollingRegion);
    });

    it('setters', () => {
      xScrollable._scrollTop = 100;
      xScrollable._scrollLeft = 100;
      assert.equal(scrollingRegion.scrollTop, 100);
      assert.equal(scrollingRegion.scrollLeft, 100);
    });

    it('getters', () => {
      scrollingRegion.scrollTop = 50;
      scrollingRegion.scrollLeft = 50;
      assert.equal(xScrollable._scrollTop, 50, '_scrollTop');
      assert.equal(xScrollable._scrollLeft, 50, '_scrollLeft');
      assert.equal(xScrollable._scrollTargetWidth, scrollingRegion.offsetWidth, '_scrollTargetWidth');
      assert.equal(xScrollable._scrollTargetHeight, scrollingRegion.offsetHeight, '_scrollTargetHeight');
      assert.ok(xScrollable.scrollTarget, 'scrollTarget');
      assert.ok(xScrollable._legacyTarget, '_legacyTarget');
      assert.isTrue(xScrollable.scrollTarget === xScrollable._legacyTarget, 'Targets equal');
    });

    it('scroll method', () => {
      xScrollable.scroll(110, 110);
      assert.equal(xScrollable._scrollTop, 110);
      assert.equal(xScrollable._scrollLeft, 110);
      xScrollable.scroll(0, 0);
      assert.equal(xScrollable._scrollTop, 0);
      assert.equal(xScrollable._scrollLeft, 0);
    });
  });

  describe('nested scrolling region', () => {
    let xScrollingRegion;
    let xScrollable;

    beforeEach(async () => {
      const nestedScrollingRegion = await trivialNestedScrollingRegionFixture();
      xScrollable = nestedScrollingRegion.shadowRoot.querySelector('#xScrollable');
      xScrollingRegion = nestedScrollingRegion.shadowRoot.querySelector('#xRegion');
      await nextFrame();
    });

    afterEach(() => {
      xScrollable._scrollTop = 0;
      xScrollable._scrollLeft = 0;
    });

    it('scrollTarget reference', () => {
      assert.equal(xScrollable.scrollTarget, xScrollingRegion);
    });

    it('setters', () => {
      xScrollable._scrollTop = 10;
      xScrollable._scrollLeft = 20;
      assert.equal(xScrollingRegion.scrollTop, 10);
      assert.equal(xScrollingRegion.scrollLeft, 20);
    });

    it('getters', () => {
      xScrollable._scrollTop = 10;
      xScrollable._scrollLeft = 20;
      assert.equal(xScrollable._scrollTop, 10, '_scrollTop');
      assert.equal(xScrollable._scrollLeft, 20, '_scrollLeft');
    });

    it('scroll method', () => {
      xScrollable.scroll(1, 2);
      assert.equal(xScrollable._scrollLeft, 1);
      assert.equal(xScrollable._scrollTop, 2);
      xScrollable.scroll(3, 4);
      assert.equal(xScrollable._scrollLeft, 3);
      assert.equal(xScrollable._scrollTop, 4);
    });
  });
});

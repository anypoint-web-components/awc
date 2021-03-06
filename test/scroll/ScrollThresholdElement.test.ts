/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fixture, assert, aTimeout } from '@open-wc/testing';
import '../../src/define/scroll-threshold.js';
import { ScrollThresholdElement } from '../../src/index.js';

const style = document.createElement('style');
style.innerHTML = `#scrollingRegion {
  width: 200px;
  height: 200px;
  overflow: auto;
  background: green;
}
.content {
  height: 2000px;
  width: 2px;
  background-color: gray;
}`;
document.head.appendChild(style);

describe('ScrollThresholdElement', () => {
  async function trivialScrollThresholdFixture(): Promise<ScrollThresholdElement> {
    return fixture(`<scroll-threshold id="scrollingRegion">
      <div class="content"></div>
    </scroll-threshold>`);
  }

  async function trivialDocumentScrollingFixture(): Promise<ScrollThresholdElement> {
    return fixture(`<scroll-threshold scrollTarget="document">
      <div class="content"></div>
    </scroll-threshold>`);
  }

  describe('basic features', () => {
    let scrollThreshold: ScrollThresholdElement;
    beforeEach(async () => {
      scrollThreshold = await trivialScrollThresholdFixture();
      scrollThreshold._scrollDebouncer = 1;
    });

    afterEach(() => {
      scrollThreshold._upperTriggered = false;
      scrollThreshold._lowerTriggered = false;
      scrollThreshold._scrollTop = 0;
    });

    it('default', async () => {
      await aTimeout(20);
      assert.equal(scrollThreshold._defaultScrollTarget, scrollThreshold, '_defaultScrollTarget');
      assert.equal(scrollThreshold.scrollTarget, scrollThreshold, 'scrollTarget');
      assert.equal(scrollThreshold.upperThreshold, 100, 'upperThreshold');
      assert.equal(scrollThreshold.lowerThreshold, 100, 'lowerThreshold');
      assert.isUndefined(scrollThreshold.horizontal, 'horizontal');
      assert.equal(window.getComputedStyle(scrollThreshold.scrollTarget as HTMLElement).overflow, 'auto', 'overflow');
    });

    it('upperthreshold event', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.addEventListener('upperthreshold', () => {
        eventTriggered = scrollThreshold.upperTriggered;
      });
      assert.isTrue(scrollThreshold.upperTriggered, 'Before scroll upperTriggered');
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop += 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('onupperthreshold setter', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.onupperthreshold = () => {
        eventTriggered = scrollThreshold.upperTriggered;
      };
      assert.typeOf(scrollThreshold.onupperthreshold, 'function');
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop += 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('clears onupperthreshold', async () => {
      await aTimeout(0);
      let called = false;
      function f() {
        called = true;
      }
      scrollThreshold.onupperthreshold = f;
      scrollThreshold.onupperthreshold = undefined;
      scrollThreshold._scrollTop += 10;
      await aTimeout(40);
      assert.isFalse(called);
    });

    it('lowerthreshold event', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.addEventListener('lowerthreshold', () => {
        eventTriggered = scrollThreshold.lowerTriggered;
      });
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('onlowerthreshold setter', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.onlowerthreshold = () => {
        eventTriggered = scrollThreshold.lowerTriggered;
      };
      assert.typeOf(scrollThreshold.onlowerthreshold, 'function');
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('clears onlowerthreshold', async () => {
      await aTimeout(0);
      let called = false;
      function f() {
        called = true;
      }
      scrollThreshold.onlowerthreshold = f;
      scrollThreshold.onlowerthreshold = undefined;
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      await aTimeout(40);
      assert.isFalse(called);
    });

    it('clearTriggers', async () => {
      await aTimeout(0);
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.upperTriggered);
    });

    it('checkScrollThresholds', async () => {
      await aTimeout(0);
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check triggers');
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.lowerTriggered, 'reset triggers');
    });

    it('horizontal', async () => {
      await aTimeout(0);
      scrollThreshold.horizontal = true;
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollLeft = (scrollThreshold.scrollTarget as HTMLElement).scrollWidth;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check lowerTriggered');
      scrollThreshold._scrollLeft = 0;
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.upperTriggered, 'upperTriggered');
    });
  });

  describe('document scroll', () => {
    let scrollThreshold: ScrollThresholdElement;
    beforeEach(async () => {
      scrollThreshold = await trivialDocumentScrollingFixture();
      scrollThreshold._scrollDebouncer = 1;
    });

    afterEach(() => {
      scrollThreshold._upperTriggered = false;
      scrollThreshold._lowerTriggered = false;
      scrollThreshold._scrollTop = 0;
    });

    it('default', async () => {
      await aTimeout(0);
      assert.equal(scrollThreshold.scrollTarget, scrollThreshold._doc, 'scrollTarget');
      assert.equal(scrollThreshold.upperThreshold, 100, 'upperThreshold');
      assert.equal(scrollThreshold.lowerThreshold, 100, 'lowerThreshold');
      assert.isUndefined(scrollThreshold.horizontal, 'horizontal');
    });

    it('upperthreshold event', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.addEventListener('upperthreshold', () => {
        eventTriggered = scrollThreshold.upperTriggered;
      });
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollTop += 10;
      await aTimeout(40);
      assert.isTrue(eventTriggered, 'After scroll upperTriggered');
    });

    it('lowerthreshold event', async () => {
      await aTimeout(0);
      let eventTriggered;
      scrollThreshold.addEventListener('lowerthreshold', () => {
        eventTriggered = scrollThreshold.lowerTriggered;
      });
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      await aTimeout(40);
      assert.isTrue(eventTriggered);
    });

    it('clearTriggers', async () => {
      await aTimeout(0);
      assert.isTrue(scrollThreshold.upperTriggered);
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.upperTriggered);
    });

    it('checkScrollThresholds', async () => {
      await aTimeout(0);
      scrollThreshold._scrollTop = (scrollThreshold.scrollTarget as HTMLElement).scrollHeight;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check triggers');
      scrollThreshold.clearTriggers();
      assert.isFalse(scrollThreshold.lowerTriggered, 'reset triggers');
    });

    it('horizontal', async () => {
      await aTimeout(0);
      scrollThreshold.horizontal = true;
      scrollThreshold.clearTriggers();
      scrollThreshold._scrollLeft = (scrollThreshold.scrollTarget as HTMLElement).scrollWidth;
      assert.isFalse(scrollThreshold.lowerTriggered, 'check assumption');
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.lowerTriggered, 'check lowerTriggered');
      scrollThreshold._scrollLeft = 0;
      scrollThreshold.checkScrollThresholds();
      assert.isTrue(scrollThreshold.upperTriggered, 'upperTriggered');
    });
  });

  describe('a11y', () => {
    async function a11yFixture(): Promise<ScrollThresholdElement> {
      return fixture(`<scroll-threshold id="scrollingRegion">
        <div class="content"></div>
      </scroll-threshold>`);
    }

    it('is accessible', async () => {
      const element = await a11yFixture();
      await assert.isAccessible(element);
    });
  });
});

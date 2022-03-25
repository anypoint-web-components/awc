import { fixture, assert, nextFrame, html, aTimeout } from '@open-wc/testing';
import { TestFit } from './test-fit.js';
import './test-fit.js';

const s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = `body {
  margin: 0;
  padding: 0;
}
.absolute {
  position: absolute;
  top: 0;
  left: 0;
}
.scrolling {
  overflow: auto;
}
.sized-x {
  width: 100px;
}
.sized-y {
  height: 100px;
}
.positioned-left {
  position: absolute;
  left: 100px;
}
.positioned-right {
  position: absolute;
  right: 100px;
}
.positioned-top {
  position: absolute;
  top: 100px;
}
.positioned-bottom {
  position: absolute;
  bottom: 100px;
}
.with-max-width {
  max-width: 500px;
}
.with-max-height {
  max-height: 500px;
}
.with-margin {
  margin: 20px;
}
.constrain {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 150px;
  height: 150px;
  border: 1px solid black;
  box-sizing: border-box;
}
.sizer {
  width: 9999px;
  height: 9999px;
}

body > div:last-of-type {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}`;
document.getElementsByTagName('head')[0].appendChild(s);

const constrain = document.createElement('div');
constrain.classList.add('constrain');
document.body.appendChild(constrain);

const tpl = document.createElement('template');
tpl.innerHTML = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
culpa qui officia deserunt mollit anim id est laborum.</p>`;
tpl.id = 'ipsum';
document.body.appendChild(tpl);

describe('FitMixin', () => {
  async function basicFixture(): Promise<TestFit> {
    return fixture(html`<test-fit>Basic</test-fit>`);
  }

  async function positionedXyFixture(): Promise<TestFit> {
    return fixture(html`
      <test-fit autoFitOnAttach class="sized-x positioned-left positioned-top">
        Sized (x/y), positioned/positioned
      </test-fit>`);
  }

  async function inlinePositionedXyFixture(): Promise<TestFit> {
    return fixture(html`
    <test-fit autoFitOnAttach class="sized-x sized-y" style="position:absolute;left:100px;top:100px;">
      Sized (x/y), positioned/positioned
    </test-fit>`);
  }

  async function absoluteFixture(): Promise<TestFit> {
    return fixture(html`
    <test-fit autoFitOnAttach class="absolute">
      Absolutely positioned
    </test-fit>`);
  }

  async function sizedXyFixture(): Promise<TestFit> {
    return fixture(html`
    <test-fit autoFitOnAttach class="sized-x sized-y">
      Sized (x/y), auto center/center
    </test-fit>`);
  }

  async function sizedXFixture(): Promise<TestFit> {
    return fixture(html`
    <test-fit autoFitOnAttach class="sized-x">
      Sized (x), auto center/center
    </test-fit>`);
  }

  async function sectionedFixture(): Promise<TestFit> {
    return fixture(html`
    <test-fit autoFitOnAttach class="sized-x">
      <div>
        Sized (x), auto center/center with scrolling section
      </div>
      <div class="internal"></div>
    </test-fit>`);
  }

  async function constrainTargetFixture(): Promise<HTMLDivElement> {
    return fixture(html`
    <div class="constrain">
      <test-fit autoFitOnAttach class="el sized-x sized-y">
        <div>
          Auto center/center to parent element
        </div>
      </test-fit>
    </div>`);
  }

  async function offscreenContainerFixture(): Promise<HTMLDivElement> {
    return fixture(html`
    <div style="position: fixed; top: -1px; left: 0;">
      <test-fit autoFitOnAttach class="el sized-x">
        <div>
          Sized (x), auto center/center, container is offscreen
        </div>
      </test-fit>
    </div>`);
  }

  async function hostPropertiesFixture(): Promise<TestFit> {
    return fixture(html`<test-fit my-prop="test-value"></test-fit>`);
  }

  // async function scrollableFixture() {
  //   return await fixture(`
  //   <test-fit autofitonattach class="scrolling">
  //     scrollable
  //     <div class="sizer"></div>
  //   </test-fit>`);
  // }

  function makeScrolling(el: TestFit): void {
    el.classList.add('scrolling');
    const template = document.getElementById('ipsum') as HTMLTemplateElement;
    for (let i = 0; i < 20; i += 1) {
      el.appendChild(template.content.cloneNode(true));
    }
  }

  function intersects(r1: any, r2: any): boolean {
    return !(
      r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom
      || r2.bottom <= r1.top);
  }

  describe('Basic', () => {
    it('position() works without autoFitOnAttach', async () => {
      const element = await basicFixture();
      element.verticalAlign = 'top';
      element.horizontalAlign = 'left';
      element.position();
      const rect = element.getBoundingClientRect();
      assert.equal(rect.top, 0, 'top ok');
      assert.equal(rect.left, 0, 'left ok');
    });

    it('constrain() works without autoFitOnAttach', async () => {
      const element = await basicFixture();
      element.constrain();
      const style = getComputedStyle(element);
      assert.equal(style.maxWidth, `${window.innerWidth}px`, 'maxWidth ok');
      assert.equal(style.maxHeight, `${window.innerHeight}px`, 'maxHeight ok');
    });

    it('center() works without autoFitOnAttach', async () => {
      const element = await basicFixture();
      element.center();
      const rect = element.getBoundingClientRect();
      assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
      assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
    });

    it('Computes _fitWidth for window', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element._fitWidth;
      assert.equal(result, window.innerWidth);
    });

    it('Computes _fitWidth for fit element', async () => {
      const constrainElement = document.querySelector('.constrain') as HTMLElement;
      const element = await basicFixture();
      element.fitInto = constrain;
      await nextFrame();
      const result = element._fitWidth;
      assert.equal(result, constrainElement.getBoundingClientRect().width);
    });

    it('Computes _fitHeight for window', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element._fitHeight;
      assert.equal(result, window.innerHeight);
    });

    it('Computes _fitHeight for fit element', async () => {
      const constrainElement = document.querySelector('.constrain') as HTMLElement;
      const element = await basicFixture();
      element.fitInto = constrainElement;
      await nextFrame();
      const result = element._fitHeight;
      assert.equal(result, constrainElement.getBoundingClientRect().height);
    });

    it('Computes _fitLeft for window', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element._fitLeft;
      assert.equal(result, 0);
    });

    it('Computes _fitLeft for fit element', async () => {
      const constrainElement = document.querySelector('.constrain') as HTMLElement;
      const element = await basicFixture();
      element.fitInto = constrainElement;
      await nextFrame();
      const result = element._fitLeft;
      assert.equal(result, constrainElement.getBoundingClientRect().left);
    });

    it('Computes _fitTop for window', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element._fitTop;
      assert.equal(result, 0);
    });

    it('Computes _fitTop for fit element', async () => {
      const constrainElement = document.querySelector('.constrain') as HTMLElement;
      const element = await basicFixture();
      element.fitInto = constrainElement;
      await nextFrame();
      const result = element._fitTop;
      assert.equal(result, constrainElement.getBoundingClientRect().top);
    });

    it('Computes _localeHorizontalAlign for RTL - right', async () => {
      const element = await basicFixture();
      element._isRTL = true;
      element.horizontalAlign = 'right';
      const result = element._localeHorizontalAlign;
      assert.equal(result, 'left');
    });

    it('Computes _localeHorizontalAlign for RTL - left', async () => {
      const element = await basicFixture();
      element._isRTL = true;
      element.horizontalAlign = 'left';
      const result = element._localeHorizontalAlign;
      assert.equal(result, 'right');
    });

    it('Preserves host properties', async () => {
      const element = await hostPropertiesFixture();
      assert.equal(element.myProp, 'test-value');
    });
  });

  describe('manual positioning', async () => {
    it('css positioned element is not re-positioned', async () => {
      const el = await positionedXyFixture();
      await nextFrame();
      const rect = el.getBoundingClientRect();
      assert.equal(rect.top, 100, 'top is unset');
      assert.equal(rect.left, 100, 'left is unset');
    });

    it('inline positioned element is not re-positioned', async () => {
      const el = await inlinePositionedXyFixture();
      await nextFrame();
      let rect = el.getBoundingClientRect();
      // need to measure document.body here because mocha sets a min-width on
      // html,body, and the element is positioned wrt to that by css
      // const bodyRect = document.body.getBoundingClientRect();
      assert.equal(rect.top, 100, 'top is unset');
      assert.equal(rect.left, 100, 'left is unset');
      el.refit();
      rect = el.getBoundingClientRect();
      assert.equal(rect.top, 100, 'top is unset after refit');
      assert.equal(rect.left, 100, 'left is unset after refit');
    });

    it('position property is preserved after', async () => {
      const el = await absoluteFixture();
      await nextFrame();
      assert.equal(
        getComputedStyle(el)
        .position,
        'absolute',
        'position:absolute is preserved'
);
    });
  });

  // function moveElementToBody(el) {
  //   const parent = el.parentNode;
  //   parent.removeChild(el);
  //   document.body.appendChild(el);
  //   el.__parent = parent;
  // }
  //
  // function moveElementToParent(el) {
  //   document.body.removeChild(el);
  //   el.__parent.appendChild(el);
  //   delete el.__parent;
  // }

  describe('fit to window', async () => {
    it('sized element is centered in viewport', async () => {
      const el = await sizedXyFixture();
      await aTimeout(0);
      const rect = el.getBoundingClientRect();
      assert.closeTo(
        rect.left - (window.innerWidth - rect.right),
        0,
        5,
        'centered horizontally'
);
      assert.closeTo(
        rect.top - (window.innerHeight - rect.bottom),
        0,
        5,
        'centered vertically'
);
    });

    it('sized element with margin is centered in viewport', async () => {
      const el = await sizedXyFixture();
      await aTimeout(0);
      el.classList.add('with-margin');
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.closeTo(rect.left - (window.innerWidth - rect.right),
        0, 5, 'centered horizontally');
      assert.closeTo(rect.top - (window.innerHeight - rect.bottom),
        0, 5, 'centered vertically');
    });

    it.skip('sized element with transformed parent is centered in viewport', async () => {
      const constrainElement = await constrainTargetFixture();
      await aTimeout(0);
      const el = constrainElement.querySelector('.el') as TestFit;
      const rectBefore = el.getBoundingClientRect();
      constrainElement.style.transform = 'translate3d(5px, 5px, 0)';
      el.center();
      const rectAfter = el.getBoundingClientRect();
      assert.equal(rectBefore.top, rectAfter.top, 'top ok');
      assert.equal(rectBefore.bottom, rectAfter.bottom, 'bottom ok');
      assert.equal(rectBefore.left, rectAfter.left, 'left ok');
      assert.equal(rectBefore.right, rectAfter.right, 'right ok');
    });

    it('scrolling element is centered in viewport', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.closeTo(rect.left - (window.innerWidth - rect.right),
        0, 5, 'centered horizontally');
      assert.closeTo(rect.top - (window.innerHeight - rect.bottom),
        0, 5, 'centered vertically');
    });

    it('scrolling element is constrained to viewport height', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(
        rect.height <= window.innerHeight,
        'height is less than or equal to viewport height'
);
    });

    it('scrolling element with offscreen container is constrained to viewport height', async () => {
      const container = await offscreenContainerFixture();
      await aTimeout(0);
      const el = container.querySelector('.el') as TestFit;
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight,
        'height is less than or equal to viewport height');
    });

    it('scrolling element with max-height is centered in viewport', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('with-max-height');
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.closeTo(rect.left - (window.innerWidth - rect.right),
        0, 5, 'centered horizontally');
      assert.closeTo(rect.top - (window.innerHeight - rect.bottom),
        0, 5, 'centered vertically');
    });

    it('scrolling element with max-height respects max-height', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('with-max-height');
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= 500, 'height is less than or equal to max-height');
    });

    it('css positioned, scrolling element is constrained to viewport height (top,left)', async () => {
      const el = await positionedXyFixture();
      await aTimeout(0);
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight - 100,
        'height is less than or equal to viewport height');
    });

    it('css positioned, scrolling element is constrained to viewport height (bottom, right)', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('positioned-bottom');
      el.classList.add('positioned-right');
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight - 100,
        'height is less than or equal to viewport height');
    });

    it('sized, scrolling element with margin is centered in viewport', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('with-margin');
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.closeTo(rect.left - (window.innerWidth - rect.right),
        0, 5, 'centered horizontally');
      assert.closeTo(rect.top - (window.innerHeight - rect.bottom),
        0, 5, 'centered vertically');
    });

    it('sized, scrolling element is constrained to viewport height', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('with-margin');
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight - 20 * 2,
        'height is less than or equal to viewport height');
    });

    it('css positioned, scrolling element with margin is constrained to viewport height (top, left)', async () => {
      const el = await positionedXyFixture();
      await aTimeout(0);
      el.classList.add('with-margin');
      makeScrolling(el);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight - 100 - 20 * 2,
        'height is less than or equal to viewport height');
    });

    it('css positioned, scrolling element with margin is constrained to viewport height (bottom, right)', async () => {
      const el = await sizedXFixture();
      await aTimeout(0);
      el.classList.add('positioned-bottom');
      el.classList.add('positioned-right');
      el.classList.add('with-margin');
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight - 100 - 20 * 2,
        'height is less than or equal to viewport height');
    });

    it('scrolling sizingTarget is constrained to viewport height', async () => {
      const el = await sectionedFixture();
      await aTimeout(0);
      const internal = el.querySelector('.internal') as TestFit;
      el.sizingTarget = internal;
      makeScrolling(internal);
      el.refit();
      const rect = el.getBoundingClientRect();
      assert.isTrue(rect.height <= window.innerHeight,
        'height is less than or equal to viewport height');
    });

    // it('scrolling sizingTarget preserves scrolling position', async () => {
    //   const el = await scrollableFixture();
    //   await nextFrame();
    //   el.scrollTop = 20;
    //   el.scrollLeft = 20;
    //   await nextFrame();
    //   el.refit();
    //   assert.equal(el.scrollTop, 20, 'scrollTop ok');
    //   assert.equal(el.scrollLeft, 20, 'scrollLeft ok');
    // });
  });

  describe('fit to element', () => {
    it('element fits in another element', async () => {
      const constrainElement = await constrainTargetFixture();
      await nextFrame();
      const el = constrainElement.querySelector('.el') as TestFit;
      makeScrolling(el);
      el.fitInto = constrainElement;
      el.refit();
      const rect = el.getBoundingClientRect();
      const cRect = constrainElement.getBoundingClientRect();
      assert.isTrue(rect.height <= cRect.height,
        'width is less than or equal to fitInto width');
      assert.isTrue(rect.height <= cRect.height,
        'height is less than or equal to fitInto height');
    });

    it('element centers in another element', async () => {
      const constrainElement = await constrainTargetFixture();
      await nextFrame();
      const el = constrainElement.querySelector('.el') as TestFit;
      makeScrolling(el);
      el.fitInto = constrainElement;
      el.refit();
      const rect = el.getBoundingClientRect();
      const cRect = constrainElement.getBoundingClientRect();
      assert.closeTo(rect.left - cRect.left - (cRect.right - rect.right),
        0, 5, 'centered horizontally in fitInto');
      assert.closeTo(rect.top - cRect.top - (cRect.bottom - rect.bottom),
        0, 5, 'centered vertically in fitInto');
    });

    it('element with max-width centers in another element', async () => {
      const constrainElement = document.querySelector('.constrain') as HTMLElement;
      const el = await sizedXyFixture();
      await nextFrame();
      el.classList.add('with-max-width');
      el.fitInto = constrainElement;
      el.refit();
      const rect = el.getBoundingClientRect();
      const cRect = constrainElement.getBoundingClientRect();
      assert.closeTo(rect.left - cRect.left - (cRect.right - rect.right),
        0, 5, 'centered horizontally in fitInto');
      assert.closeTo(rect.top - cRect.top - (cRect.bottom - rect.bottom),
        0, 5, 'centered vertically in fitInto');
    });

    it('positioned element fits in another element', async () => {
      const constrainElement = document.querySelector('.constrain') as TestFit;
      const el = await sizedXyFixture();
      await nextFrame();
      // element's positionTarget is `body`, and fitInto is `constrain`.
      el.verticalAlign = 'top';
      el.horizontalAlign = 'left';
      el.fitInto = constrainElement;
      el.refit();
      const rect = el.getBoundingClientRect();
      const cRect = constrainElement.getBoundingClientRect();
      assert.equal(rect.top, cRect.top, 'top ok');
      assert.equal(rect.left, cRect.left, 'left ok');
    });
  });

  describe('horizontal/vertical align', () => {
    let parent: HTMLDivElement;
    let parentRect: DOMRect;
    let el: TestFit;
    let elRect: DOMRect;
    const fitRect = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight
    };

    beforeEach(async () => {
      parent = await constrainTargetFixture();
      await aTimeout(0);
      parentRect = parent.getBoundingClientRect();
      el = parent.querySelector('.el') as TestFit;
      elRect = el.getBoundingClientRect();
    });

    it('intersects works', () => {
      const base = {
        top: 0,
        bottom: 1,
        left: 0,
        right: 1
      };
      assert.isTrue(intersects(base, base), 'intersects itself');
      assert.isFalse(
        intersects(base, {
          top: 1,
          bottom: 2,
          left: 0,
          right: 1
        }),
        'no intersect on edge'
);
      assert.isFalse(
        intersects(base, {
          top: -2,
          bottom: -1,
          left: 0,
          right: 1
        }),
        'no intersect on edge (negative values)'
);
      assert.isFalse(
        intersects(base, {
          top: 2,
          bottom: 3,
          left: 0,
          right: 1
        }),
        'no intersect'
);
    });

    describe('when verticalAlign is top', () => {
      it('element is aligned to the positionTarget top', () => {
        el.verticalAlign = 'top';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top, 'top ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is aligned to the positionTarget top without overlapping it', () => {
        // Allow enough space on the parent's bottom & right.
        parent.style.width = '10px';
        parent.style.height = '10px';
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'top';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.verticalAlign = 'top';
        el.style.marginTop = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top + 10, 'top ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
        el.style.marginTop = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top - 10, 'top ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('verticalOffset is applied', () => {
        el.verticalAlign = 'top';
        el.verticalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top + 10, 'top ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.verticalAlign = 'top';
        // Make it go out of screen
        el.verticalOffset = -1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top in viewport');
        assert.isTrue(rect.height < elRect.height, 'reduced size');
      });

      it('negative verticalOffset does not crop element', () => {
        // Push to the bottom of the screen.
        parent.style.top = `${window.innerHeight - 50}px`;
        el.verticalAlign = 'top';
        el.verticalOffset = -10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, window.innerHeight - 60, 'top ok');
        assert.equal(rect.bottom, window.innerHeight, 'bottom ok');
      });
      it('max-height is updated', () => {
        parent.style.top = '-10px';
        el.verticalAlign = 'top';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top ok');
        assert.isBelow(rect.height, elRect.height, 'height ok');
      });

      it('min-height is preserved: element is displayed even if partially', () => {
        parent.style.top = '-10px';
        el.verticalAlign = 'top';
        el.style.minHeight = `${elRect.height}px`;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top ok');
        assert.equal(rect.height, elRect.height, 'min-height ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer bottom align if it minimizes the cropping', () => {
        parent.style.top = '-10px';
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'top';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('position() changes element width when fitPositionTarget enabled', async () => {
        el.verticalAlign = 'top';
        el.fitPositionTarget = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.width, 150, 'width ok');
      });

      it('position() does not change element width when fitPositionTarget disabled', async () => {
        el.verticalAlign = 'top';
        el.fitPositionTarget = false;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.width, 100, 'width ok');
      });
    });

    describe('when verticalAlign is bottom', () => {
      it('element is aligned to the positionTarget bottom', () => {
        el.verticalAlign = 'bottom';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is aligned to the positionTarget bottom without overlapping it', () => {
        el.verticalAlign = 'bottom';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.verticalAlign = 'bottom';
        el.style.marginBottom = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom - 10, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
        el.style.marginBottom = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom + 10, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('verticalOffset is applied', () => {
        el.verticalAlign = 'bottom';
        el.verticalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom - 10, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.verticalAlign = 'bottom';
        // Make it go out of screen
        el.verticalOffset = 1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top in viewport');
        assert.isTrue(rect.height < elRect.height, 'reduced size');
      });

      it('element max-height is updated', () => {
        parent.style.top = `${100 - parentRect.height}px`;
        el.verticalAlign = 'bottom';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, 100, 'bottom ok');
        assert.equal(rect.height, 100, 'height ok');
      });

      it('min-height is preserved: element is displayed even if partially', () => {
        parent.style.top = `${elRect.height - 10 - parentRect.height}px`;
        el.verticalAlign = 'bottom';
        el.style.minHeight = `${elRect.height}px`;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top ok');
        assert.equal(rect.height, elRect.height, 'min-height ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer top align if it minimizes the cropping', () => {
        parent.style.top = `${window.innerHeight - elRect.height}px`;
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'bottom';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top, 'top ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });
    });

    describe('when verticalAlign is middle', () => {
      it('element is aligned to the positionTarget middle', () => {
        el.verticalAlign = 'middle';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
          rect.top,
          parentRect.top + (parentRect.height - rect.height) / 2,
          'top ok'
);
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is aligned to the positionTarget top without overlapping it', () => {
        // Allow enough space on the parent's bottom & right.
        el.verticalAlign = 'middle';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.verticalAlign = 'middle';
        el.style.marginTop = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(
          rect.top,
          parentRect.top + (parentRect.height - rect.height) / 2 + 10,
          'top ok'
);
        assert.equal(rect.height, elRect.height, 'no cropping');
        el.style.marginTop = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(
          rect.top,
          parentRect.top + (parentRect.height - rect.height) / 2 - 10,
          'top ok'
);
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('verticalOffset is applied', () => {
        el.verticalAlign = 'middle';
        el.verticalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
          rect.top,
          parentRect.top + (parentRect.height - rect.height) / 2 + 10,
          'top ok'
);
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.verticalAlign = 'middle';
        // Make it go out of screen
        el.verticalOffset = -1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top in viewport');
        assert.isTrue(rect.height < elRect.height, 'reduced size');
      });

      it('negative verticalOffset does not crop element', () => {
        // Push to the bottom of the screen.
        parent.style.top = `${window.innerHeight - 50}px`;
        el.verticalAlign = 'middle';
        el.verticalOffset = -10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, window.innerHeight - 35, 'top ok');
        assert.equal(rect.bottom, window.innerHeight, 'bottom ok');
      });

      it('max-height is updated', () => {
        parent.style.top = '-50px';
        el.verticalAlign = 'middle';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top ok');
        assert.isBelow(rect.height, elRect.height, 'height ok');
      });

      it('min-height is preserved: element is displayed even if partially', () => {
        parent.style.top = '-50px';
        el.verticalAlign = 'middle';
        el.style.minHeight = `${elRect.height}px`;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, 0, 'top ok');
        assert.equal(rect.height, elRect.height, 'min-height ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer bottom align if it minimizes the cropping', () => {
        parent.style.top = '-50px';
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'middle';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.bottom, parentRect.bottom, 'bottom ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });
    });

    describe('when verticalAlign is auto', () => {
      it('element is aligned to the positionTarget top', () => {
        el.verticalAlign = 'auto';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.top, parentRect.top, 'auto aligned to top');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('element is aligned to the positionTarget top without overlapping it', () => {
        // Allow enough space on the parent's bottom & right.
        parent.style.width = '10px';
        parent.style.height = '10px';
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'auto';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.height, elRect.height, 'no cropping');
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
      });

      it('bottom is preferred to top if it diminishes the cropped area', () => {
        // This would cause a cropping of the element, so it should
        // automatically align to the bottom to avoid it.
        parent.style.top = '-10px';
        parentRect = parent.getBoundingClientRect();
        el.verticalAlign = 'auto';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
          rect.bottom, parentRect.bottom, 'auto aligned to bottom'
);
        assert.equal(rect.height, elRect.height, 'no cropping');
      });

      it('bottom is preferred to top if it diminishes the cropped area, without overlapping positionTarget',
        () => {
          // This would cause a cropping of the element, so it should
          // automatically align to the bottom to avoid it.
          parent.style.top = '-10px';
          parentRect = parent.getBoundingClientRect();
          el.verticalAlign = 'auto';
          el.noOverlap = true;
          el.refit();
          const rect = el.getBoundingClientRect();
          assert.equal(rect.height, elRect.height, 'no cropping');
          assert.isFalse(intersects(rect, parentRect), 'no overlap');
        });
    });

    describe('when horizontalAlign is left', () => {
      it('element is aligned to the positionTarget left', () => {
        el.horizontalAlign = 'left';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left, 'left ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is aligned to the positionTarget left without overlapping it', () => {
        // Make space at the parent's right.
        parent.style.width = '10px';
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'left';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.horizontalAlign = 'left';
        el.style.marginLeft = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left + 10, 'left ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
        el.style.marginLeft = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left - 10, 'left ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('horizontalOffset is applied', () => {
        el.horizontalAlign = 'left';
        el.horizontalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left + 10, 'left ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.horizontalAlign = 'left';
        // Make it go out of screen.
        el.horizontalOffset = -1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left in viewport');
        assert.isTrue(rect.width < elRect.width, 'reduced size');
      });

      it('negative horizontalOffset does not crop element', () => {
        // Push to the bottom of the screen.
        parent.style.left = `${window.innerWidth - 50}px`;
        el.horizontalAlign = 'left';
        el.horizontalOffset = -10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, window.innerWidth - 60, 'left ok');
        assert.equal(rect.right, window.innerWidth, 'right ok');
      });

      it('element max-width is updated', () => {
        parent.style.left = '-10px';
        el.horizontalAlign = 'left';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left ok');
        assert.isBelow(rect.width, elRect.width, 'width ok');
      });

      it('min-width is preserved: element is displayed even if partially', () => {
        parent.style.left = '-10px';
        el.style.minWidth = `${elRect.width}px`;
        el.horizontalAlign = 'left';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left ok');
        assert.equal(rect.width, elRect.width, 'min-width ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer right align if it minimizes the cropping', () => {
        parent.style.left = '-10px';
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'left';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'right ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });
    });

    describe('when horizontalAlign is right', () => {
      it('element is aligned to the positionTarget right', () => {
        el.horizontalAlign = 'right';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'right ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is aligned to the positionTarget right without overlapping it', () => {
        // Make space at the parent's left.
        parent.style.left = `${elRect.width}px`;
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'right';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.horizontalAlign = 'right';
        el.style.marginRight = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right - 10, 'right ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
        el.style.marginRight = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right + 10, 'right ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('horizontalOffset is applied', () => {
        el.horizontalAlign = 'right';
        el.horizontalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right - 10, 'right ok');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.horizontalAlign = 'right';
        // Make it go out of screen.
        el.horizontalOffset = 1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left in viewport');
        assert.isTrue(rect.width < elRect.width, 'reduced width');
      });

      it('element max-width is updated', () => {
        parent.style.left = `${100 - parentRect.width}px`;
        el.horizontalAlign = 'right';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, 100, 'right ok');
        assert.equal(rect.width, 100, 'width ok');
      });

      it('min-width is preserved: element is displayed even if partially', () => {
        parent.style.left = `${elRect.width - 10 - parentRect.width}px`;
        el.horizontalAlign = 'right';
        el.style.minWidth = `${elRect.width}px`;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left ok');
        assert.equal(rect.width, elRect.width, 'min-width ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer left align if it minimizes the cropping', () => {
        parent.style.left = `${window.innerWidth - elRect.width}px`;
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'right';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left, 'left ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });
    });

    describe('when horizontalAlign is center', () => {
      it('element is aligned to the positionTarget center', () => {
        el.horizontalAlign = 'center';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
          rect.left,
          parentRect.left + (parentRect.width - rect.width) / 2,
          'left ok'
);
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is aligned to the positionTarget left without overlapping it', () => {
        el.horizontalAlign = 'center';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element margin is considered as offset', () => {
        el.horizontalAlign = 'center';
        el.style.marginLeft = '10px';
        el.refit();
        let rect = el.getBoundingClientRect();
        assert.equal(
          rect.left,
          parentRect.left + (parentRect.width - rect.width) / 2 + 10,
          'left ok'
);
        assert.equal(rect.width, elRect.width, 'no cropping');
        el.style.marginLeft = '-10px';
        el.refit();
        rect = el.getBoundingClientRect();
        assert.equal(
          rect.left,
          parentRect.left + (parentRect.width - rect.width) / 2 - 10,
          'left ok'
);
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('horizontalOffset is applied', () => {
        el.horizontalAlign = 'center';
        el.horizontalOffset = 10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
          rect.left,
          parentRect.left + (parentRect.width - rect.width) / 2 + 10,
          'left ok'
);
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is kept in viewport', () => {
        el.horizontalAlign = 'center';
        // Make it go out of screen.
        el.horizontalOffset = -1000;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left in viewport');
        assert.isTrue(rect.width < elRect.width, 'reduced size');
      });

      it('negative horizontalOffset does not crop element', () => {
        // Push to the bottom of the screen.
        parent.style.left = `${window.innerWidth - 50}px`;
        el.horizontalAlign = 'center';
        el.horizontalOffset = -10;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, window.innerWidth - 35, 'left ok');
        assert.equal(rect.right, window.innerWidth, 'right ok');
      });

      it('element max-width is updated', () => {
        parent.style.left = '-50px';
        el.horizontalAlign = 'center';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left ok');
        assert.isBelow(rect.width, elRect.width, 'width ok');
      });

      it('min-width is preserved: element is displayed even if partially', () => {
        parent.style.left = '-50px';
        el.style.minWidth = `${elRect.width}px`;
        el.horizontalAlign = 'center';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, 0, 'left ok');
        assert.equal(rect.width, elRect.width, 'min-width ok');
        assert.isTrue(intersects(rect, fitRect), 'partially visible');
      });

      it('dynamicAlign will prefer right align if it minimizes the cropping', () => {
        parent.style.left = '-50px';
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'center';
        el.dynamicAlign = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'right ok');
        assert.equal(rect.height, elRect.height, 'no cropping');
      });
    });

    describe('when horizontalAlign is auto', () => {
      it('element is aligned to the positionTarget left', () => {
        el.horizontalAlign = 'auto';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left, 'auto aligned to left');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('element is aligned to the positionTarget left without overlapping positionTarget', () => {
        // Make space at the parent's left.
        parent.style.left = `${elRect.width}px`;
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'auto';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.width, elRect.width, 'no cropping');
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
      });

      it('right is preferred to left if it diminishes the cropped area', () => {
        // This would cause a cropping of the element, so it should
        // automatically align to the right to avoid it.
        parent.style.left = '-10px';
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'auto';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'auto aligned to right');
        assert.equal(rect.width, elRect.width, 'no cropping');
      });

      it('right is preferred to left if it diminishes the cropped area, without overlapping positionTarget', () => {
        // Make space at the parent's right.
        parent.style.width = '10px';
        parentRect = parent.getBoundingClientRect();
        el.horizontalAlign = 'auto';
        el.noOverlap = true;
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.width, elRect.width, 'no cropping');
        assert.isFalse(intersects(rect, parentRect), 'no overlap');
      });
    });

    describe('when horizontalAlign is center and verticalAlign is middle', () => {
      it('element is aligned to the positionTarget center', () => {
        el.horizontalAlign = 'center';
        el.verticalAlign = 'middle';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(
            rect.left,
            parentRect.left + (parentRect.width - rect.width) / 2,
            'left ok'
);
        assert.equal(
            rect.top,
            parentRect.top + (parentRect.height - rect.height) / 2,
            'top ok'
);
        assert.equal(rect.width, elRect.width, 'no cropping');
      });
    });

    describe('prefer horizontal overlap to vertical overlap', () => {
      beforeEach(() => {
        el.noOverlap = true;
        el.dynamicAlign = true;
        // Make space around the positionTarget.
        parent.style.top = `${elRect.height}px`;
        parent.style.left = `${elRect.width}px`;
        parent.style.width = '10px';
        parent.style.height = '10px';
        parentRect = parent.getBoundingClientRect();
      });

      it('top-left aligns to target bottom-left', () => {
        el.verticalAlign = 'top';
        el.horizontalAlign = 'left';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left, 'left ok');
        assert.equal(rect.top, parentRect.bottom, 'top ok');
      });

      it('top-right aligns to target bottom-right', () => {
        el.verticalAlign = 'top';
        el.horizontalAlign = 'right';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'right ok');
        assert.equal(rect.top, parentRect.bottom, 'top ok');
      });

      it('bottom-left aligns to target top-left', () => {
        el.verticalAlign = 'bottom';
        el.horizontalAlign = 'left';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.left, parentRect.left, 'left ok');
        assert.equal(rect.bottom, parentRect.top, 'bottom ok');
      });

      it('bottom-right aligns to target top-right', () => {
        el.verticalAlign = 'bottom';
        el.horizontalAlign = 'right';
        el.refit();
        const rect = el.getBoundingClientRect();
        assert.equal(rect.right, parentRect.right, 'right ok');
        assert.equal(rect.bottom, parentRect.top, 'bottom ok');
      });
    });
  });
});

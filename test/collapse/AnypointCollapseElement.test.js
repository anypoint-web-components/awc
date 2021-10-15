import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../../anypoint-collapse.js';

/**
 * @typedef {import('../../index.js').AnypointCollapseElement} AnypointCollapseElement
 */

describe('AnypointCollapseElement', () => {
  /**
   * @return {Promise<AnypointCollapseElement>}
   */
  async function basicFixture() {
    return fixture(html`<anypoint-collapse opened>
      <div style="height:100px;">
        Lorem ipsum
      </div>
    </anypoint-collapse>`);
  }

  /**
   * @return {Promise<AnypointCollapseElement>}
   */
  async function emptyFixture() {
    return fixture(html`<anypoint-collapse opened></anypoint-collapse>`);
  }

  /**
   * @return {Promise<AnypointCollapseElement>}
   */
  async function horizontalFixture() {
    return fixture(`<anypoint-collapse opened horizontal>
      <div style="width:100px;">
        Lorem ipsum
      </div>
    </anypoint-collapse>`);
  }

  describe('constructor', () => {
    let collapse;

    beforeEach(async () => {
      collapse = await basicFixture();
    });

    it('opened attribute', () => {
      assert.equal(collapse.opened, true);
    });

    it('animated by default', () => {
      assert.isFalse(collapse.noAnimation, '`noAnimation` is false');
    });

    it('not transitioning on attached', () => {
      assert.isFalse(collapse.transitioning, '`transitioning` is false');
    });

    it('horizontal attribute', () => {
      assert.equal(collapse.horizontal, false);
    });

    it('default opened height', () => {
      assert.equal(collapse.style.maxHeight, '');
    });
  });

  describe('#opened', () => {
    let collapse;
    let collapseHeight;

    beforeEach(async () => {
      collapse = await basicFixture();
      collapseHeight = getComputedStyle(collapse).height;
    });

    it('set opened to false triggers animation', (done) => {
      collapse.opened = false;
      // Animation got enabled.
      assert.notEqual(collapse.style.transitionDuration, '0s');
      assert.equal(collapse.transitioning, true, 'transitioning became true');
      collapse.addEventListener('transitionend', () => {
        // Animation disabled.
        assert.equal(collapse.style.transitionDuration, '0s');
        assert.equal(collapse.transitioning, false, 'transitioning became false');
        done();
      });
    });

    it('set opened to false, then to true', (done) => {
      // this listener will be triggered twice (every time `opened` changes)
      collapse.addEventListener('transitionend', () => {
        if (collapse.opened) {
          // Check finalSize after animation is done.
          assert.equal(collapse.style.height, '');
          done();
        } else {
          // Check if size is still 0px.
          assert.equal(collapse.style.maxHeight, '0px');
          // Trigger 2nd toggle.
          collapse.opened = true;
          // Size should be immediately set.
          assert.equal(collapse.style.maxHeight, collapseHeight);
        }
      });
      // Trigger 1st toggle.
      collapse.opened = false;
      // Size should be immediately set.
      assert.equal(collapse.style.maxHeight, '0px');
    });

    it('opened changes trigger resize', () => {
      const spy = sinon.stub();
      collapse.addEventListener('resize', spy);
      // No animations for faster test.
      collapse.noAnimation = true;
      collapse.opened = false;
      assert.isTrue(spy.calledOnce, 'resize was fired');
    });

    it('overflow is hidden while animating', (done) => {
      collapse.addEventListener('transitionend', () => {
        // Should still be hidden.
        assert.equal(getComputedStyle(collapse).overflow, 'hidden');
        done();
      });
      assert.equal(getComputedStyle(collapse).overflow, 'visible');
      collapse.opened = false;
      // Immediately updated style.
      assert.equal(getComputedStyle(collapse).overflow, 'hidden');
    });
  });

  describe('#transitioning', () => {
    let collapse;

    beforeEach(async () => {
      collapse = await basicFixture();
    });

    it('updates only during transitions between open/close states', () => {
      const spy = sinon.spy();
      collapse.addEventListener('transitioningchange', spy);
      collapse.noAnimation = true;
      assert.equal(
          spy.callCount, 0, 'transitioning not affected by noAnimation');
      collapse.horizontal = true;
      assert.equal(
          spy.callCount, 0, 'transitioning not affected by horizontal');
      collapse.opened = false;
      assert.equal(spy.callCount, 2, 'transitioning changed twice');
      assert.equal(collapse.transitioning, false, 'transitioning is false');
    });
  });

  describe('#noAnimation', () => {
    let collapse;

    beforeEach(async () => {
      collapse = await basicFixture();
    });

    it('disables animations', () => {
      collapse.noAnimation = true;
      // trying to animate the size update
      collapse.opened = false;
      // Animation immediately disabled.
      assert.equal(collapse.style.maxHeight, '0px');
    });
  });

  describe('#horizontal', () => {
    let collapse;
    let collapseWidth;

    beforeEach(async () => {
      collapse = await horizontalFixture();
      collapseWidth = getComputedStyle(collapse).width;
    });

    it('opened attribute', () => {
      assert.equal(collapse.opened, true);
    });

    it('horizontal attribute', () => {
      assert.equal(collapse.horizontal, true);
    });

    it('default opened width', () => {
      assert.equal(collapse.style.width, '');
    });

    it('set opened to false, then to true', (done) => {
      // This listener will be triggered twice (every time `opened` changes).
      collapse.addEventListener('transitionend', () => {
        if (collapse.opened) {
          // Check finalSize after animation is done.
          assert.equal(collapse.style.width, '');
          done();
        } else {
          // Check if size is still 0px.
          assert.equal(collapse.style.maxWidth, '0px');
          // Trigger 2nd toggle.
          collapse.opened = true;
          // Size should be immediately set.
          assert.equal(collapse.style.maxWidth, collapseWidth);
        }
      });
      // Trigger 1st toggle.
      collapse.opened = false;
      // Size should be immediately set.
      assert.equal(collapse.style.maxWidth, '0px');
    });
  });

  describe('No content', () => {
    let collapse;

    beforeEach(async () => {
      collapse = await emptyFixture();
    });

    it('empty&opened shows dynamically loaded content', async () => {
      await nextFrame();
      collapse.toggle();
      collapse.toggle();
      assert.equal(collapse.style.maxHeight, '');
    });
  });

  describe('a11y', () => {
    /**
     * @return {Promise<AnypointCollapseElement>}
     */
    async function a11yFixture() {
      return fixture(`<anypoint-collapse id="collapse" tabindex="0">
        <div>
          Forma temperiemque cornua sidera dissociata cornua recessit innabilis ligavit: solidumque coeptis nullus caelum sponte phoebe di regat mentisque tanta austro capacius amphitrite sui quin postquam semina fossae liquidum umor galeae coeptis caligine liberioris quin liquidum matutinis invasit posset: flexi glomeravit radiis certis invasit oppida postquam onerosior inclusum dominari opifex terris pace finxit quam aquae nunc sine altae auroram quam habentem homo totidemque scythiam in pondus ensis tegit caecoque poena lapidosos humanas coeperunt poena aetas totidem nec natura aethera locavit caelumque distinxit animalibus phoebe cingebant moderantum porrexerat terrae possedit sua sole diu summaque obliquis melioris orbem
        </div>
      </anypoint-collapse>`);
    }

    let collapse;

    beforeEach(async () => {
      // Force focus on body at every test.
      document.body.focus();
      collapse = await a11yFixture();
    });

    it('aria attributes', () => {
      assert.equal(collapse.getAttribute('role'), 'group');
      assert.equal(collapse.getAttribute('aria-hidden'), 'true');
    });

    it('set opened to true', () => {
      collapse.opened = true;
      assert.equal(collapse.getAttribute('aria-hidden'), 'false');
    });

    it('focus the collapse when opened', () => {
      assert.notEqual(document.activeElement, collapse);
      collapse.opened = true;
      assert.equal(document.activeElement, collapse);
    });

    it('passes automated tests when closed', async () => {
      await assert.isAccessible(collapse, {
        // on FF this fails while it works on others...
        ignoredRules: ['aria-hidden-focus']
      });
    });
  });
});

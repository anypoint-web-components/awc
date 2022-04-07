import { fixture, assert, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../../src/define/anypoint-collapse.js';
import { AnypointCollapseElement } from '../../src/index.js';

describe('AnypointCollapseElement: Flex layout', () => {
  async function basicFixture(): Promise<AnypointCollapseElement> {
    return fixture(html`
      <div id="container" style="height: 200px; display: flex;">
        <anypoint-collapse id="collapse" opened style="flex: 1 0 auto">
          <div style="height:100px;">
            Lorem ipsum
          </div>
        </anypoint-collapse>
      </div>`);
  }

  let container: HTMLElement;
  let collapse: AnypointCollapseElement;
  let collapseHeight: string;

  beforeEach(async () => {
    container = await basicFixture();
    collapse = container.querySelector('anypoint-collapse')!;
    collapseHeight = getComputedStyle(collapse).height;
  });

  it('default opened height', () => {
    assert.equal(collapse.style.height, '');
  });

  it.skip('set opened to false triggers animation', (done) => {
    collapse.opened = false;
    // Animation got enabled.
    collapse.addEventListener('transitionend', () => {
      // Animation disabled.
      assert.equal(collapse.style.transitionDuration, '0s');
      done();
    });
  });

  it('noAnimation disables animations', () => {
    collapse.noAnimation = true;
    // trying to animate the size update
    collapse.opened = false;
    // Animation immediately disabled.
    assert.equal(collapse.style.maxHeight, '0px');
  });

  it.skip('set opened to false, then to true', (done) => {
    // this listener will be triggered twice (every time `opened` changes)
    collapse.addEventListener('transitionend', () => {
      if (collapse.opened) {
        // Check finalSize after animation is done.
        assert.equal(collapse.style.maxHeight, '');
        done();
      } else {
        // Check if size is still 0px.
        assert.equal(collapse.style.maxHeight, '0px');
        // Trigger 2nd toggle.
        collapse.toggle();
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

  it.skip('overflow is hidden while animating', (done) => {
    collapse.addEventListener('transitionend', () => {
      // Should still be hidden.
      assert.equal(getComputedStyle(collapse)
        .overflow, 'hidden');
      done();
    });
    assert.equal(getComputedStyle(collapse)
      .overflow, 'visible');
    collapse.opened = false;
    // Immediately updated style.
    assert.equal(getComputedStyle(collapse)
      .overflow, 'hidden');
  });

  it.skip('toggle horizontal updates size', () => {
    collapse.horizontal = false;
    assert.equal(collapse.style.width, '');
    assert.equal(collapse.style.maxHeight, '');
    assert.equal(collapse.style.transitionProperty, 'max-height');

    collapse.horizontal = true;
    assert.equal(collapse.style.maxWidth, '');
    assert.equal(collapse.style.height, '');
    assert.equal(collapse.style.transitionProperty, 'max-width');
  });
});

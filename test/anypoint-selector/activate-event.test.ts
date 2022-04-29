import { fixture, assert, html, nextFrame, oneEvent } from '@open-wc/testing';
import AnypointSelector from '../../src/elements/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function basicFixture(): Promise<AnypointSelector> {
    return fixture(html`<anypoint-selector id="selector" selected="0">
      <div>Item 0</div>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
      <div>Item 4</div>
    </anypoint-selector>`);
  }

  describe('activate event', () => {
    let s: AnypointSelector;
    beforeEach(async () => {
      s = await basicFixture();
    });

    it('activates on click', () => {
      assert.equal(s.selected, '0');
      // select Item 1
      s.children[1].dispatchEvent(new CustomEvent('click', { bubbles: true }));
      assert.equal(s.selected, '1');
    });

    it('activates on click and fires activate', (done) => {
      assert.equal(s.selected, '0');
      // attach activate listener
      s.addEventListener('activate', (event) => {
        // @ts-ignore
        assert.equal(event.detail.selected, '1');
        // @ts-ignore
        assert.equal(event.detail.item, s.children[1]);
        done();
      });
      // select Item 1
      s.children[1].dispatchEvent(new CustomEvent('click', { bubbles: true }));
    });

    it('click on already selected and fires activate', (done) => {
      assert.equal(s.selected, '0');
      // attach activate listener
      s.addEventListener('activate', (event) => {
        // @ts-ignore
        assert.equal(event.detail.selected, '0');
        // @ts-ignore
        assert.equal(event.detail.item, s.children[0]);
        done();
      });
      // select Item 0
      s.children[0].dispatchEvent(new CustomEvent('click', { bubbles: true }));
    });

    it('activates on mousedown', async () => {
      // set activateEvent to mousedown
      s.activateEvent = 'mousedown';
      await nextFrame();
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
      assert.equal(s.selected, '2');
    });

    it('activates on mousedown and fires activate', async () => {
      // set activateEvent to mousedown
      s.activateEvent = 'mousedown';
      await nextFrame();
      // select Item 2
      const p = oneEvent(s, 'activate');
      s.children[2].dispatchEvent(new Event('mousedown', { bubbles: true }));
      const e = await p;
      assert.equal(e.detail.selected, '2');
      assert.equal(e.detail.item, s.children[2]);
    });

    it('no activation', async () => {
      assert.equal(s.selected, '0');
      // set activateEvent to null
      // @ts-ignore
      s.activateEvent = null;
      await nextFrame();
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
      assert.equal(s.selected, '0');
    });

    it('activates on click and preventDefault', () => {
      // attach activate listener
      s.addEventListener('activate', (event) => {
        event.preventDefault();
      });
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('click', { bubbles: true }));
      // shouldn't got selected since we preventDefault in activate
      assert.equal(s.selected, '0');
    });

    it('activates after detach and re-attach', async () => {
      // Detach and re-attach
      const parent = s.parentNode;
      parent.removeChild(s);
      parent.appendChild(s);
      await nextFrame();
      // select Item 2
      s.children[2].dispatchEvent(new Event('click', { bubbles: true }));
      await nextFrame();
      assert.equal(s.selected, '2');
    });
  });
});

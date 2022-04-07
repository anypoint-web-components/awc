import { fixture, assert } from '@open-wc/testing';
import AnypointSelector from '../../src/elements/AnypointSelectorElement.js';
import '../../src/define/anypoint-selector.js';

const style = document.createElement('style');
style.innerHTML = `.selected {
  background: #ccc;
}`;

describe('AnypointSelector', () => {
  async function basicFixture(): Promise<AnypointSelector> {
    return fixture(`<anypoint-selector id="selector" selected="0">
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

    it('activates on mousedown', () => {
      // set activateEvent to mousedown
      s.activateEvent = 'mousedown';
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
      assert.equal(s.selected, '2');
    });

    it('activates on mousedown and fires activate', (done) => {
      // attach activate listener
      s.addEventListener('activate', (event) => {
        // @ts-ignore
        assert.equal(event.detail.selected, '2');
        // @ts-ignore
        assert.equal(event.detail.item, s.children[2]);
        done();
      });
      // set activateEvent to mousedown
      s.activateEvent = 'mousedown';
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('mousedown', { bubbles: true }));
    });

    it('no activation', () => {
      assert.equal(s.selected, '0');
      // set activateEvent to null
      // @ts-ignore
      s.activateEvent = null;
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

    it('activates after detach and re-attach', () => {
      // Detach and re-attach
      const parent = s.parentNode;
      // @ts-ignore
      parent.removeChild(s);
      // @ts-ignore
      parent.appendChild(s);
      // select Item 2
      s.children[2].dispatchEvent(new CustomEvent('click', { bubbles: true }));
      assert.equal(s.selected, '2');
    });
  });
});

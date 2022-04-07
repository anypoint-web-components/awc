/* eslint-disable lit-a11y/tabindex-no-positive */
import {fixture, assert, nextFrame, html} from '@open-wc/testing';
import './test-buttons.js';
import { TestButtons } from './test-buttons.js';
import './test-buttons-wrapper.js';
import { TestButtonsWrapper } from './test-buttons-wrapper.js';
import { FocusableHelper } from '../../src/define/focusable-helper.js';

const s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = `
.hidden {
  visibility: hidden;
}
.no-display {
  display: none;
}
`;
document.getElementsByTagName('head')[0].appendChild(s);

describe('FocusableHelper', () => {
  async function basicFixture(): Promise<HTMLDivElement> {
    return (fixture(html`
      <div>
        <h2>Focusables (no tabindex)</h2>
        <div>
          <input class="focusable1" placeholder="1 (nested)">
        </div>
        <a href="#" class="focusable2">2</a>
        <button disabled> disabled button</button>
        <input disabled tabindex="0" value="disabled input with tabindex">
        <div tabindex="-1">not focusable</div>
        <div contenteditable class="focusable3">3</div>
      </div>`));
  }

  async function tabindexFixture(): Promise<HTMLDivElement> {
    return (fixture(html`
      <div>
        <h2>Focusables (with tabindex)</h2>
        <div tabindex="0" class="focusable7">7</div>
        <div tabindex="0" class="focusable8">8</div>
        <div tabindex="0" class="focusable9">9</div>
        <div tabindex="0" class="focusable10">10</div>
        <div tabindex="0" class="focusable11">11</div>
        <div tabindex="0" class="focusable12">12</div>
        <div tabindex="-1">not focusable</div>
        <div tabindex="3" class="focusable3">3</div>
        <div tabindex="4" class="focusable4">4</div>
        <div tabindex="5" class="focusable5">5</div>
        <div>
          <div tabindex="1" class="focusable1">1 (nested)</div>
          <div tabindex="6" class="focusable6">6 (nested)</div>
        </div>
        <div tabindex="2" class="focusable2">2</div>
      </div>`));
  }

  async function shadowFixture(): Promise<TestButtons> {
    return (fixture(html`
      <test-buttons>
        <h2>focusables in ShadowDOM</h2>
        <input placeholder="type something..">
      </test-buttons>`));
  }

  async function composedFixture(): Promise<TestButtonsWrapper> {
    return (fixture(html`
      <test-buttons-wrapper>
        <input placeholder="type something..">
      </test-buttons-wrapper>`));
  }

  describe('getTabbableNodes', () => {
    it('returns tabbable nodes', async () => {
      const node = await basicFixture();
      await nextFrame();
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 3, '3 nodes are focusable');
      assert.equal(focusableNodes[0], node.querySelector('.focusable1'));
      assert.equal(focusableNodes[1], node.querySelector('.focusable2'));
      assert.equal(focusableNodes[2], node.querySelector('.focusable3'));
    });

    it('includes the root if it has a valid tabindex', async () => {
      const node = await basicFixture();
      await nextFrame();
      node.setAttribute('tabindex', '0');
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 4, '4 focusable nodes');
      // @ts-ignore
      assert.notEqual(focusableNodes.indexOf(node), -1, 'root is included');
    });

    it('excludes visibility: hidden elements', async () => {
      const node = await basicFixture();
      await nextFrame();
      const focusable = node.querySelector('.focusable1') as HTMLElement;
      focusable.classList.add('hidden');
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 2, '2 focusable nodes');
      assert.equal(focusableNodes.indexOf(focusable), -1, 'hidden element is not included');
    });

    it('excludes display: none elements', async () => {
      const node = await basicFixture();
      await nextFrame();
      const focusable = node.querySelector('.focusable1') as HTMLElement;
      focusable.classList.add('no-display');
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 2, '2 focusable nodes');
      assert.equal(focusableNodes.indexOf(focusable), -1, 'hidden element is not included');
    });

    it('respects the tabindex order', async () => {
      const node = await tabindexFixture();
      await nextFrame();
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 12, '12 nodes are focusable');
      for (let i = 0; i < 12; i++) {
        assert.equal(focusableNodes[i], node.querySelector(`.focusable${i + 1}`));
      }
    });

    it('includes tabbable elements in the shadow dom', async () => {
      const node = await shadowFixture();
      await nextFrame();
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 4, '4 nodes are focusable');
      assert.equal(focusableNodes[0], node.shadowRoot!.querySelector('#button0'));
      assert.equal(focusableNodes[1], node.shadowRoot!.querySelector('#button1'));
      assert.equal(focusableNodes[2], node.querySelector('input'));
      assert.equal(focusableNodes[3], node.shadowRoot!.querySelector('#button2'));
    });

    it('handles composition', async () => {
      const node = await composedFixture();
      await nextFrame();
      const focusableNodes = FocusableHelper.getTabbableNodes(node);
      assert.equal(focusableNodes.length, 6, '6 nodes are focusable');
      const wrapped = node.shadowRoot!.querySelector('#wrapped') as HTMLElement;
      assert.equal(focusableNodes[0], node.shadowRoot!.querySelector('#select'));
      assert.equal(focusableNodes[1], wrapped.shadowRoot!.querySelector('#button0'));
      assert.equal(focusableNodes[2], wrapped.shadowRoot!.querySelector('#button1'));
      assert.equal(focusableNodes[3], node.querySelector('input'));
      assert.equal(focusableNodes[4], wrapped.shadowRoot!.querySelector('#button2'));
      assert.equal(focusableNodes[5], node.shadowRoot!.querySelector('#focusableDiv'));
    });

    it('handles distributed nodes', async () => {
      const node = await composedFixture();
      await nextFrame();
      const wrapped = node.shadowRoot!.querySelector('#wrapped') as HTMLElement;
      const focusableNodes = FocusableHelper.getTabbableNodes(wrapped);
      assert.equal(focusableNodes.length, 4, '4 nodes are focusable');
      assert.equal(focusableNodes[0], wrapped.shadowRoot!.querySelector('#button0'));
      assert.equal(focusableNodes[1], wrapped.shadowRoot!.querySelector('#button1'));
      assert.equal(focusableNodes[2], node.querySelector('input'));
      assert.equal(focusableNodes[3], wrapped.shadowRoot!.querySelector('#button2'));
    });
  });
});

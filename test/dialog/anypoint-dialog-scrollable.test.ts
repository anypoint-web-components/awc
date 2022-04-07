/* eslint-disable no-param-reassign */
import { fixture, aTimeout, nextFrame, assert, html } from '@open-wc/testing';
import '../../src/define/anypoint-dialog.js';
import '../../src/define/anypoint-dialog-scrollable.js';
import { AnypointDialogElement } from '../../src/index.js';

describe('<anypoint-dialog-scrollable>', () => {
  async function basicFixture(): Promise<AnypointDialogElement> {
    const content = `
      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
      qui officia deserunt mollit anim id est laborum.`;
    let arr = new Array(7);
    arr = arr.fill(true);
    return (fixture(html`
      <anypoint-dialog style="width: 100%; height: 400px;">
        <div class="title">Header</div>
        <anypoint-dialog-scrollable>
          ${arr.map(() => html`<p>${content}</p>`)}
        </anypoint-dialog-scrollable>
        <div class="footer">Footer</div>
      </anypoint-dialog>`));
  }

  async function shortFixture(): Promise<AnypointDialogElement> {
    return (fixture(html`
      <anypoint-dialog style="width: 100%; height: 400px;">
        <div class="title">Header</div>
        <anypoint-dialog-scrollable>
          <p>Hello world!</p>
        </anypoint-dialog-scrollable>
        <div class="footer">Footer</div>
      </anypoint-dialog>`));
  }

  async function untilScrolled(node: HTMLElement, scrollTop: number): Promise<void> {
    node.scrollTop = scrollTop;
    await aTimeout(0);
    node.scrollTop = scrollTop;
    if (node.scrollTop === scrollTop) {
      await aTimeout(250);
    } else {
      await aTimeout(10);
    }
  }

  describe('basics', () => {
    it.skip('shows top divider when scrolled', async () => {
      const container = await basicFixture();
      const scrollable = container.querySelector('anypoint-dialog-scrollable')!;
      await aTimeout(100);
      await untilScrolled(scrollable.scrollTarget, 10);
      const result = getComputedStyle(scrollable, '::before').content;
      assert.ok(result, '::before has content');
    });

    it.skip('shows bottom divider when scrolled', async () => {
      const container = await basicFixture();
      const scrollable = container.querySelector('anypoint-dialog-scrollable')!;
      await aTimeout(100);
      await nextFrame();
      const result = getComputedStyle(scrollable, '::after').content;
      assert.ok(result, '::after has content');
    });

    it('hides bottom divider when scrolled to the bottom', async () => {
      const container = await basicFixture();
      const scrollable = container.querySelector('anypoint-dialog-scrollable')!;
      await aTimeout(10);
      const top = scrollable.scrollTarget.scrollHeight - scrollable.scrollTarget.offsetHeight;
      await untilScrolled(scrollable.scrollTarget, top);
      const result = getComputedStyle(scrollable, '::after').content;
      assert.ok(!result || result === 'none', '::after does not have content');
    });

    it('does not show bottom divider if not scrollable', async () => {
      const container = await shortFixture();
      await aTimeout(10);
      const scrollable = container.querySelector('anypoint-dialog-scrollable')!;
      const result = getComputedStyle(scrollable, '::after').content;
      assert.ok(!result || result === 'none', '::after does not have content');
    });

    it('removes bottom divider if content is removed dynamically', async () => {
      const container = await basicFixture();
      const scrollable = container.querySelector('anypoint-dialog-scrollable')!;
      await aTimeout(10);
      assert.isFalse(scrollable.classList.contains('scrolled-to-bottom'), 'scrollable does not have scrolled-to-bottom class');
      scrollable.innerHTML = '<p>dummy content</p>';
      await nextFrame();
      scrollable.updateScrollState();
      assert.isTrue(scrollable.classList.contains('scrolled-to-bottom'), 'scrollable has scrolled-to-bottom class');
    });
  });
});

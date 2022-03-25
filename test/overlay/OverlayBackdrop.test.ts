import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import './test-overlay.js';
import { TestOverlay } from './test-overlay.js';

const s = document.createElement('style');
s.type = 'text/css';
s.innerHTML = `
html,
body {
    margin: 0;
    width: 100%;
    height: 100%;
    min-width: 0;
}
.sizer {
    width: 4000px;
    height: 5000px;
}
`;
document.getElementsByTagName('head')[0].appendChild(s);

const sizer = document.createElement('div');
sizer.className = 'sizer';
document.body.appendChild(sizer);

describe('OverlayBackdrop', () => {
  async function backdropFixture(): Promise<TestOverlay> {
    return (fixture(html`
      <test-overlay withBackdrop>
          Overlay with backdrop
      </test-overlay>`));
  }

  async function runAfterOpen(overlay: TestOverlay): Promise<void> {
    return new Promise((resolve) => {
      overlay.addEventListener('opened', () => resolve());
      overlay.open();
    });
  }

  describe('overlay with backdrop', () => {
    let overlay: TestOverlay;

    beforeEach(async () => {
      overlay = await backdropFixture();
    });

    it('backdrop size matches parent size', async () => {
      await runAfterOpen(overlay);
      await nextFrame();
      const backdrop = overlay.backdropElement as HTMLElement;
      const parent = backdrop.parentElement as HTMLElement;
      assert.strictEqual(backdrop.offsetWidth, parent.clientWidth, 'backdrop width matches parent width');
      assert.strictEqual(backdrop.offsetHeight, parent.clientHeight, 'backdrop height matches parent height');
    });
  });
});

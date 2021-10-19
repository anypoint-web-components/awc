import { fixture, assert, aTimeout, oneEvent, html } from '@open-wc/testing';
import '../../bottom-sheet.js';


/** @typedef {import('../index').BottomSheetElement} BottomSheetElement */

describe('<bottom-sheet>', () => {
  /**
   * @returns {Promise<BottomSheetElement>}
   */
  async function basicFixture() {
    return (fixture(html`<bottom-sheet></bottom-sheet>`));
  }

  /**
   * @returns {Promise<BottomSheetElement>}
   */
  async function openedFixture() {
    return (fixture(html`<bottom-sheet opened></bottom-sheet>`));
  }

  /**
   * @returns {Promise<BottomSheetElement>}
   */
  async function labelFixture() {
    return (fixture(html`<bottom-sheet label="test"></bottom-sheet>`));
  }

  describe('Basics', () => {
    let sheet;

    it('is hidden', async () => {
      sheet = await basicFixture();
      assert.isFalse(sheet.opened);
    });

    it('is visible', async () => {
      sheet = await openedFixture();
      assert.isTrue(sheet.opened, '`opened` is true');
    });

    it('show() will open bottom-sheet', async () => {
      sheet = await basicFixture();
      sheet.open();
      assert.isTrue(sheet.opened, '`opened` is true');
    });

    it('hide() will close bottom-sheet', async () => {
      sheet = await openedFixture();
      sheet.close();
      assert.isFalse(sheet.opened, '`opened` is true');
    });

    it('fires the opened event', async () => {
      const element = await openedFixture();
      await oneEvent(element, 'opened');
    });

    it('there is only 1 bottom-sheet opened', async () => {
      const sheet1 = await basicFixture();
      const sheet2 = await openedFixture();
      sheet2.open();
      sheet1.open();
      assert.isTrue(sheet1.opened, 'sheet1 is opened');
      assert.isFalse(sheet2.opened, 'sheet2 is not opened');
      sheet2.open();
      assert.isFalse(sheet1.opened, 'sheet1 is now not opened');
      assert.isTrue(sheet2.opened, 'sheet2 is now opened');
    });

    it('scrollTarget returns the target', async () => {
      sheet = await basicFixture();
      await aTimeout(0);
      assert.ok(sheet.scrollTarget);
    });

    it('_renderOpened() adds bottom-sheet-open class', async () => {
      sheet = await basicFixture();
      sheet._renderOpened();
      assert.isTrue(sheet.classList.contains('bottom-sheet-open'));
    });

    it('_renderClosed() removes bottom-sheet-open class', async () => {
      sheet = await basicFixture();
      sheet.className = 'bottom-sheet-open';
      sheet._renderClosed();
      assert.isFalse(sheet.classList.contains('bottom-sheet-open'));
    });
  });

  describe('a11y', () => {
    it('passes in a regular state', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('passes in an opened state', async () => {
      const element = await openedFixture();
      await assert.isAccessible(element);
    });

    it('passes with a label', async () => {
      const element = await labelFixture();
      await assert.isAccessible(element);
    });
  });
});

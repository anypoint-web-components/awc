import { fixture, assert, html, aTimeout } from '@open-wc/testing';
import '../../anypoint-combobox.js';

/** @typedef {import('../../index').AnypointComboboxElement} AnypointCombobox */

describe('<anypoint-combobox>', () => {
  /**
   * @param {string[]=} source 
   * @returns {Promise<AnypointCombobox>}
   */
  async function sourceFixture(source) {
    return (fixture(html`
      <anypoint-combobox .source="${source}" value="a"></anypoint-combobox>`));
  }

  describe('Selection', () => {
    const suggestions = ['Apple', 'Apricot', 'Avocado'];
    let element = /** @type AnypointCombobox */ (null);

    beforeEach(async () => {
      element = await sourceFixture(suggestions);
    });

    it('closes the autocomplete on activate event', async () => {
      const node = element.shadowRoot.querySelector('anypoint-autocomplete');
      node.renderSuggestions();
      await aTimeout(0);
      const item = /** @type HTMLElement */ (node.querySelector('anypoint-item'));
      item.click();
      assert.isFalse(node.opened);
    });
  });

  describe('a11y', () => {
    async function a11yFixture(source) {
      return fixture(html`
        <anypoint-combobox
          .source="${source}"
          value="a"
        >
          <label slot="label">Test</label>
        </anypoint-combobox>`);
    }

    it('is accessible with value', async () => {
      const element = await a11yFixture();
      await assert.isAccessible(element);
    });
  });
});

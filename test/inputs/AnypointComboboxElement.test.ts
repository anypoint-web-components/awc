import { fixture, assert, html, aTimeout, nextFrame } from '@open-wc/testing';
import '../../src/define/anypoint-combobox.js';
import { AnypointComboboxElement } from '../../src/index.js'

describe('<anypoint-combobox>', () => {
  async function sourceFixture(source: string[]): Promise<AnypointComboboxElement> {
    return (fixture(html`
      <anypoint-combobox .source="${source}" value="a"></anypoint-combobox>`));
  }

  describe('Selection', () => {
    const suggestions = ['Apple', 'Apricot', 'Avocado'];
    let element: AnypointComboboxElement;

    beforeEach(async () => {
      element = await sourceFixture(suggestions);
    });

    it('closes the autocomplete on activate event', async () => {
      const node = element.shadowRoot!.querySelector('anypoint-autocomplete')!;
      node.renderSuggestions();
      await aTimeout(0);
      const item = node.querySelector('anypoint-item') as HTMLElement;
      item.click();
      assert.isFalse(node.opened);
    });
  });

  describe('a11y', () => {
    async function a11yFixture(source?: string[]): Promise<AnypointComboboxElement> {
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
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});

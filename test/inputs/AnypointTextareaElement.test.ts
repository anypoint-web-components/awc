import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import { AnypointTextareaElement } from '../../src/index.js'
import '../../src/define/anypoint-textarea.js';

// Because input and textarea uses the same input it only tests for textarea specific
// code as everything else was tested in input element.

describe('<anypoint-textarea>', () => {
  async function basicFixture(): Promise<AnypointTextareaElement> {
    return fixture(html`<anypoint-textarea></anypoint-textarea>`);
  }

  async function noLabelFloatFixture(): Promise<AnypointTextareaElement> {
    return fixture(html`<anypoint-textarea nolabelfloat>
      <label slot="label">Label</label>
    </anypoint-textarea>`);
  }

  describe('noLabelFloat', () => {
    let element: AnypointTextareaElement;
    beforeEach(async () => {
      element = await noLabelFloatFixture();
    });

    it('renders label by default', () => {
      const label = element.shadowRoot!.querySelector('.label')!;
      const { display } = getComputedStyle(label);
      assert.notEqual(display, 'none');
    });

    it('hides label when has value', async () => {
      element.value = 'test';
      await nextFrame();
      const label = element.shadowRoot!.querySelector('.label')!;
      const { display } = getComputedStyle(label);
      assert.equal(display, 'none');
    });
  });

  describe('a11y', () => {
    async function a11yBasicFixture(): Promise<AnypointTextareaElement> {
      return fixture(`<anypoint-textarea value="test value">
      <label slot="label">test label</label>
      </anypoint-textarea>`);
    }
    
    async function formFixture(): Promise<AnypointTextareaElement> {
      return fixture(`
      <form>
        <fieldset name="form-fields">
          <anypoint-textarea name="formItem" value="test-value">
            <label slot="label">Text input</label>
          </anypoint-listbox>
        </fieldset>
        <input type="reset" value="Reset">
        <input type="submit" value="Submit">
      </form>`);
    }

    it('sets tabindex on the element', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex on the element', async () => {
      const element = await fixture(`<anypoint-textarea tabindex="1"></anypoint-textarea>`);
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('is accessible with label', async () => {
      const element = await a11yBasicFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible in a form', async () => {
      const element = await formFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });
  });
});

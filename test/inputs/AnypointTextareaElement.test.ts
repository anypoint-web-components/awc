import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
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

  describe('_labelClass getter', () => {
    it('returns default value', async () => {
      const element = await basicFixture();
      assert.equal(
        element._labelClass,
        'label resting'
      );
    });

    it('returns floating value when value', async () => {
      const element = await basicFixture();
      element.value = 'test';
      assert.equal(
        element._labelClass,
        'label floating'
      );
    });

    it('returns floating value when placeholder', async () => {
      const element = await basicFixture();
      element.placeholder = 'test';
      assert.equal(
        element._labelClass,
        'label floating'
      );
    });

    it('returns floating value when focused', async () => {
      const element = await basicFixture();
      MockInteractions.focus(element);
      assert.equal(
        element._labelClass,
        'label floating'
      );
    });
  });

  describe('_infoAddonClass getter', () => {
    let element: AnypointTextareaElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(
        element._infoAddonClass,
        'info'
      );
    });

    it('returns default class when not invalid', () => {
      element.invalidMessage = 'test';
      assert.equal(
        element._infoAddonClass,
        'info'
      );
    });

    it('returns hidden class when invalid', () => {
      element.invalidMessage = 'test';
      element.invalid = true;
      assert.equal(
        element._infoAddonClass,
        'info label-hidden'
      );
    });
  });

  describe('_errorAddonClass getter', () => {
    let element: AnypointTextareaElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default class', () => {
      assert.equal(
        element._errorAddonClass,
        'invalid label-hidden'
      );
    });

    it('returns info-offset class when with info message', () => {
      element.infoMessage = 'test';
      assert.equal(
        element._errorAddonClass,
        'invalid label-hidden info-offset'
      );
    });

    it('returns visible class when invalid', () => {
      element.infoMessage = 'test';
      element.invalid = true;
      assert.equal(
        element._errorAddonClass,
        'invalid info-offset'
      );
    });
  });

  describe('Info message', () => {
    let element: AnypointTextareaElement;
    beforeEach(async () => {
      element = await basicFixture();
      element.infoMessage = 'test';
      await nextFrame();
    });

    it('renders info message', () => {
      const node = element.shadowRoot!.querySelector('p.info')!;
      assert.ok(node);
    });

    it('info message is visible', () => {
      const node = element.shadowRoot!.querySelector('p.info')!;
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when invalid', async () => {
      element.invalid = true;
      element.invalidMessage = 'test msg';
      await nextFrame();
      const node = element.shadowRoot!.querySelector('p.info')!;
      assert.isTrue(node.classList.contains('label-hidden'));
    });
  });

  describe('Error message', () => {
    let element: AnypointTextareaElement;
    beforeEach(async () => {
      element = await basicFixture();
      element.invalidMessage = 'test';
      await nextFrame();
    });

    it('renders error message', () => {
      const node = element.shadowRoot!.querySelector('p.invalid');
      assert.ok(node);
    });

    it('info message is visible when error', async () => {
      element.invalid = true;
      await nextFrame();
      const node = element.shadowRoot!.querySelector('p.invalid')!;
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when not invalid', async () => {
      const node = element.shadowRoot!.querySelector('p.invalid')!;
      assert.isTrue(node.classList.contains('label-hidden'));
    });
  });

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
    async function a11yNoLabelFixture(): Promise<AnypointTextareaElement> {
      return fixture(`<anypoint-textarea value="test value"></anypoint-textarea>`);
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
      await assert.isAccessible(element);
    });

    it('is not accessible without label', async () => {
      const element = await a11yNoLabelFixture();
      await assert.isNotAccessible(element);
    });

    it('is accessible in a form', async () => {
      const element = await formFixture();
      await assert.isAccessible(element);
    });
  });
});

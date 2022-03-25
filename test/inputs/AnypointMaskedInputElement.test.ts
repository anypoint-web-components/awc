import { fixture, assert, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { AnypointMaskedInputElement } from '../../index.js'
import '../../define/anypoint-masked-input.js';

describe('<anypoint-masked-input>', () => {
  async function maskedFixture(): Promise<AnypointMaskedInputElement> {
    return fixture(html`<anypoint-masked-input>
      <label slot="label">Label</label>
      </anypoint-masked-input>`);
  }

  async function visibleFixture(): Promise<AnypointMaskedInputElement> {
    return fixture(html`<anypoint-masked-input visible>
      <label slot="label">Label</label>
    </anypoint-masked-input>`);
  }

  async function typeFixture(): Promise<AnypointMaskedInputElement> {
    return fixture(html`<anypoint-masked-input type="tel">
    <label slot="label">Label</label>
    </anypoint-masked-input>`);
  }

  async function typeVisibleFixture(): Promise<AnypointMaskedInputElement> {
    return fixture(html`<anypoint-masked-input visible type="tel">
    <label slot="label">Label</label>
    </anypoint-masked-input>`);
  }

  describe('_visibilityToggleIcon', () => {
    it('returns an icon when masked', async () => {
      const element = await maskedFixture();
      assert.typeOf(element._visibilityToggleIcon, 'object');
    });

    it('returns an icon when not masked', async () => {
      const element = await visibleFixture();
      assert.typeOf(element._visibilityToggleIcon, 'object');
    });
  });

  describe('_visibilityToggleTitle', () => {
    it('returns title when masked', async () => {
      const element = await maskedFixture();
      assert.equal(
          element._visibilityToggleTitle,
          'Show input value'
      );
    });

    it('returns title when not masked', async () => {
      const element = await visibleFixture();
      assert.equal(
          element._visibilityToggleTitle,
          'Hide input value'
      );
    });
  });

  describe('_visibilityToggleLabel', () => {
    it('returns label when masked', async () => {
      const element = await maskedFixture();
      assert.equal(
          element._visibilityToggleLabel,
          'Activate to show input value'
      );
    });

    it('returns label when not masked', async () => {
      const element = await visibleFixture();
      assert.equal(
          element._visibilityToggleLabel,
          'Activate to hide input value'
      );
    });
  });

  describe('_inputType', () => {
    it('returns type when masked', async () => {
      const element = await typeFixture();
      assert.equal(element._inputType, 'password');
    });

    it('returns type when not masked', async () => {
      const element = await typeVisibleFixture();
      assert.equal(element._inputType, 'tel');
    });

    it('returns default type when "type" is not set', async () => {
      const element = await visibleFixture();
      assert.equal(element._inputType, 'text');
    });
  });

  describe('toggleVisibility()', () => {
    let element: AnypointMaskedInputElement;
    beforeEach(async () => {
      element = await maskedFixture();
    });

    it('Toggles visibility when button click', () => {
      const node = element.shadowRoot!.querySelector('anypoint-icon-button')!;
      MockInteractions.tap(node);

      assert.isTrue(element.visible);
    });
  });

  describe('a11y', () => {
    it('is accessible when masked', async () => {
      const element = await maskedFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when not masked', async () => {
      const element = await visibleFixture();
      await assert.isAccessible(element);
    });
  });
});

/* eslint-disable lit-a11y/role-has-required-aria-attrs */
import { fixture, assert, html } from '@open-wc/testing';
import { AnypointRadioButtonElement } from '../../src/index.js'
import '../../src/define/anypoint-radio-button.js';

describe('<anypoint-radio-button>', () => {
  async function basicFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button>Label</anypoint-radio-button>`);
  }
  
  async function roleFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button role="checkbox"></anypoint-radio-button>`);
  }

  async function tabindexFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button tabindex="-1"></anypoint-radio-button>`);
  }

  describe('a11y', () => {
    it('sets the default role attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'radio');
    });

    it('respects an existing role attribute', async () => {
      const element = await roleFixture();
      assert.equal(element.getAttribute('role'), 'checkbox');
    });

    it('sets the default tabindex attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects an existing tabindex attribute', async () => {
      const element = await tabindexFixture();
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('is accessible for normal state', async () => {
      const element = await fixture(`<anypoint-radio-button>Label</anypoint-radio-button>`);
      await assert.isAccessible(element);
    });

    it('is accessible for disabled state', async () => {
      const element = await fixture(`<anypoint-radio-button disabled>Label</anypoint-radio-button>`);
      await assert.isAccessible(element);
    });

    it('is accessible for checked state', async () => {
      const element = await fixture(`<anypoint-radio-button checked>Label</anypoint-radio-button>`);
      await assert.isAccessible(element);
    });

    it('is not accessible when no label', async () => {
      const element = await fixture(`<anypoint-radio-button></anypoint-radio-button>`);
      await assert.isNotAccessible(element);
    });

    it('is accessible with aria-label', async () => {
      const element = await fixture(`<anypoint-radio-button aria-label="Batman">Robin</anypoint-radio-button>`);
      await assert.isAccessible(element);
    });
  });
});

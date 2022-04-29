/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable lit-a11y/role-has-required-aria-attrs */
/* eslint-disable lit-a11y/tabindex-no-positive */
import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import '../../src/colors.js';
import '../../src/define/anypoint-switch.js';
import { AnypointSwitchElement } from '../../src/index.js';

describe('<anypoint-switch>', () => {
  async function basicFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch>on/off</anypoint-switch>`));
  }

  async function checkedFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch checked>on/off</anypoint-switch>`));
  }

  async function tabIndexFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch tabindex="1">on/off</anypoint-switch>`));
  }

  async function roleFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch role="radio">Batman</anypoint-switch>`));
  }

  async function anypointFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch anypoint>on/off</anypoint-switch>`));
  }

  async function checkedAnypointFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch checked anypoint>on/off</anypoint-switch>`));
  }

  describe('anypoint', () => {
    let element: AnypointSwitchElement;
    beforeEach(async () => {
      element = await anypointFixture();
    });

    it('renders unchecked icon', () => {
      const icon = element.shadowRoot!.querySelector('.anypoint .icon svg');
      assert.ok(icon);
    });

    it('renders checked icon', async () => {
      const uncheckedIcon = element.shadowRoot!.querySelector('.anypoint .icon svg');
      element.checked = true;
      await nextFrame();
      const checkedIcon = element.shadowRoot!.querySelector('.anypoint .icon svg');
      assert.ok(checkedIcon, 'has checked icon');
      assert.notEqual(checkedIcon, uncheckedIcon, 'it is not unchecked icon');
    });
  });

  describe('a11y', () => {
    it('Sets default tabindex', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it.skip('Respects existing tabindex', async () => {
      const element = await tabIndexFixture();
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('Sets default role', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'checkbox');
    });

    it('Respects existing role', async () => {
      const element = await roleFixture();
      assert.equal(element.getAttribute('role'), 'radio');
    });

    it('Sets aria-checked attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('aria-checked'), 'false');
    });

    it('Sets aria-checked when checked', async () => {
      const element = await checkedFixture();
      assert.equal(element.getAttribute('aria-checked'), 'true');
    });

    it('is not accessible without the label', async () => {
      const element = await fixture(`<anypoint-switch></anypoint-switch>`);
      await assert.isNotAccessible(element);
    });

    it('is accessible when not checked', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when checked', async () => {
      const element = await checkedFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when not checked (anypoint)', async () => {
      const element = await anypointFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when checked (anypoint)', async () => {
      const element = await checkedAnypointFixture();
      await assert.isAccessible(element);
    });
  });
});

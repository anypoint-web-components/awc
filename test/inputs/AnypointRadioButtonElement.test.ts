/* eslint-disable lit-a11y/role-has-required-aria-attrs */
import { fixture, assert, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon';
import { AnypointRadioButtonElement } from '../../src/index.js'
import '../../src/define/anypoint-radio-button.js';

describe('<anypoint-radio-button>', () => {
  async function basicFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button>Label</anypoint-radio-button>`);
  }
  async function noLabelFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button>Label</anypoint-radio-button>`);
  }
  
  async function roleFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button role="checkbox"></anypoint-radio-button>`);
  }
  async function tabindexFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button tabindex="-1"></anypoint-radio-button>`);
  }
  async function checkedFixture(): Promise<AnypointRadioButtonElement> {
    return fixture(html`<anypoint-radio-button checked>Label</anypoint-radio-button>`);
  }

  describe('Basics', () => {
    it('checked is false by default', async () => {
      const element = await noLabelFixture();
      assert.isFalse(element.checked);
    });

    it('checked is true from attribute setup', async () => {
      const element = await checkedFixture();
      assert.isTrue(element.checked);
    });

    it('checked set to false sets aria attribute', async () => {
      const element = await checkedFixture();
      // @ts-ignore
      element.checked = undefined;
      assert.equal(element.getAttribute('aria-checked'), 'false');
    });

    it('sets tabindex to -1 when disabled', async () => {
      const element = await checkedFixture();
      element.disabled = true;
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('restores tabindex when enabled', async () => {
      const element = await checkedFixture();
      element.disabled = true;
      await aTimeout(0);
      element.disabled = false;
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('does not restore button tabindex when manually removed', async () => {
      const element = await checkedFixture();
      element.removeAttribute('tabindex');
      element.disabled = true;
      assert.equal(element.getAttribute('tabindex'), '-1');
      await aTimeout(0);
      element.disabled = false;
      assert.isFalse(element.hasAttribute('tabindex'));
    });
  });

  describe('No label', () => {
    let element: AnypointRadioButtonElement;

    beforeEach(async () => {
      element = await noLabelFixture();
    });

    it('Check button via click', (done) => {
      element.addEventListener('click', () => {
        assert.isTrue(element.getAttribute('aria-checked') === 'true');
        assert.isTrue(element.checked);
        done();
      });
      element.click();
    });

    it('Button cannot be unchecked by click', () => {
      element.checked = true;
      element.click();
      assert.isTrue(element.checked);
    });

    it('Disabled button cannot be clicked', () => {
      element.disabled = true;
      element.click();
      assert.isFalse(element.checked);
    });
  });

  describe('User input', () => {
    let element: AnypointRadioButtonElement;

    beforeEach(async () => {
      element = await noLabelFixture();
    });

    [
      'Space', 'Enter', 'NumpadEnter',
    ].forEach((key) => {
      it(`toggles state with the ${key} key`, () => {
        const spy = sinon.spy();
        element.addEventListener('change', spy);
        const e = new KeyboardEvent('keydown', {
          bubbles: true,
          composed: true,
          cancelable: true,
          code: key,
        });
        element.dispatchEvent(e);
        assert.isTrue(element.checked, 'the element has the checked state');
        assert.isTrue(spy.called, 'dispatched the change event');
      });
    });

    it('ignores other keys', () => {
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'KeyA',
      });
      element.dispatchEvent(e);
      assert.isFalse(element.checked, 'the element has the checked state');
      assert.isFalse(spy.called, 'dispatched the change event');
    });
  });

  describe('a11y', () => {
    it('Sets default role attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'radio');
    });

    it('Respects existing role attribute', async () => {
      const element = await roleFixture();
      assert.equal(element.getAttribute('role'), 'checkbox');
    });

    it('Sets default tabindex attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('Respects existing tabindex attribute', async () => {
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

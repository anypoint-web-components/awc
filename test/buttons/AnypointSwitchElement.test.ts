/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable lit-a11y/role-has-required-aria-attrs */
/* eslint-disable lit-a11y/tabindex-no-positive */
import { fixture, assert, aTimeout, nextFrame, html } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../colors.js';
import '../../define/anypoint-switch.js';
import { AnypointSwitchElement } from '../../index.js';

describe('<anypoint-switch>', () => {
  async function basicFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch>on/off</anypoint-switch>`));
  }

  async function noLabelFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch></anypoint-switch>`));
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

  async function disabledFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch disabled tabindex="1">Batman</anypoint-switch>`));
  }

  async function anypointFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch anypoint>on/off</anypoint-switch>`));
  }

  async function checkedAnypointFixture(): Promise<AnypointSwitchElement> {
    return (fixture(html`<anypoint-switch checked anypoint>on/off</anypoint-switch>`));
  }

  async function formFixture(): Promise<HTMLFormElement> {
    return (fixture(html`<form>
      <anypoint-switch name="test-name" value="test-value"></anypoint-switch>
    </form>`));
  }

  async function formCheckedFixture(): Promise<HTMLFormElement> {
    return (fixture(html`<form>
      <anypoint-switch name="test-name" value="test-value" checked></anypoint-switch>
    </form>`));
  }

  async function formCheckedRequiredFixture(): Promise<HTMLFormElement> {
    return (fixture(html`<form>
      <anypoint-switch name="test-name" value="test-value" checked required></anypoint-switch>
    </form>`));
  }

  describe('Defaults', () => {
    let c1: AnypointSwitchElement;
    beforeEach(async () => {
      c1 = await noLabelFixture();
    });

    it('check switch via click', async () => {
      MockInteractions.tap(c1);
      await aTimeout(0);
      assert.equal(c1.getAttribute('aria-checked'), 'true', 'Has aria-checked');
      assert.isTrue(c1.checked, '.checked is true');
    });

    it('toggle switch via click', async () => {
      c1.checked = true;
      MockInteractions.tap(c1);
      await aTimeout(0);
      assert.isFalse(c1.getAttribute('aria-checked') !== 'false');
      assert.isFalse(c1.checked);
    });

    it('disabled switch cannot be clicked', async () => {
      c1.disabled = true;
      c1.checked = true;
      MockInteractions.tap(c1);
      await aTimeout(100);
      assert.isTrue(c1.getAttribute('aria-checked') === 'true', 'has checked attribute');
      assert.isTrue(c1.checked, 'is checked');
    });

    it('switch can be validated', () => {
      c1.required = true;
      assert.isFalse(c1.validate());
      c1.checked = true;
      assert.isTrue(c1.validate());
    });

    it('disabled switch is always valid', () => {
      c1.disabled = true;
      c1.required = true;
      assert.isTrue(c1.validate());
      c1.checked = true;
      assert.isTrue(c1.validate());
    });

    it('Passes validation', () => {
      const result = c1.checkValidity();
      assert.isTrue(result);
    });
  });

  describe('_internals', () => {
    it('Has associated form', async () => {
      const form = await formFixture();
      const element = form.querySelector('anypoint-switch')!;
      // @ts-ignore
      if (element._internals && element._internals.form) {
        assert.isTrue(element.form === form);
      }
    });

    it('Form reset resets the control', async () => {
      const form = await formCheckedFixture();
      const element = form.querySelector('anypoint-switch')!;
      // @ts-ignore
      if (element._internals && element._internals.form) {
        form.reset();
        assert.isFalse(element.checked);
      }
    });

    it('Sets custom validation', async () => {
      const form = await formCheckedRequiredFixture();
      const element = form.querySelector('anypoint-switch')!;
      // @ts-ignore
      if (element._internals && element._internals.form) {
        element.checked = false;
        assert.isTrue(element.matches(':invalid'));
      }
    });
  });

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

  describe('Disabled state', () => {
    let element: AnypointSwitchElement;
    beforeEach(async () => {
      element = await disabledFixture();
    });

    it('sets tabindex to -1', () => {
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('enabling button sets tabindex', async () => {
      element.disabled = false;
      await nextFrame();
      assert.equal(element.getAttribute('tabindex'), '0');
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

  describe('change', () => {
    let element: AnypointSwitchElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.onchange, null);
      const f = () => {};
      element.onchange = f;
      assert.isTrue(element.onchange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onchange = f;
      element.click();
      // @ts-ignore
      element.onchange = undefined;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onchange = f1;
      element.onchange = f2;
      element.click();
      // @ts-ignore
      element.onchange = undefined;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
});

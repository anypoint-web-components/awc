/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { fixture, assert, aTimeout, nextFrame } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../src/colors.js';
import '../../src/define/anypoint-checkbox.js';
import { keyDownUp } from '../lib/helpers.js';
import { AnypointCheckboxElement } from '../../src/index.js';

describe('<anypoint-checkbox>', () => {
  async function basicFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox></anypoint-checkbox>`));
  }

  async function noLabelFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox></anypoint-checkbox>`));
  }

  async function withLabelFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox>Batman</anypoint-checkbox>`));
  }

  async function roleFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox role="button">Batman</anypoint-checkbox>`));
  }

  async function checkedFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox checked>Batman</anypoint-checkbox>`));
  }

  async function tabindexFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox tabindex="-1">Batman</anypoint-checkbox>`));
  }

  async function indeterminateFixture(): Promise<AnypointCheckboxElement> {
    return (fixture(`<anypoint-checkbox indeterminate></anypoint-checkbox>`));
  }

  async function formFixture(): Promise<HTMLFormElement> {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value"></anypoint-checkbox>
    </form>`));
  }

  async function formCheckedFixture(): Promise<HTMLFormElement> {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value" checked></anypoint-checkbox>
    </form>`));
  }

  async function formCheckedRequiredFixture(): Promise<HTMLFormElement> {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value" checked required></anypoint-checkbox>
    </form>`));
  }

  describe('a11y', () => {
    let c1: AnypointCheckboxElement;
    let c2: AnypointCheckboxElement;
    let c3: AnypointCheckboxElement;
    let c4: AnypointCheckboxElement;
    let c5: AnypointCheckboxElement;
    beforeEach(async () => {
      c1 = await noLabelFixture();
      c2 = await withLabelFixture();
      c3 = await roleFixture();
      c4 = await checkedFixture();
      c5 = await tabindexFixture();
    });

    it('Sets role attribute', () => {
      assert.isTrue(c1.getAttribute('role') === 'checkbox');
      assert.isTrue(c2.getAttribute('role') === 'checkbox');
      assert.isTrue(c3.getAttribute('role') === 'button');
      assert.isTrue(c4.getAttribute('role') === 'checkbox');
    });

    it('Sets aria-checked attribute', () => {
      assert.equal(c1.getAttribute('aria-checked'), 'false');
      assert.equal(c2.getAttribute('aria-checked'), 'false');
      assert.equal(c3.getAttribute('aria-checked'), 'false');
      assert.equal(c4.getAttribute('aria-checked'), 'true');
    });

    it('Sets tabindex attribute', () => {
      assert.equal(c1.getAttribute('tabindex'), '0');
      assert.equal(c2.getAttribute('tabindex'), '0');
      assert.equal(c3.getAttribute('tabindex'), '0');
      assert.equal(c4.getAttribute('tabindex'), '0');
      assert.equal(c5.getAttribute('tabindex'), '-1');
    });

    it('is not accessible without the label', async () => {
      const element = await fixture(`<anypoint-checkbox></anypoint-checkbox>`);
      await assert.isNotAccessible(element);
    });

    it('is accessible with label', async () => {
      const element = await fixture(`<anypoint-checkbox>Checkbox</anypoint-checkbox>`);
      await assert.isAccessible(element);
    });

    it('is accessible with aria label', async () => {
      const element = await fixture(`<anypoint-checkbox aria-label="Checkbox"></anypoint-checkbox>`);
      await assert.isAccessible(element);
    });

    it('is accessible with aria label', async () => {
      const element = await fixture(`<anypoint-checkbox disabled>Disabled checkbox</anypoint-checkbox>`);
      await assert.isAccessible(element);
    });

    it('is accessible when checked', async () => {
      const element = await fixture(`<anypoint-checkbox checked>Checked checkbox</anypoint-checkbox>`);
      await assert.isAccessible(element);
    });
  });

  describe('Defaults', () => {
    let c1: AnypointCheckboxElement;
    beforeEach(async () => {
      c1 = await noLabelFixture();
    });

    it('check checkbox via click', async () => {
      c1.click();
      await aTimeout(0);
      assert.equal(c1.getAttribute('aria-checked'), 'true', 'Has aria-checked');
      assert.isTrue(c1.checked, '.checked is true');
    });

    it('toggle checkbox via click', async () => {
      c1.checked = true;
      c1.click();
      await nextFrame();
      assert.isFalse(c1.getAttribute('aria-checked') !== 'false');
      assert.isFalse(c1.checked);
    });

    it('disabled checkbox cannot be clicked', async () => {
      c1.disabled = true;
      c1.checked = true;
      c1.click();
      await aTimeout(0);
      assert.isTrue(c1.getAttribute('aria-checked') === 'true');
      assert.isTrue(c1.checked);
    });

    it('checkbox can be validated', () => {
      c1.required = true;
      assert.isFalse(c1.checkValidity());
      c1.checked = true;
      assert.isTrue(c1.checkValidity());
    });

    it('disabled checkbox is always valid', () => {
      c1.disabled = true;
      c1.required = true;
      assert.isTrue(c1.checkValidity());
      c1.checked = true;
      assert.isTrue(c1.checkValidity());
    });
  });

  describe('Basic', () => {
    let element: AnypointCheckboxElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('check checkbox via click', async () => {
      element.click();
      await nextFrame();
      assert.equal(element.getAttribute('aria-checked'), 'true');
      assert.isTrue(element.checked);
    });

    it('uncheck checkbox via click', async () => {
      element.checked = true;
      element.click();
      await nextFrame();
      assert.equal(element.getAttribute('aria-checked'), 'false');
      assert.isFalse(element.checked);
    });

    it('disabled checkbox cannot be clicked', (done) => {
      element.disabled = true;
      element.checked = true;
      element.click();
      setTimeout(() => {
        assert.equal(element.getAttribute('aria-checked'), 'true');
        assert.isTrue(element.checked);
        done();
      }, 1);
    });

    it('checkbox can be validated', () => {
      element.required = true;
      assert.isFalse(element.checkValidity(), 'not validated');
      element.checked = true;
      assert.isTrue(element.checkValidity(), 'is validated');
    });

    it('disabled checkbox is always valid', () => {
      element.disabled = true;
      element.required = true;
      assert.isTrue(element.checkValidity());
      element.checked = true;
      assert.isTrue(element.checkValidity());
    });

    it('Passes validation', () => {
      const result = element.checkValidity();
      assert.isTrue(result);
    });
  });

  describe('indeterminate', () => {
    let element: AnypointCheckboxElement;
    beforeEach(async () => {
      element = await indeterminateFixture();
    });

    it('Removes indeterminate when clicked', async () => {
      MockInteractions.tap(element);
      await aTimeout(0);
      assert.isFalse(element.indeterminate);
    });

    it('Removes indeterminate when checked changed', () => {
      element.checked = true;
      assert.isFalse(element.indeterminate);
    });

    it('Removes indeterminate when space pressed', async () => {
      keyDownUp(element, 'Space');
      await aTimeout(1);
      assert.isFalse(element.indeterminate);
    });

    it('Removes indeterminate when enter pressed', async () => {
      keyDownUp(element, 'Enter');
      await aTimeout(0);
      assert.isFalse(element.indeterminate);
    });
  });

  describe('checkbox classes', () => {
    let element: AnypointCheckboxElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has the checkbox class by default', () => {
      const node = element.shadowRoot!.querySelector('.checkboxContainer')!.firstElementChild as HTMLElement;
      assert.equal(node.className.trim(), 'checkbox');
    });

    it('has the checked class when checked', async () => {
      element.click();
      await nextFrame();
      const node = element.shadowRoot!.querySelector('.checkboxContainer')!.firstElementChild as HTMLElement;
      assert.equal(node.className.trim(), 'checkbox checked');
    });

    it('has the invalid class when invalid', async () => {
      element.required = true;
      element.checkValidity();
      await nextFrame();
      const node = element.shadowRoot!.querySelector('.checkboxContainer')!.firstElementChild as HTMLElement;
      assert.equal(node.className.trim(), 'checkbox invalid');
    });
  });

  describe('_internals', () => {
    it('has an associated form', async () => {
      const form = await formFixture();
      const element = form.querySelector('anypoint-checkbox')!;
      // @ts-ignore
      if (element._internals && element.form) {
        assert.isTrue(element.form === form);
      }
    });

    it('resets the control', async () => {
      const form = await formCheckedFixture();
      const element = form.querySelector('anypoint-checkbox')!;
      // @ts-ignore
      if (element._internals && element.form) {
        form.reset();
        assert.isFalse(element.checked);
      }
    });

    it('sets the custom validation', async () => {
      const form = await formCheckedRequiredFixture();
      const element = form.querySelector('anypoint-checkbox')!;
      // @ts-ignore
      if (element._internals && element.form) {
        element.checked = false;
        await nextFrame();
        assert.isTrue(element.matches(':invalid'));
      }
    });
  });

  describe('change', () => {
    let element: AnypointCheckboxElement;
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

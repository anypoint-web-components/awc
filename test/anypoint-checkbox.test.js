import { fixture, assert, aTimeout } from '@open-wc/testing';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '../anypoint-checkbox.js';

/** @typedef {import('../').AnypointCheckbox} AnypointCheckbox */

describe('<anypoint-checkbox>', () => {
  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function basicFixture() {
    return (fixture(`<anypoint-checkbox></anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function noLabelFixture() {
    return (fixture(`<anypoint-checkbox></anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function withLabelFixture() {
    return (fixture(`<anypoint-checkbox>Batman</anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function roleFixture() {
    return (fixture(`<anypoint-checkbox role="button">Batman</anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function checkedFixture() {
    return (fixture(`<anypoint-checkbox checked>Batman</anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function tabindexFixture() {
    return (fixture(`<anypoint-checkbox tabindex="-1">Batman</anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<AnypointCheckbox>}
   */
  async function indeterminateFixture() {
    return (fixture(`<anypoint-checkbox indeterminate></anypoint-checkbox>`));
  }

  /**
   * @returns {Promise<HTMLFormElement>}
   */
  async function formFixture() {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value"></anypoint-checkbox>
    </form>`));
  }

  /**
   * @returns {Promise<HTMLFormElement>}
   */
  async function formCheckedFixture() {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value" checked></anypoint-checkbox>
    </form>`));
  }

  /**
   * @returns {Promise<HTMLFormElement>}
   */
  async function formCheckedRequiredFixture() {
    return (fixture(`<form>
      <anypoint-checkbox name="test-name" value="test-value" checked required></anypoint-checkbox>
    </form>`));
  }

  describe('a11y', () => {
    let c1;
    let c2;
    let c3;
    let c4;
    let c5;
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
    let c1;
    beforeEach(async () => {
      c1 = await noLabelFixture();
    });

    it('check checkbox via click', async () => {
      MockInteractions.tap(c1);
      await aTimeout(0);
      assert.equal(c1.getAttribute('aria-checked'), 'true', 'Has aria-checked');
      assert.isTrue(c1.checked, '.checked is true');
    });

    it('toggle checkbox via click', async () => {
      c1.checked = true;
      MockInteractions.tap(c1);
      await aTimeout(0);
      assert.isFalse(c1.getAttribute('aria-checked') !== 'false');
      assert.isFalse(c1.checked);
    });

    it('disabled checkbox cannot be clicked', async () => {
      c1.disabled = true;
      c1.checked = true;
      MockInteractions.tap(c1);
      await aTimeout(0);
      assert.isTrue(c1.getAttribute('aria-checked') === 'true');
      assert.isTrue(c1.checked);
    });

    it('checkbox can be validated', () => {
      c1.required = true;
      assert.isFalse(c1.validate());
      c1.checked = true;
      assert.isTrue(c1.validate());
    });

    it('disabled checkbox is always valid', () => {
      c1.disabled = true;
      c1.required = true;
      assert.isTrue(c1.validate());
      c1.checked = true;
      assert.isTrue(c1.validate());
    });
  });

  describe('Basic', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('check checkbox via click', (done) => {
      element.addEventListener('click', () => {
        assert.equal(element.getAttribute('aria-checked'), 'true');
        assert.isTrue(element.checked);
        done();
      });
      element.click();
    });

    it('Uncheck checkbox via click', (done) => {
      element.checked = true;
      element.addEventListener('click', () => {
        assert.equal(element.getAttribute('aria-checked'), 'false');
        assert.isFalse(element.checked);
        done();
      });
      element.click();
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
      assert.isFalse(element.validate(), 'not validated');
      element.checked = true;
      assert.isTrue(element.validate(), 'is validated');
    });

    it('disabled checkbox is always valid', () => {
      element.disabled = true;
      element.required = true;
      assert.isTrue(element.validate());
      element.checked = true;
      assert.isTrue(element.validate());
    });

    it('Passes validation', () => {
      const result = element.checkValidity();
      assert.isTrue(result);
    });
  });

  describe('indeterminate', () => {
    let element;
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
      MockInteractions.pressSpace(element);
      await aTimeout(0);
      assert.isFalse(element.indeterminate);
    });

    it('Removes indeterminate when enter pressed', async () => {
      MockInteractions.pressEnter(element);
      await aTimeout(0);
      assert.isFalse(element.indeterminate);
    });
  });

  describe('_computeCheckboxClass()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns empty string when no arguments', () => {
      const result = element._computeCheckboxClass(false, false);
      assert.equal(result, '');
    });

    it('Returns checked class for checked', () => {
      const result = element._computeCheckboxClass(true, false);
      assert.equal(result, 'checked');
    });

    it('Returns invalid class for invalid', () => {
      const result = element._computeCheckboxClass(false, true);
      assert.equal(result, 'invalid');
    });

    it('Returns both classes', () => {
      const result = element._computeCheckboxClass(true, true);
      assert.equal(result, 'checked invalid');
    });
  });

  describe('_internals', () => {
    it('Has associated form', async () => {
      const form = await formFixture();
      const element = form.querySelector('anypoint-checkbox');
      // @ts-ignore
      if (element._internals) {
        assert.isTrue(element.form === form);
      }
    });

    it('Form reset resets the control', async () => {
      const form = await formCheckedFixture();
      const element = form.querySelector('anypoint-checkbox');
      // @ts-ignore
      if (element._internals) {
        form.reset();
        assert.isFalse(element.checked);
      }
    });

    it('Sets custom validation', async () => {
      const form = await formCheckedRequiredFixture();
      const element = form.querySelector('anypoint-checkbox');
      // @ts-ignore
      if (element._internals) {
        element.checked = false;
        assert.isTrue(element.matches(':invalid'));
      }
    });
  });

  describe('change', () => {
    let element = /** @type AnypointCheckbox */ (null);
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
      element.onchange = null;
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
      element.onchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });
});

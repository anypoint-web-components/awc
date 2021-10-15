import { fixture, assert } from '@open-wc/testing';
import sinon from 'sinon';
import './simple-checkbox.js';

/** @typedef {import('./simple-checkbox').SimpleCheckbox} SimpleCheckbox */

describe('Active state tests', () => {
  /**
   * @returns {Promise<SimpleCheckbox>}
   */
  async function basicFixture() {
    return fixture(`<simple-checkbox></simple-checkbox>`);
  }

  /**
   * @returns {Promise<SimpleCheckbox>}
   */
  async function checkedFixture() {
    return fixture(`<simple-checkbox checked></simple-checkbox>`);
  }

  /**
   * @returns {Promise<SimpleCheckbox>}
   */
  async function withValueFixture() {
    return fixture(`<simple-checkbox value="batman"></simple-checkbox>`);
  }

  /**
   * @returns {Promise<SimpleCheckbox>}
   */
  async function requiredFixture() {
    return fixture(`<simple-checkbox required></simple-checkbox>`);
  }

  describe('Basics', () => {
    it('can be checked', async () => {
      const c = await basicFixture();
      assert.isFalse(c.checked);
      c.checked = true;
      assert.isTrue(c.checked);
    });

    it('can be unchecked', async () => {
      const c = await checkedFixture();
      assert.isTrue(c.checked);
      c.checked = false;
      assert.isFalse(c.checked);
    });

    it('invalid if required and not checked', async () => {
      const c = await basicFixture();
      c.required = true;
      assert.isFalse(c.checked);
      assert.isFalse(c.validate(c.value));
      assert.isTrue(c.invalid);
    });

    it('valid if required and checked', async () => {
      const c = await basicFixture();
      c.required = true;
      c.checked = true;
      assert.isTrue(c.checked);
      assert.isTrue(c.validate(c.value));
      assert.isFalse(c.invalid);
    });

    it('valid if not required and not checked', async () => {
      const c = await basicFixture();
      assert.isFalse(c.checked);
      assert.isTrue(c.validate(c.value));
      assert.isFalse(c.invalid);
    });

    it('has a default value of "on", always', async () => {
      const c = await basicFixture();
      assert.isTrue(c.value === 'on');
      c.checked = true;
      assert.isTrue(c.value === 'on');
    });

    it('does not stomp over user defined value when checked', async () => {
      const c = await withValueFixture();
      assert.isTrue(c.value === 'batman');
      c.checked = true;
      assert.isTrue(c.value === 'batman');
    });

    it('value returns "on" when no explicit value is specified', async () => {
      const c = await basicFixture();
      assert.equal(c.value, 'on', 'returns "on"');
    });

    it('value returns the value when an explicit value is set', async () => {
      const c = await basicFixture();
      c.value = 'abc';
      assert.equal(c.value, 'abc', 'returns "abc"');
      c.value = '123';
      assert.equal(c.value, '123', 'returns "123"');
    });

    it('value returns "on" when value is set to undefined', async () => {
      const c = await basicFixture();
      c.value = 'abc';
      assert.equal(c.value, 'abc', 'returns "abc"');
      c.value = undefined;
      assert.equal(c.value, 'on', 'returns "on"');
    });

    it("Won't call _requiredChanged() when already set", async () => {
      const c = await requiredFixture();
      const spy = sinon.spy(c, '_requiredChanged');
      c.required = true;
      assert.isFalse(spy.called);
    });

    it("Won't call _valueChanged() when already set", async () => {
      const c = await withValueFixture();
      const spy = sinon.spy(c, '_valueChanged');
      c.value = 'batman';
      assert.isFalse(spy.called);
    });

    it("Won't call _checkedChanged() when already set", async () => {
      const c = await checkedFixture();
      const spy = sinon.spy(c, '_checkedChanged');
      c.checked = true;
      assert.isFalse(spy.called);
    });
  });

  describe('Change events', () => {
    let element = /** @type SimpleCheckbox */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches the checkedchange event', () => {
      const spy = sinon.spy();
      element.addEventListener('checkedchange', spy);
      element.checked = true;
      assert.isTrue(spy.called);
    });

    it('Ignores the change event when the value was already set', () => {
      element.checked = true;
      const spy = sinon.spy();
      element.addEventListener('checkedchange', spy);
      element.checked = true;
      assert.isFalse(spy.called);
    });

    it('Dispatches iron-change event', () => {
      const spy = sinon.spy();
      element.addEventListener('iron-change', spy);
      element.checked = true;
      assert.isTrue(spy.called);
    });

    it('Ignores iron-change event when the value was already set', () => {
      element.checked = true;
      const spy = sinon.spy();
      element.addEventListener('iron-change', spy);
      element.checked = true;
      assert.isFalse(spy.called);
    });

    it('Dispatches checked-changed event', () => {
      const spy = sinon.spy();
      element.addEventListener('checked-changed', spy);
      element.checked = true;
      assert.isTrue(spy.called);
      assert.isTrue(spy.args[0][0].detail.value);
    });

    it('Ignores checked-changed event when the value was already set', () => {
      element.checked = true;
      const spy = sinon.spy();
      element.addEventListener('checked-changed', spy);
      element.checked = true;
      assert.isFalse(spy.called);
    });
  });

  describe('checkedchange', () => {
    let element = /** @type SimpleCheckbox */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.equal(element.oncheckedchange, null);``
      const f = () => {};
      element.oncheckedchange = f;
      assert.isTrue(element.oncheckedchange === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oncheckedchange = f;
      element.checked = true;
      element.oncheckedchange = null;
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
      element.oncheckedchange = f1;
      element.oncheckedchange = f2;
      element.checked = true;
      element.oncheckedchange = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('setting `required` sets `aria-required=true`', async () => {
      const c = await basicFixture();
      c.required = true;
      assert.equal(c.getAttribute('aria-required'), 'true');
      c.required = false;
      assert.isFalse(c.hasAttribute('aria-required'));
    });

    it('setting `invalid` sets `aria-invalid=true`', async () => {
      const c = await basicFixture();
      c.invalid = true;
      assert.equal(c.getAttribute('aria-invalid'), 'true');
      c.invalid = false;
      assert.isFalse(c.hasAttribute('aria-invalid'));
    });

    it('is accessible in normal state', async () => {
      const element = await fixture(`<simple-checkbox></simple-checkbox>`);
      await assert.isAccessible(element);
    });

    it('is accessible in checked state', async () => {
      const element = await fixture(
        `<simple-checkbox checked></simple-checkbox>`
      );
      await assert.isAccessible(element);
    });

    it('is accessible in disabled state', async () => {
      const element = await fixture(
        `<simple-checkbox disabled></simple-checkbox>`
      );
      await assert.isAccessible(element);
    });

    it('is accessible in invalid state', async () => {
      const element = await fixture(
        `<simple-checkbox invalid></simple-checkbox>`
      );
      await assert.isAccessible(element);
    });

    it('is accessible in required state', async () => {
      const element = await fixture(
        `<simple-checkbox required></simple-checkbox>`
      );
      await assert.isAccessible(element);
    });
  });
});

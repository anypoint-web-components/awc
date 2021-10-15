import { nextFrame, fixture, assert } from '@open-wc/testing';
import './test-validatable.js';
import '../demo/cats-only.js';
import '../demo/minimum-length.js';

/* eslint-disable prefer-destructuring */

[
  ['cats-only', 'Error cat'],
  ['minimum-length', 'Error length'],
].forEach(item => {
  const validator = document.createElement(item[0]);
  // @ts-ignore
  validator.message = item[1];
  document.body.appendChild(validator);
});
describe('ValidatableMixin', () => {
  async function basicFixture() {
    return fixture(`<test-validatable></test-validatable>`);
  }

  async function invalidFixture() {
    return fixture(`<test-validatable invalid></test-validatable>`);
  }

  describe('Basics', () => {
    it("validate() is true if a validator isn't set", async () => {
      const element = await basicFixture();
      const valid = element.validate();
      assert.isTrue(valid);
    });
  });

  describe('Validation', () => {
    let input;

    beforeEach(async () => {
      input = await basicFixture();
    });

    it('Initially validates', () => {
      assert.isTrue(input.validate(''));
      assert.isTrue(input.validate('cats'));
    });

    it('validates single validator', () => {
      input.validator = 'cats-only';
      assert.isFalse(input.validate('test'), 'validate is false');
      assert.isTrue(input.validate('cats'), 'validate is true');
    });

    it('validates multiple validators', () => {
      input.validator = 'cats-only minimum-length';
      // validates agains `cats-only` but not `minimum-length`
      assert.isFalse(input.validate('cat'), 'validate is false');
      assert.isTrue(input.validate('cats'), 'validate is true');
    });

    it('Sets validationStates when invalid', () => {
      input.validator = 'cats-only minimum-length';
      // validates agains `cats-only` but not `minimum-length`
      input.validate('cat');
      const states = input.validationStates;

      assert.isFalse(states[1].valid, 'state.valid is false');
      assert.isString(states[1].message, 'state.message is string');
    });

    it('Sets validationStates when valid', () => {
      input.validator = 'cats-only minimum-length';
      // validates agains `cats-only` but not `minimum-length`
      input.validate('cat');
      const states = input.validationStates;

      assert.isTrue(states[0].valid, 'state.valid is true');
    });
  });

  describe('oninvalid', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.oninvalid);
      const f = () => {};
      element.oninvalid = f;
      assert.isTrue(element.oninvalid === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.oninvalid = f;
      element.invalid = true;
      element.oninvalid = null;
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
      element.oninvalid = f1;
      element.oninvalid = f2;
      element.invalid = true;
      element.oninvalid = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('setting `invalid` sets aria-invalid', async () => {
      const element = await basicFixture();
      element.invalid = true;
      await nextFrame();
      assert.equal(
        element.getAttribute('aria-invalid'),
        'true',
        'aria-invalid is set'
      );
      element.invalid = false;
      await nextFrame();
      assert.isFalse(
        element.hasAttribute('aria-invalid'),
        'aria-invalid is unset'
      );
    });

    it('is accessible in normal state', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible in invalid state', async () => {
      const element = await invalidFixture();
      await assert.isAccessible(element);
    });
  });
});

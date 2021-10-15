import { fixture, assert } from '@open-wc/testing';
import { ValidatorMixin, ValidatorStore } from '../index.js';
import './simple-validator.js';

/* eslint-disable no-new */

// @ts-ignore
class TestClass extends ValidatorMixin(Object) {
  static get is() {
    return 'test-class';
  }
}

describe('ValidatorMixin', () => {
  /**
   * @return {Promise<ValidatorMixin>}
   */
  async function basicFixture() {
    return fixture('<simple-validator></simple-validator>');
  }

  async function messageFixture() {
    return fixture('<simple-validator message="test"></simple-validator>');
  }

  it('registers in ValidatorStore', async () => {
    await basicFixture();

    assert.ok(
      ValidatorStore.get('simple-validator'),
      'simple-validator found in ValidatorStore'
    );
  });

  it('deregisters in ValidatorStore', async () => {
    const element = await basicFixture();
    element.unregister();
    assert.notOk(
      ValidatorStore.get('simple-validator'),
      'simple-validator not found in ValidatorStore'
    );
  });

  it('ignores deregistering other instances', async () => {
    await basicFixture();
    ValidatorStore.unregister({});
    assert.ok(
      ValidatorStore.get('simple-validator'),
      'simple-validator not found in ValidatorStore'
    );
  });

  it('validate() returnes true by default', async () => {
    const element = await basicFixture();
    assert.isTrue(element.validate());
  });

  it('Has a message poroperty', async () => {
    const element = await messageFixture();
    assert.equal(element.message, 'test');
  });

  it('does not set the same message', async () => {
    const element = await messageFixture();
    element.message = 'test';
    // it's for coverage
  });

  it('uses `is` getter to register the validator', () => {
    new TestClass();
    assert.ok(
      ValidatorStore.get('test-class'),
      'test-class found in ValidatorStore'
    );
  });
});

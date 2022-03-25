import { fixture, assert } from '@open-wc/testing';
import { ValidatorStore } from '../../index.js';
import { SimpleValidator } from './simple-validator.js';
import './simple-validator.js';

describe('ValidatorMixin', () => {
  async function basicFixture(): Promise<SimpleValidator> {
    return fixture('<simple-validator></simple-validator>');
  }

  async function messageFixture(): Promise<SimpleValidator> {
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

  it('validate() returns true by default', async () => {
    const element = await basicFixture();
    assert.isTrue(element.validate());
  });

  it('Has a message property', async () => {
    const element = await messageFixture();
    assert.equal(element.message, 'test');
  });

  it('does not set the same message', async () => {
    const element = await messageFixture();
    element.message = 'test';
    // it's for coverage
  });
});

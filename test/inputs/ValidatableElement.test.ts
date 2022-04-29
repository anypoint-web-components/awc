import { fixture, assert, html, nextFrame } from '@open-wc/testing';
import { customElement, property } from 'lit/decorators.js';
import sinon from 'sinon';
import { ValidatableElement } from '../../src/index.js';

@customElement('anypoint-validatable-element')
class TestElement extends ValidatableElement {
  @property({ type: Number }) value?: number;

  protected _getValidity(): boolean {
    return !Number.isNaN(this.value) && this.value > 1;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "anypoint-validatable-element": TestElement
  }
}

describe('ValidatableElement', () => {
  async function validFixture(): Promise<TestElement> {
    return fixture(html`<anypoint-validatable-element value="2"></anypoint-validatable-element>`);
  }

  async function invalidFixture(): Promise<TestElement> {
    return fixture(html`<anypoint-validatable-element value="0"></anypoint-validatable-element>`);
  }

  it('returns the value of get validity when valid', async () => {
    const element = await validFixture();
    const result = element.checkValidity();
    assert.isTrue(result);
  });

  it('returns the value of get validity when invalid', async () => {
    const element = await invalidFixture();
    const result = element.checkValidity();
    assert.isFalse(result);
  });

  it('dispatches the invalid event', async () => {
    const element = await invalidFixture();
    const spy = sinon.spy();
    element.addEventListener('invalid', spy);
    element.checkValidity();
    assert.isTrue(spy.calledOnce);
  });

  it('sets the aria-invalid attribute', async () => {
    const element = await invalidFixture();
    element.checkValidity();
    await nextFrame();
    assert.isTrue(element.hasAttribute('aria-invalid'));
  });

  it('removes the aria-invalid attribute when valid again', async () => {
    const element = await invalidFixture();
    element.checkValidity();
    await nextFrame();
    element.value = 5;
    element.checkValidity();
    await nextFrame();
    assert.isFalse(element.hasAttribute('aria-invalid'));
  });
});

import {
  html,
  fixture,
  assert
} from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import '../../src/define/anypoint-tab.js';
import { AnypointTabElement } from '../../src/index.js';

describe('AnypointTabElement', () => {
  describe('Initialization', () => {
    it('can be initialized with document.createElement', () => {
      const element = document.createElement('anypoint-tab');
      assert.ok(element);
    });
  });

  describe('a11y', () => {
    async function basicFixture(): Promise<HTMLDivElement> {
      return fixture(html`<div role="tablist"><anypoint-tab>Content</anypoint-tab></div>`);
    }

    it('is accessible', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('has role attribute', async () => {
      const element = await basicFixture();
      assert.equal(element.querySelector('anypoint-tab')!.getAttribute('role'), 'tab');
    });
  });

  describe('Rendering links', () => {
    async function basicFixture(): Promise<AnypointTabElement> {
      return fixture(html`
        <anypoint-tab link>
          <arc-icon icon="menu"></arc-icon>
          <a href="#">Link</a>
        </anypoint-tab>
      `);
    }

    let element: AnypointTabElement;
    let link: HTMLAnchorElement;
    beforeEach(async () => {
      element = await basicFixture();
      link = element.querySelector('a')!;
    });

    it.skip('clicks on a link', () => {
      const spy = sinon.spy(link, 'click');
      MockInteractions.tap(element);
      assert.isTrue(spy.called);
    });

    it('does nothing when no link in the element', () => {
      element.removeChild(link);
      const spy = sinon.spy(link, 'click');
      MockInteractions.tap(element);
      assert.isFalse(spy.called);
    });

    it('does nothing when no link property', () => {
      element.link = false;
      const spy = sinon.spy(link, 'click');
      MockInteractions.tap(element);
      assert.isFalse(spy.called);
    });
  });
});

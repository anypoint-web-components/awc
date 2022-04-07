import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { clearAll } from '../../demo/lib/Icons.js';
import { clear } from '../../src/resources/Icons.js';
import '../../src/define/anypoint-chip.js';
import AnypointChip, { hasIconNodeValue } from '../../src/elements/AnypointChipElement.js';

describe('AnypointChipElement', () => {
  async function basicFixture(): Promise<AnypointChip> {
    return fixture('<anypoint-chip>test label</anypoint-chip>');
  }
  async function removableFixture(): Promise<AnypointChip> {
    return fixture('<anypoint-chip removable>test label</anypoint-chip>');
  }
  async function withLabelFixture(): Promise<AnypointChip> {
    return fixture('<anypoint-chip>My label</anypoint-chip>');
  }
  async function withIconFixture(): Promise<AnypointChip> {
    return fixture(`
    <anypoint-chip>
      <span class="avatar" slot="icon">C</span>
      <span>My label</span>
    </anypoint-chip>`);
  }
  async function roleFixture(): Promise<AnypointChip> {
    return fixture(`<anypoint-chip role="radio"></anypoint-chip>`);
  }
  async function togglesFixture(): Promise<AnypointChip> {
    return fixture(`<anypoint-chip removable toggles>test label</anypoint-chip>`);
  }
  async function disabledFixture(): Promise<AnypointChip> {
    return fixture(`<anypoint-chip disabled>test label</anypoint-chip>`);
  }
  async function tabIndexFixture(): Promise<AnypointChip> {
    return fixture(`<anypoint-chip tabindex="1">test label</anypoint-chip>`);
  }

  describe('Basics', () => {
    let element: AnypointChip;

    it('[hasIconNodeValue] is computed', async () => {
      element = await basicFixture();
      assert.isFalse(element[hasIconNodeValue]);
    });

    it('Close icon is not rendered', async () => {
      element = await basicFixture();
      const node = element.shadowRoot!.querySelector('.close');
      assert.notOk(node);
    });

    it('Adds icon when removable', async () => {
      element = await removableFixture();
      const node = element.shadowRoot!.querySelector('.close');
      assert.ok(node);
    });

    it('Container has no additional class names for label only', async () => {
      element = await withLabelFixture();
      const node = element.shadowRoot!.querySelector('.container')!;
      assert.isFalse(node.classList.contains('with-remove'));
      assert.isFalse(node.classList.contains('with-icon'));
    });

    it('Container has with-remove class for removable', async () => {
      element = await removableFixture();
      const node = element.shadowRoot!.querySelector('.container')!;
      assert.isTrue(node.classList.contains('with-remove'));
    });

    it('Container has with-icon class for icon', async () => {
      element = await withIconFixture();
      const node = element.shadowRoot!.querySelector('.container')!;
      assert.isTrue(node.classList.contains('with-icon'));
    });

    it('[hasIconNodeValue] is computed when icon is set', async () => {
      element = await withIconFixture();
      assert.isTrue(element[hasIconNodeValue]);
    });

    it('[hasIconNodeValue] is computed when icon is removed', async () => {
      element = await withIconFixture();
      const node = element.querySelector('.avatar')!;
      node.parentNode!.removeChild(node);
      await nextFrame();
      assert.isFalse(element[hasIconNodeValue]);
    });

    it('Sets disabled property to undefined when not previously set', async () => {
      element = await basicFixture();
      assert.isUndefined(element.disabled);
    });

    it('Sets disabled property to true', async () => {
      element = await disabledFixture();
      assert.isTrue(element.disabled);
    });

    it('Sets disabled property to false', async () => {
      element = await disabledFixture();
      element.removeAttribute('disabled');
      assert.isFalse(element.disabled);
    });
  });

  describe('remove()', () => {
    let element: AnypointChip;
    it('dispatches the `chipremoved` custom event', async () => {
      element = await removableFixture();
      const spy = sinon.spy();
      element.addEventListener('chipremoved', spy);
      const node = element.shadowRoot!.querySelector('.close')!;
      // @ts-ignore
      node.click();
      assert.isTrue(spy.called);
    });

    it('Chip is not active when removed', async () => {
      element = await togglesFixture();
      const node = element.shadowRoot!.querySelector('.close')!;
      // @ts-ignore
      node.click();
      assert.isFalse(element.active);
    });
  });

  describe('_detectHasIcon()', () => {
    let element: AnypointChip;
    it('Computes value when no icon', async () => {
      element = await basicFixture();
      element._detectHasIcon();
      assert.isFalse(element[hasIconNodeValue]);
    });

    it('Computes value when icon', async () => {
      element = await withIconFixture();
      element._detectHasIcon();
      assert.isTrue(element[hasIconNodeValue]);
    });
  });

  describe('_keyDownHandler()', () => {
    let element: AnypointChip;

    [
      ['Backspace', 'remove'],
      ['Delete', 'remove'],
      ['Space', '_clickHandler'],
      ['Enter', '_clickHandler'],
      ['Space', '_asyncClick'],
      ['Enter', '_asyncClick']
    ].forEach((item) => {
      it(`calls ${item[1]}() when ${item[0]} key`, async () => {
        element = await removableFixture();
        // @ts-ignore
        const spy = sinon.spy(element, item[1]);
        // @ts-ignore
        element._keyDownHandler({
          code: item[0],
        });
        assert.isTrue(spy.called);
      });
    });

    it('Ignores other keys', async () => {
      element = await removableFixture();
      const spy1 = sinon.spy(element, 'remove');
      const spy2 = sinon.spy(element, '_clickHandler');
      // @ts-ignore
      element._keyDownHandler({
        key: 'E'
      });
      assert.isFalse(spy1.called);
      assert.isFalse(spy2.called);
    });
  });

  describe('_focusBlurHandler()', () => {
    let element: AnypointChip;
    before(async () => {
      element = await basicFixture();
    });

    it('Sets "focused" when event type is focus', () => {
      element._focusBlurHandler(new FocusEvent('focus'));
      assert.isTrue(element.focused);
    });

    it('Removes "focused" when event type is not focus', () => {
      element._focusBlurHandler(new FocusEvent('blur'));
      assert.isFalse(element.focused);
    });

    it('Sets "focused" property for focus event', () => {
      MockInteractions.focus(element);
      assert.isTrue(element.focused);
    });

    it('Removes "focused" property for blur event', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      element.dispatchEvent(new CustomEvent('blur', {}));
      assert.isFalse(element.focused);
    });

    it('Sets "focused" attribute for focus event', () => {
      MockInteractions.focus(element);
      assert.isTrue(element.hasAttribute('focused'));
    });

    it('Removes "focused" attribute for blur event', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      element.dispatchEvent(new CustomEvent('blur', {}));
      assert.isFalse(element.hasAttribute('focused'));
    });
  });

  describe('_iconSlot getter', () => {
    it('Returns reference to icon slot', async () => {
      const element = await basicFixture();
      const ref = element._iconSlot;
      assert.ok(ref);
      assert.equal(ref.nodeName, 'SLOT');
    });
  });

  describe('_disabledChanged()', () => {
    it('Sets aria-disabled when disabled', async () => {
      const element = await basicFixture();
      element.disabled = true;
      assert.isTrue(element.hasAttribute('aria-disabled'));
      assert.equal(element.getAttribute('aria-disabled'), 'true');
    });

    it('Sets aria-disabled when not disabled', async () => {
      const element = await disabledFixture();
      element.disabled = false;
      assert.isTrue(element.hasAttribute('aria-disabled'));
      assert.equal(element.getAttribute('aria-disabled'), 'false');
    });

    it('Sets pointer events style when disabled', async () => {
      const element = await basicFixture();
      element.disabled = true;
      const value = element.style.pointerEvents.trim().toLowerCase();
      assert.equal(value, 'none');
    });

    it('Re-sets pointer events style when not disabled', async () => {
      const element = await disabledFixture();
      element.disabled = false;
      const value = element.style.pointerEvents.trim();
      assert.equal(value, '');
    });

    it('Sets tabindex to -1 when disabled', async () => {
      const element = await tabIndexFixture();
      element.disabled = true;
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('Sets _oldTabIndex property when disabled', async () => {
      const element = await tabIndexFixture();
      element.disabled = true;
      // @ts-ignore
      assert.equal(element._oldTabIndex, '1');
    });

    it('Removes focused state when disabled', async () => {
      const element = await basicFixture();
      element._focused = true;
      element.disabled = true;
      assert.isFalse(element._focused);
    });

    it('Calls blur() when disabled', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, 'blur');
      element.disabled = true;
      assert.isTrue(spy.called);
    });

    it('restores tabindex when not disabled', async () => {
      const element = await tabIndexFixture();
      element.disabled = true;
      await nextFrame();
      element.disabled = false;
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('Removes tabindex when not disabled and was not set previously', async () => {
      const element = await basicFixture();
      // tabindex is added when missing when element is created
      element.removeAttribute('tabindex');
      element.disabled = true;
      await nextFrame();
      element.disabled = false;
      assert.isFalse(element.hasAttribute('tabindex'));
    });

    it('Does nothing otherwise', async () => {
      const element = await basicFixture();
      element._disabledChanged(false);
      // coverage
    });
  });

  describe('_clickHandler()', () => {
    let element: AnypointChip;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _userActivate() with when toggles and not active', () => {
      const spy = sinon.spy(element, '_userActivate');
      element.toggles = true;
      element._clickHandler();
      assert.isTrue(spy.args[0][0]);
    });

    it('Calls _userActivate() with false when toggles and active', () => {
      const spy = sinon.spy(element, '_userActivate');
      element._active = true;
      element.toggles = true;
      element._clickHandler();
      assert.isFalse(spy.args[0][0]);
    });

    it('Sets active to false when not toggles and active', () => {
      element._active = true;
      element._clickHandler();
      assert.isFalse(element.active);
    });

    it('Does nothing otherwise', () => {
      element._clickHandler();
      // It's for coverage
      assert.isFalse(element.active);
    });
  });

  describe('_userActivate()', () => {
    let element: AnypointChip;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Does nothing if "active" equals argument', () => {
      element._active = true;
      element._userActivate(true);
      assert.isTrue(element.active);
      // It's for coverage
    });

    it('Updates "active" value', () => {
      element._active = true;
      element._userActivate(false);
      assert.isFalse(element.active);
      // It's for coverage
    });
  });

  describe('_asyncClick()', () => {
    it('Calls click() with a delay', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, 'click');
      element._asyncClick();
      await aTimeout(0);
      assert.isTrue(spy.called);
    });
  });

  describe('__activeChanged()', () => {
    let element: AnypointChip;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Adds active attribute when true and has none', () => {
      element.__activeChanged(true);
      assert.isTrue(element.hasAttribute('active'));
    });

    it('Does nothing when true and has attribute', () => {
      element.setAttribute('active', '');
      element.__activeChanged(true);
      assert.isTrue(element.hasAttribute('active'));
      // Coverage
    });

    it('Removes active attribute when false and has one', () => {
      element.setAttribute('active', '');
      element.__activeChanged(false);
      assert.isFalse(element.hasAttribute('active'));
    });

    it('Does nothing when false and has no attribute', () => {
      element.__activeChanged(false);
      assert.isFalse(element.hasAttribute('active'));
      // Coverage
    });

    it('Removes aria-pressed attribute when not toggles', () => {
      element.setAttribute('aria-pressed', 'true');
      element.__activeChanged(false);
      assert.isFalse(element.hasAttribute('aria-pressed'));
    });

    it('Does nothing when not toggles and no aria-pressed', () => {
      element.__activeChanged(false);
      assert.isFalse(element.hasAttribute('aria-pressed'));
      // For coverage
    });

    it('Sets aria-pressed to true', () => {
      element.toggles = true;
      element.__activeChanged(true);
      assert.equal(element.getAttribute('aria-pressed'), 'true');
    });

    it('Sets aria-pressed to false', () => {
      element.toggles = true;
      element.__activeChanged(false);
      assert.equal(element.getAttribute('aria-pressed'), 'false');
    });
  });

  describe('close icon', () => {
    let element: AnypointChip;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has the default close icon', () => {
      assert.equal(element.removeIcon, clear);
    });

    it('sets a custom icon', () => {
      element.removeIcon = clearAll;
      assert.equal(element.removeIcon, clearAll);
    });
  });

  describe('a11y', () => {
    it('Sets default tabindex', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('Respects existing tabindex', async () => {
      const element = await tabIndexFixture();
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('Sets default role', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'button');
    });

    it('Respects existing role', async () => {
      const element = await roleFixture();
      assert.equal(element.getAttribute('role'), 'radio');
    });

    it('is accessible with label only', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible with remove icon', async () => {
      const element = await removableFixture();
      await assert.isAccessible(element);
    });

    it('is accessible with leading icon', async () => {
      const element = await withIconFixture();
      await assert.isAccessible(element);
    });
  });
});

import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { clearAll } from '../../demo/lib/Icons.js';
import { clear } from '../../src/resources/Icons.js';
import '../../src/define/anypoint-chip.js';
import AnypointChip, { hasIconNodeValue } from '../../src/elements/chips/AnypointChipElement.js';

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

  describe('notifyRemove()', () => {
    let element: AnypointChip;

    it('dispatches the `chipremoved` custom event', async () => {
      element = await removableFixture();
      const spy = sinon.spy();
      element.addEventListener('chipremoved', spy);
      const node = element.shadowRoot!.querySelector('.close') as HTMLElement;
      node.click();
      assert.isTrue(spy.called);
    });

    it('Chip is not active when removed', async () => {
      element = await togglesFixture();
      const node = element.shadowRoot!.querySelector('.close') as HTMLElement;
      node.click();
      assert.isFalse(element.active);
    });
  });

  describe('_detectHasIcon()', () => {
    let element: AnypointChip;
    it('Computes value when no icon', async () => {
      element = await basicFixture();
      assert.isFalse(element[hasIconNodeValue]);
    });

    it('Computes value when icon', async () => {
      element = await withIconFixture();
      assert.isTrue(element[hasIconNodeValue]);
    });
  });

  describe('Keyboard manipulation', () => {
    function dispatch(element: EventTarget, code: string): void {
      const e = new KeyboardEvent('keydown', {
        cancelable: true,
        code,
      });
      element.dispatchEvent(e);
    }

    it('notifies remove when Backspace', async () => {
      const element = await removableFixture();
      const spy = sinon.spy();
      element.addEventListener('chipremoved', spy);
      dispatch(element, 'Backspace');
      assert.isTrue(spy.called);
    });

    it('notifies remove when Delete', async () => {
      const element = await removableFixture();
      const spy = sinon.spy();
      element.addEventListener('chipremoved', spy);
      dispatch(element, 'Delete');
      assert.isTrue(spy.called);
    });

    it('clicks when Space', async () => {
      const element = await removableFixture();
      const spy = sinon.spy(element, 'click');
      dispatch(element, 'Space');
      await aTimeout(1);
      assert.isTrue(spy.called);
    });

    it('clicks when Enter', async () => {
      const element = await removableFixture();
      const spy = sinon.spy(element, 'click');
      dispatch(element, 'Space');
      await aTimeout(1);
      assert.isTrue(spy.called);
    });
  });

  describe('Focus and blur', () => {
    let element: AnypointChip;
    before(async () => {
      element = await basicFixture();
    });

    it('sets the "focused" on element focus', async () => {
      element.focus();
      await nextFrame();
      assert.isTrue(element.focused);
    });

    it('removes the "focused" when element blur', async () => {
      element.focus();
      await nextFrame();
      element.blur();
      await nextFrame();
      assert.isFalse(element.focused);
    });
  });

  describe('Disabled state', () => {
    it('sets aria-disabled when disabled', async () => {
      const element = await basicFixture();
      element.disabled = true;
      await nextFrame();
      assert.isTrue(element.hasAttribute('aria-disabled'));
      assert.equal(element.getAttribute('aria-disabled'), 'true');
    });

    it('sets aria-disabled when not disabled', async () => {
      const element = await disabledFixture();
      element.disabled = false;
      await nextFrame();
      assert.isTrue(element.hasAttribute('aria-disabled'));
      assert.equal(element.getAttribute('aria-disabled'), 'false');
    });

    it('Sets pointer events style when disabled', async () => {
      const element = await basicFixture();
      element.disabled = true;
      await nextFrame();
      const value = element.style.pointerEvents.trim().toLowerCase();
      assert.equal(value, 'none');
    });

    it('Re-sets pointer events style when not disabled', async () => {
      const element = await disabledFixture();
      element.disabled = false;
      await nextFrame();
      const value = element.style.pointerEvents.trim();
      assert.equal(value, '');
    });

    it('Sets tabindex to -1 when disabled', async () => {
      const element = await tabIndexFixture();
      element.disabled = true;
      await nextFrame();
      assert.equal(element.getAttribute('tabindex'), '-1');
    });

    it('restores previously set tabindex when not disabled', async () => {
      const element = await tabIndexFixture();
      element.disabled = true;
      await nextFrame();
      element.disabled = false;
      await nextFrame();
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('removes focused state when disabled', async () => {
      const element = await basicFixture();
      element.focused = true;
      await nextFrame();
      element.disabled = true;
      await nextFrame();
      assert.isFalse(element.focused);
    });

    it('calls blur() when disabled', async () => {
      const element = await basicFixture();
      const spy = sinon.spy(element, 'blur');
      element.disabled = true;
      await nextFrame();
      assert.isTrue(spy.called);
    });

    it('removes tabindex when not disabled and was not set previously', async () => {
      const element = await basicFixture();
      // tabindex is added when missing when element is created
      element.removeAttribute('tabindex');
      element.disabled = true;
      await nextFrame();
      element.disabled = false;
      await nextFrame();
      assert.isFalse(element.hasAttribute('tabindex'));
    });
  });

  describe('_clickHandler()', () => {
    it('sets the active state when toggles', async () => {
      const element = await togglesFixture();
      element.click();
      await nextFrame();
      assert.isTrue(element.active);
    });

    it('removes the active state when toggles', async () => {
      const element = await togglesFixture();
      element.click();
      await nextFrame();
      element.click();
      await nextFrame();
      assert.isFalse(element.active);
    });

    it('sets not active when not toggles', async () => {
      const element = await basicFixture();
      element.active = true;
      await nextFrame();
      element.click();
      await nextFrame();
      assert.isFalse(element.active);
    });
  });

  describe('Active state', () => {
    it('sets "aria-pressed" when toggles', async () => {
      const element = await togglesFixture();
      element.active = true;
      await nextFrame();
      assert.equal(element.getAttribute('aria-pressed'), 'true', 'set to true');
      element.active = false;
      await nextFrame();
      assert.equal(element.getAttribute('aria-pressed'), 'false', 'set to false');
    });
  });

  describe('close icon', () => {
    let element: AnypointChip;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('has the default close icon', () => {
      assert.equal(element._removeIcon, clear);
    });

    it('sets a custom icon', () => {
      element.removeIcon = clearAll;
      assert.equal(element._removeIcon, clearAll);
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

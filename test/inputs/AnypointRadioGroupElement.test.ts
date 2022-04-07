import { fixture, assert, nextFrame, html } from '@open-wc/testing';
import { AnypointRadioButtonElement, AnypointRadioGroupElement } from '../../src/index.js'
import '../../src/define/anypoint-radio-group.js';
import '../../src/define/anypoint-radio-button.js';

describe('<anypoint-radio-group>', () => {
  async function basicFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group>
       <anypoint-radio-button name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button name="c">Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }
  async function selectedFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group>
      <anypoint-radio-button name="a" checked>Apple</anypoint-radio-button>
      <anypoint-radio-button name="b">Banana</anypoint-radio-button>
      <anypoint-radio-button name="c">Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }
  async function ignoredFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group>
       <anypoint-radio-button checked name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button name="c">Orange</anypoint-radio-button>
       <div name="d">Strawberry</div>
    </anypoint-radio-group>`));
  }
  async function mixedFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group>
       <anypoint-radio-button checked name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button name="c">Orange</anypoint-radio-button>
       <input type="radio" name="d"/>
    </anypoint-radio-group>`));
  }
  async function selected2Fixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group selected="1">
       <anypoint-radio-button name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button name="c">Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }
  async function multiCheckedFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group>
       <anypoint-radio-button checked name="a">Apple</anypoint-radio-button>
       <anypoint-radio-button name="b">Banana</anypoint-radio-button>
       <anypoint-radio-button checked name="c">Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }
  async function attrForSelectedFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group selected="banana" attrforselected="data-label">
      <anypoint-radio-button name="a" data-label="apple">Apple</anypoint-radio-button>
      <anypoint-radio-button name="b" data-label="banana">Banana</anypoint-radio-button>
      <anypoint-radio-button name="c" data-label="orange">Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }
  async function disabledFixture(): Promise<AnypointRadioGroupElement> {
    return (fixture(html`<anypoint-radio-group disabled>
      <anypoint-radio-button>Apple</anypoint-radio-button>
      <anypoint-radio-button>Banana</anypoint-radio-button>
      <anypoint-radio-button>Orange</anypoint-radio-button>
    </anypoint-radio-group>`));
  }

  describe('Selection states', () => {
    it('sets selected property when selection changes', async () => {
      const element = await basicFixture();
      const node = element.querySelector('anypoint-radio-button')!;
      node.click();
      assert.equal(element.selected, 0);
    });

    it('sets selected property from checked attribute', async () => {
      const element = await selectedFixture();
      assert.equal(element.selected, 0);
    });

    it('sets selected element checked', async () => {
      const element = await selected2Fixture();
      assert.equal(element.selected, 1);
      const node = element.querySelector('anypoint-radio-button[name="b"]') as AnypointRadioButtonElement;
      assert.isTrue(node.checked);
    });

    it('only selects last checked node', async () => {
      const element = await multiCheckedFixture();
      assert.equal(element.selected, 2);
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      assert.isTrue(node.checked);

      const oldNode = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      assert.isFalse(oldNode.checked);
    });

    it('selects from attribute', async () => {
      const element = await attrForSelectedFixture();
      const node = element.querySelector('anypoint-radio-button[name="b"]') as AnypointRadioButtonElement;
      assert.isTrue(node.checked);
    });

    it('deselects old node', async () => {
      const element = await selectedFixture();
      const oldSelected = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      assert.isTrue(oldSelected.checked, 'old selected is initially selected');
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      node.click();
      assert.isFalse(oldSelected.checked, 'removes selection');
    });

    it('selects new node', async () => {
      const element = await selectedFixture();
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      node.click();
      assert.isTrue(node.checked);
    });

    it('selected property changes after selection change', async () => {
      const element = await selectedFixture();
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      node.click();
      assert.equal(element.selected, 2);
    });

    it('accepts dynamic node', async () => {
      const element = await selectedFixture();
      const node = document.createElement('anypoint-radio-button');
      node.name = 'd';
      node.innerText = 'Dino';
      element.appendChild(node);
      await nextFrame();
      node.click();
      assert.equal(element.selected, 3);
    });

    it('ignores nodes that are not role radio', async () => {
      const element = await ignoredFixture();
      const node = element.querySelector('div[name="d"]') as HTMLDivElement;
      node.click();
      assert.equal(element.selected, 0);
    });

    it('ignores removed nodes', async () => {
      const element = await basicFixture();
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      element.removeChild(node);
      await nextFrame();
      node.click();
      assert.isUndefined(element.selected);
    });

    it('ignores nodes with changed role', async () => {
      const element = await basicFixture();
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      node.setAttribute('role', 'input');
      await nextFrame();
      node.click();
      assert.isUndefined(element.selected);
      assert.equal(element.selectedItem, null);
    });

    it('removes selection when removing selected node', async () => {
      const element = await selectedFixture();
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      element.removeChild(node);
      await nextFrame();
      assert.isUndefined(element.selected);
      assert.equal(element.selectedItem, null);
    });

    it('accepts input radio', async () => {
      const element = await mixedFixture();
      const node = element.querySelector('input[name="d"]') as HTMLInputElement;
      node.click();
      assert.equal(element.selected, 3);
      assert.equal(element.selectedItem, node);
    });

    it('focuses on first item when no selection', async () => {
      const element = await basicFixture();
      element.focus();
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('focuses on selected item when selection', async () => {
      const element = await selected2Fixture();
      element.focus();
      const node = element.querySelector('anypoint-radio-button[name="b"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('moves focus to next item when arrow right', async () => {
      const element = await selected2Fixture();
      element.focus();
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowRight',
      });
      element.dispatchEvent(e);
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('moves focus to next item when arrow down', async () => {
      const element = await selected2Fixture();
      element.focus();
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowDown',
      });
      element.dispatchEvent(e);
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('moves focus to previous item when arrow left', async () => {
      const element = await selected2Fixture();
      element.focus();
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowLeft',
      });
      element.dispatchEvent(e);
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('moves focus to previous item when arrow up', async () => {
      const element = await selected2Fixture();
      element.focus();
      const e = new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowUp',
      });
      element.dispatchEvent(e);
      const node = element.querySelector('anypoint-radio-button[name="a"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
    });

    it('selects focused element and deselect others', async () => {
      const element = await selected2Fixture();
      element.focus();
      element.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'ArrowRight',
        key: 'ArrowRight',
      }));
      const node = element.querySelector('anypoint-radio-button[name="c"]') as AnypointRadioButtonElement;
      assert.equal(document.activeElement, node);
      node.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        cancelable: true,
        code: 'Space',
        key: 'Space',
      }));
      await nextFrame();
      assert.equal(element.selected, 2, 'updates the selection');
      const unselected = element.querySelector('anypoint-radio-button[name="b"]') as AnypointRadioButtonElement;
      assert.isFalse(unselected.checked, 'previously checked is not checked anymore');
    });
  });

  describe('disabled state', () => {
    it('disables children when disabled', async () => {
      const element = await basicFixture();
      element.disabled = true;
      const nodes = element.querySelectorAll('*') as NodeListOf<AnypointRadioButtonElement>;
      for (let i = 0; i < nodes.length; i++) {
        assert.isTrue(nodes[i].disabled);
      }
    });

    it('enables children when enabled', async () => {
      const element = await disabledFixture();
      element.disabled = false;
      const nodes = element.querySelectorAll('*') as NodeListOf<AnypointRadioButtonElement>;
      for (let i = 0; i < nodes.length; i++) {
        assert.isFalse(nodes[i].disabled);
      }
    });

    it('disables children when initializing', async () => {
      const element = await disabledFixture();
      const nodes = element.querySelectorAll('*') as NodeListOf<AnypointRadioButtonElement>;
      for (let i = 0; i < nodes.length; i++) {
        assert.isTrue(nodes[i].disabled);
      }
    });

    it('ignores selection when disabled', async () => {
      const element = await disabledFixture();
      const node = element.querySelector('anypoint-radio-button')!;
      assert.isTrue(node.disabled, 'radio is initially disabled');
      assert.isFalse(node.checked, 'radio is initially not checked');
      node.click();
      assert.isFalse(node.checked, 'radio is not checked');
    });
  });

  describe('a11y', () => {
    it('has role', async () => {
      const element = await basicFixture();
      assert.equal(element.getAttribute('role'), 'radiogroup');
    });

    it('is accessible when no selection', async () => {
      const element = await basicFixture();
      await assert.isAccessible(element);
    });

    it('is accessible when selected', async () => {
      const element = await selectedFixture();
      await assert.isAccessible(element);
    });
  });
});

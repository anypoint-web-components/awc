import { fixture, assert, aTimeout, nextFrame, html } from '@open-wc/testing';
import { html as LitHtml } from 'lit-html';
import sinon from 'sinon';
import '../../anypoint-autocomplete.js';
import { openedValue, autocompleteFocus, ignoreNextFocus } from '../../src/AnypointAutocompleteElement.js';

/* eslint-disable no-param-reassign */

/** @typedef {import('../../').AnypointAutocompleteElement} AnypointAutocomplete */
/** @typedef {import('../../src/AnypointAutocompleteElement').InternalSuggestion} InternalSuggestion */
/** @typedef {import('../../').Suggestion} Suggestion */
/** @typedef {import('../../').AnypointDropdownElement} AnypointDropdown */

describe('AnypointAutocompleteElement', () => {
  const suggestions = ['Apple', 'Apricot', 'Avocado', 'Banana'];
  const objectSuggestions = [
    {
      value: 'Apple',
      id: 1,
    },
    {
      value: 'Apricot',
      id: 2,
    },
    {
      value: 'Avocado',
      id: 3,
    },
    {
      value: 'Banana',
      id: 4,
    },
    {
      value: 'Olive',
      id: 5,
    },
  ];

  const htmlSuggestions = [
    {
      value: 'Apple',
      label: LitHtml`<b>Apple</b>`,
      id: 1,
    },
    {
      value: 'Apricot',
      label: LitHtml`<b>Apricot</b>`,
      id: 2,
    },
    {
      value: 'Avocado',
      label: LitHtml`<b>Avocado</b>`,
      id: 3,
    },
    {
      value: 'Banana',
      label: LitHtml`<b>Banana</b>`,
      id: 4,
    },
    {
      value: 'Olive',
      label: LitHtml`<b>Olive</b>`,
      id: 5,
    },
  ];

  function notifyInput(target) {
    target.dispatchEvent(new Event('input', { composed: true, bubbles: true }));
  }

  /**
   * @return {Promise<AnypointAutocomplete>}
   */
  async function basicFixture() {
    return fixture(html`<anypoint-autocomplete></anypoint-autocomplete>`);
  }

  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function suggestionsFixture() {
    return fixture(html`
      <div>
        <input id="f1" />
        <anypoint-autocomplete noAnimations target="f1" .source="${suggestions}"></anypoint-autocomplete>
      </div>
    `);
  }

  /**
   * @param {Suggestion[]} model
   * @return {Promise<HTMLDivElement>}
   */
  async function modelFixture(model) {
    return fixture(html`
      <div>
        <input id="f1" />
        <anypoint-autocomplete noAnimations target="f1" .source="${model}"></anypoint-autocomplete>
      </div>
    `);
  }

  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function loaderFixture() {
    return fixture(html`
      <div>
        <input id="f2" />
        <anypoint-autocomplete loader target="f2"></anypoint-autocomplete>
      </div>
    `);
  }

  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function stringTargetFixture() {
    return fixture(html`<div><input id="f2">
    <anypoint-autocomplete target="f2"></anypoint-autocomplete></div>`);
  }

  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function anypointFixture() {
    return fixture(html`<div><input id="f2">
    <anypoint-autocomplete anypoint target="f2"></anypoint-autocomplete></div>`);
  }

  /**
   * @return {Promise<HTMLDivElement>}
   */
  async function noTargetValueUpdateFixture() {
    return fixture(html`
      <div>
        <input id="f1" />
        <anypoint-autocomplete noAnimations target="f1" .source="${suggestions}"></anypoint-autocomplete>
      </div>
    `);
  }

  describe('Initialization', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    before(async () => {
      element = await basicFixture();
    });

    it('has empty _suggestions', () => {
      assert.deepEqual(element._suggestions, []);
    });

    it('has default loader', () => {
      assert.isFalse(element.loader);
    });

    it('has default _loading', () => {
      assert.isFalse(element._loading);
    });

    it('has default opened', () => {
      assert.isFalse(element.opened);
    });

    it('has default openOnFocus', () => {
      assert.isFalse(element.openOnFocus);
    });

    it('has default horizontalAlign', () => {
      assert.equal(element.horizontalAlign, 'center');
    });

    it('has default verticalAlign', () => {
      assert.equal(element.verticalAlign, 'top');
    });

    it('has default scrollAction', () => {
      assert.equal(element.scrollAction, 'refit');
    });

    it('has default horizontalOffset', () => {
      assert.equal(element.horizontalOffset, 0);
    });

    it('has default verticalOffset', () => {
      assert.equal(element.verticalOffset, 2);
    });

    it('generates an id', () => {
      assert.isNotEmpty(element.id);
    });

    it('sets position style programmatically', () => {
      assert.equal(element.style.position.trim(), 'absolute');
    });
  });

  describe('User input', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('sets _previousQuery', () => {
      input.value = 'test';
      notifyInput(input);
      assert.equal(input.value, element._previousQuery);
    });

    it('dispatches query event', () => {
      const spy = sinon.spy();
      element.addEventListener('query', spy);
      input.value = 'test';
      notifyInput(input);
      assert.equal(spy.args[0][0].detail.value, 'test');
    });

    it('filters suggestions', () => {
      const word = 'TEST';
      element.addEventListener('query', function f(e) {
        e.target.removeEventListener('query', f);
        // @ts-ignore
        e.target.source = [word, `${word  }2`, 'etra73hxis'];
      });
      input.value = 'test';
      notifyInput(input);
      assert.lengthOf(element.suggestions, 2);
    });
  });

  describe('Suggestions with label', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    const model = [{
      value: 'v1',
      label: 'l1',
    }, {
      value: 'v2',
      label: 'l2',
    }];
    beforeEach(async () => {
      const region = await modelFixture(model);
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('render label instead of value', async () => {
      input.value = '';
      notifyInput(input);
      await nextFrame();
      const items = element.querySelectorAll('anypoint-item');
      assert.equal(items[0].textContent.trim(), 'l1');
      assert.equal(items[1].textContent.trim(), 'l2');
    });

    it('inserts value into the input', async () => {
      input.value = '';
      notifyInput(input);
      await nextFrame();
      element._listbox.selectNext();
      assert.equal(input.value, 'v1');
    });

    it('renders HTML template label', async () => {
      element.source = htmlSuggestions;
      await nextFrame();
      input.value = 'appl';
      notifyInput(input);
      await nextFrame();
      const label = element._listbox.querySelector('anypoint-item b');
      assert.ok(label, 'bold label exists');
      assert.include(label.textContent, 'Apple');
    });
  });

  describe('No input update', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await noTargetValueUpdateFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('does not update input value', async () => {
      input.value = '';
      notifyInput(input);
      element._listbox.selectNext();
      assert.equal(input.value, '');
    });
  });

  describe('Suggestions with description', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    const model = [{
      value: 'v1',
      description: 'd1',
    }, {
      value: 'v2',
      description: 'd2',
    }];

    beforeEach(async () => {
      const region = await modelFixture(model);
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('renders two line item', async () => {
      input.value = '';
      notifyInput(input);
      await nextFrame();
      const item = element.querySelector('anypoint-item');
      const body = item.querySelector('anypoint-item-body');
      assert.isTrue(body.hasAttribute('twoLine'));
      const desc = body.querySelector('[data-secondary]')
      assert.equal(desc.textContent.trim(), 'd1');
    });

    it('renders HTML template description', async () => {
      element.source = htmlSuggestions.map((i) => {
        i.description = LitHtml`<i>item description</i>`;
        return i;
      });
      await nextFrame();
      input.value = 'appl';
      notifyInput(input);
      await nextFrame();
      const label = element._listbox.querySelector('anypoint-item [data-secondary] i');
      assert.ok(label, 'description exists');
    });
  });

  describe('_targetChanged()', () => {
    it('Recognizes target by id', async () => {
      const fix = await stringTargetFixture();
      const element = fix.querySelector('anypoint-autocomplete');
      const input = fix.querySelector('input');
      assert.isTrue(element._oldTarget === input);
      assert.isTrue(element.target === input);
    });

    it('calls notifyResize()', async () => {
      const element = await basicFixture();
      const input = document.createElement('input');
      const spy = sinon.spy(element, 'notifyResize');
      element.target = input;
      assert.isTrue(spy.called);
    });

    it('sets target only once', async () => {
      const element = await basicFixture();
      const input = document.createElement('input');
      element.target = input;
      const spy = sinon.spy(element, 'notifyResize');
      element.target = input;
      assert.isFalse(spy.called);
    });

    it('ignores string attribute when no parent', async () => {
      const region = await fixture(html`<div>
        <input id="r1">
        <anypoint-autocomplete></anypoint-autocomplete>
      </div>`);
      const element = region.querySelector('anypoint-autocomplete');
      const parent = element.parentElement;
      parent.removeChild(element);
      element.target = 'r1';
      assert.equal(element.target, 'r1');
    });

    it('re-initializes parent when re-attached to the dom', async () => {
      const region = await fixture(html`<div>
        <input id="r1">
        <anypoint-autocomplete></anypoint-autocomplete>
      </div>`);
      const element = region.querySelector('anypoint-autocomplete');
      const parent = element.parentElement;
      parent.removeChild(element);
      element.target = 'r1';
      parent.appendChild(element);
      const input = region.querySelector('input');
      // @ts-ignore
      // @ts-ignore
      assert.isTrue(element.target === input);
    });

    it('removes listeners from old target', async () => {
      const region = await fixture(`<div>
        <input id="i1">
        <input id="i2">
        <anypoint-autocomplete target="r1"></anypoint-autocomplete>
      </div>`);
      const element = region.querySelector('anypoint-autocomplete');
      const i1 = /** @type HTMLInputElement */ (region.querySelector('#i1'));
      element.target = 'i2';
      const spy = sinon.spy();
      element.addEventListener('query', spy);
      i1.value = 'test';
      notifyInput(i1);
      assert.isFalse(spy.called);
    });

    it('adds listeners to new target', async () => {
      const region = await fixture(`<div>
        <input id="i1">
        <input id="i2">
        <anypoint-autocomplete target="r1"></anypoint-autocomplete>
      </div>`);
      const element = region.querySelector('anypoint-autocomplete');
      const i2 = /** @type HTMLInputElement */ (region.querySelector('#i2'));
      element.target = 'i2';
      const spy = sinon.spy();
      element.addEventListener('query', spy);
      i2.value = 'test';
      notifyInput(i2);
      assert.isTrue(spy.called);
    });
  });

  describe('Suggestions processing', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('computes suggestions list', () => {
      input.value = 'App';
      notifyInput(input);
      assert.equal(element.suggestions.length, 1);
    });

    it('uses previously filtered query', async () => {
      input.value = 'a';
      notifyInput(input);
      assert.equal(element.suggestions.length, 4);
      await aTimeout(0);
      /* eslint-disable require-atomic-updates */
      input.value = 'ap';
      notifyInput(input);
      assert.equal(element.suggestions.length, 2);
    });

    it('resets previous suggestions when query changes', async () => {
      input.value = 'a';
      notifyInput(input);
      assert.equal(element.suggestions.length, 4);
      await aTimeout(0);
      input.value = 'pa';
      notifyInput(input);
      assert.equal(element.suggestions.length, 0);
    });

    it('dispatches "selected" event', async () => {
      input.value = 'a';
      notifyInput(input);
      await aTimeout(0);
      const spy = sinon.spy();
      element.addEventListener('selected', spy);
      element._listbox.selectNext();
      assert.equal(spy.args[0][0].detail.value, 'Apple');
    });

    it('sets value on target when "selected" event not cancelled', async () => {
      input.value = 'a';
      notifyInput(input);
      await aTimeout(0);
      element._listbox.selectNext();
      await aTimeout(1);
      assert.equal(input.value, 'Apple');
    });

    it('closes the suggestions', async () => {
      input.value = 'a';
      notifyInput(input);
      await aTimeout(0);
      element._listbox.selectNext();
      await aTimeout(1);
      assert.isFalse(element.opened);
    });

    it('sets suggestions closed when no suggestions', async () => {
      element.source = [];
      input.value = 'a';
      notifyInput(input);
      await aTimeout(0);
      assert.isFalse(element.opened);
    });

    it('sets selected suggestion object on selected event', async () => {
      element.source = objectSuggestions;
      input.value = 'apr';
      notifyInput(input);
      await aTimeout(10);
      const spy = sinon.spy();
      element.addEventListener('selected', spy);
      element._listbox.selectNext();
      assert.deepEqual(spy.args[0][0].detail.value, objectSuggestions[1]);
    });

    it('sets selected suggestion object with HTML labels', async () => {
      element.source = htmlSuggestions;
      input.value = 'apr';
      notifyInput(input);
      await aTimeout(10);
      const spy = sinon.spy();
      element.addEventListener('selected', spy);
      element._listbox.selectNext();
      assert.deepEqual(spy.args[0][0].detail.value.id, 2);
      assert.deepEqual(spy.args[0][0].detail.value.value, 'Apricot');
    });
  });

  describe('Suggestions with progress', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await loaderFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('renders progress bar', async () => {
      input.value = 'a';
      notifyInput(input);
      await nextFrame();
      const node = element.querySelector('progress');
      assert.ok(node);
    });

    it('sets loading property', async () => {
      input.value = 'a';
      notifyInput(input);
      assert.isTrue(element.loading);
    });

    it('removes progress bar when suggestions are set', async () => {
      input.value = 'a';
      notifyInput(input);
      await nextFrame();
      element.source = ['apple'];
      await nextFrame();
      const node = element.querySelector('progress');
      assert.notOk(node);
    });

    it('removes progress bar when empty suggestions are set', async () => {
      input.value = 'a';
      notifyInput(input);
      await nextFrame();
      element.source = [];
      await nextFrame();
      const node = element.querySelector('progress');
      assert.notOk(node);
    });
  });

  describe('renderSuggestions()', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
    });

    it('sets _previousQuery', () => {
      input.value = 'a';
      element.renderSuggestions();
      assert.equal(element._previousQuery, 'a');
    });

    it('accepts numeric input', () => {
      input.type = 'number';
      element._oldTarget.parentElement.removeChild(element._oldTarget);
      // @ts-ignore
      element._oldTarget = { value: 2, };
      element.renderSuggestions();
      element._oldTarget = undefined;
      assert.equal(element._previousQuery, '2');
    });

    it('calls _dispatchQuery()', () => {
      input.value = 'a';
      const spy = sinon.spy(element, '_dispatchQuery');
      element.renderSuggestions();
      assert.equal(spy.args[0][0], input.value);
    });

    it('calls _filterSuggestions()', () => {
      input.value = 'a';
      const spy = sinon.spy(element, '_filterSuggestions');
      element.renderSuggestions();
      assert.isTrue(spy.called);
    });

    it('calls _filterSuggestions() when has _previousQuery that matches', () => {
      input.value = 'a';
      element.renderSuggestions();
      input.value = 'ap';
      const spy = sinon.spy(element, '_filterSuggestions');
      element.renderSuggestions();
      assert.isTrue(spy.called);
    });

    it('ignores change when not attached to the dom', () => {
      element.parentElement.removeChild(element);
      input.value = 'a';
      element.renderSuggestions();
      assert.equal(element._previousQuery, undefined);
    });

    it('clears suggestions when query changes', () => {
      input.value = 'a';
      element.renderSuggestions();
      input.value = 'test';
      element.renderSuggestions();
      assert.deepEqual(element._suggestions, []);
    });

    it('opens element when loader', () => {
      element.loader = true;
      input.value = 'a';
      element.renderSuggestions();
      assert.isTrue(element.opened);
    });

    it('is called on input change', async () => {
      input.value = 'a';
      notifyInput(input);
      assert.equal(element._previousQuery, 'a');
    });
  });

  describe('_filterSuggestions()', () => {
    it('Does nothing when event target not set', async () => {
      const element = await basicFixture();
      element._filterSuggestions();
      assert.deepEqual(element._suggestions, []);
    });

    it('Does nothing when no previous query set', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = undefined;
      element._previousQuery = 'test';
      element._filterSuggestions();
      assert.deepEqual(element._suggestions, []);
    });

    it('Does nothing when source', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element._filterSuggestions();
      assert.deepEqual(element._suggestions, []);
    });

    it('Filters out string values', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = ['a', 'aa', 'b', 'ab'];
      element._previousQuery = 'a';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [{
        value: 'a',
        index: 0,
      }, {
        value: 'aa',
        index: 1,
      }, {
        value: 'ab',
        index: 3,
      }]);
    });

    it('Filters out string values - cap query', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = ['a', 'aa', 'b', 'ab'];
      element._previousQuery = 'A';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [{
        value: 'a',
        index: 0,
      }, {
        value: 'aa',
        index: 1,
      }, {
        value: 'ab',
        index: 3,
      }]);
    });

    it('Filters out string values - cap items', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = ['A', 'Aa', 'b', 'Ab'];
      element._previousQuery = 'a';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [{
        value: 'A',
        index: 0,
      }, {
        value: 'Aa',
        index: 1,
      }, {
        value: 'Ab',
        index: 3,
      }]);
    });

    it('Filters out object values', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [
        {
          value: 'a',
        },
        {
          value: 'aa',
        },
        {
          value: 'b',
        },
        {
          value: 'ab',
        },
      ];
      element._previousQuery = 'a';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [
        {
          value: 'a' ,
          index: 0,
        }, {
          value: 'aa',
          index: 1,
        }, {
          value: 'ab',
          index: 3,
        }
      ]);
    });

    it('Filters out object values - cap query', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'a' }, { value: 'aa' }, { value: 'b' }, { value: 'ab' }];
      element._previousQuery = 'A';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [
        {
          value: 'a' ,
          index: 0,
        }, {
          value: 'aa',
          index: 1,
        }, {
          value: 'ab',
          index: 3,
        }
      ]);
    });

    it('Filters out object values - cap items', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'A' }, { value: 'Aa' }, { value: 'b' }, { value: 'Ab' }];
      element._previousQuery = 'a';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [
        {
          value: 'A' ,
          index: 0,
        }, {
          value: 'Aa',
          index: 1,
        }, {
          value: 'Ab',
          index: 3,
        }
      ]);
    });

    it('Filters out through the "filter" property', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'A', filter: 'x' }, { value: 'Aa', filter: 'y' }, { value: 'b', filter: 'z' }, { value: 'Ab', filter: 'xa' }];
      element._previousQuery = 'x';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      assert.deepEqual(element.suggestions, [{
        filter: 'x',
        value: 'A',
        index: 0,
      }, {
        filter: 'xa',
        value: 'Ab',
        index: 3,
      }]);
    });

    it('returns all when no query', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'a' }, { value: 'aa' }, { value: 'ab' }, { value: 'b' }];
      element._previousQuery = '';
      element._filterSuggestions();
      assert.typeOf(element.suggestions, 'array');
      const mapped = /** @type InternalSuggestion[] */ (element.source.map((item, index) => {
        const copy = { ...item, index };
        return copy;
      }));
      assert.deepEqual(element.suggestions, mapped);
    });

    it('closes element when no items after filtered', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'a' }, { value: 'aa' }];
      element._previousQuery = 'b';
      element[openedValue] = true;
      element._filterSuggestions();
      assert.isFalse(element.opened);
    });

    it.skip('sorts the results #1', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'zoab' }, { value: 'saab' }, { value: 'ab' }, { value: 'Ab' }];
      element._previousQuery = 'ab';
      element._filterSuggestions();
      assert.equal(/** @type InternalSuggestion */ (element.suggestions[0]).value, 'ab');
    });

    it('sorts the results #2', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'xab' }, { value: 'xxab' }, { value: 'abxx' }];
      element._previousQuery = 'ab';
      element._filterSuggestions();
      assert.deepEqual(element.suggestions, [
        { value: 'abxx', index: 2 },
        { value: 'xab', index: 0 },
        { value: 'xxab', index: 1 },
      ]);
    });

    it('sorts the results #3', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'xxxab' }, { value: 'ab' }];
      element._previousQuery = 'ab';
      element._filterSuggestions();
      assert.deepEqual(element.suggestions, [{ value: 'ab', index: 1 }, { value: 'xxxab', index: 0 }]);
    });

    it('Opens the overlay', async () => {
      const element = (await suggestionsFixture()).querySelector('anypoint-autocomplete');
      element.source = [{ value: 'a' }, { value: 'aa' }];
      element._previousQuery = 'a';
      element._filterSuggestions();
      await aTimeout(0);
      assert.isTrue(element.opened);
    });
  });

  describe('_targetFocusHandler()', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    const source = ['Apple', 'Appli', 'Applo'];

    beforeEach(async () => {
      element = (await stringTargetFixture()).querySelector('anypoint-autocomplete');
      element.source = source;
      element.openOnFocus = true;
      element._suggestions = source;
      await nextFrame();
    });

    it('Does nothing when openOnFocus is not set', () => {
      element.openOnFocus = false;
      element._targetFocusHandler();
      assert.isUndefined(element[autocompleteFocus]);
    });

    it('Does nothing when opened', () => {
      element[openedValue] = true;
      element._targetFocusHandler();
      assert.isUndefined(element[autocompleteFocus]);
    });

    it('Does nothing when __autocompleteFocus is already set', () => {
      element[autocompleteFocus] = 1;
      element._targetFocusHandler();
      assert.equal(element[autocompleteFocus], 1);
    });

    it('Does nothing when [ignoreNextFocus] is set', async () => {
      element[ignoreNextFocus] = true;
      element._targetFocusHandler();
      await aTimeout(0);
      assert.isTrue(element[ignoreNextFocus]);
    });

    it('Sets [autocompleteFocus]', () => {
      element._targetFocusHandler();
      assert.isTrue(element[autocompleteFocus]);
    });

    it('Re-sets [autocompleteFocus]', async () => {
      element._targetFocusHandler();
      await aTimeout(1);
      assert.isFalse(element[autocompleteFocus]);
    });

    it('Calls renderSuggestions()', async () => {
      element._targetFocusHandler();
      const spy = sinon.spy(element, 'renderSuggestions');
      await aTimeout(1);
      assert.isTrue(spy.called);
    });
  });

  describe('onquery', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onquery);
      const f = () => {};
      element.onquery = f;
      assert.isTrue(element.onquery === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onquery = f;
      element._dispatchQuery('test');
      element.onquery = null;
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
      element.onquery = f1;
      element.onquery = f2;
      element._dispatchQuery('test');
      element.onquery = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('onselected', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    beforeEach(async () => {
      const region = await stringTargetFixture();
      element = region.querySelector('anypoint-autocomplete');
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onselected);
      const f = () => {};
      element.onselected = f;
      assert.isTrue(element.onselected === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onselected = f;
      element._inform('test');
      element.onselected = null;
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
      element.onselected = f1;
      element.onselected = f2;
      element._inform('test');
      element.onselected = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('anypoint property', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    const source = ['Apple', 'Appli', 'Applo'];

    beforeEach(async () => {
      const region = await anypointFixture();
      element = region.querySelector('anypoint-autocomplete');
      element.source = source;
      element.openOnFocus = true;
      element._suggestions = source;
      await nextFrame();
    });

    it('sets anypoint property on anypoint-item', () => {
      const item = element.querySelector('anypoint-item');
      assert.isTrue(item.anypoint);
    });

    it('does not render ripple effect', () => {
      const item = element.querySelector('paper-ripple');
      assert.notOk(item);
    });
  });

  describe('_targetKeydown', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
      element._previousQuery = 'a';
      input.value = 'a';
      element._filterSuggestions();
      await aTimeout(0);
      element[openedValue] = false;
    });

    it('calls _onDownKey() when ArrowDown', () => {
      const spy = sinon.spy(element, '_onDownKey');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
        keyCode: 40,
      }));
      assert.isTrue(spy.called);
    });

    it('calls _onEnterKey() when Enter', () => {
      const spy = sinon.spy(element, '_onEnterKey');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Enter',
        key: 'Enter',
        keyCode: 13,
      }));
      assert.isTrue(spy.called);
    });

    it('calls _onTabDown() when Enter', () => {
      const spy = sinon.spy(element, '_onTabDown');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Tab',
        key: 'Tab',
        keyCode: 9,
      }));
      assert.isTrue(spy.called);
    });

    it('calls _onEscKey() when Escape', () => {
      const spy = sinon.spy(element, '_onEscKey');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'Escape',
        key: 'Escape',
        keyCode: 27,
      }));
      assert.isTrue(spy.called);
    });

    it('calls _onUpKey() when ArrowUp', async () => {
      const item = element._listbox.items[3];
      element._listbox._focusedItem = item;
      const spy = sinon.spy(element, '_onUpKey');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'ArrowUp',
        key: 'ArrowUp',
        keyCode: 38,
      }));
      assert.isTrue(spy.called);
    });
  });

  describe('_onDownKey()', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
      element._previousQuery = 'a';
      input.value = 'a';
      element._filterSuggestions();
      await nextFrame();
      element[openedValue] = false;
    });

    it('calls renderSuggestions() when closed', () => {
      const spy = sinon.spy(element, 'renderSuggestions');
      element._onDownKey();
      assert.isTrue(spy.called);
    });

    it('eventually highlights an item when closed', async () => {
      element[openedValue] = true;
      const spy = sinon.spy(element._listbox, 'highlightNext');
      element._onDownKey();
      await aTimeout(0);
      assert.isTrue(spy.called);
    });

    it('focuses on the list when opened', () => {
      element[openedValue] = true;
      const spy = sinon.spy(element._listbox, 'highlightNext');
      element._onDownKey();
      assert.isTrue(spy.called);
    });
  });

  describe('_onUpKey()', () => {
    let element;
    let input;

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
      element._previousQuery = 'a';
      input.value = 'a';
      element._filterSuggestions();
      await nextFrame();
      const item = element._listbox.items[3];
      element._listbox._focusedItem = item;
      element[openedValue] = false;
    });

    it('calls renderSuggestions() when closed', async () => {
      const spy = sinon.spy(element, 'renderSuggestions');
      element._onUpKey();
      assert.isTrue(spy.called);
      await aTimeout(0);
    });

    it('eventually focuses on the list when closed', async () => {
      element[openedValue] = true;
      const spy = sinon.spy(element._listbox, 'highlightPrevious');
      element._onUpKey();
      await aTimeout(0);
      assert.isTrue(spy.called);
    });

    it('focuses on the list when opened', () => {
      element[openedValue] = true;
      const spy = sinon.spy(element._listbox, 'highlightPrevious');
      element._onUpKey();
      assert.isTrue(spy.called);
    });
  });

  describe('disabled state', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
      element._previousQuery = 'a';
      input.value = 'a';
      element.disabled = true;
    });

    async function renderSuggestions() {
      element._filterSuggestions();
      await nextFrame();
    }

    it('does not render suggestions on input', () => {
      const spy = sinon.spy(element, 'renderSuggestions');
      input.dispatchEvent(new CustomEvent('input'));
      assert.isFalse(spy.called);
    });

    it('does not render suggestions when calling renderSuggestions()', () => {
      const spy = sinon.spy(element, '_filterSuggestions');
      element.renderSuggestions();
      assert.isFalse(spy.called);
    });

    it('ignores key events on the target', () => {
      element.openOnFocus = true;
      const spy = sinon.spy(element, '_onDownKey');
      input.dispatchEvent(new KeyboardEvent('keydown', {
        composed: true,
        bubbles: true,
        cancelable: true,
        code: 'ArrowDown',
        key: 'ArrowDown',
        keyCode: 40,
      }));
      assert.isFalse(spy.called);
    });

    it('ignores focus on the target', () => {
      element[autocompleteFocus] = false;
      input.focus();
      assert.isFalse(element[autocompleteFocus]);
    });

    it('closes rendered suggestions', async () => {
      element.disabled = false;
      await renderSuggestions();
      assert.isTrue(element[openedValue], 'suggestions are rendered');
      element.disabled = true;
      assert.isFalse(element[openedValue], 'suggestions are closed');
    });
  });

  describe('resize event', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);
    let dropDown = /** @type AnypointDropdown */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      input = region.querySelector('input');
      element._previousQuery = 'a';
      input.value = 'a';
      element.disabled = true;
      element._filterSuggestions();
      await nextFrame();
      dropDown = element.querySelector('anypoint-dropdown');
    });

    it('dispatches resize event when dropdown resizes', async () => {
      const spy = sinon.spy();
      element.addEventListener('resize', spy);
      dropDown.dispatchEvent(new CustomEvent('resize'));
      await element.updateComplete;
      await aTimeout(0);
      assert.isTrue(spy.calledOnce);
    });

    it('ignores when not opened', async () => {
      element[openedValue] = false;
      const spy = sinon.spy();
      element.addEventListener('resize', spy);
      dropDown.dispatchEvent(new CustomEvent('resize'));
      await element.updateComplete;
      await aTimeout(0);
      assert.isFalse(spy.calledOnce);
    });
  });

  describe('#positionTarget', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let dropDown = /** @type AnypointDropdown */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      dropDown = element.querySelector('anypoint-dropdown');
    });

    it('has the default positioning target', () => {
      assert.equal(dropDown.positionTarget.localName, 'input');
    });

    it('has the set positioning target', async () => {
      const target = document.createElement('span');
      element.positionTarget = target;
      await nextFrame();
      assert.isTrue(dropDown.positionTarget === target);
    });
  });

  describe('#fitPositionTarget', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let dropDown = /** @type AnypointDropdown */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      dropDown = element.querySelector('anypoint-dropdown');
    });

    it('has no fitPositionTarget set on the dropdown', () => {
      assert.notOk(dropDown.fitPositionTarget);
    });

    it('has fitPositionTarget set on the dropdown', async () => {
      element.fitPositionTarget = true;
      await nextFrame();
      assert.isTrue(dropDown.fitPositionTarget);
    });
  });

  describe('a11y', () => {
    async function basicFixtureA11y() {
      return fixture(html`
        <div>
          <label id="inputLabel">Test</label>
          <input id="f1" aria-labelledby="inputLabel" />
          <anypoint-autocomplete noAnimations target="f1" .source="${suggestions}"></anypoint-autocomplete>
        </div>
      `);
    }

    async function noTargetControlsFixture() {
      return fixture(html`
        <div>
          <label id="inputLabel">Test</label>
          <input id="f1" aria-labelledby="inputLabel" />
          <anypoint-autocomplete target="f1" noTargetControls></anypoint-autocomplete>
        </div>
      `);
    }

    it('is accessible', async () => {
      const element = await basicFixtureA11y();
      await assert.isAccessible(element);
    });

    it('sets aria-controls on the target', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('#f1').getAttribute('aria-controls');
      assert.isNotEmpty(result);
    });

    it('does not set aria-controls on the target when noTargetControls', async () => {
      const element = await noTargetControlsFixture();
      const result = element.querySelector('#f1').getAttribute('aria-controls');
      assert.equal(result, null);
    });

    it('sets aria-controls on the element', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('anypoint-autocomplete').getAttribute('aria-controls');
      assert.isNotEmpty(result);
    });

    it('sets aria-controls to the listbox', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('anypoint-autocomplete').getAttribute('aria-controls');
      const boxId = element.querySelector('anypoint-listbox').id;
      assert.equal(result, boxId);
    });

    it('sets aria-owns to the listbox', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('anypoint-autocomplete').getAttribute('aria-owns');
      const boxId = element.querySelector('anypoint-listbox').id;
      assert.equal(result, boxId);
    });

    it('sets aria-autocomplete on the target', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('#f1').getAttribute('aria-autocomplete');
      assert.equal(result, 'list');
    });

    it('sets aria-haspopup on the target', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('#f1').getAttribute('aria-haspopup');
      assert.equal(result, 'true');
    });

    it('sets autocomplete on the target', async () => {
      const element = await basicFixtureA11y();
      const result = element.querySelector('#f1').getAttribute('autocomplete');
      assert.equal(result, 'off');
    });

    it('sets role on parent', async () => {
      const element = await basicFixtureA11y();
      const result = element.getAttribute('role');
      assert.equal(result, 'combobox');
    });

    it('sets aria-expanded on parent', async () => {
      const element = await basicFixtureA11y();
      const result = element.getAttribute('aria-expanded');
      assert.equal(result, 'false');
    });

    it('sets aria-owns on parent', async () => {
      const element = await basicFixtureA11y();
      const result = element.getAttribute('aria-owns');
      const boxId = element.querySelector('anypoint-autocomplete').id;
      assert.equal(result, boxId);
    });

    it('sets aria-haspopup on parent', async () => {
      const element = await basicFixtureA11y();
      const result = element.getAttribute('aria-haspopup');
      assert.equal(result, 'listbox');
    });
  });

  describe('Suggestion rendering', () => {
    let element = /** @type AnypointAutocomplete */ (null);
    let input = /** @type HTMLInputElement */ (null);

    beforeEach(async () => {
      const region = await suggestionsFixture();
      element = region.querySelector('anypoint-autocomplete');
      element.openOnFocus = true;
      input = region.querySelector('input');
      await nextFrame();
    });

    it('should open suggestions when input is focused', async () => {
      input.focus();
      await nextFrame();
      assert.isTrue(element.opened);
    });

    it('should close suggestions when click happens outside input', async () => {
      input.focus();
      await nextFrame();
      document.body.click();
      await nextFrame();
      assert.isFalse(element.opened);
    });

    it('should not close suggestions when click happens inside input', async () => {
      input.focus();
      await nextFrame();
      input.click();
      await nextFrame();
      assert.isTrue(element.opened);
    });
  });
});

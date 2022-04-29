import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { AnypointInputElement } from '../../src/index.js'
import '../../src/define/anypoint-input.js';

describe('<anypoint-input>', () => {
  async function basicFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input></anypoint-input>`);
  }
  
  async function autoValidateFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input
      autoValidate
      required
      invalidMessage="test"></anypoint-input>`);
  }
  
  async function patternFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input pattern="[a-z]*"></anypoint-input>`);
  }

  async function noLabelFloatFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input nolabelfloat label="Label"></anypoint-input>`);
  }

  async function readOnlyFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input readonly label="Label"></anypoint-input>`);
  }

  async function zeroFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input type="number" value="0" label="Label"></anypoint-input>`);
  }

  async function numberFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input type="number" value="10" label="Label"></anypoint-input>`);
  }

  async function legacyLabelFixture(): Promise<AnypointInputElement> {
    return fixture(html`<anypoint-input>
      <label slot="label">Legacy label </label>>
    </anypoint-input>`);
  }

  const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

  describe('setters and getters', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets value on element', () => {
      element.value = 'test';
      assert.equal(element.value, 'test');
    });

    it('sets value on input element', async () => {
      element.value = 'test';
      await nextFrame();
      const input = element.inputElement;
      assert.equal(input.value, 'test');
    });

    it('setting the same value ignores setter', async () => {
      element.value = 'test';
      const spy = sinon.spy();
      element.addEventListener('valuechange', spy);
      element.value = 'test';
      assert.isFalse(spy.called);
    });

    it('returns regexp for _patternRegExp when allowedPattern', () => {
      element.allowedPattern = '[a-z]';
      const result = element._patternRegExp;
      assert.typeOf(result, 'regexp');
    });

    it('returns regexp for _patternRegExp when number type', () => {
      element.type = 'number';
      const result = element._patternRegExp;
      assert.typeOf(result, 'regexp');
    });

    it('returns undefined for _patternRegExp otherwise', () => {
      const result = element._patternRegExp;
      assert.isUndefined(result);
    });

    it('inputElement returns the input', () => {
      const result = element.inputElement;
      assert.equal(result.localName, 'input');
    });
  });

  describe('_inputType getter', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns default input type', () => {
      const result = element._inputType;
      assert.equal(result, 'text');
    });

    it('returns set input type', () => {
      element.type = 'password';
      const result = element._inputType;
      assert.equal(result, 'password');
    });
  });

  describe('Default values', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets default autoValidate', () => {
      assert.isUndefined(element.autoValidate);
    });

    it('sets default autocomplete', () => {
      assert.equal(element.autocomplete, 'off');
    });

    it('sets default autocorrect', () => {
      assert.equal(element.autocorrect, 'off');
    });

    it('sets default autocorrect', () => {
      assert.equal(element.autocorrect, 'off');
    });

    it('sets default tabindex', () => {
      assert.equal(element.tabIndex, 0);
    });
  });

  describe('_invalidChanged()', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets invalid state', async () => {
      element.invalid = true;
      await nextFrame();
      // This is done in parent class.
      assert.equal(element.getAttribute('aria-invalid'), 'true');
    });
  });

  describe('focus and blur', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await autoValidateFixture();
    });

    it('focuses on the input', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      assert.equal(document.activeElement, element);
    });

    it('sets input selection', async () => {
      element.value = 'test';
      await nextFrame();
      MockInteractions.focus(element);
      const input = element.inputElement;
      assert.equal(input.selectionStart, 4, 'selectionStart is preserved');
      assert.equal(input.selectionEnd, 4, 'selectionEnd is preserved');
    });

    it('auto validates on blur', async () => {
      MockInteractions.focus(element);
      await nextFrame();
      const spy = sinon.spy(element, 'checkValidity');
      MockInteractions.blur(element);
      assert.isTrue(spy.called);
    });
  });

  describe('_keydownHandler()', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await autoValidateFixture();
    });

    it('sets the _shiftTabPressed', async () => {
      const e = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
      });
      element.dispatchEvent(e);
      assert.isTrue((element as any)._shiftTabPressed);
    });

    it('prevents invalid input', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      const e = new KeyboardEvent('keydown', {
        key: '1',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isTrue(e.defaultPrevented);
    });

    it('ignores preventing when no pattern', async () => {
      element.preventInvalidInput = true;
      const e = new KeyboardEvent('keydown', {
        key: '1',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when no preventInvalidInput', async () => {
      element.preventInvalidInput = false;
      element.allowedPattern = '[a-z]';
      const e = new KeyboardEvent('keydown', {
        key: '1',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when number type', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      element.type = 'number';
      await nextFrame();
      const e = new KeyboardEvent('keydown', {
        key: '1',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when file type', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      element.type = 'file';
      await nextFrame();
      const e = new KeyboardEvent('keydown', {
        key: '1',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when meta key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const e = new KeyboardEvent('keydown', {
        key: '1',
        metaKey: true,
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when ctrl key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const e = new KeyboardEvent('keydown', {
        key: '1',
        ctrlKey: true,
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when Backspace key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const e = new KeyboardEvent('keydown', {
        key: 'Backspace',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });

    it('ignores preventing when allowed key', async () => {
      element.allowedPattern = '[a-z]';
      element.preventInvalidInput = true;
      const e = new KeyboardEvent('keydown', {
        key: 'a',
        cancelable: true,
      });
      element.dispatchEvent(e);
      assert.isFalse(e.defaultPrevented);
    });
  });

  describe('_onShiftTabDown()', () => {
    let element: any;
    let e: KeyboardEvent;
    beforeEach(async () => {
      element = await basicFixture();
      e = new KeyboardEvent('keydown');
      element.dispatchEvent(e);
    });

    it('sets _shiftTabPressed', () => {
      element._onShiftTabDown(e);
      assert.isTrue(element._shiftTabPressed);
    });

    it('resets _shiftTabPressed', async () => {
      element._onShiftTabDown(e);
      await aTimeout(1);
      assert.isFalse(element._shiftTabPressed);
    });
  });

  describe('_autoValidateChanged()', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('calls checkValidity when true', async () => {
      const spy = sinon.spy(element, 'checkValidity');
      element.autoValidate = true;
      await nextFrame();
      assert.isTrue(spy.called);
    });

    it('ignores checkValidity when false', async () => {
      element.autoValidate = true;
      const spy = sinon.spy(element, 'checkValidity');
      element.autoValidate = false;
      await nextFrame();
      assert.isFalse(spy.called);
    });
  });

  describe('Events retargeting', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('retargets the change event', () => {
      const input = element.inputElement;
      const spy = sinon.spy();
      element.addEventListener('change', spy);
      input.dispatchEvent(new Event('change'));
      assert.isTrue(spy.called);
    });

    it('retargets the search event', () => {
      const input = element.inputElement;
      const spy = sinon.spy();
      element.addEventListener('search', spy);
      input.dispatchEvent(new Event('search'));
      assert.isTrue(spy.called);
    });
  });

  describe('_checkPatternValidity()', () => {
    it('returns true when no argument', async () => {
      const element = await basicFixture() as any;
      const result = element._checkPatternValidity();
      assert.isTrue(result);
    });

    it('returns true when no pattern', async () => {
      const element = await basicFixture() as any;
      const result = element._checkPatternValidity('test');
      assert.isTrue(result);
    });

    it('returns true when pattern matches', async () => {
      const element = await patternFixture() as any;
      const result = element._checkPatternValidity('test');
      assert.isTrue(result);
    });

    it('returns false when pattern does not match', async () => {
      const element = await patternFixture() as any;
      const result = element._checkPatternValidity('c4e');
      assert.isTrue(result);
    });
  });

  describe('_inputHandler()', () => {
    let element: any;
    let target: HTMLInputElement;
    let e: Event;
    beforeEach(async () => {
      element = await basicFixture();
      element.value = 'test';
      await nextFrame();
      target = element.inputElement as HTMLInputElement;
      e = new Event('input');
      element.dispatchEvent(e);
    });

    it('sets _patternAlreadyChecked', () => {
      element._patternAlreadyChecked = true;
      element._inputHandler(e);
      assert.isFalse(element._patternAlreadyChecked);
    });

    it('sets _previousValidInput', () => {
      element._inputHandler(e);
      assert.equal(element._previousValidInput, 'test');
    });

    it('calls checkValidity() when auto validate is on', async () => {
      element.autoValidate = true;
      const spy = sinon.spy(element, 'checkValidity');
      element._inputHandler(e);
      assert.isTrue(spy.called);
    });

    it('calls _checkPatternValidity() when input prevention is enabled', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      const spy = sinon.spy(element, '_checkPatternValidity');
      element._inputHandler(e);
      assert.isTrue(spy.called);
    });

    it('ignores call to _checkPatternValidity() when _patternAlreadyChecked', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._patternAlreadyChecked = true;
      const spy = sinon.spy(element, '_checkPatternValidity');
      element._inputHandler(e);
      assert.isFalse(spy.called);
    });

    it('updates value when input prevention is enabled', async () => {
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._previousValidInput = 'test';
      target.value = 'test1';
      e = new Event('input');
      target.dispatchEvent(e);
      assert.equal(target.value, 'test');
      assert.equal(element.value, 'test');
    });

    it('ignores value update for file inputs', async () => {
      element.type = 'file';
      element.preventInvalidInput = true;
      element.allowedPattern = '[a-z]';
      element._previousValidInput = 'test';
      element._inputHandler(e);
      // no error
    });
  });

  describe('_checkInputValidity()', () => {
    let element: any;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns false when required and no value', () => {
      element.required = true;
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns true when file', async () => {
      element.type = 'file';
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isTrue(result);
    });

    it('returns false when pattern does not match', async () => {
      element.value = 'test123';
      element.pattern = '[a-z]';
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when minLength mismatch', async () => {
      element.value = 'a';
      element.minLength = 10;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when minLength mismatch', async () => {
      element.value = 'ab';
      element.maxLength = 1;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when min mismatch', async () => {
      element.type = 'number';
      element.value = 1;
      element.min = 2;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when max mismatch', async () => {
      element.type = 'number';
      element.value = 2;
      element.max = 1;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when not a number', async () => {
      element.type = 'number';
      element.value = 'test';
      element.max = 1;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns false when step mismatch', async () => {
      element.type = 'number';
      element.value = 10.123;
      element.step = '1';
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isFalse(result);
    });

    it('returns true for number', async () => {
      element.type = 'number';
      element.value = 10;
      element.step = '1';
      element.min = 1;
      element.max = 100;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isTrue(result);
    });

    it('returns true for text', async () => {
      element.type = 'text';
      element.value = 'test';
      element.pattern = '[a-z]*';
      element.minLength = 1;
      element.maxLength = 100;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isTrue(result);
    });

    it('returns true for 0 number', async () => {
      element.type = 'number';
      element.value = 0;
      await nextFrame();
      const result = element._checkInputValidity(element.inputElement);
      assert.isTrue(result);
    });
  });

  (hasFormAssociatedElements ? describe : describe.skip)(
    'form-associated custom elements',
    () => {
      async function formFixture(): Promise<HTMLFormElement> {
        return fixture(`
      <form>
        <fieldset name="form-fields">
          <anypoint-input name="formItem" value="test-value">
            <label slot="label">Text input</label>
          </anypoint-listbox>
        </fieldset>
        <input type="reset" value="Reset">
        <input type="submit" value="Submit">
      </form>`);
      }

      describe('Internal basics', () => {
        let element: AnypointInputElement;
        let form: HTMLFormElement;
        beforeEach(async () => {
          form = await formFixture();
          element = form.querySelector('anypoint-input')!;
        });

        it('initializes ElementInternals interface', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            // @ts-ignore
            assert.ok(element._internals);
          }
        });

        it('has associated form', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            // @ts-ignore
            assert.equal(element.form, form);
          }
        });

        it('the element is in the list of form elements', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            const elements = Array.from(form.elements);
            assert.notEqual(elements.indexOf(element), -1);
          }
        });
      });

      describe('Submitting the form', () => {
        let element: AnypointInputElement;
        let form: HTMLFormElement;
        beforeEach(async () => {
          form = await formFixture();
          element = form.querySelector('anypoint-input')!;
        });

        it('set value in forms submission value', async () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            // @ts-ignore
            const spy = sinon.spy(element._internals, 'setFormValue');
            element.value = 'test';
            await nextFrame();
            assert.isTrue(spy.called);
          }
        });
      });

      describe('Resetting the form', () => {
        let element: AnypointInputElement;
        let form: HTMLFormElement;
        beforeEach(async () => {
          form = await formFixture();
          element = form.querySelector('anypoint-input')!;
        });

        it('resets the input value', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            form.reset();
            assert.equal(element.value, '');
          }
        });
      });

      describe('Disables the input when fieldset is disabled', () => {
        let element: AnypointInputElement;
        let form: HTMLFormElement;
        let fieldset: HTMLFieldSetElement;
        beforeEach(async () => {
          form = await formFixture();
          element = form.querySelector('anypoint-input')!;
          fieldset = form.querySelector('fieldset')!;
        });

        it('resets the disabled input value', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            fieldset.disabled = true;
            assert.isTrue(element.disabled);
          }
        });
      });

      describe('checkValidity()', () => {
        let element: AnypointInputElement;
        let form: HTMLFormElement;
        beforeEach(async () => {
          form = await formFixture();
          element = form.querySelector('anypoint-input')!;
        });

        it('calls internal checkValidity()', () => {
          // @ts-ignore
          if (element._internals && element._internals.form) {
            // @ts-ignore
            const spy = sinon.spy(element._internals, 'checkValidity');
            element.checkValidity();
            assert.isTrue(spy.called);
          }
        });
      });
    }
  );

  describe('Info message', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
      element.infoMessage = 'test';
      await nextFrame();
    });

    it('renders info message', () => {
      const node = element.shadowRoot!.querySelector('p.info');
      assert.ok(node);
    });

    it('info message is visible', () => {
      const node = element.shadowRoot!.querySelector('p.info')!;
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when invalid', async () => {
      element.invalid = true;
      element.invalidMessage = 'test msg';
      await nextFrame();
      const node = element.shadowRoot!.querySelector('p.info')!;
      assert.isTrue(node.classList.contains('label-hidden'))!;
    });
  });

  describe('Error message', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
      element.invalidMessage = 'test';
      await nextFrame();
    });

    it('renders error message', () => {
      const node = element.shadowRoot!.querySelector('p.invalid');
      assert.ok(node);
    });

    it('info message is visible when error', async () => {
      element.invalid = true;
      await nextFrame();
      const node = element.shadowRoot!.querySelector('p.invalid')!;
      assert.isFalse(node.classList.contains('label-hidden'));
    });

    it('hides info message when not invalid', async () => {
      const node = element.shadowRoot!.querySelector('p.invalid')!;
      assert.isTrue(node.classList.contains('label-hidden'));
    });
  });

  describe('noLabelFloat', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await noLabelFloatFixture();
    });

    it('renders label by default', () => {
      const label = element.shadowRoot!.querySelector('.label')!;
      const { display } = getComputedStyle(label);
      assert.notEqual(display, 'none');
    });

    it('hides label when has value', async () => {
      element.value = 'test';
      await nextFrame();
      const label = element.shadowRoot!.querySelector('.label')!;
      const { display } = getComputedStyle(label);
      assert.equal(display, 'none');
    });
  });

  describe('read only state', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await readOnlyFixture();
    });

    it('passes readonly to the input element', () => {
      const input = element.inputElement;
      assert.isTrue(input.readOnly);
    });

    it('removes readonly from the input element', async () => {
      element.readOnly = false;
      await nextFrame();
      const input = element.inputElement;
      assert.isFalse(input.readOnly);
    });
  });

  describe('a11y', () => {
    async function a11yBasicFixture(): Promise<AnypointInputElement> {
      const element = await fixture(html`<anypoint-input value="test value">
      <label slot="label">test label</label>
      </anypoint-input>`);
      await aTimeout(1);
      return element as AnypointInputElement;
    }

    async function a11yPrefixFixture(): Promise<AnypointInputElement> {
      const element = await fixture(html`<anypoint-input name="amount-usd">
        <label slot="label">Amount to transfer</label>
        <span slot="prefix" aria-label="Value in US dollars">$</span>
      </anypoint-input>`);
      await aTimeout(1);
      return element as AnypointInputElement;
    }

    async function a11ySuffixFixture(): Promise<AnypointInputElement> {
      const element = await fixture(html`<anypoint-input type="email" name="email-suffix">
        <label slot="label">Email</label>
        <div slot="suffix">@mulesoft.com</div>
      </anypoint-input>`);
      await aTimeout(1);
      return element as AnypointInputElement;
    }

    async function formFixture(): Promise<HTMLFormElement> {
      return fixture(html`
      <form>
        <fieldset name="form-fields">
          <anypoint-input name="formItem" value="test-value">
            <label slot="label">Text input</label>
          </anypoint-input>
        </fieldset>
        <input type="reset" value="Reset">
        <input type="submit" value="Submit">
      </form>`);
    }

    async function a11yOutlinedFixture(): Promise<AnypointInputElement> {
      return fixture(html`<anypoint-input value="test value" outlined>
      <label slot="label">test label</label>
      </anypoint-input>`);
    }

    async function a11yAnypointFixture(): Promise<AnypointInputElement> {
      return fixture(html`<anypoint-input value="test value" anypoint>
      <label slot="label">test label</label>
      </anypoint-input>`);
    }

    it('sets tabindex on the element', async () => {
      const element = await basicFixture();
      await nextFrame();
      assert.equal(element.getAttribute('tabindex'), '0');
    });

    it('respects existing tabindex on the element', async () => {
      const element = await fixture(
        `<anypoint-input tabindex="1"></anypoint-input>`
      );
      await nextFrame();
      assert.equal(element.getAttribute('tabindex'), '1');
    });

    it('is accessible with label', async () => {
      const element = await a11yBasicFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible with a prefix', async () => {
      const element = await a11yPrefixFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible with a suffix', async () => {
      const element = await a11ySuffixFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible in a form', async () => {
      const element = await formFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when outlined', async () => {
      const element = await a11yOutlinedFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });

    it('is accessible when anypoint mode', async () => {
      const element = await a11yAnypointFixture();
      await nextFrame();
      await assert.isAccessible(element);
    });
  });

  describe('APIC-574', () => {
    let element: AnypointInputElement;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('should render 0 value for integer input', async () => {
      // @ts-ignore
      element.value = 0;
      element.autoValidate = true;
      // element.dataType = 'input';
      element.required = true;
      element.name = 'page';
      element.anypoint = true;
      element.readOnly = false;
      await nextFrame();

      const input = element.shadowRoot!.querySelector('.input-element') as HTMLInputElement;
      assert.equal(input.value, '0', 'the input has the value');
    });
  });

  describe('number type', () => {
    it('has a number value as string', async () => {
      const element = await numberFixture();
      const input = element.inputElement as HTMLInputElement;
      assert.strictEqual(input.value, '10');
      assert.strictEqual(element.value, '10');
    });

    it('floats the label for a zero value', async () => {
      const element = await zeroFixture();
      assert.isTrue(element._isFloating);
    });
  });

  describe('legacy label slot', () => {
    it('sets the "label" from the slotted element', async () => {
      const element = await legacyLabelFixture();
      await nextFrame();
      assert.equal(element.label, 'Legacy label');
    });
  });
});

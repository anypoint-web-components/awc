/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';
import './lib/demo-icon.js';
import './lib/interactive-demo.js';
import '../src/define/anypoint-checkbox.js';
import '../src/define/anypoint-radio-button.js';
import '../src/define/anypoint-radio-group.js';
import '../src/colors.js';
import '../src/define/anypoint-button.js';
import '../src/define/anypoint-input.js';
import '../src/define/anypoint-textarea.js';
import '../src/define/anypoint-masked-input.js';
import { demoProperty } from './lib/decorators.js';
import { SupportedInputTypes } from '../src/types.js';

// const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

class ComponentDemo extends DemoPage {
  @demoProperty()
  readonly = false;

  @demoProperty()
  formData?: string;

  @demoProperty()
  textFiledLeading?: boolean;

  @demoProperty()
  textFiledTrailing?: boolean;

  @demoProperty()
  textFieldError?: boolean;

  @demoProperty()
  textFieldInfo?: boolean;

  @demoProperty()
  typeSelector: SupportedInputTypes = 'text';

  @demoProperty()
  textAreaInfo?: boolean;

  @demoProperty()
  textAreaError?: boolean;

  @demoProperty()
  textAreaNoLabelFloat?: boolean;

  @demoProperty()
  mainFiledReadOnly?: boolean;

  @demoProperty()
  mainFiledDisabled?: boolean;

  @demoProperty()
  maskedNoLabelFloat?: boolean;

  @demoProperty()
  maskedDisabled?: boolean;

  @demoProperty()
  maskedReadOnly?: boolean;

  @demoProperty()
  textFiledNoLabelFloat?: boolean;

  constructor() {
    super();
    this.componentName = 'anypoint-input';
  }

  _readonlyHandler(e: any): void {
    this.readonly = e.target.checked;
  }

  _valueHandler(e: any): void {
    const prop = e.target.dataset.target;
    // @ts-ignore
    this[prop] = e.detail.value;
  }

  _formSubmit(e: any): void {
    e.preventDefault();
    const result = {};
    for (let i = 0; i < e.target.elements.length; i++) {
      const node = e.target.elements[i];
      if (!node.name) {
        continue;
      }
      // @ts-ignore
      result[node.name] = node.value;
    }
    this.formData = JSON.stringify(result, null, 2);
  }

  _textFiledAssistiveHandler(e: any): void {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    if (name === 'info') {
      this.textFieldError = false;
      this.textFieldInfo = true;
    } else if (name === 'error') {
      this.textFieldError = true;
      this.textFieldInfo = false;
    } else {
      this.textFieldError = false;
      this.textFieldInfo = false;
    }
  }

  _textAreaAssistiveHandler(e: any): void {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    if (name === 'info') {
      this.textAreaError = false;
      this.textAreaInfo = true;
    } else if (name === 'error') {
      this.textAreaError = true;
      this.textAreaInfo = false;
    } else {
      this.textAreaError = false;
      this.textAreaInfo = false;
    }
  }

  _textFiledTypeHandler(e: any): void {
    const { name, checked } = e.target;
    if (!checked) {
      return;
    }
    this.typeSelector = name;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      textFiledLeading,
      textFiledTrailing,
      textFiledNoLabelFloat,
      textFieldInfo,
      textFieldError,
      mainFiledReadOnly,
      mainFiledDisabled
    } = this;
    const infoMessage = textFieldInfo ? 'Assistive text label' : undefined;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the text field element with various
          configuration options.
        </p>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-input
            slot="content"
            name="main"
            title="Text field"
            ?outlined="${outlined}"
            ?anypoint="${anypoint}"
            .infoMessage="${infoMessage}"
            invalidMessage="This value is invalid"
            ?invalid="${textFieldError}"
            ?nolabelfloat="${textFiledNoLabelFloat}"
            ?readOnly="${mainFiledReadOnly}"
            ?disabled="${mainFiledDisabled}"
          >
            <label slot="label">Label</label>
            ${textFiledLeading ? html`
                  <demo-icon icon="infoOutline" slot="prefix"></demo-icon>
                `
              : undefined}
            ${textFiledTrailing ? html`
                  <demo-icon icon="clear" slot="suffix"></demo-icon>
                `
              : undefined}
          </anypoint-input>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="textFiledLeading"
            @change="${this._toggleMainOption}"
            >Leading icon</anypoint-checkbox
          >
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="textFiledTrailing"
            @change="${this._toggleMainOption}"
            >Trailing icon</anypoint-checkbox
          >
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="textFiledNoLabelFloat"
            @change="${this._toggleMainOption}"
            >No label float</anypoint-checkbox
          >

          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="mainFiledDisabled"
            @change="${this._toggleMainOption}"
            >Disabled</anypoint-checkbox
          >
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="mainFiledReadOnly"
            @change="${this._toggleMainOption}"
            >Read only</anypoint-checkbox
          >

          <label slot="options" id="mainAssistiveLabel">Assistive text</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="mainAssistiveLabel"
          >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              checked
              name="none"
              >None</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              name="info"
              >Info message</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledAssistiveHandler}"
              name="error"
              >Error text</anypoint-radio-button
            >
          </anypoint-radio-group>
        </interactive-demo>
      </section>
    `;
  }

  _introductionTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design text field and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Text field allows the user to enter a value into the UI. It can appear
          in a <code>&lt;form&gt;</code> or a dialog.
        </p>
      </section>
    `;
  }

  _usageTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint text field comes with 3 predefined styles:</p>
        <ul>
          <li><b>Filled</b> (normal) - For low emphasis inputs</li>
          <li><b>Outlined</b> - For high emphasis inputs</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/design/components/text-fields.html"
            >text fields</a
          >
          documentation in Material Design documentation for principles and
          anatomy of text fields.
        </p>

        <h3>Choosing the right text field</h3>
        <p>
          Filled and outlined text fields provide the same functionality, so the
          type of text field you use can depend on style alone.
        </p>
        <p>
          Choose the right type that works well with application visual style,
          makes the inputs distinctive from other components like buttons and
          surrounding content, and best accommodates the goals of the UI. Note,
          that outlined buttons have higher emphasis than filled buttons.
          However, do not mix the two types in a single UI region.
        </p>

        <p>
          The anypoint text filed style is for Anypoint native applications for
          easy integration. Every component including this element should expose
          the <code>anypoint</code> property and propagate it to the text filed.
          An application importing the component can simply set this value to
          adjust styling to the general UI.
        </p>

        <h3>Prefixes and suffixes</h3>

        <p>
          Prefix is a widget rendered before the input field. Suffix is a widget
          rendered after the text field.
        </p>

        <p>
          When it make sense a prefix or suffix can be used to suggest right
          input. Fox example in cash amount field input a prefix could be
          <code>$</code> sign which suggest the value is interpreted in US
          dollars.
        </p>

        <anypoint-input name="ex1">
          <label slot="label" aria-label="Amount to transfer in US dollars">Amount to transfer</label>
          <div slot="prefix" aria-hidden="true">$</div>
        </anypoint-input>

        <p>
          Similarly suffix can provide additional information about the format
          of input. For the same cash amount input suffix could render
          <code>.00</code> to suggest that the input is an integer.
        </p>

        <anypoint-input name="ex2">
          <label slot="label" aria-label="Amount to transfer as whole number">Amount to transfer</label>
          <span slot="suffix" aria-hidden="true">.00</span>
        </anypoint-input>

        <p>
          Suffixes can also be active widget. It can be an icon button that
          toggles visibility of the password. Just remember that adding
          interactive suffixes is not a common design pattern and your suffix
          has to have clear meaning to the user.
        </p>

        <anypoint-input type="password" name="ex3">
          <label slot="label" aria-label="Activate the button to show the password">Password</label>
          <anypoint-button slot="suffix"
            onclick="this.parentNode.type='text'"
            >Show</anypoint-button
          >
        </anypoint-input>

        <anypoint-input type="email" name="ex4">
          <label slot="label">Email</label>
          <div slot="suffix">@mulesoft.com</div>
        </anypoint-input>

        <h3>Assistive text</h3>

        <p>
          Assistive text allows the user to better understand what kind of input is
          required. It can be an info message or invalid message when invalid
          input has been detected.
        </p>

        <h4>Info message</h4>
        <p>
          Info message provides the user with additional description for the
          field. It should be used when the label can be confusing or to ensure
          the user about the reason of collecting the input.
        </p>

        <anypoint-input infoMessage="Used to confirm your order." type="email" name="ex5">
          <label slot="label">Email</label>
        </anypoint-input>

        <p>
          Do not try to put too detailed information. The user should be able to
          scan the message in a fraction of a second. Treat it as an additional
          text for the label.
        </p>

        <h4>Invalid message</h4>
        <p>
          Error message should help the user recover from the error state. Use
          clear message with simple instructions of how to fix the problem, for
          example <code>Only letters are allowed.</code>
        </p>

        <anypoint-input
          invalidMessage="Only letters are allowed"
          type="text"
          name="ex6"
          invalid
        >
          <label slot="label">Username</label>
        </anypoint-input>

        <p>
          Note, consider using <code>preventInvalidInput</code> and
          <code>allowedPattern</code>
          in situations like the one above. However, don't be too restrictive
          when using this properties.
        </p>

        <h3>Positioning</h3>
        <p>Each input element has 12 pixels top and bottom margin and 8 pixels left and right margin.</p>
        <p>
          The spacing allows to put multiple controls inside a form without styling it for
          visibility. This can be changed via CSS styling, but please, consider impact of this action
          to other elements which are positioned in the same way.
        </p>
      </section>
    `;
  }

  _typesTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      typeSelector,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Input types</h3>
        <p>
          The component support all native input types.
        </p>

        <interactive-demo
          opened
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-input
            slot="content"
            title="Text field"
            ?outlined="${outlined}"
            ?anypoint="${anypoint}"
            .type="${typeSelector}"
            name="ex7"
          >
            <label slot="label">Text field</label>
          </anypoint-input>

          <label slot="options" id="typesLabel">Input type</label>
          <anypoint-radio-group
            slot="options"
            selectable="anypoint-radio-button"
            aria-labelledby="typesLabel"
          >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              checked
              name="text"
              >Text</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="number"
              >Number</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="password"
              >Password</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="date"
              >Date</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="time"
              >Time</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="datetime-local"
              >Datetime-local</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="month"
              >Month</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="week"
              >Week</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="color"
              >Color</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="email"
              >Email</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="url"
              >URL</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="tel"
              >Tel</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="search"
              >Search</anypoint-radio-button
            >
            <anypoint-radio-button
              @change="${this._textFiledTypeHandler}"
              name="file"
              >File</anypoint-radio-button
            >
          </anypoint-radio-group>
        </interactive-demo>
      </section>
    `;
  }

  _customValidatorsTemplate(): TemplateResult {
    return html`<section class="documentation-section">
      <h3>Validation</h3>

      <h3>Built-in validators</h3>
      <p>
        Preferred way of dealing with validation is to use native input's validation
        properties like <code>required</code>, <code>minLength</code>, <code>maxLength</code>, and so on.
        The element prefers native validation over custom logic as it has a better performance.
      </p>

      <p>
        Use this attributes with combination with <code>autoValidate</code> attribute which
        validates the state on user input
      </p>

      <anypoint-input
        title="This input is required"
        type="text"
        autoValidate
        required
        invalidMessage="The value is required"
      >
        <label slot="label">Required input</label>
      </anypoint-input>

      <anypoint-input
        title="Min and max length"
        type="text"
        autoValidate
        minlength="5"
        maxLength="10"
        invalidMessage="Use 5 to 10 characters"
      >
        <label slot="label">Min and max length</label>
      </anypoint-input>

      <anypoint-input
        title="Min and max number"
        type="number"
        autoValidate
        min="10"
        max="20"
        invalidMessage="Only number in range 10 - 20"
      >
        <label slot="label">Min and max number</label>
      </anypoint-input>

      <anypoint-input
        title="Letters only via pattern"
        type="text"
        autoValidate
        pattern="[a-zA-Z]*"
        invalidMessage="Only letters are allowed"
      >
        <label slot="label">Pattern</label>
      </anypoint-input>

      <anypoint-input
        title="Letters only via pattern"
        type="text"
        allowedPattern="[a-zA-Z]"
        preventInvalidInput
        infoMessage="Prevents non-letter characters"
      >
        <label slot="label">Prevent invalid input</label>
      </anypoint-input>
    </section>`;
  }

  _textareaTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      textAreaInfo,
      textAreaError,
      textAreaNoLabelFloat,
    } = this;
    const infoMessage = textAreaInfo ? 'Assistive text label' : undefined;
    return html`<section class="documentation-section">
      <h3>Text area field</h3>
      <p>
        Text area field focuses user attention on entering more complex text input.
      </p>

      <p>
        It does not accept prefixes and suffixes as the user needs an space to
        input the value.
      </p>

      <interactive-demo
        .states="${demoStates}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <section slot="content">
          <anypoint-textarea
            name="main"
            title="Text field"
            ?outlined="${outlined}"
            ?anypoint="${anypoint}"
            .infoMessage="${infoMessage}"
            invalidMessage="This value is invalid"
            ?invalid="${textAreaError}"
            ?nolabelfloat="${textAreaNoLabelFloat}"
          >
            <label slot="label">Label</label>
          </anypoint-textarea>
        </section>

        <label slot="options" id="textAreaOptionsLabel">Options</label>
        <anypoint-checkbox
          aria-describedby="textAreaOptionsLabel"
          slot="options"
          name="textAreaNoLabelFloat"
          @change="${this._toggleMainOption}"
          >No label float</anypoint-checkbox
        >

        <label slot="options" id="areaAssistiveLabel">Assistive text</label>
        <anypoint-radio-group
          slot="options"
          selectable="anypoint-radio-button"
          aria-labelledby="areaAssistiveLabel"
        >
          <anypoint-radio-button
            @change="${this._textAreaAssistiveHandler}"
            checked
            name="none"
            >None</anypoint-radio-button
          >
          <anypoint-radio-button
            @change="${this._textAreaAssistiveHandler}"
            name="info"
            >Info message</anypoint-radio-button
          >
          <anypoint-radio-button
            @change="${this._textAreaAssistiveHandler}"
            name="error"
            >Error text</anypoint-radio-button
          >
        </anypoint-radio-group>
      </interactive-demo>
      <h3>Positioning</h3>
      <p>
        Text area field should be the only element in a row.
        The user may choose to resize the text area using native resize control.
        You should not make that decision on behalf of the user.
        Additional UI widgets placed aside of the text area may obscure the view
        and make providing input harder to some users.
      </p>
      </section>`;
  }

  _maskedInputTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      maskedNoLabelFloat,
      maskedDisabled,
      maskedReadOnly,
    } = this;

    return html`<section class="documentation-section">
      <h3>Masked inputs</h3>
      <p>
        You can mask the input and toggle value visibility by using <code>anypoint-masked-input</code>.
        The input renders an icon to toggle input's visibility.
      </p>

      <interactive-demo
        .states="${demoStates}"
        @state-changed="${this._demoStateHandler}"
        ?dark="${darkThemeActive}"
      >
        <section slot="content">
          <anypoint-masked-input
            name="main"
            title="Text field"
            ?outlined="${outlined}"
            ?anypoint="${anypoint}"
            ?nolabelfloat="${maskedNoLabelFloat}"
            ?disabled="${maskedDisabled}"
            ?readOnly="${maskedReadOnly}"
          >
            <label slot="label">Label</label>
          </anypoint-masked-input>
        </section>

        <label slot="options" id="maskedOptionsLabel">Options</label>
        <anypoint-checkbox
          aria-describedby="maskedOptionsLabel"
          slot="options"
          name="maskedNoLabelFloat"
          @change="${this._toggleMainOption}"
          >No label float</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="maskedOptionsLabel"
          slot="options"
          name="maskedDisabled"
          @change="${this._toggleMainOption}"
          >Disabled</anypoint-checkbox
        >
        <anypoint-checkbox
          aria-describedby="maskedOptionsLabel"
          slot="options"
          name="maskedReadOnly"
          @change="${this._toggleMainOption}"
          >Read only</anypoint-checkbox
        >
      </interactive-demo>
    </section>`;
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint text field</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
      ${this._typesTemplate()}
      ${this._customValidatorsTemplate()}
      ${this._textareaTemplate()}
      ${this._maskedInputTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();

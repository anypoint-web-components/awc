/* eslint-disable class-methods-use-this */
import { html, LitElement } from 'lit-element';
import 'prismjs/prism.js';
import 'prismjs/components/prism-markdown.min.js';
import './SharedStyles.js';
import { styles, prismStyles } from './DemoHelperStyles.js';

export default class DemoHelperElement extends LitElement {
  static get styles() {
    return [styles, prismStyles];
  }

  set markdown(value) {
    this._markdown = value;
    this._highlight(value);
  }

  get markdown() {
    return this._markdown;
  }

  constructor() {
    super();
    this._slotChangeHandler = this._slotChangeHandler.bind(this);
    this._firstUpdated = false;
    this.ignoreSlotChange = false;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this._firstUpdated || this.ignoreSlotChange) {
      return;
    }
    this._registerSlotListener();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const slot = this.shadowRoot.querySelector('#content');
    slot.removeEventListener('slotchange', this._slotChangeHandler);
  }

  firstUpdated() {
    this._firstUpdated = true;
    this._registerSlotListener();
  }

  _registerSlotListener() {
    const slot = this.shadowRoot.querySelector('#content');
    if (!slot) {
      return;
    }
    slot.addEventListener('slotchange', this._slotChangeHandler);
  }

  _slotChangeHandler() {
    this._updateContent();
  }

  _updateContent() {
    const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector('#content'));
    const template = /** @type HTMLTemplateElement */ (slot.assignedNodes().find((node) => node.nodeName === 'TEMPLATE'));
    if (!template) {
      return;
    }
    let snippet = this.unindent(template.innerHTML);
    // Hack: In safari + shady dom, sometime we get an empty 'class' attribute.
    // if we do, delete it.
    snippet = snippet.replace(/ class=""/g, '');

    // Boolean properties are displayed as checked="", so remove the ="" bit.
    snippet = snippet.replace(/=""/g, '');

    this.markdown = snippet;
    slot.removeEventListener('slotchange', this._slotChangeHandler);
    this.appendChild(document.importNode(template.content, true));
    this.ignoreSlotChange = true;
  }

  /**
   * @param {string} text 
   * @returns {string}
   */
  unindent(text) {
    if (!text) {
      return text;
    }
    const lines = text.replace(/\t/g, '  ').split('\n');
    const indent = lines.reduce((prev, line) => {
      if (/^\s*$/.test(line)) {
        return prev; // Completely ignore blank lines.
      }
      const lineIndent = line.match(/^(\s*)/)[0].length;
      if (prev === null) {
        return lineIndent;
      }
      // @ts-ignore
      return lineIndent < prev ? /* istanbul ignore next */ lineIndent : prev;
    }, null);

    return lines.map((l) => l.substr(Number(indent))).join('\n');
  }

   /**
   * @param {string} code 
   */
  _highlight(code) {
    /* global Prism */
    // @ts-ignore
    const grammar = Prism.languages.markdown;
    const lang = 'markdown';
    const env = {
      code,
      grammar,
      language: lang
    };
    // @ts-ignore
    Prism.hooks.run('before-highlight', env);
    // @ts-ignore
    const result = Prism.highlight(code, grammar, lang);
    this.shadowRoot.querySelector('code').innerHTML = result;
  }

  _copyToClipboard() {
    const button = this.shadowRoot.querySelector('#copyButton');
    const snipRange = document.createRange();
    snipRange.selectNodeContents(this.shadowRoot.querySelector('.code'));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(snipRange);
    let result = false;
    try {
      result = document.execCommand('copy');
      button.textContent = 'done';
    } catch (err) {
      // Copy command is not available
      /* istanbul ignore next: It is really hard to get here */
      button.textContent = 'error';
    }

    // Return to the copy button after a second.
    setTimeout(this._resetCopyButtonState.bind(this), 1000);

    selection.removeAllRanges();
    return result;
  }

  _resetCopyButtonState() {
    this.shadowRoot.querySelector('#copyButton').textContent = 'copy';
  }

  render() {
    return html`
    <div class="demo">
      <slot id="content"></slot>
      <div id="demoContent"></div>
    </div>
    <div class="code-container">
      <code class="code"></code>
      <button id="copyButton" title="copy to clipboard" @click="${this._copyToClipboard}">Copy</button>
    </div>
    `;
  }
}

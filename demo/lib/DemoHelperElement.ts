/* eslint-disable class-methods-use-this */
import { html, LitElement, CSSResult, TemplateResult } from 'lit';
import 'prismjs/prism';
import 'prismjs/components/prism-markdown.min';
import './SharedStyles.js';
import { styles, prismStyles } from './DemoHelperStyles.js';

export default class DemoHelperElement extends LitElement {
  static get styles(): CSSResult[] {
    return [styles, prismStyles];
  }

  _markdown?: string;

  set markdown(value: string | undefined) {
    this._markdown = value;
    if (value) {
      this._highlight(value);
    }
  }

  get markdown(): string | undefined {
    return this._markdown;
  }

  _firstUpdated = false;

  ignoreSlotChange = false;

  constructor() {
    super();
    this._slotChangeHandler = this._slotChangeHandler.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._firstUpdated || this.ignoreSlotChange) {
      return;
    }
    this._registerSlotListener();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const slot = this.shadowRoot!.querySelector('#content') as HTMLSlotElement;
    slot.removeEventListener('slotchange', this._slotChangeHandler);
  }

  firstUpdated(): void {
    this._firstUpdated = true;
    this._registerSlotListener();
  }

  _registerSlotListener(): void {
    const slot = this.shadowRoot!.querySelector('#content');
    if (!slot) {
      return;
    }
    slot.addEventListener('slotchange', this._slotChangeHandler);
  }

  _slotChangeHandler(): void {
    this._updateContent();
  }

  _updateContent(): void {
    const slot = this.shadowRoot!.querySelector('#content') as HTMLSlotElement;
    const template = slot.assignedNodes().find((node) => node.nodeName === 'TEMPLATE') as HTMLTemplateElement | undefined;
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

  unindent(text: string): string {
    if (!text) {
      return text;
    }
    const lines = text.replace(/\t/g, '  ').split('\n');
    const indent = lines.reduce((prev, line): number => {
      if (/^\s*$/.test(line)) {
        return prev; // Completely ignore blank lines.
      }
      const matcher = line.match(/^(\s*)/);
      if (!matcher) {
        return prev;
      }
      const lineIndent = matcher[0].length;
      if (prev === null) {
        return lineIndent;
      }
      // @ts-ignore
      return lineIndent < prev ? /* istanbul ignore next */ lineIndent : prev;
    }, 0);

    return lines.map((l) => l.substr(Number(indent))).join('\n');
  }

  _highlight(code: string): void {
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
    const node = this.shadowRoot!.querySelector('code') as HTMLElement;
    node.innerHTML = result;
  }

  _copyToClipboard(): boolean {
    const button = this.shadowRoot!.querySelector('#copyButton') as HTMLElement;
    const snipRange = document.createRange();
    snipRange.selectNodeContents(this.shadowRoot!.querySelector('.code') as HTMLElement);
    const selection = window.getSelection()!;
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

  _resetCopyButtonState(): void {
    const node = this.shadowRoot!.querySelector('#copyButton') as HTMLElement;
    node.textContent = 'copy';
  }

  render(): TemplateResult {
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

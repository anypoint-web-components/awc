/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
import { html, LitElement, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import './demo-icon.js';
import '../../src/define/anypoint-tabs.js';
import '../../src/define/anypoint-tab.js';
import '../../src/define/anypoint-button.js';
import '../../src/define/anypoint-icon-button.js';
import styles from './InteractiveStyles.js';
import { AnypointTabsElement } from '../../src/index.js';

export default class InteractiveDemoElement extends LitElement {
  static get styles(): CSSResult {
    return styles;
  }

  /**
   * The list of general style states for the element.
   * It renders list of tabs with labels from this array.
   */
  @property({ type: Array })
  states: string[] = [];

  /**
   * When set it renders the component in dark theme.
   */
  @property({ type: Boolean, reflect: true })
  dark = false;
  
  /**
   * @returns {AnypointTabsElement}
   */
  get tabs(): AnypointTabsElement {
    return this.shadowRoot!.querySelector('anypoint-tabs') as AnypointTabsElement;
  }

  protected _selectedState = 0;

  /**
   * Currently selected state's index in the `states` array.
   * Change dispatches `state-changed` custom event.
   */
  @property({ type: Number })
  get selectedState(): number {
    return this._selectedState;
  }

  set selectedState(value: number) {
    const old = this._selectedState;
    if (old === value) {
      return;
    }
    this._selectedState = value;
    this.requestUpdate('selectedState', old);
    this.dispatchEvent(new CustomEvent('state-changed', {
      detail: {
        value,
        state: this.states[value]
      }
    }));
  }

  _opened = false;

  /**
   * True when the configuration panel is opened.
   */
  @property({ type: Boolean })
  get opened(): boolean {
    return this._opened;
  }

  set opened(value: boolean) {
    const old = this._opened;
    if (old === value) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._updateTabsAnimation();
    this._updateOptionsTabindex();
  }

  firstUpdated(): void {
    this._updateOptionsTabindex();
  }

  _stateChangeHandler(e: Event): void {
    const index = Number((e.target as AnypointTabsElement).selected);
    this.selectedState = Number.isNaN(index) ? 0 : index;
  }

  _toggleOptions(): void {
    this.opened = !this.opened;
  }

  _updateTabsTimer: any;

  _updateTabsAnimation(): void {
    if (this._updateTabsTimer) {
      clearTimeout(this._updateTabsTimer);
    }
    this._updateTabsTimer = setTimeout(() => {
      this._updateTabsTimer = undefined;
      // @ts-ignore
      this.tabs.notifyResize();
    }, 120);
  }

  _updateOptionsTabindex(): void {
    if (!this.shadowRoot) {
      return;
    }
    const slot = this.shadowRoot.querySelector('slot[name="options"]') as HTMLSlotElement;
    if (!slot) {
      return;
    }
    const nodes = slot.assignedNodes();
    const { opened } = this;
    Array.from(nodes).forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      const typedElement = node as HTMLElement;
      if (opened) {
        this._activateOptionNode(typedElement);
      } else {
        this._deactivateOptionNode(typedElement);
      }
    });
  }

  _activateOptionNode(node: HTMLElement): void {
    const old = node.dataset.oldTabindex;
    if (!old) {
      return;
    }
    node.setAttribute('tabindex', old);
    node.setAttribute('aria-hidden', 'false');
    delete node.dataset.oldTabindex;
  }

  _deactivateOptionNode(node: HTMLElement): void {
    const current = node.getAttribute('tabindex');
    if (!current) {
      return;
    }
    node.dataset.oldTabindex = current;
    node.setAttribute('tabindex', '-1');
    node.setAttribute('aria-hidden', 'true');
  }

  render(): TemplateResult {
    return html`
    <div class="demo-content">
      <div class="content-selector">
        ${this._tabsTemplate()}
        ${this._triggerTemplate()}
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
    ${this._configTemplate()}
    `;
  }

  _tabsTemplate(): TemplateResult {
    const { states, selectedState } = this;
    return html`
    <anypoint-tabs
      .selected="${selectedState}"
      @selectedchange="${this._stateChangeHandler}"
      aria-label="Element state selection">
      ${states.map((item) => html`
        <anypoint-tab
          aria-label="Activate to enable state ${item}"
        >${item}</anypoint-tab>
      `)}
    </anypoint-tabs>`;
  }

  _triggerTemplate(): TemplateResult {
    const { opened } = this;
    return html`<anypoint-button
      ?hidden=${opened}
      @click="${this._toggleOptions}"
      tabindex="${opened ? '-1' : '0'}"
      aria-label="Toggle configuration options"
      aria-controls="cnfPanel"
    >Options</anypoint-button>`;
  }

  _configTemplate(): TemplateResult {
    const { opened } = this;
    const css = opened ? 'opened' : '';
    const hdn = opened ? 'false' : 'true';
    return html`
    <div id="cnfPanel" class="demo-config ${css}" aria-hidden="${hdn}">
      <div class="config-title">
        <h3>Configuration</h3>
        <anypoint-icon-button
          title="Close panel"
          aria-label="Close configuration panel"
          tabindex="${opened ? '0' : '-1'}"
          @click="${this._toggleOptions}"
        >
          <demo-icon icon="close"></demo-icon>
        </anypoint-icon-button>
      </div>
      <div class="options">
        <slot name="options"></slot>
      </div>
    </div>`;
  }
}

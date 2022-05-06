import { html, css, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import MenuElement from '../selector/MenuElement';

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */

let globalId = 1;

/**
 * Ensures the node to have an ID.
 * It is later used with aria attributes.
 */
export const ensureNodeId = (node: HTMLElement): void => {
  if (!node.id) {
    node.id = `anypointlistbox-${globalId}`;
    globalId++;
  }
};

/**
 * @slot - The content of the list box
 */
export default class AnypointListboxElement extends MenuElement {
  static get styles(): CSSResult {
    return css`
      :host {
        display: block;
        padding: var(--anypoint-listbox-padding, 0);
        background-color: var(
          --anypoint-listbox-background-color,
          var(--primary-background-color)
        );
        color: var(--anypoint-listbox-color, var(--primary-text-color));
      }

      :host ::slotted(.selected) {
        font-weight: 700;
      }
    `;
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  constructor() {
    super();
    this._selectHandler = this._selectHandler.bind(this);
    this._deselectHandler = this._deselectHandler.bind(this);
  }

  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listbox');
    }
    this.setAttribute('aria-activedescendant', '');
    super.connectedCallback();
    this.addEventListener('select', this._selectHandler);
    this.addEventListener('deselect', this._deselectHandler);

    this._initSelection();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('select', this._selectHandler);
    this.removeEventListener('deselect', this._deselectHandler);
  }

  firstUpdated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(cp);
    const { anypoint } = this;
    if (anypoint) {
      this._updateChildrenAnypoint(anypoint);
    }
  }

  protected anypointChanged(value?: boolean): void {
    super.anypointChanged(value);
    this._updateChildrenAnypoint(value);
  }

  /**
   * Initializes `aria-activedescendant` when element is attached to the DOM.
   */
  _initSelection(): void {
    if (this.selectedItem) {
      this._setActiveDescendant(this.selectedItem);
    }
  }

  /**
   * Sets `aria-activedescendant` value to selected element's id.
   */
  _selectHandler(e: Event): void {
    const typed = e as CustomEvent;
    const { item } = typed.detail;
    this._setActiveDescendant(item);
  }

  /**
   * Sets `aria-activedescendant` value to node's id.
   */
  _setActiveDescendant(node: HTMLElement): void {
    ensureNodeId(node);
    this.setAttribute('aria-activedescendant', node.id);
  }

  /**
   * Removes `aria-activedescendant` from the element when item is
   * deselected.
   */
  _deselectHandler(): void {
    this.setAttribute('aria-activedescendant', '');
  }

  /**
   * Updates `anypoint` state on children.
   * This is a convenience method to set `anypoint` property on this element
   * and propagate it on children instead of setting this property on each
   * item separately.
   * @param anypoint Current state of `anypoint` property
   */
  _updateChildrenAnypoint(anypoint?: boolean): void {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) {
      return;
    }
    const nodes = slot.assignedNodes();
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i] as HTMLElement;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      if (anypoint) {
        node.setAttribute('anypoint', '');
      } else {
        node.removeAttribute('anypoint');
      }
    }
  }
}

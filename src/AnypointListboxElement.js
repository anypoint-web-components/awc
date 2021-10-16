import { html, css, LitElement } from 'lit-element';
import { MenuMixin } from './mixins/MenuMixin.js';

/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */

let globalId = 1;

/**
 * Ensures the node to have an ID.
 * It is later used with aria attributes.
 * @param {HTMLElement} node
 */
export const ensureNodeId = (node) => {
  if (!node.id) {
    node.id = `anypointlistbox-${globalId}`;
    globalId++;
  }
};

export default class AnypointListboxElement extends MenuMixin(LitElement) {
  get styles() {
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

  render() {
    return html`<style>${this.styles}</style><slot></slot>`;
  }

  static get properties() {
    return {
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  get compatibility() {
    return this._compatibility;
  }

  set compatibility(value) {
    const old = this._compatibility;
    if (old === value) {
      return;
    }
    this._compatibility = value;
    this._updateChildrenCompatibility(value);
  }

  constructor() {
    super();
    this._selectHandler = this._selectHandler.bind(this);
    this._deselectHandler = this._deselectHandler.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listbox');
    }
    this.setAttribute('aria-activedescendant', '');
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('select', this._selectHandler);
    this.addEventListener('deselect', this._deselectHandler);

    this._initSelection();
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('select', this._selectHandler);
    this.removeEventListener('deselect', this._deselectHandler);
  }

  firstUpdated() {
    const { compatibility } = this;
    if (compatibility) {
      this._updateChildrenCompatibility(compatibility);
    }
  }

  /**
   * Initializes `aria-activedescendant` when element is attached to the DOM.
   */
  _initSelection() {
    // @ts-ignore
    if (this.selectedItem) {
      // @ts-ignore
      this._setActiveDescendant(this.selectedItem);
    }
  }

  /**
   * Sets `aria-activedescendant` value to selected element's id.
   * @param {CustomEvent} e
   */
  _selectHandler(e) {
    const { item } = e.detail;
    this._setActiveDescendant(item);
  }

  /**
   * Sets `aria-activedescendant` value to node's id.
   * @param {HTMLElement} node
   */
  _setActiveDescendant(node) {
    ensureNodeId(node);
    this.setAttribute('aria-activedescendant', node.id);
  }

  /**
   * Removes `aria-activedescendant` from the element when item is
   * deselected.
   */
  _deselectHandler() {
    this.setAttribute('aria-activedescendant', '');
  }

  /**
   * Updates `compatibility` state on children.
   * This is a convenience method to set `compatibility` property on this element
   * and propagate it on children instead of setting this property on each
   * item separately.
   * @param {Boolean} compatibility Current state of `compatibility` property
   */
  _updateChildrenCompatibility(compatibility) {
    const slot = this.shadowRoot.querySelector('slot');
    if (!slot) {
      return;
    }
    const nodes = slot.assignedNodes();
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = /** @type HTMLElement */ (nodes[i]);
      if (node.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
      if (compatibility) {
        node.setAttribute('compatibility', '');
      } else {
        node.removeAttribute('compatibility');
      }
    }
  }
}

import { LitElement, TemplateResult } from 'lit-element';
import { MenuMixin } from './mixins/MenuMixin';
import { MultiSelectableMixin } from './mixins/MultiSelectableMixin';
import { SelectableMixin } from './mixins/SelectableMixin';
/**
 * Ensures the node to have an ID.
 * It is later used with aria attributes.
 */
export declare function ensureNodeId(node: HTMLElement): void;

export default class AnypointListboxElement extends MenuMixin(SelectableMixin(MultiSelectableMixin(LitElement))) {
  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * Enables compatibility with Anypoint components.
   * @deprecated Use `compatibility` instead.
   */
  legacy: boolean;
  render(): TemplateResult;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(): void;
  _initSelection(): void;
  _selectHandler(e: CustomEvent): void;
  _setActiveDescendant(node: HTMLElement): void;
  _deselectHandler(): void;
  _updateChildrenCompatibility(compatibility: boolean): void;
}

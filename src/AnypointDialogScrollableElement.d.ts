import { TemplateResult, LitElement } from 'lit-element';
import AnypointDialogElement from './AnypointDialogElement';

export default class AnypointDialogScrollable extends LitElement {
  /**
   * Parent element to this element.
   */
  dialogElement: AnypointDialogElement;

  /**
   * Returns the scrolling element.
   */
  readonly scrollTarget: HTMLElement;

  firstUpdated(): void;

  _ensureTarget(): void;

  updateScrollState(): void;

  _toggleClass(styles: string, add: boolean): void;

  render(): TemplateResult;
}

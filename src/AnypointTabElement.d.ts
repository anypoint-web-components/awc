import { TemplateResult } from 'lit-element';
import AnypointButtonElement from './AnypointButtonElement';

export default class AnypointTabElement extends AnypointButtonElement {
  /**
   * If true, the tab will forward keyboard clicks (enter/space) to the first anchor element found in its descendants
   * @attribute
   */
  link: boolean;

  connectedCallback(): void;

  disconnectedCallback(): void;

  _clickHandler(e: MouseEvent): void;

  render(): TemplateResult;
}

import {TemplateResult, LitElement} from 'lit-element';
import { AnypointTabsElement } from '../../';

/**
 * @fires state-changed An event dispatched when selected demo state change
 */
export default class ArcInteractiveDemo extends LitElement {
  /**
   * True when the configuration panel is opened.
   * @attribute
   */
  opened: boolean;
  /**
   * The list of general style states for the element.
   * It renders list of tabs with labels from this array.
   */
  states: string[];
  /**
   * Currently selected state's index in the `states` array.
   * Change dispatches `state-changed` custom event.
   * @attribute
   */
  selectedState: number;
  _selectedState: number;
  /**
   * When set it renders the component in dark theme.
   * @attribute
   */
  dark: boolean;
  
  readonly tabs: AnypointTabsElement;
  _updateTabsTimer: number;
  
  constructor();
  firstUpdated(): void;
  _stateChangeHandler(e: CustomEvent): void;
  _toggleOptions(): void;
  _updateTabsAnimation(): void;
  _updateOptionsTabindex(): void;
  _activateOptionNode(node: HTMLElement): void;
  _deactivateOptionNode(node: HTMLElement): void;
  render(): TemplateResult;
  _tabsTemplate(): TemplateResult;
  _triggerTemplate(): TemplateResult;
  _configTemplate(): TemplateResult;
}

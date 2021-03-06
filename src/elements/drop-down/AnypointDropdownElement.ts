import { html, css, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import OverlayElement from '../overlay/OverlayElement.js';
import { IAnimationConfig, DefaultListCloseAnimation, DefaultListOpenAnimation } from '../../lib/Animations.js';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */

/**
 * @slot dropdown-content - The content for the drop down
 */
export default class AnypointDropdownElement extends OverlayElement {
  static get styles(): CSSResult {
    return css`
    :host {
      position: fixed;
    }

    .contentWrapper ::slotted(*) {
      overflow: auto;
    }

    .contentWrapper.animating ::slotted(*) {
      overflow: hidden;
      pointer-events: none;
    }
    `;
  }

  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   */
  @property({ type: Array }) openAnimationConfig?: IAnimationConfig[];

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   */
  @property({ type: Array }) closeAnimationConfig?: IAnimationConfig[];

  /**
   * If provided, this will be the element that will be focused when
   * the dropdown opens.
   */
  @property({ type: Object }) focusTarget?: HTMLElement;

  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) noAnimations?: boolean;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * This property is a shortcut to set `scrollAction` to lock or refit.
   * Prefer directly setting the `scrollAction` property.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) allowOutsideScroll?: boolean;

  /**
   * The element that is contained by the dropdown, if any.
   */
  get containedElement(): HTMLElement | null {
    const slot = this.shadowRoot!.querySelector('slot');
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedNodes({ flatten: true });
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return nodes[i] as HTMLElement;
      }
    }
    return null;
  }

  get contentWrapper(): HTMLElement | null {
    return this.shadowRoot!.querySelector('.contentWrapper');
  }

  _activeAnimations?: Animation[];

  constructor() {
    super();
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.allowOutsideScroll = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Ensure scrollAction is set.
    if (!this.scrollAction) {
      this.scrollAction = this.allowOutsideScroll ? 'refit' : 'lock';
    }
  }

  firstUpdated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(cp);
    requestAnimationFrame(() => {
      this._setupSizingTarget();
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cancelAnimation();
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('positionTarget') || cp.has('verticalAlign') || cp.has('horizontalAlign') || cp.has('verticalOffset') || cp.has('horizontalOffset')) {
      this._updateOverlayPosition();
    }
    if (cp.has('allowOutsideScroll')) {
      this._allowOutsideScrollChanged();
    }
    if (cp.has('opened')) {
      if (this.opened && this.disabled) {
        this.opened = false;
      }
    }
  }

  _setupSizingTarget(): void {
    if (!this.sizingTarget || this.sizingTarget === this) {
      this.sizingTarget = this.containedElement || this;
    }
  }

  _updateOverlayPosition(): void {
    // from OverlayElement
    if (this._isAttached) {
      // from ResizableElement
      this.notifyResize();
    }
  }

  _openedChanged(): void {
    if (this.opened && this.disabled) {
      // from OverlayElement
      this.cancel();
    } else {
      this.cancelAnimation();
      super._openedChanged();
    }
  }

  _renderOpened(): void {
    if (!this.noAnimations) {
      const wrap = this.contentWrapper;
      if (wrap) {
        wrap.classList.add('animating');
      }
      this.playAnimation('open');
    } else {
      super._renderOpened();
    }
  }

  _renderClosed(): void {
    if (!this.noAnimations) {
      const wrap = this.contentWrapper;
      if (wrap) {
        wrap.classList.add('animating');
      }
      this.playAnimation('close');
    } else {
      super._renderClosed();
    }
  }

  /**
   * Called when animation finishes on the dropdown (when opening or
   * closing). Responsible for "completing" the process of opening or
   * closing the dropdown by positioning it or setting its display to
   * none.
   */
  _onAnimationFinish(): void {
    this._activeAnimations = undefined;
    const wrap = this.contentWrapper;
    if (wrap) {
      wrap.classList.remove('animating');
    }
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
    }
  }

  /**
   * Sets scrollAction according to the value of allowOutsideScroll.
   * Prefer setting directly scrollAction.
   */
  _allowOutsideScrollChanged(): void {
    const { allowOutsideScroll } = this;
    // Wait until initial values are all set.
    if (!this._isAttached) {
      return;
    }
    if (!allowOutsideScroll) {
      this.scrollAction = 'lock';
    } else if (!this.scrollAction || this.scrollAction === 'lock') {
      this.scrollAction = 'refit';
    }
  }

  _applyFocus(): void {
    const focusTarget = this.focusTarget || this.containedElement;
    if (focusTarget && this.opened && !this.noAutoFocus) {
      focusTarget.focus();
    } else {
      super._applyFocus();
    }
  }

  playAnimation(name: 'open' | 'close'): void {
    if (window.KeyframeEffect === undefined) {
      this._onAnimationFinish();
      return;
    }

    const node = this.containedElement;
    if (!node) {
      return;
    }
    let origin: string;
    switch (this.verticalAlign) {
      case 'bottom': origin = '100%'; break;
      case 'middle': origin = '50%'; break;
      default: origin = '0%';
    }
    this._setPrefixedProperty(node, 'transformOrigin', `0% ${origin}`);
    let results;
    if (name === 'open') {
      results = this._configureStartAnimation(node, this.openAnimationConfig);
    } else if (name === 'close') {
      results = this._configureEndAnimation(node, this.closeAnimationConfig);
    }
    if (!results || !results.length) {
      this._onAnimationFinish();
      return;
    }
    this._activeAnimations = results;
  }

  cancelAnimation(): void {
    if (!this._activeAnimations) {
      return;
    }
    this._activeAnimations.forEach((anim) => {
      if (anim && anim.cancel) {
        anim.cancel();
      }
    });
    this._activeAnimations = [];
  }

  _runEffects(node: HTMLElement, config: IAnimationConfig[]): Animation[] {
    const results: Animation[] = [];
    for (let i = 0; i < config.length; i++) {
      const options = config[i];
      try {
        this.__runAnimation(node, options, results);
      } catch (_) {
        continue;
      }
    }
    return results;
  }

  __runAnimation(node: HTMLElement, options: IAnimationConfig, results: Animation[]): void {
    const result = node.animate(options.keyframes, options.timing);
    results[results.length] = result;
    result.onfinish = (): void => {
      result.onfinish = null;
      const index = results.findIndex((item) => item === result);
      results.splice(index, 1);
      if (!results.length) {
        this._onAnimationFinish();
      }
    };
  }

  _configureStartAnimation(node: HTMLElement, config: IAnimationConfig[] = DefaultListOpenAnimation): Animation[] | null {
    if (window.KeyframeEffect === undefined || !config) {
      return null;
    }
    return this._runEffects(node, config);
  }

  _configureEndAnimation(node: HTMLElement, config: IAnimationConfig[] = DefaultListCloseAnimation): Animation[] | null {
    if (window.KeyframeEffect === undefined || !config) {
      return null;
    }
    return this._runEffects(node, config);
  }

  _setPrefixedProperty(node: HTMLElement, prop: string, value: string): void {
    const map = {
      transform: ['webkitTransform'],
      transformOrigin: ['mozTransformOrigin', 'webkitTransformOrigin']
    };
    // @ts-ignore
    const prefixes = map[prop];
    for (let index = 0, len = prefixes.length; index < len; index++) {
      const prefix = prefixes[index];
      node.style[prefix] = value;
    }
    // @ts-ignore
    node.style[prop] = value;
  }

  render(): TemplateResult {
    return html`
    <div class="contentWrapper">
      <slot name="dropdown-content"></slot>
    </div>
    `;
  }
}

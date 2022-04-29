import { html, CSSResult, TemplateResult } from 'lit';
import { property, state, eventOptions } from 'lit/decorators.js';
import AnypointTabElement from './AnypointTabElement.js';
import '../define/anypoint-icon-button.js';
import styles from '../styles/TabsStyles.js';
import MenubarElement from './selector/MenubarElement.js';

/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

/**
 * Calculates value in percentages
 * @param w Element width
 * @param w0 Parent width
 * @return The percentage of element's width relative to parent.
 */
export function calcPercent(w: number, w0: number): number {
  return (100 * w) / w0;
}

/**
 * Tabs for anypoint web components
 */
export default class AnypointTabsElement extends MenubarElement {
  static get styles(): CSSResult | CSSResult[] {
    return styles;
  }

  /**
   * If true, the bottom bar to indicate the selected tab will not be shown.
   */
  @property({ type: Boolean }) noBar?: boolean;

  /**
   * If true, the slide effect for the bottom bar is disabled.
   */
  @property({ type: Boolean, reflect: true }) noSlide?: boolean;

  /**
   * If true, tabs are scrollable and the tab width is based on the label
   * width.
   */
  @property({ type: Boolean }) scrollable?: boolean;

  /**
   * If true, tabs expand to fit their container. This currently only applies
   * when scrollable is true.
   */
  @property({ type: Boolean }) fitContainer?: boolean;

  /**
   * If true, dragging on the tabs to scroll is disabled.
   */
  @property({ type: Boolean }) disableDrag?: boolean;

  /**
   * If true, scroll buttons (left/right arrow) will be hidden for scrollable
   * tabs.
   */
  @property({ type: Boolean, reflect: true }) hideScrollButtons?: boolean;

  /**
   * If true, the tabs are aligned to bottom (the selection bar appears at the
   * top).
   */
  @property({ type: Boolean }) alignBottom?: boolean;

  /**
   * If true, tabs are automatically selected when focused using the
   * keyboard.
   */
  @property({ type: Boolean }) autoselect?: boolean;

  /**
   * The delay (in milliseconds) between when the user stops interacting
   * with the tabs through the keyboard and when the focused item is
   * automatically selected (if `autoselect` is true).
   */
  @property({ type: Number }) autoselectDelay = 0;

  @state() _leftHidden?: boolean;

  @state() _rightHidden?: boolean;

  get _contentClass(): string {
    const { scrollable, fitContainer } = this;
    // return scrollable ? 'scrollable' + (fitContainer ? ' fit-container' : '') :
    //                     ' fit-container';
    let result = '';
    if (scrollable) {
      result = 'scrollable';
    }
    if (fitContainer) {
      if (result) {
        result += ' ';
      }
      result += 'fit-container';
    }
    return result;
  }

  get _selectionClass(): string {
    const { noBar, alignBottom } = this;
    if (noBar) {
      return 'hidden';
    }
    if (alignBottom) {
      return 'align-bottom';
    }
    return '';
  }

  get _leftButtonClass(): string {
    const { scrollable, hideScrollButtons } = this;
    return this._computeScrollButtonClass(scrollable, hideScrollButtons);
  }

  get _rightButtonClass(): string {
    const { scrollable, hideScrollButtons } = this;
    return this._computeScrollButtonClass(scrollable, hideScrollButtons);
  }

  __tabsContainer?: HTMLDivElement;

  get _tabsContainer(): HTMLDivElement {
    if (!this.__tabsContainer) {
      this.__tabsContainer = this.shadowRoot!.querySelector('#tabsContainer') as HTMLDivElement;
    }
    return this.__tabsContainer;
  }

  __tabsContent?: HTMLDivElement;

  get _tabsContent(): HTMLDivElement {
    if (!this.__tabsContent) {
      this.__tabsContent = this.shadowRoot!.querySelector('#tabsContent') as HTMLDivElement;
    }
    return this.__tabsContent;
  }

  __selectionBar?: HTMLDivElement;

  get _selectionBar(): HTMLDivElement {
    if (!this.__selectionBar) {
      this.__selectionBar = this.shadowRoot!.querySelector('#selectionBar') as HTMLDivElement;
    }
    return this.__selectionBar;
  }

  get _tabContainerScrollSize(): number {
    const node = this._tabsContainer;
    if (!node) {
      return 0;
    }
    return Math.max(0, node.scrollWidth - node.offsetWidth);
  }

  _step = 10;

  _holdDelay = 1;

  _holdJob: any;

  constructor() {
    super();
    this._sizingHandler = this._sizingHandler.bind(this);
    this._itemsHandler = this._itemsHandler.bind(this);
    this._selectHandler = this._selectHandler.bind(this);
    this._deselectHandler = this._deselectHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);

    this._holdJob = null;
    this._pendingActivationItem = undefined;
    this._pendingActivationTimeout = undefined;
    this.selectable = 'anypoint-tab';
  }

  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist');
    }
    super.connectedCallback();
    this.addEventListener('resize', this._sizingHandler);
    this.addEventListener('itemschange', this._itemsHandler);
    this.addEventListener('select', this._selectHandler);
    this.addEventListener('deselect', this._deselectHandler);
    this.addEventListener('blur', this._blurHandler, true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.__selectionBar = undefined;
    this.__tabsContainer = undefined;
    this.removeEventListener('resize', this._sizingHandler);
    this.removeEventListener('itemschange', this._itemsHandler);
    this.removeEventListener('select', this._selectHandler);
    this.removeEventListener('deselect', this._deselectHandler);
    this.removeEventListener('blur', this._blurHandler);
    this._cancelPendingActivation();
  }

  _itemsHandler(): void {
    this._sizingHandler();
    if (!this.anypoint) {
      return;
    }
    // it is safe to cast this as `selectable` property is set to `anypoint-tab`.
    const items = (this.items || []) as AnypointTabElement[];
    items.forEach((item) => {
      item.noink = true;
    });
  }

  __resizeDebounce?: boolean;

  _sizingHandler(): void {
    if (this.__resizeDebounce) {
      return;
    }
    this.__resizeDebounce = true;
    setTimeout(() => this._updateResized(), 10);
  }

  _previousTab?: HTMLElement;

  _updateResized(): void {
    this.__resizeDebounce = false;
    this._scroll();
    this._tabChanged(this.selectedItem!);
    if (!this._previousTab) {
      this._previousTab = this.selectedItem!;
    }
  }

  _deselectTimer: any;

  _selectHandler(e: Event): void {
    const { detail } = e as CustomEvent;
    this._tabChanged(detail.item, this._previousTab);
    this._previousTab = detail.item;
    if (this._deselectTimer) {
      clearTimeout(this._deselectTimer);
    }
  }

  _deselectHandler(): void {
    if (this._deselectTimer) {
      return;
    }
    this._deselectTimer = setTimeout(() => this._updateDeselect(), 1);
  }

  _blurHandler(e: Event): void {
    if (e.target === this._pendingActivationItem) {
      this._cancelPendingActivation();
    }
  }

  _updateDeselect(): void {
    this._deselectTimer = null;
    this._tabChanged(undefined, this._previousTab);
    this._previousTab = undefined;
  }

  _scroll(dx: number = 0): void {
    if (!this.scrollable || this.disableDrag) {
      return;
    }
    this._affectScroll(dx);
  }

  _affectScroll(dx: number): void {
    const node = this._tabsContainer;
    if (!node) {
      return;
    }
    node.scrollLeft += dx;
    const { scrollLeft } = node;
    this._leftHidden = scrollLeft === 0;
    this._rightHidden = scrollLeft === this._tabContainerScrollSize;
    this._affectScrollButton();
  }

  _affectScrollButton(): void {
    const { scrollWidth, clientWidth } = this._tabsContainer;
    const shouldHideButtons = scrollWidth <= clientWidth;
    if (shouldHideButtons !== this.hideScrollButtons) {
      this.hideScrollButtons = shouldHideButtons;
    }
  }

  _pos?: { width: number, left: number };

  _width?: number;

  _left?: number;

  _tabChanged(tab?: HTMLElement, old?: HTMLElement): void {
    // This is a port of a great work of the Polymer team.
    const bar = this._selectionBar;
    if (!bar) {
      return;
    }
    if (!tab) {
      // Remove the bar without animation.
      bar.classList.remove('expand');
      bar.classList.remove('contract');
      this._positionBar(0, 0);
      return;
    }

    const containerRect = this._tabsContent.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const tabRect = tab.getBoundingClientRect();
    const tabOffsetLeft = tabRect.left - containerRect.left;

    this._pos = {
      width: calcPercent(tabRect.width, containerWidth),
      left: calcPercent(tabOffsetLeft, containerWidth),
    };

    if (this.noSlide || !old) {
      // Position the bar without animation.
      bar.classList.remove('expand');
      bar.classList.remove('contract');
      this._positionBar(this._pos.width, this._pos.left);
      return;
    }

    const oldRect = old.getBoundingClientRect();
    const oldIndex = this.items.indexOf(old);
    const index = this.items.indexOf(tab);
    const m = 5;

    // bar animation: expand
    bar.classList.add('expand');

    let moveRight = oldIndex < index;
    const isRTL = this._isRTL;
    if (isRTL) {
      moveRight = !moveRight;
    }

    if (moveRight) {
      this._positionBar(
        calcPercent(
          tabRect.left + tabRect.width - oldRect.left,
          containerWidth
        ) - m,
        this._left
      );
    } else {
      this._positionBar(
        calcPercent(
          oldRect.left + oldRect.width - tabRect.left,
          containerWidth
        ) - m,
        calcPercent(tabOffsetLeft, containerWidth) + m
      );
    }

    if (this.scrollable) {
      this._scrollToSelectedIfNeeded(tabRect.width, tabOffsetLeft);
    }
  }

  _positionBar(width = 0, left = 0): void {
    width = width || 0;
    left = left || 0;

    this._width = width;
    this._left = left;
    this._selectionBar.style.transform = `translateX(${left}%) scaleX(${
      width / 100
    })`;
  }

  _activateHandler(e: Event): void {
    this._cancelPendingActivation();
    super._activateHandler(e);
  }

  _onKeydown(e: KeyboardEvent): void {
    super._onKeydown(e);
    if (this.autoselect && ['ArrowRight', 'ArrowLeft'].includes(e.code)) {
      this._scheduleActivation(this.focusedItem!, this.autoselectDelay);
    }
  }

  _pendingActivationItem?: HTMLElement;

  _pendingActivationTimeout: any;

  _scheduleActivation(item: HTMLElement, delay: number): void {
    this._pendingActivationItem = item;
    this._pendingActivationTimeout = setTimeout(
      () => this._delayedActivation(),
      delay
    );
  }

  _delayedActivation(): void {
    const item = this._pendingActivationItem;
    this._pendingActivationItem = undefined;
    this._pendingActivationTimeout = undefined;
    if (item) {
      item.dispatchEvent(
        new Event(this.activateEvent, { bubbles: true, cancelable: true })
      );
    }
  }

  _cancelPendingActivation(): void {
    if (this._pendingActivationTimeout !== undefined) {
      clearTimeout(this._pendingActivationTimeout);
      this._pendingActivationItem = undefined;
      this._pendingActivationTimeout = undefined;
    }
  }

  _onBarTransitionEnd(): void {
    const bar = this._selectionBar;
    const cl = bar.classList;
    if (cl.contains('expand')) {
      cl.remove('expand');
      cl.add('contract');
      this._positionBar(this._pos!.width, this._pos!.left);
      // bar animation done
    } else if (cl.contains('contract')) {
      cl.remove('contract');
    }
  }

  anypointChanged(value?: boolean): void {
    const items = (this.items || []) as AnypointTabElement[];
    items.forEach((item) => {
      item.noink = value;
    });
  }

  _scrollToSelectedIfNeeded(tabWidth: number, tabOffsetLeft: number): void {
    const node = this._tabsContainer;
    if (!node) {
      return;
    }
    let left = tabOffsetLeft - node.scrollLeft;
    if (left < 0) {
      node.scrollLeft += left;
    } else {
      left += tabWidth - node.offsetWidth;
      if (left > 0) {
        node.scrollLeft += left;
      }
    }
  }

  _computeScrollButtonClass(scrollable?: boolean, hideScrollButtons?: boolean): string {
    if (!scrollable || hideScrollButtons) {
      return 'hidden';
    }
    return '';
  }

  _onScrollButtonUp(): void {
    clearInterval(this._holdJob);
    this._holdJob = null;
  }

  _onLeftScrollButtonDown(): void {
    this._scrollToLeft();
    this._holdJob = setInterval(this._scrollToLeft.bind(this), this._holdDelay);
  }

  _onRightScrollButtonDown(): void {
    this._scrollToRight();
    this._holdJob = setInterval(
      this._scrollToRight.bind(this),
      this._holdDelay
    );
  }

  _scrollToLeft(): void {
    if (this._leftHidden) {
      this._onScrollButtonUp();
    } else {
      this._affectScroll(-this._step);
    }
  }

  _scrollToRight(): void {
    if (this._rightHidden) {
      this._onScrollButtonUp();
    } else {
      this._affectScroll(this._step);
    }
  }

  __lastTouchX = 0;

  @eventOptions({passive: true})
  _touchMove(e: TouchEvent): void {
    if (!this.scrollable) {
      return;
    }
    const touches = e.changedTouches;
    const touch = touches && touches[0];
    if (!touch) {
      return;
    }
    const ddx = this.__lastTouchX - touch.clientX;
    this.__lastTouchX = touch.clientX;
    this._scroll(ddx);
  }

  @eventOptions({passive: true})
  _touchStart(e: TouchEvent): void {
    if (!this.scrollable) {
      return;
    }
    const { touches } = e;
    const touch = touches && touches[0];
    if (!touch) {
      return;
    }
    this.__lastTouchX = touch.clientX;
  }

  @eventOptions({passive: true})
  _touchEnd(): void {
    if (!this.scrollable) {
      return;
    }
    this.__lastTouchX = 0;
  }

  _leftButtonTemplate(scrollable?: boolean): TemplateResult | string {
    if (!scrollable) {
      return '';
    }
    return html`<anypoint-icon-button
      aria-label="Activate to move tabs left"
      class="${this._leftButtonClass}"
      .disabled="${this._leftHidden}"
      @mouseup="${this._onScrollButtonUp}"
      @mousedown="${this._onLeftScrollButtonDown}"
      tabindex="-1"
    >
      <svg
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        style="pointer-events: none; display: block;"
        class="icon"
      >
        <g><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></g>
      </svg>
    </anypoint-icon-button>`;
  }

  _rightButtonTemplate(scrollable?: boolean): TemplateResult | string {
    if (!scrollable) {
      return '';
    }
    return html`<anypoint-icon-button
      aria-label="Activate to move tabs right"
      class="${this._rightButtonClass}"
      .disabled="${this._rightHidden}"
      @mouseup="${this._onScrollButtonUp}"
      @mousedown="${this._onRightScrollButtonDown}"
      tabindex="-1"
    >
      <svg
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
        style="pointer-events: none; display: block;"
        class="icon"
      >
        <g><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></g>
      </svg>
    </anypoint-icon-button>`;
  }

  _selectionTemplate(): TemplateResult | string {
    return html`<div
      id="selectionBar"
      class="${this._selectionClass}"
      @transitionend="${this._onBarTransitionEnd}"
    ></div>`;
  }

  render(): TemplateResult {
    const { _contentClass, scrollable, } = this;
    return html`
      ${this._leftButtonTemplate(scrollable)}
      <div
        id="tabsContainer"
        @touchstart="${this._touchStart}"
        @touchmove="${this._touchMove}"
        @touchend="${this._touchEnd}"
      >
        <div id="tabsContent" class="${_contentClass}">
          ${this._selectionTemplate()}
          <slot></slot>
        </div>
      </div>
      ${this._rightButtonTemplate(scrollable)} `;
  }
}

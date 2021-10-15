import { html, LitElement } from 'lit-element';
import { ArcResizableMixin } from '@advanced-rest-client/arc-resizable-mixin';
import { MenubarMixin } from './MenubarMixin.js';
import '../anypoint-icon-button.js';
import styles from './styles/TabsStyles.js';

/** @typedef {import('./AnypointTabElement').default} AnypointTabElement */

/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

/**
 * Calculates value in percentages
 * @param {number} w Element width
 * @param {number} w0 Parent width
 * @return {number} The percentage of element's width relative to parent.
 */
export function calcPercent(w, w0) {
  return (100 * w) / w0;
}

/**
 * Tabs for anypoint web components
 */
export default class AnypointTabsElement extends MenubarMixin(ArcResizableMixin(LitElement)) {
  get styles() {
    return styles;
  }

  static get properties() {
    return {
      /**
       * If true, the bottom bar to indicate the selected tab will not be shown.
       */
      noBar: { type: Boolean },
      /**
       * If true, the slide effect for the bottom bar is disabled.
       */
      noSlide: { type: Boolean, reflect: true, },
      /**
       * If true, tabs are scrollable and the tab width is based on the label
       * width.
       */
      scrollable: { type: Boolean },
      /**
       * If true, tabs expand to fit their container. This currently only applies
       * when scrollable is true.
       */
      fitContainer: { type: Boolean },
      /**
       * If true, dragging on the tabs to scroll is disabled.
       */
      disableDrag: { type: Boolean },
      /**
       * If true, scroll buttons (left/right arrow) will be hidden for scrollable
       * tabs.
       */
      hideScrollButtons: { type: Boolean, reflect: true },

      /**
       * If true, the tabs are aligned to bottom (the selection bar appears at the
       * top).
       */
      alignBottom: { type: Boolean },

      /**
       * If true, tabs are automatically selected when focused using the
       * keyboard.
       */
      autoselect: { type: Boolean },

      /**
       * The delay (in milliseconds) between when the user stops interacting
       * with the tabs through the keyboard and when the focused item is
       * automatically selected (if `autoselect` is true).
       */
      autoselectDelay: { type: Number },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean, reflect: true },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },

      _leftHidden: { type: Boolean },
      _rightHidden: { type: Boolean },
    };
  }

  get legacy() {
    return this._compatibility;
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
    this._compatibilityChanged(value);
    this.requestUpdate('compatibility', old);
  }

  get _contentClass() {
    const { scrollable, fitContainer } = this;
    // return scrollable ? 'scrollable' + (fitContainer ? ' fit-container' : '') :
    //                     ' fit-container';
    let klas = '';
    if (scrollable) {
      klas = 'scrollable';
    }
    if (fitContainer) {
      if (klas) {
        klas += ' ';
      }
      klas += 'fit-container';
    }
    return klas;
  }

  get _selectionClass() {
    const { noBar, alignBottom } = this;
    if (noBar) {
      return 'hidden';
    }
    if (alignBottom) {
      return 'align-bottom';
    }
    return '';
  }

  get _leftButtonClass() {
    const { scrollable, hideScrollButtons } = this;
    return this._computeScrollButtonClass(scrollable, hideScrollButtons);
  }

  get _rightButtonClass() {
    const { scrollable, hideScrollButtons } = this;
    return this._computeScrollButtonClass(scrollable, hideScrollButtons);
  }

  get _tabsContainer() {
    if (!this.__tabsContainer) {
      this.__tabsContainer = /** @type HTMLDivElement */ (this.shadowRoot.querySelector(
        '#tabsContainer'
      ));
    }
    return this.__tabsContainer;
  }

  get _tabsContent() {
    if (!this.__tabsContent) {
      this.__tabsContent = /** @type HTMLDivElement */ (this.shadowRoot.querySelector(
        '#tabsContent'
      ));
    }
    return this.__tabsContent;
  }

  get _selectionBar() {
    if (!this.__selectionBar) {
      this.__selectionBar = /** @type HTMLDivElement */ (this.shadowRoot.querySelector(
        '#selectionBar'
      ));
    }
    return this.__selectionBar;
  }

  get _tabContainerScrollSize() {
    const node = this._tabsContainer;
    if (!node) {
      return 0;
    }
    return Math.max(0, node.scrollWidth - node.offsetWidth);
  }

  constructor() {
    super();
    this._sizingHandler = this._sizingHandler.bind(this);
    this._itemsHandler = this._itemsHandler.bind(this);
    this._selectHandler = this._selectHandler.bind(this);
    this._deselectHandler = this._deselectHandler.bind(this);
    this._blurHandler = this._blurHandler.bind(this);
    this._touchStart = this._touchStart.bind(this);
    this._touchEnd = this._touchEnd.bind(this);
    this._touchMove = this._touchMove.bind(this);

    this._holdJob = null;
    this._pendingActivationItem = undefined;
    this._pendingActivationTimeout = undefined;
    this.selectable = 'anypoint-tab';
    this.autoselectDelay = 0;
    this.noBar = false;
    this.noSlide = false;
    this.scrollable = false;
    this.fitContainer = false;
    this.disableDrag = false;
    this.hideScrollButtons = false;
    this.alignBottom = false;
    this.autoselect = false;

    this._step = 10;
    this._holdDelay = 1;
    this._leftHidden = false;
    this._rightHidden = false;

    this._touchstartConfig = {
      handleEvent: this._touchStart,
      passive: true,
    };
    this._touchendConfig = {
      handleEvent: this._touchEnd,
      passive: true,
    };
    this._touchmoveConfig = {
      handleEvent: this._touchMove,
      passive: true,
    };
  }

  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tablist');
    }
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('resize', this._sizingHandler);
    this.addEventListener('iron-resize', this._sizingHandler);
    this.addEventListener('itemschange', this._itemsHandler);
    this.addEventListener('select', this._selectHandler);
    this.addEventListener('deselect', this._deselectHandler);
    this.addEventListener('blur', this._blurHandler, true);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__selectionBar = null;
    this.__tabsContainer = null;
    this.removeEventListener('resize', this._sizingHandler);
    this.removeEventListener('iron-resize', this._sizingHandler);
    this.removeEventListener('itemschange', this._itemsHandler);
    this.removeEventListener('select', this._selectHandler);
    this.removeEventListener('deselect', this._deselectHandler);
    this.removeEventListener('blur', this._blurHandler);
    this._cancelPendingActivation();
  }

  _itemsHandler() {
    this._sizingHandler();
    if (!this.compatibility) {
      return;
    }
    // it is safe to cast this as `selectable` property is set to `anypoint-tab`.
    const items = /** @type AnypointTabElement[] */ (this.items || []);
    items.forEach((item) => {
      item.noink = true;
    });
  }

  _sizingHandler() {
    if (this.__resizeDebounce) {
      return;
    }
    this.__resizeDebounce = true;
    setTimeout(() => this._updateResized(), 10);
  }

  _updateResized() {
    this.__resizeDebounce = false;
    this._scroll();
    this._tabChanged(this.selectedItem);
    if (!this._previousTab) {
      this._previousTab = this.selectedItem;
    }
  }

  _selectHandler(e) {
    const { detail } = e;
    this._tabChanged(detail.item, this._previousTab);
    this._previousTab = detail.item;
    if (this._deselectTimer) {
      clearTimeout(this._deselectTimer);
    }
  }

  _deselectHandler() {
    if (this._deselectTimer) {
      return;
    }
    this._deselectTimer = setTimeout(() => this._updateDeselect(), 1);
  }

  /**
   * @param {Event} e 
   */
  _blurHandler(e) {
    if (e.target === this._pendingActivationItem) {
      this._cancelPendingActivation();
    }
  }

  _updateDeselect() {
    this._deselectTimer = null;
    this._tabChanged(null, this._previousTab);
    this._previousTab = null;
  }

  _scroll(dx) {
    if (!this.scrollable || this.disableDrag) {
      return;
    }
    dx = dx || 0;
    this._affectScroll(dx);
  }

  _affectScroll(dx) {
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

  _affectScrollButton() {
    const { scrollWidth, clientWidth } = this._tabsContainer;
    const shouldHideButtons = scrollWidth <= clientWidth
    if (shouldHideButtons !== this.hideScrollButtons) {
      this.hideScrollButtons = shouldHideButtons;
    }
  }

  _tabChanged(tab, old) {
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

  _positionBar(width, left) {
    width = width || 0;
    left = left || 0;

    this._width = width;
    this._left = left;
    this._selectionBar.style.transform = `translateX(${left}%) scaleX(${
      width / 100
    })`;
  }

  _activateHandler(e) {
    this._cancelPendingActivation();
    super._activateHandler(e);
  }

  _onKeydown(e) {
    super._onKeydown(e);
    if (this.autoselect && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      this._scheduleActivation(this.focusedItem, this.autoselectDelay);
    }
  }

  _scheduleActivation(item, delay) {
    this._pendingActivationItem = item;
    this._pendingActivationTimeout = setTimeout(
      () => this._delayedActivation(),
      delay
    );
  }

  _delayedActivation() {
    const item = this._pendingActivationItem;
    this._pendingActivationItem = undefined;
    this._pendingActivationTimeout = undefined;
    item.dispatchEvent(
      new CustomEvent(this.activateEvent, { bubbles: true, cancelable: true })
    );
  }

  _cancelPendingActivation() {
    if (this._pendingActivationTimeout !== undefined) {
      clearTimeout(this._pendingActivationTimeout);
      this._pendingActivationItem = undefined;
      this._pendingActivationTimeout = undefined;
    }
  }

  _onBarTransitionEnd() {
    const bar = this._selectionBar;
    const cl = bar.classList;
    if (cl.contains('expand')) {
      cl.remove('expand');
      cl.add('contract');
      this._positionBar(this._pos.width, this._pos.left);
      // bar animation done
    } else if (cl.contains('contract')) {
      cl.remove('contract');
    }
  }

  _compatibilityChanged(value) {
    const items = /** @type AnypointTabElement[] */ (this.items || []);
    items.forEach((item) => {
      item.noink = value;
    });
  }

  _scrollToSelectedIfNeeded(tabWidth, tabOffsetLeft) {
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

  _computeScrollButtonClass(scrollable, hideScrollButtons) {
    if (!scrollable || hideScrollButtons) {
      return 'hidden';
    }
    return '';
  }

  _onScrollButtonUp() {
    clearInterval(this._holdJob);
    this._holdJob = null;
  }

  _onLeftScrollButtonDown() {
    this._scrollToLeft();
    this._holdJob = setInterval(this._scrollToLeft.bind(this), this._holdDelay);
  }

  _onRightScrollButtonDown() {
    this._scrollToRight();
    this._holdJob = setInterval(
      this._scrollToRight.bind(this),
      this._holdDelay
    );
  }

  _scrollToLeft() {
    if (this._leftHidden) {
      this._onScrollButtonUp();
    } else {
      this._affectScroll(-this._step);
    }
  }

  _scrollToRight() {
    if (this._rightHidden) {
      this._onScrollButtonUp();
    } else {
      this._affectScroll(this._step);
    }
  }

  /**
   * @param {TouchEvent} e
   */
  _touchMove(e) {
    const touches = e.changedTouches;
    const touch = touches && touches[0];
    if (!touch) {
      return;
    }
    const ddx = this.__lastTouchX - touch.clientX;
    this.__lastTouchX = touch.clientX;
    this._scroll(ddx);
  }

  /**
   * @param {TouchEvent} e
   */
  _touchStart(e) {
    const { touches } = e;
    const touch = touches && touches[0];
    if (!touch) {
      return;
    }
    this.__lastTouchX = touch.clientX;
  }

  _touchEnd() {
    this.__lastTouchX = 0;
  }

  _leftButtonTemplate(scrollable) {
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

  _rightButtonTemplate(scrollable) {
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

  _selectionTemplate() {
    return html`<div
      id="selectionBar"
      class="${this._selectionClass}"
      @transitionend="${this._onBarTransitionEnd}"
    ></div>`;
  }

  render() {
    const {
      _contentClass,
      _touchstartConfig,
      _touchmoveConfig,
      _touchendConfig,
      scrollable,
    } = this;
    const startEvent = scrollable ? _touchstartConfig : undefined;
    const moveEvent = scrollable ? _touchmoveConfig : undefined;
    const endEvent = scrollable ? _touchendConfig : undefined;
    return html`<style>
        ${this.styles}
      </style>
      ${this._leftButtonTemplate(scrollable)}
      <div
        id="tabsContainer"
        @touchstart="${startEvent}"
        @touchmove="${moveEvent}"
        @touchend="${endEvent}"
      >
        <div id="tabsContent" class="${_contentClass}">
          ${this._selectionTemplate()}
          <slot></slot>
        </div>
      </div>
      ${this._rightButtonTemplate(scrollable)} `;
  }
}

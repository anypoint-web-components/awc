/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable class-methods-use-this */
import { html, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement';
import dialogStyles from '../styles/AnypointDialogStyles.js';
import { IAnimationConfig, DefaultListCloseAnimation, DefaultListOpenAnimation } from '../lib/Animations.js';
import { OverlayMixin } from '../mixins/OverlayMixin.js';

interface IModelPreviousConfiguration {
  noCancelOnOutsideClick?: boolean;
  noCancelOnEscKey?: boolean;
  withBackdrop?: boolean;
}
/**
 * @fires cancel
 * @fires opened
 * @fires closed
 * @fires openedchange
 * 
 * @prop {HTMLElement | Window} fitInto
 * @prop {HTMLElement | Window} positionTarget
 * @prop {HTMLElement} sizingTarget
 * 
 * @attr {HorizontalAlign} horizontalAlign
 * @prop {HorizontalAlign | string | undefined} horizontalAlign
 * 
 * @attr {VerticalAlign} horizontalAlign
 * @prop {VerticalAlign | string | undefined} verticalAlign
 * 
 * @attr {boolean} noOverlap
 * @prop {boolean | undefined} noOverlap
 * 
 * @attr {boolean} dynamicAlign
 * @prop {boolean | undefined} dynamicAlign
 * 
 * @attr {boolean} autoFitOnAttach
 * @prop {boolean | undefined} autoFitOnAttach
 * 
 * @attr {boolean} fitPositionTarget
 * @prop {boolean | undefined} fitPositionTarget
 * 
 * @attr {number} horizontalOffset
 * @prop {number | undefined} horizontalOffset
 * 
 * @attr {number} verticalOffset
 * @prop {number | undefined} verticalOffset
 * 
 * @attr {boolean} noAutoFocus
 * @prop {boolean | undefined} noAutoFocus
 * 
 * @attr {boolean} noCancelOnEscKey
 * @prop {boolean | undefined} noCancelOnEscKey
 * 
 * @attr {boolean} noCancelOnOutsideClick
 * @prop {boolean | undefined} noCancelOnOutsideClick
 * 
 * @attr {boolean} restoreFocusOnClose
 * @prop {boolean | undefined} restoreFocusOnClose
 * 
 * @attr {boolean} allowClickThrough
 * @prop {boolean | undefined} allowClickThrough
 * 
 * @attr {boolean} alwaysOnTop
 * @prop {boolean | undefined} alwaysOnTop
 * 
 * @attr {boolean} opened
 * @prop {boolean | undefined} opened
 * 
 * @attr {boolean} withBackdrop
 * @prop {boolean | undefined} withBackdrop
 * 
 * @attr {string} scrollAction
 * @prop {string | undefined} scrollAction
 * 
 * @prop {boolean | undefined} canceled
 * 
 * @prop {any} closingReason
 */
export default class AnypointDialogElement extends OverlayMixin(AnypointElement) {
  static get styles(): CSSResult[] {
    return [
      dialogStyles,
    ];
  }

  protected _modal?: boolean;

  /**
   * If `modal` is true, this implies `noCancelOnOutsideClick`,
   * `noCancelOnEscKey` and `withBackdrop`.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get modal(): boolean | undefined {
    return this._modal;
  }

  set modal(value: boolean | undefined) {
    const old = this._modal;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._modal = value;
    if (this.requestUpdate) {
      this.requestUpdate('modal', old);
    }
    this._modalChanged(value);
  }

  private __ready = false;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dialog. Pass an Array for multiple animations.
   */
  @property({ type: Array })
  openAnimationConfig?: IAnimationConfig[];

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dialog. Pass an Array for multiple animations.
   */
  @property({ type: Array })
  closeAnimationConfig?: IAnimationConfig[];

  /**
   * Set to true to disable animations when opening and closing the
   * dialog.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  noAnimations?: boolean;

  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this._resizeHandler = this._resizeHandler.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'dialog');
    this.setAttribute('tabindex', '-1');
    this.addEventListener('click', this._clickHandler as EventListener);
    this.addEventListener('resize', this._resizeHandler);
    this.__ready = true;
    if (this.modal) {
      this._modalChanged(this.modal);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._clickHandler as EventListener);
    this.removeEventListener('resize', this._resizeHandler);
    this.cancelAnimation();
  }

  _updateClosingReasonConfirmed(confirmed: boolean): void {
    if (!this.closingReason) {
      this.closingReason = {};
    }
    this.closingReason.confirmed = confirmed;
  }

  /**
   * Checks if the click target is the dialog closing target
   */
  protected _isTargetClosingReason(target: Element): boolean {
    if (!target.hasAttribute) {
      return false;
    }
    const attrs = ['dialog-dismiss', 'dialog-confirm', 'data-dialog-dismiss', 'data-dialog-confirm'];
    return attrs.some((name) => target.hasAttribute(name));
  }

  protected _clickHandler(e: PointerEvent): void {
    // @ts-ignore
    const path = (e.path || e.composedPath()) as Element[];
    for (let i = 0, l = path.indexOf(this); i < l; i++) {
      const target = path[i];
      if (this._isTargetClosingReason(target)) {
        this._updateClosingReasonConfirmed(target.hasAttribute('dialog-confirm') || target.hasAttribute('data-dialog-confirm'));
        this.close();
        e.stopPropagation();
        break;
      }
    }
  }

  /**
   * Handler for the resize event dispatched by the children. 
   * Causes the content to resize.
   */
  protected _resizeHandler(): void {
    this.refit();
  }

  private _modelPrevConf?: IModelPreviousConfiguration;

  protected _modalChanged(modal?: boolean): void {
    if (!this.__ready) {
      return;
    }
    if (modal) {
      this._modelPrevConf = {
        noCancelOnEscKey: this.noCancelOnEscKey,
        noCancelOnOutsideClick: this.noCancelOnOutsideClick,
        withBackdrop: this.withBackdrop,
      };
      this.noCancelOnOutsideClick = true;
      this.noCancelOnEscKey = true;
      this.withBackdrop = true;
    } else {
      const { _modelPrevConf = {} } = this;
      this.noCancelOnOutsideClick = this.noCancelOnOutsideClick && !!_modelPrevConf.noCancelOnOutsideClick;
      this.noCancelOnEscKey = this.noCancelOnEscKey && !!_modelPrevConf.noCancelOnEscKey;
      this.withBackdrop = this.withBackdrop && !!_modelPrevConf.withBackdrop;
    }
  }

  _openedChanged(opened?: boolean): void {
    this.cancelAnimation();
    super._openedChanged(opened);
  }

  _renderOpened(): void {
    if (!this.noAnimations) {
      this.playAnimation('open');
    } else {
      super._renderOpened();
    }
  }

  _renderClosed(): void {
    if (!this.noAnimations) {
      this.playAnimation('close');
    } else {
      super._renderClosed();
    }
  }

  /**
   * Called when animation finishes on the dialog (when opening or
   * closing). Responsible for "completing" the process of opening or
   * closing the dialog by positioning it or setting its display to
   * none.
   */
  protected _onAnimationFinish(): void {
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
    }
  }

  protected _activeAnimations: Animation[] = [];

  protected playAnimation(name: 'open' | 'close'): void {
    if (window.KeyframeEffect === undefined) {
      this._onAnimationFinish();
      return;
    }
    let results: Animation[] | undefined;
    if (name === 'open') {
      results = this._configureStartAnimation(this.openAnimationConfig);
    } else if (name === 'close') {
      results = this._configureEndAnimation(this.closeAnimationConfig);
    }
    if (!results || !results.length) {
      this._onAnimationFinish();
      return;
    }
    this._activeAnimations = results;
  }

  protected cancelAnimation(): void {
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

  protected _configureStartAnimation(config: IAnimationConfig[] = DefaultListOpenAnimation): Animation[] | undefined {
    if (window.KeyframeEffect === undefined || !config) {
      return undefined;
    }
    return this._runEffects(config);
  }

  protected _configureEndAnimation(config: IAnimationConfig[] = DefaultListCloseAnimation): Animation[] | undefined {
    if (window.KeyframeEffect === undefined || !config) {
      return undefined;
    }
    return this._runEffects(config);
  }

  protected _runEffects(config: IAnimationConfig[]): Animation[] {
    const results: Animation[] = [];
    for (let i = 0; i < config.length; i++) {
      const options = config[i];
      try {
        this.__runAnimation(options, results);
      } catch (_) {
        continue;
      }
    }
    return results;
  }

  protected __runAnimation(options: IAnimationConfig, results: Animation[]): void {
    const result = this.animate(options.keyframes, options.timing);
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

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

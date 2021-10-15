/* eslint-disable class-methods-use-this */
import { html, render } from 'lit-html';
import './SharedStyles.js';

/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('../../').AnypointSwitchElement} AnypointSwitchElement */

/**
 * Base class for AWC components demo page.
 *
 * ## Usage
 *
 * ```javascript
 * import { html, render } from 'lit-html';
 * import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
 *
 * class ComponentDemo extends DemoPage {
 *  contentTemplate() {
 *    return html`
 *      return html`<my-component ?narrow="${this.narrow}"></my-component>`;
 *    `;
 *  }
 * }
 * const instance = new ComponentDemo();
 * instance.render();
 * ```
 */
export class DemoPage extends EventTarget {
  constructor() {
    super();
    this._mediaQueryHandler = this._mediaQueryHandler.bind(this);

    this.initObservableProperties([
      'narrow', 'componentName', 'stylesActive', 'anypoint',
    ]);

    /**
     * A list of demo states to be passed to `arc-interactive-demo` element
     * @type {string[]}
     */
    this.demoStates = ['Material', 'Anypoint'];

    /**
     * Component name rendered in the header section.
     * @type {string}
     */
    this.componentName = '';

    /**
     * Determines whether the initial render had run and the `firstRender()`
     * function was called.
     *
     * @type {boolean}
     * @default false
     */
    this.firstRendered = false;

    /**
     * Whether or not the styles should be applied to `body.styled` element.
     * @type {boolean}
     * @default true
     */
    this.stylesActive = true;

    /**
     * Whether or not the dark theme is active
     * @type {boolean}
     * @default false
     */
    this.darkThemeActive = false;

    /**
     * Enables Anypoint platform styles.
     * @type {boolean}
     * @default false
     */
    this.anypoint = false;

    document.body.classList.add('styled');

    this.initMediaQueries();
  }

  get darkThemeActive() {
    return this._darkThemeActive;
  }

  set darkThemeActive(value) {
    if (this._darkThemeActive === value || !document.body) {
      return;
    }
    this._darkThemeActive = value;
    if (value) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    this.render();
  }

  /**
   * Helper function to be overridden by child classes. It is called when the view
   * is rendered for the first time.
   */
  firstRender() {
  }

  /**
   * Creates setters and getters to properties defined in the passed list of properties.
   * Property setter will trigger render function.
   *
   * @param {string[]} props List of properties to initialize.
   */
  initObservableProperties(props) {
    props.forEach((item) => {
      Object.defineProperty(this, item, {
        get() {
          return this[`_${item}`];
        },
        set(newValue) {
          this._setObservableProperty(item, newValue);
        },
        enumerable: true,
        configurable: true
      });
    });
  }

  /**
   * Initializes media queries for dark system theme.
   */
  initMediaQueries() {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    if (matcher.matches) {
      this.darkThemeActive = true;
    }
    matcher.addEventListener('change', this._mediaQueryHandler);
  }

  /**
   * @param {string} prop
   * @param {any} value
   */
  _setObservableProperty(prop, value) {
    const key = `_${prop}`;
    if (this[key] === value) {
      return;
    }
    this[key] = value;
    this.render();
  }

  /**
   * A handler for the `change` event for an element that has `checked` and `name` properties.
   * This can be used with `anypoint-switch`, `anypoint-checkbox`, and `checkbox` elements.
   *
   * The `name` should correspond to a variable name to be set. The set value is the value
   * of `checked` property read from the event's target.
   *
   * @param {CustomEvent} e
   */
  _toggleMainOption(e) {
    const { name, checked } = /** @type HTMLInputElement */ (e.target);
    this[name] = checked;
  }

  /**
   * A handler for the `change` event for the demo state
   *
   * @param {CustomEvent} e
   */
  _demoStateHandler(e) {
    const { value } = e.detail;
    this.anypoint = value === 1;
    this._updateAnypoint();
  }

  /**
   * Depending on the `anypoint` flag state it adds or removes the `anypoint` styles from the body.
   */
  _updateAnypoint() {
    if (this.anypoint) {
      document.body.classList.add('anypoint');
    } else {
      document.body.classList.remove('anypoint');
    }
  }

  /**
   * @param {MediaQueryListEvent} e 
   */
  _mediaQueryHandler(e) {
    this.darkThemeActive = e.matches;
  }

  /**
   * Call this on the top of the `render()` method to render demo navigation
   * @return {TemplateResult} HTML template for demo header
   */
  headerTemplate() {
    const { componentName } = this;
    return html`
    <header>
      ${componentName ? html`<h1 class="api-title">${componentName}</h1>` : ''}
    </header>`;
  }

  /**
   * Override this function to add some custom custom controls to the
   * view controls dropdown.
   * @return {TemplateResult} HTML template for demo header
   */
  _demoViewControlsTemplate() {
    return html``;
  }

  /**
   * Abstract method. When not overriding `render()` method you can use
   * this function to render content inside the standard API components layout.
   *
   * ```
   * contentTemplate() {
   *  return html`<p>Demo content</p>`;
   * }
   * ```
   * @return {TemplateResult}
   */
  contentTemplate() {
    return html``;
  }

  /**
   * The page render function. Usually you don't need to use it.
   * It renders the header template, main section, and the content.
   * 
   * @return {TemplateResult}
   */
  pageTemplate() {
    return html`
    ${this.headerTemplate()}
    <section role="main" class="vertical-section-container centered main">
      ${this.contentTemplate()}
    </section>`;
  }

  /**
   * The main render function. Sub classes should not override this method.
   * Override `_render()` instead.
   *
   * The function calls `_render()` in a timeout so it is safe to call this
   * multiple time in the same event loop.
   */
  render() {
    if (this._rendering) {
      return;
    }
    this._rendering = true;
    setTimeout(() => {
      this._rendering = false;
      this._render();
    });
  }

  _render() {
    if (!this.firstRendered) {
      this.firstRendered = true;
      setTimeout(() => this.firstRender());
    }
    render(this.pageTemplate(), document.querySelector('#demo'), {
      eventContext: this,
    });
  }
}

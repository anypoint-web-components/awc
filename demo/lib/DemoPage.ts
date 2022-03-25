/* eslint-disable class-methods-use-this */
import { html, render, TemplateResult } from 'lit';
import { demoProperty } from './decorators.js';
import './SharedStyles.js';

/**
 * Base class for AWC components demo page.
 */
export class DemoPage extends EventTarget {
  /**
   * A list of demo states to be passed to `interactive-demo` element
   */
  @demoProperty()
  demoStates: string[] = ['Filled', 'Outlined', 'Anypoint'];

  /**
   * Component name rendered in the header section.
   */
  @demoProperty()
  componentName = '';

  @demoProperty()
  narrow = false;

  /**
   * Determines whether the initial render had run and the `firstRender()`
   * function was called.
   * @default false
   */
  firstRendered = false;

  /**
   * Whether or not the styles should be applied to `body.styled` element.
   * @default true
   */
  @demoProperty()
  stylesActive = true;

  protected _darkThemeActive = false;

  /**
   * Enables Anypoint platform styles.
   * @default false
   */
  @demoProperty()
  anypoint = false;

  /**
   * Enables Material's outlined theme.
   * @default false
   */
  @demoProperty()
  outlined = false;

  /**
  * Whether or not the dark theme is active
  * @default false
  */
  get darkThemeActive(): boolean {
    return this._darkThemeActive;
  }

  set darkThemeActive(value: boolean) {
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

  constructor() {
    super();
    this._mediaQueryHandler = this._mediaQueryHandler.bind(this);
    document.body.classList.add('styled');
    this.initMediaQueries();
  }

  /**
   * Helper function to be overridden by child classes. It is called when the view
   * is rendered for the first time.
   */
  firstRender(): void {
    // ...
  }

  /**
   * Initializes media queries for dark system theme.
   */
  initMediaQueries(): void {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    if (matcher.matches) {
      this.darkThemeActive = true;
    }
    matcher.addEventListener('change', this._mediaQueryHandler);
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
  _toggleMainOption(e: CustomEvent): void {
    const { name, checked } = e.target as HTMLInputElement;
    // @ts-ignore
    this[name] = checked;
  }

  /**
   * A handler for the `change` event for the demo state
   */
  _demoStateHandler(e: CustomEvent): void {
    const { value } = e.detail;
    this.outlined = value === 1;
    this.anypoint = value === 2;
    this._updateAnypoint();
  }

  /**
   * Depending on the `anypoint` flag state it adds or removes the `anypoint` styles from the body.
   */
  _updateAnypoint(): void {
    if (this.anypoint) {
      document.body.classList.add('anypoint');
    } else {
      document.body.classList.remove('anypoint');
    }
  }

  _mediaQueryHandler(e: MediaQueryListEvent): void {
    this.darkThemeActive = e.matches;
  }

  /**
   * Call this on the top of the `render()` method to render demo navigation
   * @return HTML template for demo header
   */
  headerTemplate(): TemplateResult {
    const { componentName } = this;
    return html`
    <header>
      ${componentName ? html`<h1 class="api-title">${componentName}</h1>` : ''}
    </header>`;
  }

  /**
   * Override this function to add some custom custom controls to the
   * view controls dropdown.
   * @return HTML template for demo header
   */
  _demoViewControlsTemplate(): TemplateResult {
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
   */
  contentTemplate(): TemplateResult {
    return html``;
  }

  /**
   * The page render function. Usually you don't need to use it.
   * It renders the header template, main section, and the content.
   */
  pageTemplate(): TemplateResult {
    return html`
    ${this.headerTemplate()}
    <section role="main" class="vertical-section-container centered main">
      ${this.contentTemplate()}
    </section>`;
  }

  _rendering = false;

  /**
   * The main render function. Sub classes should not override this method.
   * Override `_render()` instead.
   *
   * The function calls `_render()` in a timeout so it is safe to call this
   * multiple time in the same event loop.
   */
  render(): void {
    if (this._rendering) {
      return;
    }
    this._rendering = true;
    setTimeout(() => {
      this._rendering = false;
      this._render();
    });
  }

  _render(): void {
    if (!this.firstRendered) {
      this.firstRendered = true;
      setTimeout(() => this.firstRender());
    }
    const demo = document.querySelector('#demo') as HTMLElement;
    if (!demo) {
      console.warn('The "#demo" element is not in the DOM.');
      return;
    }
    render(this.pageTemplate(), demo, {
      host: this,
    });
  }
}

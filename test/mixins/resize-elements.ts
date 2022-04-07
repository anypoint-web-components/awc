/* eslint-disable wc/no-invalid-element-name */
/* eslint-disable max-classes-per-file */
import { LitElement, html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ResizableMixin } from '../../src/index.js';
import './x-resizable.js';
import './x-resizer-parent.js';

export class XResizerParentFiltered extends ResizableMixin(LitElement) {

  @property({ type: Object })
  active?: any;
  
  render(): TemplateResult {
    return html`<p>x-resizer-parent-filtered</p>`;
  }

  resizerShouldNotify(el: any): boolean {
    return (el === this.active);
  }
}
window.customElements.define('x-resizer-parent-filtered', XResizerParentFiltered);
declare global {
  interface HTMLElementTagNameMap {
    "x-resizer-parent-filtered": XResizerParentFiltered
  }
}

export class XResizableInShadow extends LitElement {
  render(): TemplateResult {
    return html`<div>
      <x-resizable id="resizable"></x-resizable>
    </div>`;
  }
}
window.customElements.define('x-resizable-in-shadow', XResizableInShadow);
declare global {
  interface HTMLElementTagNameMap {
    "x-resizable-in-shadow": XResizableInShadow
  }
}

export class TestElement extends LitElement {
  render(): TemplateResult {
    return html`
    <!-- Normal resizable parent with child resizables -->
    <x-resizer-parent id="parent">
      <x-resizable id="child1a"></x-resizable>
      <div>
        <x-resizable id="child1b"></x-resizable>
      </div>
      <x-resizable-in-shadow id="shadow1c"></x-resizable-in-shadow>
      <div>
        <x-resizable-in-shadow id="shadow1d"></x-resizable-in-shadow>
      </div>
    </x-resizer-parent>
    <!-- Resizable parent using resizerShouldNotify, with child resizables -->
    <x-resizer-parent-filtered id="parentFiltered">
      <x-resizable id="child2a"></x-resizable>
      <div>
        <x-resizable id="child2b"></x-resizable>
      </div>
      <x-resizable-in-shadow id="shadow2c"></x-resizable-in-shadow>
      <div>
        <x-resizable-in-shadow id="shadow2d"></x-resizable-in-shadow>
      </div>
    </x-resizer-parent-filtered>`;
  }
}
window.customElements.define('test-element', TestElement);
declare global {
  interface HTMLElementTagNameMap {
    "test-element": TestElement
  }
}

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ObserveResizeMixinInterface {
  ironResizeCount: number;
  _incrementIronResizeCount(): void;
}

const ObserveResizeMixin = <T extends Constructor<LitElement>>(superClass: T): Constructor<ObserveResizeMixinInterface> & T => {
  class MyMixinClass extends superClass {
    @property({ type: Number })
    ironResizeCount = 0;

    constructor(...args: any[]) {
      super(...args);
      this._incrementIronResizeCount = this._incrementIronResizeCount.bind(this);
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener('resize', this._incrementIronResizeCount);
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener('resize', this._incrementIronResizeCount);
    }

    _incrementIronResizeCount(): void {
      this.ironResizeCount++;
    }
  }
  return MyMixinClass as Constructor<ObserveResizeMixinInterface> & T;
}

export class XShadowResizable extends ObserveResizeMixin(ResizableMixin(LitElement)) {
  render(): TemplateResult {
    return html`<div>Shadow count: ${this.ironResizeCount}</div>`;
  }
}
window.customElements.define('x-shadow-resizable', XShadowResizable);
declare global {
  interface HTMLElementTagNameMap {
    "x-shadow-resizable": XShadowResizable
  }
}

export class XLightResizable extends ObserveResizeMixin(ResizableMixin(LitElement)) {
  render(): TemplateResult {
    return html`
    Light count: ${this.ironResizeCount}
    <x-shadow-resizable id="childResizable1"></x-shadow-resizable>
    <x-shadow-resizable id="childResizable2"></x-shadow-resizable>
    `;
  }
}
window.customElements.define('x-light-resizable', XLightResizable);

declare global {
  interface HTMLElementTagNameMap {
    "x-light-resizable": XLightResizable
  }
}

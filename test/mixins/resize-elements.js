/* eslint-disable wc/no-invalid-element-name */
/* eslint-disable max-classes-per-file */
import './x-resizer-parent.js';
import './x-resizable.js';

import { LitElement, html } from 'lit-element';
import { ResizableMixin } from '../../index.js';

export class XResizerParentFiltered extends ResizableMixin(LitElement) {
  static get properties() {
    return {
      active: { type: Object }
    };
  }

  render() {
    return html`<p>x-resizer-parent-filtered</p>`;
  }

  resizerShouldNotify(el) {
    return (el === this.active);
  }
}
window.customElements.define('x-resizer-parent-filtered', XResizerParentFiltered);

export class XResizableInShadow extends LitElement {
  render() {
    return html`<div>
      <x-resizable id="resizable"></x-resizable>
    </div>`;
  }
}
window.customElements.define('x-resizable-in-shadow', XResizableInShadow);

export class TestElement extends LitElement {
  render() {
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

const ObserveResizeMixin = (superClass) => class extends superClass {
  static get properties() {
    return {
      ironResizeCount: { type: Number }
    };
  }

  constructor() {
    super();
    this.ironResizeCount = 0;
    this._incrementIronResizeCount = this._incrementIronResizeCount.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('resize', this._incrementIronResizeCount);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('resize', this._incrementIronResizeCount);
  }

  _incrementIronResizeCount() {
    this.ironResizeCount++;
  }
};

export class XShadowResizable extends ObserveResizeMixin(ResizableMixin(LitElement)) {
  render() {
    return html`<div>Shadow count: ${this.ironResizeCount}</div>`;
  }
}
window.customElements.define('x-shadow-resizable', XShadowResizable);

export class XLightResizable extends ObserveResizeMixin(ResizableMixin(LitElement)) {
  render() {
    return html`
    Light count: ${this.ironResizeCount}
    <x-shadow-resizable id="childResizable1"></x-shadow-resizable>
    <x-shadow-resizable id="childResizable2"></x-shadow-resizable>
    `;
  }
}
window.customElements.define('x-light-resizable', XLightResizable);

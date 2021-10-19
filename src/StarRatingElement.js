/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
/* eslint-disable no-plusplus */
/* eslint-disable no-bitwise */
/**
 * Creates an SVG image for a star
 * @return {SVGElement} an SVG element with a star
 */
function createStar() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('focusable', 'true');
  svg.setAttribute('role', 'radio');
  svg.style.cssText = 'display: block;';
  svg.innerHTML = `<g>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
  </g>`;
  return svg;
}

function svgFromEvent(e) {
  const path = (e.composedPath && e.composedPath()) || e.path;
  for (let i = 0, len = path.length; i < len; i++) {
    if (path[i].nodeType === 1 && path[i].nodeName.toLowerCase() === 'svg') {
      return path[i];
    }
  }
  return undefined;
}

/**
 * A web component written in plain JavaScript to render a 5 star rating.
 *
 * By default it is an interactive element where the user can change the selection.
 * Add `readOnly` attribute/JS property to disable this behavior.
 *
 * ## Example
 *
 * ```html
 * <star-rating value="3"></star-rating>
 * ```
 * ### Styling
 *
 * `<exchange-search-list-item>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--star-rating-width` | Icon width | `24px`
 * `--star-rating-height` | Icon width | `24px`
 * `--star-rating-unselected-color` | Icon color when not selected | `#eeeeee`
 * `--star-rating-selected-color` | Icon color when selected | `#fdd835`
 * `--star-rating-active-color` | Icon color when active (focus, hover) | `#e0be25`
 */
export default class StarRatingElement extends HTMLElement {
  static get template() {
    const template = document.createElement('template');
    template.innerHTML = `<style>
    :host {
      display: inline-block;
    }

    #container {
      display: flex;
    }

    .star {
      width: var(--star-rating-width, 24px);
      height: var(--star-rating-height, 24px);
      fill: var(--star-rating-unselected-color, #eeeeee);
      transition: fill 0.2s ease-in-out;
    }

    .star.selected {
      fill: var(--star-rating-selected-color, #fdd835);
    }

    :host(:not([readonly])) .star {
      cursor: pointer;
    }

    :host(:hover) .star {
      outline: none;
    }

    :host(:not([readonly])) .star:hover,
    :host(:not([readonly])) .star:active,
    :host(:not([readonly])) .star:focus {
      fill: var(--star-rating-active-color, #e0be25);
    }
    </style>
    <div id="container" role="radiogroup"></div>`;
    return template;
  }

  static get observedAttributes() {
    return ['value', 'readonly'];
  }

  set value(value) {
    let typedValue = value;
    if (typedValue === undefined || typedValue === null) {
      this.removeAttribute('value');
      typedValue = 0;
    } else {
      typedValue = Number(typedValue);
      if (Number.isNaN(typedValue)) {
        typedValue = 0;
      }
      if (this.getAttribute('value') !== String(typedValue)) {
        this.setAttribute('value', String(typedValue));
      }
    }
    this.__data__.value = typedValue;
    this._render();
  }

  get value() {
    return this.__data__.value;
  }

  set readOnly(value) {
    let typedValue = value;
    if (typedValue === '' || typedValue === 'true' || typedValue === true) {
      typedValue = true;
      if (!this.hasAttribute('readonly')) {
        this.setAttribute('readonly', '');
      }
    } else {
      typedValue = false;
      if (this.hasAttribute('readonly')) {
        this.removeAttribute('readonly');
      }
    }
    this.__data__.readOnly = typedValue;
    this._render();
  }

  get readOnly() {
    return this.__data__.readOnly || false;
  }

  /**
   * @returns {EventListener}
   */
  get onchange() {
    return this._onchange;
  }

  /**
   * @param {EventListener} value
   */
  set onchange(value) {
    if (this._onchange) {
      this.removeEventListener('value-changed', this._onchange);
    }
    if (typeof value !== 'function') {
      this._onchange = null;
      return;
    }
    this._onchange = value;
    this.addEventListener('value-changed', value);
  }

  constructor() {
    super();
    this.__data__ = {};
    this._clickHandler = this._clickHandler.bind(this);
    this._keydownHandler = this._keydownHandler.bind(this);
    const shadow = this.attachShadow({ mode: 'open' });
    const tpl = StarRatingElement.template;
    const clone = document.importNode(tpl.content, true);
    shadow.appendChild(clone);
  }

  connectedCallback() {
    this._render();
    this.addEventListener('click', this._clickHandler);
    this.addEventListener('keydown', this._keydownHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._clickHandler);
    this.removeEventListener('keydown', this._keydownHandler);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    let prop;
    switch (name) {
      case 'readonly': prop = 'readOnly'; break;
      default: prop = name; 
    }
    if (this[prop] !== newValue) {
      this[prop] = newValue;
    }
  }

  _render() {
    if (this.__rendering) {
      return;
    }
    this.__rendering = true;
    setTimeout(() => {
      this.__rendering = false;
      this._doRender();
    });
  }

  _doRender() {
    this._ensureStars();
    const stars = this.shadowRoot.querySelectorAll('#container .star');
    const selected = (this.value >>> 0) - 1;
    const tabindex = this.readOnly ? -1 : 0;
    for (let i = 0; i < 5; i++) {
      const star = stars[i];
      if (i <= selected) {
        if (!star.classList.contains('selected')) {
          star.classList.add('selected');
        }
      } else if (star.classList.contains('selected')) {
        star.classList.remove('selected');
      }
      if (i === selected) {
        if (star.getAttribute('aria-checked') !== 'true') {
          star.setAttribute('aria-checked', 'true');
        }
      } else if (star.getAttribute('aria-checked') !== 'false') {
        star.setAttribute('aria-checked', 'false');
      }
      if (star.getAttribute('tabindex') !== String(tabindex)) {
        star.setAttribute('tabindex', String(tabindex));
      }
    }
  }

  _ensureStars() {
    if (this.__data__.hasStars) {
      return;
    }
    this.__data__.hasStars = true;
    const container = this.shadowRoot.querySelector('#container');
    for (let i = 0; i < 5; i++) {
      const item = createStar();
      item.classList.add('star');
      item.dataset.index = String(i);
      container.appendChild(item);
    }
  }

  _clickHandler(e) {
    if (this.readOnly) {
      return;
    }
    this._selectionFromEvent(e);
  }

  _keydownHandler(e) {
    if (this.readOnly || (e.key !== ' ' && e.key !== 'Enter')) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    this._selectionFromEvent(e);
  }

  _selectionFromEvent(e) {
    const img = svgFromEvent(e);
    if (!img) {
      return;
    }
    const i = Number(img.dataset.index) + 1;
    this.value = i;
    this._notifyValueChanged(i);
  }

  _notifyValueChanged(value) {
    this.dispatchEvent(new CustomEvent('value-changed', { detail: { value } }));
    this.dispatchEvent(new CustomEvent('change'));
  }
}

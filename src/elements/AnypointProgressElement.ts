/* eslint-disable class-methods-use-this */
/*
Copyright 2021 Pawel Psztyc, The ARC team

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
import { html, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { property } from 'lit/decorators.js';
import elementStyles from '../styles/Progress.js';
import AnypointRangeElement from './RangeElement.js';
import { floatConverter } from '../lib/AttributeConverters.js';

/**
 * Anypoint styled progress bar.
 * 
 * The progress bars are for situations where the percentage completed can be
 * determined. They give users a quick sense of how much longer an operation
 * will take.
 */
export default class AnypointProgressElement extends AnypointRangeElement {
  static get styles(): CSSResult {
    return elementStyles;
  }

  protected _secondaryRatio?: number;

  /**
   * True if the progress is disabled.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * The number that represents the current secondary progress.
   * @attr
   */
  @property({ type: Number, converter: floatConverter }) secondaryProgress?: number;

  /**
   * Use an indeterminate progress indicator.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) indeterminate?: boolean;

  /**
   * @returns The ratio of the secondary progress.
   */
  get secondaryRatio(): number {
    return this._secondaryRatio || 0;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'progressbar');
    }
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('secondaryProgress') || cp.has('indeterminate')) {
      this._rangeChanged();
    }
  }

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('min')) {
      this.setAttribute('aria-valuemin', String(this.min));
    }
    if (cp.has('max')) {
      this.setAttribute('aria-valuemax', String(this.max));
    }
    if (cp.has('indeterminate') || cp.has('value')) {
      if (this.indeterminate) {
        this.removeAttribute('aria-valuenow');
      } else {
        this.setAttribute('aria-valuenow', String(this.value));
      }
    }
  }

  protected _rangeChanged(): void {
    super._rangeChanged();
    const { secondaryProgress: sp } = this;
    if (typeof sp === 'number') {
      const secondary = this._clampValue(sp);
      this._secondaryRatio = this._computeRatio(secondary) * 100;
    } else {
      this._secondaryRatio = undefined;
    }
  }

  render(): TemplateResult {
    const { secondaryRatio = 0, indeterminate, ratio = 0 } = this;
    const primaryClasses = {
      indeterminate: !!indeterminate,
    };
    const primaryStyle = {
      transform: `scaleX(${(ratio / 100)})`,
    };
    const secondaryStyle = {
      transform: `scaleX(${(secondaryRatio / 100)})`,
    };
    return html`
    <div id="progressContainer">
      <div id="secondaryProgress" ?hidden="${secondaryRatio === 0}" style="${styleMap(secondaryStyle)}"></div>
      <div id="primaryProgress" class="${classMap(primaryClasses)}" style="${styleMap(primaryStyle)}"></div>
    </div>
    `;
  }
}

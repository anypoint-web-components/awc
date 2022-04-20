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
import { LitElement, html, CSSResult, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { property } from 'lit/decorators.js';
import { RangeMixin, rangeChanged, clampValue, computeRatio } from '../mixins/RangeMixin.js';
import elementStyles from '../styles/Progress.js';

export const secondaryProgressValue = Symbol('secondaryProgressValue');
export const indeterminateValue = Symbol('indeterminateValue');
export const secondaryRatioValue = Symbol('secondaryRatioValue');

/**
 * Anypoint styles progress bar.
 * 
 * The progress bars are for situations where the percentage completed can be
 * determined. They give users a quick sense of how much longer an operation
 * will take.
 * 
 * @attr {number} value
 * @prop {number | undefined} value
 * @attr {number} min
 * @prop {number | undefined} min
 * @attr {number} max
 * @prop {number | undefined} max
 * @attr {number} step
 * @prop {number | undefined} step
 * @fires ratiochange
 */
export default class AnypointProgressElement extends RangeMixin(LitElement) {
  static get styles(): CSSResult {
    return elementStyles;
  }

  /**
   * True if the progress is disabled.
   */
  @property({ reflect: true, type: Boolean })
  disabled?: boolean;

  [secondaryProgressValue]?: number;

  [secondaryRatioValue]?: number;

  [indeterminateValue] = false;

  /**
   * The number that represents the current secondary progress.
   */
  @property({ type: Number })
  get secondaryProgress(): number {
    return this[secondaryProgressValue] || 0;
  }

  set secondaryProgress(value: number) {
    let parsed = value;
    if (typeof parsed === 'string') {
      parsed = parseFloat(parsed);
    }
    const v = this[clampValue](parsed);
    const old = this[secondaryProgressValue];
    if (v === old) {
      return;
    }
    this[secondaryProgressValue] = v;
    this.requestUpdate('secondaryProgress', old);
    this[rangeChanged]();
  }

  /**
   * Use an indeterminate progress indicator.
   */
  @property({ reflect: true, type: Boolean })
  get indeterminate(): boolean {
    return this[indeterminateValue];
  }

  set indeterminate(value: boolean) {
    const old = this[indeterminateValue];
    if (value === old) {
      return;
    }
    this[indeterminateValue] = value;
    this.requestUpdate('indeterminate', old);
    this[rangeChanged]();
  }

  /**
   * @returns The ratio of the secondary progress.
   */
  get secondaryRatio(): number {
    return this[secondaryRatioValue] || 0;
  }

  constructor() {
    super();
    this[secondaryProgressValue] = 0;
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'progressbar');
    }
  }

  [rangeChanged](): void {
    super[rangeChanged]();
    const { secondaryProgress, value, min, max, indeterminate } = this;
    const secondaryRatio = this[computeRatio](secondaryProgress) * 100;
    this[secondaryRatioValue] = secondaryRatio;

    if (indeterminate) {
      this.removeAttribute('aria-valuenow');
    } else {
      this.setAttribute('aria-valuenow', String(value));
    }
    this.setAttribute('aria-valuemin', String(min));
    this.setAttribute('aria-valuemax', String(max));
    this.requestUpdate();
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

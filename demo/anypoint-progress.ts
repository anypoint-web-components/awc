/* eslint-disable no-plusplus */
import { html, TemplateResult } from 'lit';
import { demoProperty } from './lib/decorators.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/demo-helper.js';
import '../src/define/anypoint-progress.js';
import '../src/define/anypoint-button.js';
import '../src/colors.js';

class ComponentDemoPage extends DemoPage {
  @demoProperty()
  repeat = 0;

  @demoProperty()
  maxRepeat = 5;

  @demoProperty()
  animating = false;

  constructor() {
    super();
    this.componentName = 'anypoint-progress';
  }

  startProgress(): void {
    const progress = document.querySelector('anypoint-progress')!;
    const button = document.querySelector('anypoint-button')!;
    this.repeat = 0;
    progress.value = progress.min;
    button.disabled = true;
    if (!this.animating) {
      this.nextProgress();
    }
  }

  nextProgress(): void {
    const progress = document.querySelector('anypoint-progress')!;
    const button = document.querySelector('anypoint-button')!;
    this.animating = true;
    if (progress.value < progress.max) {
      progress.value += (progress.step || 1);
    } else {
      if (++this.repeat >= this.maxRepeat) {
        this.animating = false;
        button.disabled = false;
        return;
      }
      progress.value = progress.min;
    }
    requestAnimationFrame(this.nextProgress.bind(this));
  }

  contentTemplate(): TemplateResult {
    return html`
    <h2>Anypoint progress</h2>
    ${this.imperativeTemplate()}
    ${this.indeterminateTemplate()}
    ${this.styledTemplate()}
    ${this.disabledTemplate()}
    ${this.secondaryTemplate()}
    `;
  }

  imperativeTemplate(): TemplateResult {
    return html`
    <div class="card">
      <h3>Imperative control</h3>
      <p>
        Once started, loops 5 times before stopping.
        <anypoint-button emphasis="high" @click="${this.startProgress}" id="start">Start</anypoint-button>
      </p>
      <anypoint-progress id="progress"></anypoint-progress>
    </div>
    `;
  }

  indeterminateTemplate(): TemplateResult {
    return html`
    <div class="card">
      <h3>Indeterminate value</h3>
      <anypoint-progress indeterminate></anypoint-progress>
      <anypoint-progress indeterminate class="slow"></anypoint-progress>
    </div>
    `;
  }

  styledTemplate(): TemplateResult {
    return html`
    <div class="card">
      <h3>Styling</h3>
      <anypoint-progress value="40" secondaryProgress="80" class="blue"></anypoint-progress>
      <anypoint-progress value="800" min="100" max="1000" class="red"></anypoint-progress>
      <anypoint-progress value="60" class="green"></anypoint-progress>
    </div>
    `;
  }

  disabledTemplate(): TemplateResult {
    return html`
    <div class="card">
      <h3>Disabled state</h3>
      <anypoint-progress value="40" secondaryProgress="80" disabled></anypoint-progress>
    </div>
    `;
  }

  secondaryTemplate(): TemplateResult {
    return html`
    <div class="card secondary">
      <h3>Timeline</h3>
      <p>0 - 12 (Δ 12)</p>
      <anypoint-progress value="0" secondaryProgress="12" max="328"></anypoint-progress>
      <p>12 - 15 (Δ 3)</p>
      <anypoint-progress value="12" secondaryProgress="15" max="328"></anypoint-progress>
      <p>15 - 204 (Δ ${204 - 15})</p>
      <anypoint-progress value="15" secondaryProgress="204" max="328"></anypoint-progress>
      <p>204 - 254 (Δ ${254 - 204})</p>
      <anypoint-progress value="204" secondaryProgress="254" max="328"></anypoint-progress>
      <p>254 - 254 (Δ 0)</p>
      <anypoint-progress value="254" secondaryProgress="254" max="328"></anypoint-progress>
      <p>254 - 328 (Δ ${328 - 254})</p>
      <anypoint-progress value="254" secondaryProgress="328" max="328"></anypoint-progress>
    </div>
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();

import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/demo-helper.js'
import '../anypoint-progress.js';
import '../anypoint-button.js';
import '../colors.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.componentName = 'anypoint-progress';

    this.repeat = undefined;
    this.maxRepeat = 5;
    this.animating = false;
  }

  startProgress() {
    const progress = document.querySelector('anypoint-progress');
    const button = document.querySelector('anypoint-button');
    this.repeat = 0;
    progress.value = progress.min;
    button.disabled = true;
    if (!this.animating) {
      this.nextProgress();
    }
  }

  nextProgress() {
    const progress = document.querySelector('anypoint-progress');
    const button = document.querySelector('anypoint-button');
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

  contentTemplate() {
    return html`
    <h2>Anypoint progress</h2>
    ${this.imperativeTemplate()}
    ${this.indeterminateTemplate()}
    ${this.styledTemplate()}
    ${this.disabledTemplate()}
    `;
  }

  imperativeTemplate() {
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

  indeterminateTemplate() {
    return html`
    <div class="card">
      <h3>Indeterminate value</h3>
      <anypoint-progress indeterminate></anypoint-progress>
      <anypoint-progress indeterminate class="slow"></anypoint-progress>
    </div>
    `;
  }

  styledTemplate() {
    return html`
    <div class="card">
      <h3>Styling</h3>
      <anypoint-progress value="40" secondaryProgress="80" class="blue"></anypoint-progress>
      <anypoint-progress value="800" min="100" max="1000" class="red"></anypoint-progress>
      <anypoint-progress value="60" class="green"></anypoint-progress>
    </div>
    `;
  }

  disabledTemplate() {
    return html`
    <div class="card">
      <h3>Disabled state</h3>
      <anypoint-progress value="40" secondaryProgress="80" disabled></anypoint-progress>
    </div>
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();

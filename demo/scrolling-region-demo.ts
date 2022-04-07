import { html, css, LitElement, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import './sample-content.js';
import '../src/define/scroll-threshold.js';

export class ScrollingRegionDemo extends LitElement {
  static get styles(): CSSResult {
    return css`
    .toolbar {
      background-color: #3367d6;
      z-index: 1;
      font: 15px arial;
      height: 54px;
      line-height: 54px;
      padding-left: 20px;
      padding-right: 20px;
      color: white;
    }

    .loader {
      background-color: #0b8043;
      text-align: center;
      height: 44px;
      font: 13px arial;
      line-height: 44px;
      color: white;
    }

    scroll-threshold {
      position: absolute;
      top: 10vh;
      left: 25vh;
      right: 25vh;
      height: 80vh;
      box-shadow: 0 0 60px rgba(0,0,0,0.5);
    }`;
  }

  @property({ type: Number })
  size = 500;

  loadMoreData(): void {
    // Simulate network delay
    setTimeout(() => {
      this.size += 5;
      // @ts-ignore
      this.shadowRoot.querySelector('scroll-threshold').clearTriggers();
    }, 500);
  }

  render(): TemplateResult {
    return html`
    <scroll-threshold lowerThreshold="500" @lowerthreshold="${this.loadMoreData}">
      <div class="toolbar">iron-scroll-threshold using a scrolling region</div>
      <sample-content .size="${this.size}"></sample-content>
      <div class="loader">Fetching new items...</div>
    </scroll-threshold>`;
  }
}

window.customElements.define('scrolling-region-demo', ScrollingRegionDemo);

declare global {
  interface HTMLElementTagNameMap {
    "scrolling-region-demo": ScrollingRegionDemo;
  }
}

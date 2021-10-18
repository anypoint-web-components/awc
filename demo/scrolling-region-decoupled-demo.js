import { html, css, LitElement } from 'lit-element';
import './sample-content.js';
import '../scroll-threshold.js';

class ScrollingRegionDecoupledDemo extends LitElement {
  static get styles() {
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

    #scrollingRegion {
      position: absolute;
      top: 10vh;
      left: 25vh;
      right: 25vh;
      height: 80vh;
      box-shadow: 0 0 60px rgba(0,0,0,0.5);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }

    scroll-threshold {
      display: none;
    }`;
  }

  static get properties() {
    return {
      size: { type: Number }
    };
  }

  constructor() {
    super();
    this.size = 500;
  }

  loadMoreData() {
    // Simulate network delay
    setTimeout(() => {
      this.size += 5;
      this.shadowRoot.querySelector('scroll-threshold').clearTriggers();
    }, 500);
  }

  render() {
    return html`
    <div id="scrollingRegion">
      <div class="toolbar">scroll-threshold using a scrolling region</div>
      <sample-content .size="${this.size}"></sample-content>
      <div class="loader">Fetching new items...</div>
    </div>
    <!-- scroll-target uses #scrollingRegion -->
    <scroll-threshold lowerThreshold="500" @lowerthreshold="${this.loadMoreData}" scrollTarget="scrollingRegion">
    </scroll-threshold>`;
  }
}

window.customElements.define('scrolling-region-decoupled-demo', ScrollingRegionDecoupledDemo);

import { html, css, LitElement } from 'lit-element';
import './sample-content.js';
import '../scroll-threshold.js';

class IndexDemo extends LitElement {
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
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
    }

    .loader {
      background-color: #0b8043;
      text-align: center;
      height: 44px;
      font: 13px arial;
      line-height: 44px;
      color: white;
    }

    sample-content {
      padding-top: 54px;
    }

    scroll-threshold {
      display: none;
    }`;
  }

  static get properties() {
    return {
      upperTriggered: { type: Boolean },
      lowerTriggered: { type: Boolean },
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

  _lowerChanged(e) {
    this.lowerTriggered = e.target.lowerTriggered;
  }

  _upperChanged(e) {
    this.upperTriggered = e.target.upperTriggered;
  }

  render() {
    const upperTriggered = this.upperTriggered ? 'true' : 'false';
    const lowerTriggered = this.lowerTriggered ? 'true' : 'false';
    return html`<div class="toolbar">
      <b>Document Scroll</b> |
      Upper triggered: ${upperTriggered} -  Lower triggered: ${lowerTriggered}
    </div>

    <sample-content .size="${this.size}"></sample-content>
    <div class="loader">Fetching new items...</div>

    <!-- scroll-target uses the document scroll -->
    <scroll-threshold
      scrollTarget="document"
      lowerThreshold="500"
      @lowerthreshold="${this.loadMoreData}"
      @lowerchange="${this._lowerChanged}"
      @upperchange="${this._upperChanged}">
    </scroll-threshold>`;
  }
}

window.customElements.define('index-demo', IndexDemo);

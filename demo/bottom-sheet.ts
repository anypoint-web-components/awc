import { html, render } from 'lit';
import './lib/demo-helper.js';
import '../src/define/anypoint-item.js';
import '../src/define/anypoint-icon-item.js';
import '../src/define/anypoint-button.js';
import '../src/define/bottom-sheet.js';

class DemoPage {
  constructor() {
    this._open = this._open.bind(this);
  }

  _open(e: any): void {
    e.target.previousElementSibling.opened = true;
  }

  render(): void {
    render(html`<div class="vertical-section-container centered">
      <h3>The bottom-sheet</h3>
      <bottom-sheet noPadding>
        <anypoint-item>Action #1</anypoint-item>
        <anypoint-item>Action #2</anypoint-item>
        <anypoint-item>Action #3</anypoint-item>
      </bottom-sheet>
      <anypoint-button emphasis="high" @click="${this._open}">Open menu</anypoint-button>

      <h3>Open with ...</h3>
      <bottom-sheet class="center-bottom" label="Open with ..." noPadding>
        <anypoint-icon-item>
          <img class="icon" src="inbox.png" alt="icon" slot="item-icon">
          Inbox
        </anypoint-icon-item>
        <anypoint-icon-item>
          <img class="icon" src="keep.png" alt="icon" slot="item-icon">
          Keep
        </anypoint-icon-item>
        <anypoint-icon-item>
          <img class="icon" src="hangouts.png" alt="icon" slot="item-icon">
          Hangouts
        </anypoint-icon-item>
        <anypoint-icon-item>
          <img class="icon" src="messenger.png" alt="icon" slot="item-icon">
          Messenger
        </anypoint-icon-item>
        <anypoint-icon-item>
          <img class="icon" src="gplus.png" alt="icon" slot="item-icon">
          Google+
        </anypoint-icon-item>
      </bottom-sheet>
      <anypoint-button emphasis="high" @click="${this._open}">Open with ...</anypoint-button>

      <h3>Scrollable content</h3>
      <bottom-sheet class="center-bottom" label="Images (might take time to load)">
        <img alt="i1" src="http://loremflickr.com/400/400/?random=0">
        <img alt="i2" src="http://loremflickr.com/400/400/?random=1">
        <img alt="i3" src="http://loremflickr.com/400/400/?random=2">
        <img alt="i4" src="http://loremflickr.com/400/400/?random=3">
        <img alt="i5" src="http://loremflickr.com/400/400/?random=4">
        <img alt="i6" src="http://loremflickr.com/400/400/?random=5">
        <img alt="i7" src="http://loremflickr.com/400/400/?random=6">
        <img alt="i8" src="http://loremflickr.com/400/400/?random=7">
        <img alt="i9" src="http://loremflickr.com/400/400/?random=8">
        <img alt="i10" src="http://loremflickr.com/400/400/?random=9">
      </bottom-sheet>
      <anypoint-button emphasis="high" @click="${this._open}">Open</anypoint-button>
    </div>
    `, document.querySelector('#demo') as HTMLElement);
  }
}
const instance = new DemoPage();
instance.render();

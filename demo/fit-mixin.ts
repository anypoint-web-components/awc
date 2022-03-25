/* eslint-disable no-plusplus */
/* eslint-disable lit-a11y/click-events-have-key-events */
import { html, render } from "lit";
import { SimpleFit } from './simple-fit.js';

class DemoPage {
  containers: number[] = [];

  constructor() {
    for (let i = 0; i < 30; i++) {
      this.containers[i] = i + 1;
    }

    this._updatePositionTarget = this._updatePositionTarget.bind(this);
    this._updateAlign = this._updateAlign.bind(this);
    this._toggleNoOverlap = this._toggleNoOverlap.bind(this);
    this._toggleDynamicAlign = this._toggleDynamicAlign.bind(this);
    this._windowRefit = this._windowRefit.bind(this);

    window.addEventListener("resize", this._windowRefit);
    window.addEventListener("scroll", this._windowRefit);
  }

  get fit(): SimpleFit {
    return document.getElementById("myFit") as SimpleFit;
  }

  _windowRefit(): void {
    this.fit.refit();
  }

  _updatePositionTarget(e: any): void {
    let { target } = e;
    const myFit = this.fit;
    target = myFit.positionTarget === target ? myFit._defaultPositionTarget : target;
    (myFit.positionTarget! as HTMLElement).style.backgroundColor = "";
    target.style.backgroundColor = "orange";
    myFit.positionTarget = target;
    myFit.refit();
  }

  _updateAlign(e: any): void {
    const { target } = e;
    if (target.hasAttribute("horizontalAlign")) {
      this.fit.horizontalAlign = target.getAttribute("horizontalAlign");
      const children = target.parentNode.querySelectorAll("[horizontalAlign]");
      for (let i = 0; i < children.length; i++) {
        if (children[i] === target) {
          if (!children[i].classList.contains("selected")) {
            children[i].classList.add("selected");
          }
        } else if (children[i].classList.contains("selected")) {
          children[i].classList.remove("selected");
        }
      }
    }
    if (target.hasAttribute("verticalAlign")) {
      this.fit.verticalAlign = target.getAttribute("verticalAlign");
      const children = target.parentNode.querySelectorAll("[verticalAlign]");
      for (let i = 0; i < children.length; i++) {
        if (children[i] === target) {
          if (!children[i].classList.contains("selected")) {
            children[i].classList.add("selected");
          }
        } else if (children[i].classList.contains("selected")) {
          children[i].classList.remove("selected");
        }
      }
    }
    this.fit.refit();
  }

  _toggleNoOverlap(e: any): void {
    this.fit.noOverlap = !this.fit.noOverlap;
    const { target } = e;
    if (this.fit.noOverlap) {
      if (!target.classList.contains("selected")) {
        target.classList.add("selected");
      }
    } else if (target.classList.contains("selected")) {
        target.classList.remove("selected");
      }
    this.fit.refit();
  }

  _toggleDynamicAlign(e: any): void {
    this.fit.dynamicAlign = !this.fit.dynamicAlign;
    const { target } = e;
    if (this.fit.dynamicAlign) {
      if (!target.classList.contains("selected")) {
        target.classList.add("selected");
      }
    } else if (target.classList.contains("selected")) {
      target.classList.remove("selected");
    }
    this.fit.refit();
  }

  render(): void {
    render(
      html`<h3>
          An element with <code>FitMixin</code> can be centered in
          <code>fitInto</code> or positioned around a
          <code>positionTarget</code>
        </h3>

        ${this.containers.map(
          (i) => html`<div class="target" @click="${this._updatePositionTarget}">
              Target #${i}
            </div>`
        )}

        <simple-fit id="myFit" verticalOffset="24" autoFitOnAttach>
          <h2>Align</h2>
          <p>
            <button @click="${this._updateAlign}" verticalAlign="top">
              top
            </button>
            <button @click="${this._updateAlign}" verticalAlign="middle">
              middle
            </button>
            <button @click="${this._updateAlign}" verticalAlign="bottom">
              bottom
            </button>
            <button @click="${this._updateAlign}" verticalAlign="auto">
              auto
            </button>
            <button @click="${this._updateAlign}" verticalAlign>null</button>
          </p>
          <p>
            <button @click="${this._updateAlign}" horizontalAlign="left">
              left
            </button>
            <button @click="${this._updateAlign}" horizontalAlign="center">
              center
            </button>
            <button @click="${this._updateAlign}" horizontalAlign="right">
              right
            </button>
            <button @click="${this._updateAlign}" horizontalAlign="auto">
              auto
            </button>
            <button @click="${this._updateAlign}" horizontalAlign>null</button>
          </p>
          <button @click="${this._toggleNoOverlap}">no overlap</button>
          <button @click="${this._toggleDynamicAlign}">dynamic align</button>
        </simple-fit> `,
      document.querySelector("#demo") as HTMLElement
    );
  }
}

const instance = new DemoPage();
instance.render();

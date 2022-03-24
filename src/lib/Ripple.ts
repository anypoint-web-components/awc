// eslint-disable-next-line import/no-cycle
import { ElementMetrics } from './ElementMetrics.js';
import * as Utility from './Utility.js';
// eslint-disable-next-line import/no-cycle
import MaterialRippleElement from '../elements/MaterialRippleElement.js';

export class Ripple {
  static get MAX_RADIUS(): number {
    return 300;
  }

  get recenters(): boolean {
    return this.element.recenters || false;
  }

  get center(): boolean {
    return this.element.center || false;
  }

  get mouseDownElapsed(): number {
    if (!this.mouseDownStart) {
      return 0;
    }
    let elapsed = Utility.now() - this.mouseDownStart;
    if (this.mouseUpStart) {
      elapsed -= this.mouseUpElapsed;
    }
    return elapsed;
  }

  get mouseUpElapsed(): number {
    return this.mouseUpStart ? Utility.now() - this.mouseUpStart : 0;
  }

  get mouseDownElapsedSeconds(): number {
    return this.mouseDownElapsed / 1000;
  }

  get mouseUpElapsedSeconds(): number {
    return this.mouseUpElapsed / 1000;
  }

  get mouseInteractionSeconds(): number {
    return this.mouseDownElapsedSeconds + this.mouseUpElapsedSeconds;
  }

  get initialOpacity(): number {
    return this.element.initialOpacity;
  }

  get opacityDecayVelocity(): number {
    return this.element.opacityDecayVelocity;
  }

  get radius(): number {
    const width2 = this.containerMetrics.width * this.containerMetrics.width;
    const height2 = this.containerMetrics.height * this.containerMetrics.height;
    const waveRadius = Math.min(Math.sqrt(width2 + height2), Ripple.MAX_RADIUS) * 1.1 + 5;

    const duration = 1.1 - 0.2 * (waveRadius / Ripple.MAX_RADIUS);
    const timeNow = this.mouseInteractionSeconds / duration;
    const size = waveRadius * (1 - 80 ** -timeNow);

    return Math.abs(size);
  }

  get opacity(): number {
    if (!this.mouseUpStart) {
      return this.initialOpacity;
    }
    return Math.max(0, this.initialOpacity - this.mouseUpElapsedSeconds * this.opacityDecayVelocity);
  }

  get outerOpacity(): number {
    // Linear increase in background opacity, capped at the opacity
    // of the wavefront (waveOpacity).
    const outerOpacity = this.mouseUpElapsedSeconds * 0.3;
    const waveOpacity = this.opacity;

    return Math.max(0, Math.min(outerOpacity, waveOpacity));
  }

  get isOpacityFullyDecayed(): boolean {
    return this.opacity < 0.01 && this.radius >= Math.min(this.maxRadius, Ripple.MAX_RADIUS);
  }

  get isRestingAtMaxRadius(): boolean {
    return this.opacity >= this.initialOpacity && this.radius >= Math.min(this.maxRadius, Ripple.MAX_RADIUS);
  }

  get isAnimationComplete(): boolean {
    return this.mouseUpStart ? this.isOpacityFullyDecayed : this.isRestingAtMaxRadius;
  }

  get translationFraction(): number {
    return Math.min(1, this.radius / this.containerMetrics.size * 2 / Math.sqrt(2));
  }

  get xNow(): number {
    if (this.xEnd) {
      return this.xStart + this.translationFraction * (this.xEnd - this.xStart);
    }
    return this.xStart;
  }

  get yNow(): number {
    if (this.yEnd) {
      return this.yStart + this.translationFraction * (this.yEnd - this.yStart);
    }
    return this.yStart;
  }

  get isMouseDown(): boolean {
    return !!this.mouseDownStart && !this.mouseUpStart;
  }

  element: MaterialRippleElement;

  color: string;

  wave: HTMLDivElement;

  waveContainer: HTMLDivElement;

  maxRadius = 0;

  mouseDownStart = 0;

  mouseUpStart = 0;

  xStart = 0;

  yStart = 0;

  xEnd = 0;

  yEnd = 0;

  slideDistance = 0;

  containerMetrics: ElementMetrics;
  
  constructor(element: MaterialRippleElement) {
    this.element = element;
    this.color = window.getComputedStyle(element).color;

    this.wave = document.createElement('div');
    this.waveContainer = document.createElement('div');
    this.wave.style.backgroundColor = this.color;
    this.wave.classList.add('wave');
    this.waveContainer.classList.add('wave-container');
    this.waveContainer.appendChild(this.wave);
    this.containerMetrics = new ElementMetrics(this.element);
    this.resetInteractionState();
  }

  resetInteractionState(): void {
    this.maxRadius = 0;
    this.mouseDownStart = 0;
    this.mouseUpStart = 0;

    this.xStart = 0;
    this.yStart = 0;
    this.xEnd = 0;
    this.yEnd = 0;
    this.slideDistance = 0;

    this.containerMetrics = new ElementMetrics(this.element);
  }

  draw(): void {
    this.wave.style.opacity = String(this.opacity);

    const scale = this.radius / (this.containerMetrics.size / 2);
    const dx = this.xNow - (this.containerMetrics.width / 2);
    const dy = this.yNow - (this.containerMetrics.height / 2);


    // 2d transform for safari because of border-radius and overflow:hidden
    // clipping bug. https://bugs.webkit.org/show_bug.cgi?id=98538
    this.waveContainer.style.webkitTransform = `translate(${  dx  }px, ${  dy  }px)`;
    this.waveContainer.style.transform = `translate3d(${  dx  }px, ${  dy  }px, 0)`;
    this.wave.style.webkitTransform = `scale(${  scale  },${  scale  })`;
    this.wave.style.transform = `scale3d(${  scale  },${  scale  },1)`;
  }

  downAction(event?: MouseEvent): void {
    const xCenter = this.containerMetrics.width / 2;
    const yCenter = this.containerMetrics.height / 2;

    this.resetInteractionState();
    this.mouseDownStart = Utility.now();

    if (this.center) {
      this.xStart = xCenter;
      this.yStart = yCenter;
      this.slideDistance = Utility.distance(this.xStart, this.yStart, this.xEnd, this.yEnd);
    } else {
      this.xStart = event ? event.x - this.containerMetrics.boundingRect.left : this.containerMetrics.width / 2;
      this.yStart = event ? event.y - this.containerMetrics.boundingRect.top : this.containerMetrics.height / 2;
    }

    if (this.recenters) {
      this.xEnd = xCenter;
      this.yEnd = yCenter;
      this.slideDistance = Utility.distance(this.xStart, this.yStart, this.xEnd, this.yEnd);
    }

    this.maxRadius = this.containerMetrics.furthestCornerDistanceFrom(this.xStart, this.yStart);

    this.waveContainer.style.top = `${(this.containerMetrics.height - this.containerMetrics.size) / 2}px`;
    this.waveContainer.style.left = `${(this.containerMetrics.width - this.containerMetrics.size) / 2}px`;

    this.waveContainer.style.width = `${this.containerMetrics.size}px`;
    this.waveContainer.style.height = `${this.containerMetrics.size}px`;
  }

  upAction(): void {
    if (!this.isMouseDown) {
      return;
    }
    this.mouseUpStart = Utility.now();
  }

  remove(): void {
    this.waveContainer.parentNode?.removeChild(this.waveContainer);
  }
}

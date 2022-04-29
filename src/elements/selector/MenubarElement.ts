import MenuElement from "./MenuElement.js";

export default class MenubarElement extends MenuElement {
  get _isRTL(): boolean {
    return window.getComputedStyle(this).direction === 'rtl';
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.getAttribute('role') === 'menu') {
      this.setAttribute('role', 'menubar');
    }
  }

  _onUpKey(e: KeyboardEvent): void {
    this.focusedItem?.click();
    e.preventDefault();
  }

  _onDownKey(e: KeyboardEvent): void {
    this.focusedItem?.click();
    e.preventDefault();
  }

  _onLeftKey(e: KeyboardEvent): void {
    if (this._isRTL) {
      this.focusNext();
    } else {
      this.focusPrevious();
    }
    e.preventDefault();
  }

  _onRightKey(e: KeyboardEvent): void {
    if (this._isRTL) {
      this.focusPrevious();
    } else {
      this.focusNext();
    }
    e.preventDefault();
  }

  _onKeydown(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft') {
      this._onLeftKey(e);
    } else if (e.code === 'ArrowRight') {
      this._onRightKey(e);
    } else {
      super._onKeydown(e);
    }
  }
}

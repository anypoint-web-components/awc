import { ArcOverlayMixin } from '@advanced-rest-client/arc-overlay-mixin';

declare function AnypointDialogMixin<T extends new (...args: any[]) => {}>(base: T): T & AnypointDialogMixinConstructor;
interface AnypointDialogMixinConstructor {
  new(...args: any[]): AnypointDialogMixin;
}
interface AnypointDialogMixin extends ArcOverlayMixin {
  /**
   * If `modal` is true, this implies `noCancelOnOutsideClick`,
   * `noCancelOnEscKey` and `withBackdrop`.
   * @attribute
   */
  modal?: boolean;

  connectedCallback(): void;

  disconnectedCallback(): void;

  _updateClosingReasonConfirmed(confirmed: boolean): void;

  _isTargetClosingReason(target: Node): boolean;

  _clickHandler(e: PointerEvent): void;
  /**
   * Handler for the resize event dispatched by the children. 
   * Causes the content to resize.
   */
  _resizeHandler(): void;

  _modalChanged(modal: boolean): void;
}
export {AnypointDialogMixinConstructor};
export {AnypointDialogMixin};

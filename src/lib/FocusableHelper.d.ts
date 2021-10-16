
export declare class FocusableHelper {

  /**
   * Returns a sorted array of tabbable nodes, including the root node.
   * It searches the tabbable nodes in the light and shadow dom of the children,
   * sorting the result by tabindex.
   */
  getTabbableNodes(node: Node): HTMLElement[];

  /**
   * Returns if a element is focusable.
   */
  isFocusable(element: HTMLElement): boolean;

  /**
   * Returns if a element is tabbable. To be tabbable, a element must be
   * focusable, visible, and with a tabindex !== -1.
   */
  isTabbable(element: HTMLElement): boolean;
}

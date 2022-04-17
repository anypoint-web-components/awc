export class AnypointSelection {
  multi = false;

  selection: unknown[] = [];

  selectCallback: Function;

  constructor(selectCallback: Function) {
    this.selectCallback = selectCallback;
  }

  /**
   * Retrieves the selected item(s).
   *
   * @returns Returns the selected item(s). If the multi property is true,
   * `get` will return an array, otherwise it will return
   * the selected item or undefined if there is no selection.
   */
  get(): unknown {
    return this.multi ? this.selection.slice() : this.selection[0];
  }

  /**
   * Clears all the selection except the ones indicated.
   *
   * @param excludes items to be excluded.
   */
  clear(excludes?: unknown[]): void {
    this.selection.slice().forEach((item) => {
      if (!excludes || excludes.indexOf(item) === -1) {
        this.setItemSelected(item, false);
      }
    });
  }

  /**
   * Indicates if a given item is selected.
   *
   * @param item The item whose selection state should be checked.
   * @return Returns true if `item` is selected.
   */
  isSelected(item: unknown): boolean {
    return this.selection.indexOf(item) >= 0;
  }

  /**
   * Sets the selection state for a given item to either selected or deselected.
   *
   * @param item The item to select.
   * @param isSelected True for selected, false for deselected.
   */
  setItemSelected(item: unknown, isSelected?: boolean): void {
    if (item !== null) {
      if (isSelected !== this.isSelected(item)) {
        // proceed to update selection only if requested state differs from
        // current
        if (isSelected) {
          this.selection.push(item);
        } else {
          const i = this.selection.indexOf(item);
          if (i >= 0) {
            this.selection.splice(i, 1);
          }
        }
        if (this.selectCallback) {
          this.selectCallback(item, isSelected);
        }
      }
    }
  }

  /**
   * Sets the selection state for a given item. If the `multi` property
   * is true, then the selected state of `item` will be toggled; otherwise
   * the `item` will be selected.
   *
   * @param item The item to select.
   */
  select(item: unknown): void {
    if (this.multi) {
      this.toggle(item);
    } else if (this.get() !== item) {
      this.setItemSelected(this.get(), false);
      this.setItemSelected(item, true);
    }
  }

  /**
   * Toggles the selection state for `item`.
   *
   * @param item The item to toggle.
   */
  toggle(item: unknown): void {
    this.setItemSelected(item, !this.isSelected(item));
  }
}

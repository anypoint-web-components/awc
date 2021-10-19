import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  cursor: pointer;
  position: relative;
}

.picker,
.box {
  width: var(--color-selector-width, 34px);
  height: var(--color-selector-height, 24px);
}

.picker {
  opacity: 0;
  position: absolute;
  cursor: pointer;
}

.box {
  border: 1px solid var(--color-selector-border-color, #E5E5E5);
}
`;

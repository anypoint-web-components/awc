import { css } from 'lit-element';

export default css`
:host {
  display: block;
  position: fixed;
  background-color: var(--bottom-sheet-background-color, #fff);
  color: var(--bottom-sheet-color, #323232);
  min-height: 48px;
  min-width: 288px;
  bottom: 0px;
  left: 0px;
  box-sizing: border-box;
  box-shadow: var(--bottom-sheet-box-shadow, 0 2px 5px 0 rgba(0, 0, 0, 0.26));
  border-radius: 2px;
  margin: 0 12px;
  font-size: 14px;
  cursor: default;
  -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
  transition: transform 0.3s, opacity 0.3s;
  opacity: 0;
  -webkit-transform: translateY(100px);
  transform: translateY(100px);
  max-width: var(--bottom-sheet-max-width);
  max-height: var(--bottom-sheet-max-height);
}

:host(.fit-bottom) {
  width: 100%;
  min-width: 0;
  border-radius: 0;
  margin: 0;
}

:host(.center-bottom) {
  left: initial;
}

:host(.bottom-sheet-open) {
  opacity: 1;
  -webkit-transform: translateY(0px);
  transform: translateY(0px);
}

label {
  white-space: var(--arc-font-nowrap-white-space);
  overflow: var(--arc-font-nowrap-overflow);
  text-overflow: var(--arc-font-nowrap-text-overflow);
  font-size: var(--arc-font-caption-font-size);
  font-weight: var(--arc-font-caption-font-weight);
  line-height: var(--arc-font-caption-line-height);
  letter-spacing: var(--arc-font-caption-letter-spacing);

  height: 48px;
  color: var(--bottom-sheet-label-color, rgba(0, 0, 0, 0.54));
  display: block;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
}

[hidden] {
  display: none !important;
}

.scrollable {
  padding: 24px;
  max-height: calc(100vh - 52px);
  -webkit-overflow-scrolling: touch;
  overflow: auto;
}

:host([no-padding]) .scrollable {
  padding: 0;
}
`;

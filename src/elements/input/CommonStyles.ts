import { css } from 'lit';

export default css`
:host {
  /* Default size of an <input> */
  width: 200px;

  display: inline-block;
  text-align: left;
  cursor: default;
  outline: none;
  height: var(--anypoint-input-height, 56px);
  box-sizing: border-box;
  position: relative;
  /* Anypoint UI controls margin in forms */
  margin: 20px 8px;
}

.hidden {
  display: none !important;
}

:host([disabled]) .input-container {
  opacity: var(--anypoint-input-disabled-opacity, 0.43);
  border-bottom: 1px dashed var(--anypoint-input-border-color, var(--secondary-text-color));
}

.input-container {
  display: inline-flex;
  flex-direction: row;
  align-items: center;

  height: inherit;
  min-height: inherit;
  width: 100%;
  background-color: var(--anypoint-input-background-color, #f5f5f5);

  border: 1px var(--anypoint-input-border-color, transparent) solid;
  border-radius: 4px 4px 0 0;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: var(--anypoint-input-border-bottom-color, #8e8e8e);
  transition: border-bottom-color 0.22s linear;
  transform-origin: center center;

  cursor: text;
}

:host([focused]) .input-container {
  border-bottom-color: var(--anypoint-input-focused-border-bottom-color, var(--accent-color));
}

:host([invalid]) .input-container {
  border-bottom-color: var(--anypoint-input-error-color, var(--error-color)) !important;
}

.label {
  position: absolute;
  transition: transform 0.12s ease-in-out, max-width 0.12s ease-in-out;
  will-change: top;
  border-radius: 3px;
  margin: 0;
  padding: 0;
  left: 8px;
  top: calc(100% / 2 - calc(1rem / 2));
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  z-index: 1;
  will-change: transform;
  max-width: calc(100% - 16px);
  text-overflow: clip;
  color: var(--anypoint-input-label-color, #616161);
  transform-origin: left top;
}

.label.floating {
  transform: translateY(-80%) scale(0.75);
  max-width: calc(100% + 20%);
}

:host([invalid]) .label {
  color: var(--anypoint-input-error-color, var(--error-color)) !important;
}

.label-area {
  position: relative;
  align-self: stretch;
  /* Gives the input at least 50% of the width */
  flex: 1 0 var(--anypoint-input-input-min-width, 50%);
  display: flex;
}

.input-element {
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  /* padding top to separate from the label */
  padding: 8px 8px 0 8px;
  box-sizing: border-box;
  color: var(--anypoint-input-input-color, inherit);
  font-size: 1rem;
  box-shadow: none;
}

.prefixes,
.suffixes {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 4px 0px;
}

.assistive-info {
  overflow: hidden;
  height: var(--anypoint-input-assistive-height, 20px);
}

.invalid,
.info {
  padding: 0;
  margin: 0 0 0 8px;
  font-size: 0.875rem;
  transition: transform 0.12s ease-in-out;
}

.info {
  color: var(--anypoint-input-info-message-color, #616161);
}

.info.label-hidden {
  transform: translateY(-200%);
}

.invalid {
  color: var(--anypoint-input-error-color, var(--error-color));
}

.invalid.label-hidden,
.invalid.info-offset.label-hidden {
  transform: translateY(-200%);
}

.invalid.info-offset {
  transform: translateY(-1.2rem);
}

/* Outlined theme */
:host([outlined]) .input-container {
  border: 1px var(--anypoint-input-border-color, #8e8e8e) solid;
  background-color: var(--anypoint-input-background-color, #fff);
  border-radius: 4px;
  transition: border-bottom-color 0.22s linear;
}

:host([outlined]) .input-element {
  padding-top: 0px;
}

:host([outlined]) .label.floating {
  background-color: var(--anypoint-input-label-background-color, white);
  transform: translateY(calc(-100% - calc(1rem / 2))) scale(0.75);
  max-width: 120%;
  padding: 0 2px;
  left: 6px;
}

:host([outlined]) .label.floating.with-prefix {
  left: -22px;
}

/* Anypoint theme */

:host([anypoint]) {
  height: 40px;
  margin-top: 25px;
}

:host([anypoint]) .input-container {
  border: none;
  border-left: 2px var(--anypoint-input-border-color, #8e8e8e) solid;
  border-right: 2px var(--anypoint-input-border-color, #8e8e8e) solid;
  border-radius: 0;
  box-sizing: border-box;
}

:host([anypoint]) .label.anypoint {
  top: -22px;
}

:host([anypoint][focused]) .input-container,
:host([anypoint]:hover) .input-container {
  border-left-color: var(--anypoint-input-anypoint-focus-border-color, var(--anypoint-input-compatibility-focus-border-color, #58595a));
  border-right-color: var(--anypoint-input-anypoint-focus-border-color, var(--anypoint-input-compatibility-focus-border-color, #58595a));
  background-color: var(--anypoint-input-anypoint-focus-background-color, var(--anypoint-input-compatibility-focus-background-color, #f9fafb));
}

:host([anypoint][invalid]) .input-container {
  border-left-color: var(--anypoint-input-error-color, var(--error-color));
  border-right-color: var(--anypoint-input-error-color, var(--error-color));
}

:host([anypoint]) .input-element {
  padding: 0 10px;
}

:host([anypoint]) .label {
  font-size: 0.935rem;
  left: -2px;
  top: -18px;
  transform: none;
  font-weight: 500;
  color: var(--anypoint-input-anypoint-label-color, #616161);
}

:host([anypoint]) .label.with-prefix {
  left: -34px;
}

:host([anypoint]) .invalid,
:host([anypoint]) .info {
  margin-left: 0px;
}

:host([nolabelfloat][anypoint]) {
  margin-top: 0px;
}

:host([nolabelfloat][anypoint]) .label.resting {
  top: calc(100% / 2 - 8px);
  left: 10px;
}

/* No label float */
:host([nolabelfloat]) .input-element {
  padding-top: 0px;
}
`;

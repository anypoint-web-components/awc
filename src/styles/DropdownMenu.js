import { css } from 'lit-element';

export default css`
  :host {
    /* Default size of an <input> */
    width: 200px;
    display: inline-block;
    position: relative;
    text-align: left;
    outline: none;
    height: 56px;
    box-sizing: border-box;
    font-size: 1rem;
    /* Anypoint UI controls margin in forms */
    margin: 16px 8px;
  }

  .hidden {
    display: none !important;
  }

  .trigger-button.form-disabled {
    pointer-events: none;
    opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.43);
  }

  .label.resting.form-disabled {
    opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.43);
  }

  :host([nolabelfloat]) {
    height: 40px;
  }

  .input-container {
    position: relative;
    height: 100%;
    /* width: inherit; */
    background-color: var(--anypoint-dropdown-menu-background-color, #f5f5f5);

    border: 1px var(--anypoint-dropdown-menu-border-color, transparent) solid;
    border-radius: 4px 4px 0 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: var(
      --anypoint-dropdown-menu-border-bottom-color,
      #8e8e8e
    );
    transition: border-bottom-color 0.22s linear;
    transform-origin: center center;

    cursor: default;
  }

  :host([invalid]) .input-container,
  :host(:invalid) .input-container {
    border-bottom: 1px solid
      var(--anypoint-dropdown-error-color, var(--error-color)) !important;
  }

  .input-container.form-disabled {
    opacity: var(--anypoint-dropdown-menu-disabled-opacity, 0.43);
    border-bottom: 1px dashed
      var(--anypoint-dropdown-menu-color, var(--secondary-text-color));
  }

  :host([opened]) .input-container,
  :host([focused]) .input-container,
  :host(:focus) .input-container {
    border-bottom-color: var(
      --anypoint-dropdown-menu-hover-border-color,
      var(--anypoint-color-coreBlue3)
    );
  }

  .input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    position: relative;
  }

  .input {
    flex: 1;
    margin: 12px 0px 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 40px);
  }

  :host(:dir(rtl)) .input {
    text-align: right;
    margin: 0px 8px 0px 0px;
  }

  :host([dir='rtl']) .input {
    text-align: right;
    margin: 12px 8px 0px 0px;
  }

  :host([nolabelfloat]) .input {
    margin-top: 0 !important;
  }

  .input-spacer {
    visibility: hidden;
    margin-left: -12px;
  }

  .label {
    position: absolute;
    transition: transform 0.12s ease-in-out, max-width 0.12s ease-in-out;
    will-change: transform;
    border-radius: 3px;
    margin: 0;
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    z-index: 1;
    max-width: calc(100% - 16px);
    text-overflow: clip;
    color: var(--anypoint-dropdown-menu-label-color, #616161);
    transform-origin: left top;
    left: 8px;
    top: calc(100% / 2 - 8px);
    font-size: 1rem;
  }

  :host(:dir(rtl)) .label {
    text-align: right;
    right: 8px;
    left: auto;
  }
  /* Not every browser support syntax above and for those who doesn't
  this style has to be repeated or it won't be applied. */
  :host([dir='rtl']) .label {
    text-align: right;
    right: 8px;
    left: auto;
    transform-origin: right top;
  }

  .label.resting {
    transform: translateY(0) scale(1);
  }

  .label.floating {
    transform: translateY(-80%) scale(0.75);
    max-width: calc(100% + 20%);
  }

  :host([nolabelfloat]:not([compatibility])) .label.floating {
    display: none !important;
  }

  :host([invalid]) .label,
  :host(:invalid) .label {
    color: var(--anypoint-dropdown-error-color, var(--error-color)) !important;
  }

  .trigger-icon {
    transform: rotate(0);
    transition: transform 0.12s ease-in-out;
    will-change: transform;
    color: var(--anypoint-dropdown-menu-label-color, #616161);
    fill: currentColor;
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .trigger-icon.opened {
    transform: rotate(-180deg);
  }

  :host([opened]) .trigger-icon,
  :host([focused]) .trigger-icon,
  :host(:focus) .trigger-icon {
    color: var(
      --anypoint-dropdown-menu-trigger-icon-active-color,
      var(--primary-color)
    );
  }

  anypoint-dropdown {
    margin-top: 58px;
    width: auto;
  }

  .dropdown-content {
    box-shadow: var(--anypoint-dropdown-shadow, var(--anypoiont-dropdown-shaddow));
    border-radius: var(--anypoint-dropdown-border-radius);
  }

  :host([verticalalign='bottom']) anypoint-dropdown {
    margin-bottom: 56px;
    margin-top: auto;
  }

  :host([nolabelfloat]) anypoint-dropdown {
    margin-top: 40px;
  }

  .assistive-info {
    overflow: hidden;
    margin-top: -2px;
    height: 20px;
    position: absolute;
  }

  .invalid,
  .info {
    padding: 0;
    margin: 0 0 0 8px;
    font-size: 0.875rem;
    transition: transform 0.12s ease-in-out;
  }

  .info {
    color: var(--anypoint-dropdown-menu-info-message-color, #616161);
  }

  .info.label-hidden {
    transform: translateY(-200%);
  }

  .invalid {
    color: var(--anypoint-dropdown-menu-error-color, var(--error-color));
  }

  .invalid.label-hidden,
  .invalid.info-offset.label-hidden {
    transform: translateY(-200%);
  }

  .invalid.info-offset {
    transform: translateY(-100%);
  }

  /* Outlined theme */
  :host([outlined]) .input-container {
    border: 1px var(--anypoint-dropdown-menu-border-color, #8e8e8e) solid;
    background-color: var(--anypoint-dropdown-menu-background-color, #fff);
    border-radius: 4px;
    transition: border-bottom-color 0.22s linear;
  }

  :host([outlined]) .input {
    margin-top: 0;
  }

  :host([outlined]) .label.resting {
    margin-top: 0;
    top: calc(100% / 2 - 8px);
  }

  :host([outlined]) .label.floating {
    background-color: var(
      --anypoint-dropdown-menu-label-background-color,
      white
    );
    transform: translateY(-130%) scale(0.75);
    max-width: 120%;
    padding: 0 2px;
    left: 6px;
  }

  :host([outlined][invalid]) .input-container,
  :host([outlined]:invalid) .input-container {
    border: 1px solid var(--anypoint-dropdown-error-color, var(--error-color)) !important;
  }

  /* Anypoint compatibility theme */

  :host([compatibility]) {
    height: 40px;
    margin-top: 25px;
  }

  :host([compatibility]) .label.compatibility {
    top: -22px;
  }

  :host([compatibility]) .input-container {
    border: none;
    border-left: 2px var(--anypoint-dropdown-menu-border-color, #8e8e8e) solid;
    border-right: 2px var(--anypoint-dropdown-menu-border-color, #8e8e8e) solid;
    border-radius: 0;
    box-sizing: border-box;
  }

  :host([compatibility][focused]) .input-container,
  :host([compatibility]:hover) .input-container {
    border-left-color: var(
      --anypoint-dropdown-menu-compatibility-focus-border-color,
      #58595a
    );
    border-right-color: var(
      --anypoint-dropdown-menu-compatibility-focus-border-color,
      #58595a
    );
    background-color: var(
      --anypoint-dropdown-menu-compatibility-focus-background-color,
      #f9fafb
    );
  }

  :host([compatibility][invalid]) .input-container {
    border-left-color: var(
      --anypoint-dropdown-menu-error-color,
      var(--error-color)
    );
    border-right-color: var(
      --anypoint-dropdown-menu-error-color,
      var(--error-color)
    );
    border-bottom: none !important;
  }

  :host([compatibility]) .label {
    font-size: 0.875rem;
    left: -2px;
    top: -18px;
    transform: none;
    font-weight: 500;
    color: var(--anypoint-dropdown-menu-compatibility-label-color, #616161);
  }

  :host([compatibility]) anypoint-dropdown {
    margin-top: 40px;
  }

  :host([compatibility]) .input {
    margin-top: 0;
  }

  :host([compatibility]) .invalid,
  :host([compatibility]) .info {
    margin-left: 0px;
  }

  :host([nolabelfloat][compatibility]) {
    margin-top: 0px;
  }

  :host([compatibility]) anypoint-dropdown {
    border-bottom: 2px var(--anypoint-dropdown-menu-border-color, #e0e0e0) solid;
    border-top: 2px var(--anypoint-dropdown-menu-border-color, #e0e0e0) solid;
  }

  :host([compatibility]) .dropdown-content {
    box-shadow: none;
  }

  :host([nolabelfloat][compatibility]) .label.resting {
    top: calc(100% / 2 - 8px);
    left: 10px;
    font-size: 1rem;
  }
`;

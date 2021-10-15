import { css } from 'lit-element';

export default css`
:host {
  display: flex;
  flex-direction: row;
  border: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
  border-radius: 4px;
  min-height: 300px;
  margin: 40px 0;
  transition: box-shadow 0.23s cubic-bezier(0.4, 0, 0.2, 1);
  --anypoint-tabs-selection-bar-color: var(--arc-interactive-demo-tab-selection-color, #2196f3);
}

:host(:hover) {
  box-shadow: 0 0 8px 0 rgba(0,0,0,.08),
              0 0 15px 0 rgba(0,0,0,.02),
              0 0 20px 4px rgba(0,0,0,.06);
}

.demo-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.demo-config {
  width: 0px;
  overflow: hidden;
  box-sizing: border-box;
  transition: width 0.12s ease-in-out;
}

.demo-config.opened {
  width: var(--arc-interactive-demo-config-width, 160px);
  overflow: auto;
  border-left: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
}

.content-selector {
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
  height: 48px;
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.content ::slotted([hidden]) {
  display: none !important;
}

anypoint-tabs {
  margin: 0 12px;
  flex: 1;
}

anypoint-tab {
  flex: none;
  color: var(--arc-interactive-demo-options-color, #757575);
}

.config-title {
  display: flex;
  align-items: center;
  flex-direction: row;
  border-bottom: 1px var(--arc-interactive-demo-border-color, #e5e5e5) solid;
  padding-left: 12px;
  color: var(--arc-interactive-demo-options-color, #757575);
  height: 48px;
}

.config-title h3 {
  flex: 1;
  font-size: .875rem;
  line-height: 1.25rem;
  font-weight: 400;
}

.options {
  padding-left: 12px;
}

.options ::slotted(label) {
  font-size: .875rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: var(--arc-interactive-demo-options-color, #757575);
  display: block;
  padding: 12px 8px 4px 0px;
}

:host([dark]) anypoint-tab {
  color: var(--arc-interactive-demo-header-color, #EEEEEE);
}

:host([dark]) .config-title {
  color: var(--arc-interactive-demo-header-color, #EEEEEE);
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}`;

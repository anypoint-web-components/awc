import { css } from 'lit-element';

export default css`
  :host {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 48px;
    font-size: 1rem;
    font-weight: 500;
    overflow: hidden;
    user-select: none;
    /* NOTE: Both values are needed, since some phones require the value to be "transparent". */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }

  :host(:dir(rtl)) {
    flex-direction: row-reverse;
  }

  #tabsContainer {
    position: relative;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    flex: 1 1 auto;
  }
  
  #tabsContent {
    height: 100%;
    flex-basis: auto;
  }

  #tabsContent.scrollable {
    white-space: nowrap;
  }

  #tabsContent:not(.scrollable),
  #tabsContent.fit-container {
    display: flex;
    flex-direction: row;
  }

  #tabsContent.fit-container {
    min-width: 100%;
  }

  #tabsContent.fit-container > ::slotted(*) {
    /* IE - prevent tabs from compressing when they should scroll. */
    flex: 1 0 auto;
  }

  .hidden {
    display: none;
  }

  anypoint-icon-button {
    width: 40px;
    height: 40px;
    margin: 0 4px;
  }

  .icon {
    width: 24px;
    height: 24px;
    display: block;
    fill: currentColor;
  }

  #selectionBar {
    position: absolute;
    height: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 2px solid
      var(--anypoint-tabs-selection-bar-color, var(--accent-color));
    -webkit-transform: scale(0);
    transform: scale(0);
    transform-origin: left center;
    transition: transform 0.15s cubic-bezier(0.4, 0, 1, 1);
    z-index: var(--anypoint-tabs-selection-bar-zindex);
  }

  :host([noslide]) #selectionBar {
    transition: none;
  }

  #selectionBar.align-bottom {
    top: 0;
    bottom: auto;
  }

  #selectionBar.expand {
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  #selectionBar.contract {
    transition-duration: 0.18s;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }

  #tabsContent > ::slotted(*) {
    height: 100%;
  }

  #tabsContent:not(.fit-container) > ::slotted(*) {
    flex: none;
  }

  :host([compatibility]) ::slotted(anypoint-tab) {
    text-transform: none;
  }
`;

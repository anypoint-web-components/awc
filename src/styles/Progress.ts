import { css } from 'lit';

export default css`
:host {
  display: block;
  width: 200px;
  position: relative;
  overflow: hidden;
  height: var(--anypoint-progress-height, 4px);
}

:host([hidden]), [hidden] {
  display: none !important;
}

#progressContainer {
  position: relative;
}

#progressContainer,
.indeterminate::after {
  height: inherit
}

#primaryProgress,
#secondaryProgress,
.indeterminate::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

#progressContainer,
.indeterminate::after {
  background: var(--anypoint-progress-container-color, #e0e0e0);
}

:host(.transiting) #primaryProgress,
:host(.transiting) #secondaryProgress {
  -webkit-transition-property: -webkit-transform;
  transition-property: transform;
  /* Duration */
  -webkit-transition-duration: var(--anypoint-progress-transition-duration, 0.08s);
  transition-duration: var(--anypoint-progress-transition-duration, 0.08s);
  /* Timing function */
  -webkit-transition-timing-function: var(--anypoint-progress-transition-timing-function, ease);
  transition-timing-function: var(--anypoint-progress-transition-timing-function, ease);
  /* Delay */
  -webkit-transition-delay: var(--anypoint-progress-transition-delay, 0s);
  transition-delay: var(--anypoint-progress-transition-delay, 0s);
}

#primaryProgress,
#secondaryProgress {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transform-origin: left center;
  transform-origin: left center;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  will-change: transform;
}

#primaryProgress {
  background: var(--anypoint-progress-active-color, #0f9d58);
}

#secondaryProgress {
  background: var(--anypoint-progress-secondary-color, #b7e1cd);
}

:host([disabled]) #primaryProgress {
  background: var(--anypoint-progress-disabled-active-color, #9e9e9e);
}

:host([disabled]) #secondaryProgress {
  background: var(--anypoint-progress-disabled-secondary-color, #e0e0e0);
}

:host(:not([disabled])) #primaryProgress.indeterminate {
  -webkit-transform-origin: right center;
  transform-origin: right center;
  -webkit-animation: indeterminate-bar var(--anypoint-progress-indeterminate-cycle-duration, 2s) linear infinite;
  animation: indeterminate-bar var(--anypoint-progress-indeterminate-cycle-duration, 2s) linear infinite;
}

:host(:not([disabled])) #primaryProgress.indeterminate::after {
  content: "";
  -webkit-transform-origin: center center;
  transform-origin: center center;
  -webkit-animation: indeterminate-splitter var(--anypoint-progress-indeterminate-cycle-duration, 2s) linear infinite;
  animation: indeterminate-splitter var(--anypoint-progress-indeterminate-cycle-duration, 2s) linear infinite;
}

@-webkit-keyframes indeterminate-bar {
  0% {
    -webkit-transform: scaleX(1) translateX(-100%);
  }
  50% {
    -webkit-transform: scaleX(1) translateX(0%);
  }
  75% {
    -webkit-transform: scaleX(1) translateX(0%);
    -webkit-animation-timing-function: cubic-bezier(.28,.62,.37,.91);
  }
  100% {
    -webkit-transform: scaleX(0) translateX(0%);
  }
}

@-webkit-keyframes indeterminate-splitter {
  0% {
    -webkit-transform: scaleX(.75) translateX(-125%);
  }
  30% {
    -webkit-transform: scaleX(.75) translateX(-125%);
    -webkit-animation-timing-function: cubic-bezier(.42,0,.6,.8);
  }
  90% {
    -webkit-transform: scaleX(.75) translateX(125%);
  }
  100% {
    -webkit-transform: scaleX(.75) translateX(125%);
  }
}

@keyframes indeterminate-bar {
  0% {
    transform: scaleX(1) translateX(-100%);
  }
  50% {
    transform: scaleX(1) translateX(0%);
  }
  75% {
    transform: scaleX(1) translateX(0%);
    animation-timing-function: cubic-bezier(.28,.62,.37,.91);
  }
  100% {
    transform: scaleX(0) translateX(0%);
  }
}

@keyframes indeterminate-splitter {
  0% {
    transform: scaleX(.75) translateX(-125%);
  }
  30% {
    transform: scaleX(.75) translateX(-125%);
    animation-timing-function: cubic-bezier(.42,0,.6,.8);
  }
  90% {
    transform: scaleX(.75) translateX(125%);
  }
  100% {
    transform: scaleX(.75) translateX(125%);
  }
}
`;

import { css } from "lit-element";

export default css`
:host {
  display: block;
  position: absolute;
  border-radius: inherit;
  overflow: hidden;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* See PolymerElements/paper-behaviors/issues/34. On non-Chrome browsers,
  * creating a node (with a position:absolute) in the middle of an event
  * handler "interrupts" that event handler (which happens when the
  * ripple is created on demand) */
  pointer-events: none;
}

:host([animating]) {
  /* This resolves a rendering issue in Chrome (as of 40) where the
    ripple is not properly clipped by its parent (which may have
    rounded corners). See: http://jsbin.com/temexa/4
    Note: We only apply this style conditionally. Otherwise, the browser
    will create a new compositing layer for every ripple element on the
    page, and that would be bad. */
  -webkit-transform: translate(0, 0);
  transform: translate3d(0, 0, 0);
}

#background,
#waves,
.wave-container,
.wave {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#background,
.wave {
  opacity: 0;
}

#waves,
.wave {
  overflow: hidden;
}

.wave-container,
.wave {
  border-radius: 50%;
}

:host(.circle) #background,
:host(.circle) #waves {
  border-radius: 50%;
}

:host(.circle) .wave-container {
  overflow: hidden;
}
`;

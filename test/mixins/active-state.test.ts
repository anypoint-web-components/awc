import { fixture, expect, aTimeout, nextFrame, html } from '@open-wc/testing';
import sinon from 'sinon';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { keyDown, keyUp, keyDownUp } from '../lib/helpers.js';
import './test-elements.js';
import { TestButton, TestLightDom } from './test-elements.js';
import '../../src/define/anypoint-input.js';

describe('Active state tests', () => {
  async function trivialActiveState(): Promise<TestButton> {
    return fixture(html`<test-button></test-button>`);
  }

  async function toggleActiveState(): Promise<TestButton> {
    return fixture(html`<test-button toggles></test-button>`);
  }

  async function buttonWithNativeInput(): Promise<TestLightDom> {
    return fixture(html`<test-light-dom><input id="input"></test-light-dom>`);
  }

  async function buttonWithPaperInput(): Promise<TestLightDom> {
    return fixture(
      html`<test-light-dom><anypoint-input id="input"></anypoint-input></test-light-dom>`
    );
  }

  describe('active-state', () => {
    let activeTarget: TestButton;
    beforeEach(async () => {
      activeTarget = await trivialActiveState();
    });

    describe('active state with toggles attribute', () => {
      beforeEach(async () => {
        activeTarget = await toggleActiveState();
      });

      describe('when down', () => {
        it('is pressed', async () => {
          MockInteractions.down(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('pressed')).to.be.eql(true);
        });
      });

      describe('when clicked', () => {
        it('is activated', done => {
          MockInteractions.downAndUp(activeTarget, async () => {
            await nextFrame();
            try {
              expect(activeTarget.hasAttribute('active')).to.be.eql(true);
              expect(activeTarget.hasAttribute('aria-pressed')).to.be.eql(true);
              expect(activeTarget.getAttribute('aria-pressed')).to.be.eql(
                'true'
              );
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('is deactivated by a subsequent click', done => {
          MockInteractions.downAndUp(activeTarget, async () => {
            await nextFrame();
            MockInteractions.downAndUp(activeTarget, async () => {
              await nextFrame();
              try {
                expect(activeTarget.hasAttribute('active')).to.be.eql(false);
                expect(activeTarget.hasAttribute('aria-pressed')).to.be.eql(
                  true
                );
                expect(activeTarget.getAttribute('aria-pressed')).to.be.eql(
                  'false'
                );
                done();
              } catch (e) {
                done(e);
              }
            });
          });
        });

        it('the correct aria attribute is set', done => {
          activeTarget.ariaActiveAttribute = 'aria-checked';
          MockInteractions.downAndUp(activeTarget, async () => {
            await nextFrame();
            try {
              expect(activeTarget.hasAttribute('active')).to.be.eql(true);
              expect(activeTarget.hasAttribute('aria-checked')).to.be.eql(true);
              expect(activeTarget.getAttribute('aria-checked')).to.be.eql(
                'true'
              );
              done();
            } catch (e) {
              done(e);
            }
          });
        });

        it('the aria attribute is updated correctly', done => {
          activeTarget.ariaActiveAttribute = 'aria-checked';
          MockInteractions.downAndUp(activeTarget, async () => {
            await nextFrame();
            try {
              expect(activeTarget.hasAttribute('active')).to.be.eql(true);
              expect(activeTarget.hasAttribute('aria-checked')).to.be.eql(true);
              expect(activeTarget.getAttribute('aria-checked')).to.be.eql(
                'true'
              );
              activeTarget.ariaActiveAttribute = 'aria-pressed';
              expect(activeTarget.hasAttribute('aria-checked')).to.be.eql(
                false
              );
              expect(activeTarget.hasAttribute('aria-pressed')).to.be.eql(true);
              expect(activeTarget.getAttribute('aria-pressed')).to.be.eql(
                'true'
              );
              done();
            } catch (e) {
              done(e);
            }
          });
        });
      });

      describe('on blur', () => {
        it('the pressed property becomes false', async () => {
          MockInteractions.focus(activeTarget);
          MockInteractions.down(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('pressed')).to.be.eql(true);
          MockInteractions.blur(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('pressed')).to.be.eql(false);
        });
      });
    });

    describe('without toggles attribute', () => {
      describe('when mouse is down', () => {
        it('does not get an active attribute', async () => {
          expect(activeTarget.hasAttribute('active')).to.be.eql(false);
          MockInteractions.down(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('active')).to.be.eql(false);
        });
      });

      describe('when mouse is up', () => {
        it('does not get an active attribute', async () => {
          MockInteractions.down(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('active')).to.be.eql(false);
          MockInteractions.up(activeTarget);
          await nextFrame();
          expect(activeTarget.hasAttribute('active')).to.be.eql(false);
        });
      });
    });

    describe('when space is pressed', () => {
      it('triggers a click event', (done) => {
        activeTarget.addEventListener('click', () => {
          done();
        });
        keyDown(activeTarget, 'Space');
        keyUp(activeTarget, 'Space');
      });

      it('only triggers click after the key is released', done => {
        let keyupTriggered = false;
        activeTarget.addEventListener('keyup', () => {
          keyupTriggered = true;
        });
        activeTarget.addEventListener('click', () => {
          try {
            expect(keyupTriggered).to.be.eql(true);
            done();
          } catch (e) {
            done(e);
          }
        });
        // MockInteractions.pressSpace(activeTarget);
        keyDown(activeTarget, 'Space');
        keyUp(activeTarget, 'Space');
      });
    });

    describe('when enter is pressed', () => {
      it('triggers a click event', done => {
        activeTarget.addEventListener('click', () => {
          done();
        });
        keyDown(activeTarget, 'Enter');
        keyUp(activeTarget, 'Enter');
      });

      it('only triggers click before the key is released', done => {
        let keyupTriggered = false;
        activeTarget.addEventListener('keyup', () => {
          keyupTriggered = true;
        });
        activeTarget.addEventListener('click', () => {
          try {
            expect(keyupTriggered).to.be.eql(false);
            done();
          } catch (e) {
            done(e);
          }
        });
        keyDown(activeTarget, 'Enter');
        setTimeout(() => {
          keyUp(activeTarget, 'Enter');
        });
      });
    });

    describe('nested native input inside button', () => {
      it('space in light child input does not trigger a button click event', async () => {
        const item = await buttonWithNativeInput();
        const input = item.querySelector('#input') as HTMLElement;
        const itemClickHandler = sinon.spy();
        item.addEventListener('click', itemClickHandler);
        input.focus();
        MockInteractions.pressSpace(input);
        await aTimeout(20);
        expect(itemClickHandler.callCount).to.be.equal(0);
      });

      it('space in button triggers a button click event', async () => {
        const item = await buttonWithNativeInput();
        const itemClickHandler = sinon.spy();
        item.addEventListener('click', itemClickHandler);
        await keyDownUp(item, 'Space');
        await aTimeout(1);
        expect(itemClickHandler.callCount).to.be.equal(1);
      });
    });

    describe('nested anypoint-input inside button', () => {
      it('space in light child input does not trigger a button click event', async () => {
        const item = await buttonWithPaperInput();
        const input = item.querySelector('#input') as HTMLElement;
        const itemClickHandler = sinon.spy();
        item.addEventListener('click', itemClickHandler);
        input.focus();
        MockInteractions.pressSpace(input);
        await aTimeout(20);
        expect(itemClickHandler.callCount).to.be.equal(0);
      });

      it('space in button triggers a button click event', async () => {
        const item = await buttonWithPaperInput();
        const itemClickHandler = sinon.spy();
        item.addEventListener('click', itemClickHandler);
        await keyDownUp(item, 'Space');
        await aTimeout(1);
        expect(itemClickHandler.callCount).to.be.equal(1);
      });
    });
  });
});

import { css } from 'lit';

export const styles = css`
:host {
  display: block;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12),
              0 3px 1px -2px rgba(0, 0, 0, 0.2);
  margin-bottom: 40px;
}

.demo {
  display: block;
  border-bottom: 1px solid #e0e0e0;
  background-color: var(--demo-helper-demo-background-color, white);
  margin: 0;
  padding: 20px;
}

.code-container {
  margin: 0;
  background-color: var(--demo-helper-code-container-background-color, #f5f5f5);
  font-size: 13px;
  overflow: auto;
  position: relative;
  padding: 0 20px;
}

.code {
  padding: 20px;
  margin: 0;
  background-color: var(--demo-helper-code-container-background-color, var(--google-grey-100));
  font-size: 13px;
  overflow: auto;

  display: block;
  white-space: pre-wrap;
}

.code > pre {
  margin: 0;
  padding: 0 0 10px 0;
}

#copyButton {
  position: absolute;
  top: 0;
  right: 0px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  background: #e0e0e0;
}
`;

export const prismStyles = css`/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */
code[class*="language-"],
pre[class*="language-"] {
  white-space: pre-wrap;
  word-spacing: normal;
  word-break: break-all;
  word-wrap: break-word;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  hyphens: auto;
  background-color: var(--prism-container-background-color);
  display: block;
  font-family: var(--arc-font-code-family, monospace);
  font-size: var(--arc-font-code-font-size, 10pt);
}
pre[class*="language-"]::-moz-selection,
pre[class*="language-"]::-moz-selection,
code[class*="language-"]::-moz-selection,
code[class*="language-"]::-moz-selection {
  text-shadow: none;
  background: var(--prism-container-selection-background-color, #b3d4fc);
}
pre[class*="language-"]::selection,
pre[class*="language-"]::selection,
code[class*="language-"]::selection,
code[class*="language-"]::selection {
  text-shadow: none;
  background: var(--prism-container-selection-background-color, #b3d4fc);
}
@media print {
  code[class*="language-"],
  pre[class*="language-"] {
    text-shadow: none;
  }
}
/* Code blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: .5em 0;
  overflow: auto;
}
:not(pre) > code[class*="language-"],
pre[class*="language-"] {
  background: var(--prism-container-pre-background-color, #f5f2f0);
}
/* Inline code */
:not(pre) > code[class*="language-"] {
  padding: .1em;
  border-radius: .3em;
  white-space: normal;
}
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--code-token-comment-value-color, slategray);
}
.token.punctuation {
  color: var(--code-punctuation-value-color, #999);
}
.namespace {
  opacity: .7;
}
.token.property,
.token.tag,
.token.constant,
.token.symbol,
.token.deleted {
  color: var(--code-property-value-color, #905);
}
.token.number {
  color: var(--code-type-number-value-color, #905);
}
.token.boolean {
  color: var(--code-type-boolean-value-color, #905);
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: var(--code-type-text-value-color, #690);
}
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: var(--code-operator-value-color, #a67f59);
  background: var(--code-operator-value-background-color, hsla(0, 0%, 100%, .5));
}
.token.atrule,
.token.attr-value,
.token.keyword {
  color: var(--code-keyword-value-color, #07a);
}
.token.function {
  color: var(--code-function-value-color, #DD4A68);
}
.token.regex,
.token.important,
.token.variable {
  color: var(--code-variable-value-color, #e90);
}
.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}
.token.entity {
  cursor: help;
}`;

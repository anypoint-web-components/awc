/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/

export type DateTimeTextOptions = "long" | "short" | "narrow";
export type DateTimeNumberOptions = "numeric" | "2-digit";
export type DateTimeTimezoneOptions = "long" | "short";
export type DateTimeTextNumberOptions = DateTimeTextOptions | DateTimeNumberOptions;

/**
 * An element to display formatted date and time.
 *
 * The `date` property accepts Date object, Number as a timestamp or string
 * that will be parsed to the Date object.
 *
 * This element uses the `Intl` interface which is available in IE 11+ browsers.
 *
 * To format the date use [Intl.DateTimeFormat]
 * (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)
 * interface options.
 *
 * The default value for each date-time component property is undefined,
 * but if all component properties are undefined, then year, month, and day
 * are assumed to be "numeric" (per spec).
 *
 * ### Example
 *
 * ```html
 * <date-time date="2010-12-10T11:50:45Z" year="numeric" month="narrow" day="numeric"></date-time>
 * ```
 *
 * The element provides accessibility by using the `time` element and setting
 * the `datetime` attribute on it.
 */
export default class DateTimeElement extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      'locales', 'date', 'year', 'month', 'day', 'hour', 'minute', 'second',
      'weekday', 'time-zone-name', 'era', 'time-zone', 'hour12', 'itemprop'
    ];
  }

  protected _observer = new MutationObserver(() => this._mutationHandler());

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this._observer.observe(this.shadowRoot!, {
      childList: true,
      characterData: true,
      subtree: true
    });
    this._updateLabel();
  }

  disconnectedCallback(): void {
    this._observer.disconnect();
  }

  _mutationHandler(): void {
    this.setAttribute('aria-label', this.shadowRoot!.textContent || '');
  }

  /**
   * A string with a BCP 47 language tag, or an array of such strings.
   * For the general form and interpretation of the locales argument,
   * see the Intl page.
   * The following Unicode extension keys are allowed:
   * - nu - Numbering system. Possible values include: "arab", "arabext",
   * "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr",
   * "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya",
   * "tamldec", "telu", "thai", "tibt".
   * - ca - Calendar. Possible values include: "buddhist", "chinese",
   * "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian",
   * "islamic", "islamicc", "iso8601", "japanese", "persian", "roc".
   * @attribute
   */
  get locales(): string | null {
    return this.getAttribute('locales');
  }

  /**
   * A string with a BCP 47 language tag, or an array of such strings.
   * For the general form and interpretation of the locales argument,
   * see the Intl page.
   * The following Unicode extension keys are allowed:
   * - nu - Numbering system. Possible values include: "arab", "arabext",
   * "bali", "beng", "deva", "fullwide", "gujr", "guru", "hanidec", "khmr",
   * "knda", "laoo", "latn", "limb", "mlym", "mong", "mymr", "orya",
   * "tamldec", "telu", "thai", "tibt".
   * - ca - Calendar. Possible values include: "buddhist", "chinese",
   * "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian",
   * "islamic", "islamicc", "iso8601", "japanese", "persian", "roc".
   */
  set locales(v: string | null) {
    if (v) {
      this.setAttribute('locales', v);
    } else {
      this.removeAttribute('locales');
    }
  }

  /**
   * The representation of the year.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  get year(): DateTimeNumberOptions | null {
    return this.getAttribute('year') as DateTimeNumberOptions;
  }

  /**
   * The representation of the year.
   * @param v Possible values are "numeric", "2-digit".
   */
  set year(v: DateTimeNumberOptions | null) {
    if (v) {
      this.setAttribute('year', v);
    } else {
      this.removeAttribute('year');
    }
  }

  /**
   * The representation of the month.
   * Possible values are "numeric", "2-digit", "narrow", "short", "long".
   * @attribute
   */
  get month(): DateTimeTextNumberOptions | null {
    return this.getAttribute('month') as DateTimeTextNumberOptions;
  }

  /**
   * The representation of the month.
   * @param v Possible values are "numeric", "2-digit", "narrow", "short", "long".
   */
  set month(v: DateTimeTextNumberOptions | null) {
    if (v) {
      this.setAttribute('month', v);
    } else {
      this.removeAttribute('month');
    }
  }

  /**
   * The representation of the day.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  get day(): DateTimeNumberOptions | null {
    return this.getAttribute('day') as DateTimeNumberOptions;
  }

  /**
   * The representation of the day.
   * @param v Possible values are "numeric", "2-digit".
   */
  set day(v: DateTimeNumberOptions | null) {
    if (v) {
      this.setAttribute('day', v);
    } else {
      this.removeAttribute('day');
    }
  }

  /**
   * The representation of the hour.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  get hour(): DateTimeNumberOptions | null {
    return this.getAttribute('hour') as DateTimeNumberOptions;
  }

  /**
   * The representation of the hour.
   * @param v Possible values are "numeric", "2-digit".
   */
  set hour(v: DateTimeNumberOptions | null) {
    if (v) {
      this.setAttribute('hour', v);
    } else {
      this.removeAttribute('hour');
    }
  }

  /**
   * The representation of the minute.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  get minute(): DateTimeNumberOptions | null {
    return this.getAttribute('minute') as DateTimeNumberOptions;
  }

  /**
   * The representation of the minute.
   * @param v Possible values are "numeric", "2-digit".
   */
  set minute(v: DateTimeNumberOptions | null) {
    if (v) {
      this.setAttribute('minute', v);
    } else {
      this.removeAttribute('minute');
    }
  }

  /**
   * The representation of the second.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  get second(): DateTimeNumberOptions | null {
    return this.getAttribute('second') as DateTimeNumberOptions;
  }

  /**
   * The representation of the second.
   * @param v Possible values are "numeric", "2-digit".
   */
  set second(v: DateTimeNumberOptions | null) {
    if (v) {
      this.setAttribute('second', v);
    } else {
      this.removeAttribute('second');
    }
  }

  /**
   * The representation of the weekday.
   * Possible values are "narrow", "short", "long".
   * @attribute
   */
  get weekday(): DateTimeTextOptions | null {
    return this.getAttribute('weekday') as DateTimeTextOptions;
  }

  /**
   * The representation of the weekday.
   * @param v Possible values are "narrow", "short", "long".
   */
  set weekday(v: DateTimeTextOptions | null) {
    if (v) {
      this.setAttribute('weekday', v);
    } else {
      this.removeAttribute('weekday');
    }
  }

  /**
   * The representation of the time zone name.
   *
   * Possible values are "short", "long".
   * @attribute
   */
  get timeZoneName(): DateTimeTimezoneOptions | null {
    return this.getAttribute('time-zone-name') as DateTimeTimezoneOptions;
  }

  /**
   * The representation of the time zone name.
   *
   * @param v Possible values are "short", "long".
   */
  set timeZoneName(v: DateTimeTimezoneOptions | null) {
    if (v) {
      this.setAttribute('time-zone-name', v);
    } else {
      this.removeAttribute('time-zone-name');
    }
  }

  /**
   * The time zone to use. The only value implementations must recognize
   * is "UTC"; the default is the runtime's default time zone.
   * Implementations may also recognize the time zone names of the IANA
   * time zone database, such as "Asia/Shanghai", "Asia/Kolkata",
   * "America/New_York".
   * @attribute
   */
  get timeZone(): string | null {
    return this.getAttribute('time-zone');
  }

  /**
   * The time zone to use. The only value implementations must recognize
   * is "UTC"; the default is the runtime's default time zone.
   * Implementations may also recognize the time zone names of the IANA
   * time zone database, such as "Asia/Shanghai", "Asia/Kolkata",
   * "America/New_York".
   */
  set timeZone(v: string | null) {
    if (v) {
      this.setAttribute('time-zone', v);
    } else {
      this.removeAttribute('time-zone');
    }
  }

  /**
   * The representation of the era.
   *
   * Possible values are "narrow", "short", "long".
   * @attribute
   */
  get era(): DateTimeTextOptions | null {
    return this.getAttribute('era') as DateTimeTextOptions;
  }

  /**
   * The representation of the era.
   *
   * @param v Possible values are "narrow", "short", "long".
   */
  set era(v: DateTimeTextOptions | null) {
    if (v) {
      this.setAttribute('era', v);
    } else {
      this.removeAttribute('era');
    }
  }

  private __hour12set: boolean | null = null;

  /**
   * Whether to use 12-hour time (as opposed to 24-hour time).
   * Possible values are `true` and `false`; the default is locale
   * dependent.
   */
  get hour12(): boolean | null {
    if (!this.hasAttribute('hour12') && !this.__hour12set) {
      return null;
    }
    return this.hasAttribute('hour12');
  }

  /**
   * Whether to use 12-hour time (as opposed to 24-hour time).
   * Possible values are `true` and `false`; the default is locale
   * dependent.
   */
  set hour12(v: boolean | null) {
    this.__hour12set = true;
    if (v) {
      this.setAttribute('hour12', '');
    } else {
      this.removeAttribute('hour12');
    }
  }

  private __date: Date | string | number | null = null;

  /**
   * A date object to render.
   * It can be a `Date` object, number representing a timestamp
   * or valid date string. The argument is parsed by `Date` constructor
   * to produce the value.
   * @attribute
   */
  get date(): Date | string | number | null {
    if (this.__date) {
      return this.__date;
    }
    return this.getAttribute('date');
  }

  /**
   * A date object to render.
   * It can be a `Date` object, number representing a timestamp
   * or valid date string. The argument is parsed by `Date` constructor
   * to produce the value.
   *
   * @param {Date|string|number} v The date to render
   */
  set date(v: Date | string | number | null) {
    this.__date = v;
    if (typeof v === 'string') {
      this.setAttribute('date', v);
    } else {
      this._updateLabel();
    }
  }

  get itemprop(): string | null {
    return this._getTimeNode().getAttribute('itemprop');
  }

  set itemprop(value: string | null) {
    const old = this.itemprop;
    if (old === value) {
      return;
    }
    if (old && value === null) {
      // This setter moves attribute from this element to "<time>" element.
      // When the attribute is removed from this then it becomes null.
      return;
    }
    const node = this._getTimeNode();
    if (value) {
      node.setAttribute('itemprop', value);
      this.removeAttribute('itemprop');
    } else {
      node.removeAttribute('itemprop');
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'itemprop') {
      this[name] = newValue;
      return;
    }
    this._updateLabel();
  }

  /**
   * Parses input `date` to a Date object.
   * @param date A date to parse
   */
  protected _getParsableDate(date: string | number | Date | null): Date {
    if (!date) {
      date = new Date();
    } else if (typeof date === 'string') {
      try {
        date = new Date(date);
        if (Number.isNaN(date.getDate())) {
          date = new Date();
        }
      } catch (e) {
        date = new Date();
      }
    } else if (!Number.isNaN(date)) {
      date = new Date(date);
    } else if (!(date instanceof Date)) {
      date = new Date();
    }
    return date;
  }

  _getIntlOptions(): Intl.DateTimeFormatOptions {
    const options: Intl.DateTimeFormatOptions = {};
    if (this.year) {
      options.year = this.year;
    }
    if (this.month) {
      options.month = this.month;
    }
    if (this.day) {
      options.day = this.day;
    }
    if (this.hour) {
      options.hour = this.hour;
    }
    if (this.minute) {
      options.minute = this.minute;
    }
    if (this.second) {
      options.second = this.second;
    }
    if (this.weekday) {
      options.weekday = this.weekday;
    }
    if (this.era) {
      options.era = this.era;
    }
    if (this.timeZoneName) {
      options.timeZoneName = this.timeZoneName;
    }
    if (this.timeZone) {
      options.timeZone = this.timeZone;
    }
    if (this.hour12 !== undefined && this.hour12 !== null) {
      options.hour12 = this.hour12;
    }
    return options;
  }

  /**
   * @returns A reference to a `<time>` element that is in the shadow DOM of this element.
   */
  _getTimeNode(): HTMLTimeElement {
    let node = this.shadowRoot!.querySelector('time');
    if (!node) {
      node = document.createElement('time');
      this.shadowRoot!.appendChild(node);
    }
    return node;
  }

  _updateLabel(): void {
    if (!this.parentElement) {
      return;
    }
    const date = this._getParsableDate(this.date);
    const node = this._getTimeNode();
    node.setAttribute('datetime', date.toISOString());
    /* istanbul ignore if */
    if (typeof Intl === 'undefined') {
      node.innerText = date.toString();
      return;
    }
    let locales;
    if (this.locales) {
      locales = this.locales;
    }
    const options = this._getIntlOptions();
    const value = new Intl.DateTimeFormat(locales, options).format(date);
    node.innerText = value;
  }
}

export type DateTimeTextOptions = "long" | "short" | "narrow";
export type DateTimeNumberOptions = "numeric" | "2-digit";
export type DateTimeTimezoneOptions = "long" | "short";
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
 *
 * ### Styling
 *
 * `<date-time>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--date-time` | Mixin applied to the element | `{}`
 */
export default class DateTimeElement extends HTMLElement {

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
  locales: any;

  /**
   * The representation of the year.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  year: DateTimeNumberOptions;

  /**
   * The representation of the month.
   * Possible values are "numeric", "2-digit", "narrow", "short", "long".
   * @attribute
   */
  month: DateTimeTextOptions;

  /**
   * The representation of the day.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  day: DateTimeNumberOptions;

  /**
   * The representation of the hour.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  hour: DateTimeNumberOptions;

  /**
   * The representation of the minute.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  minute: DateTimeNumberOptions;

  /**
   * The representation of the second.
   * Possible values are "numeric", "2-digit".
   * @attribute
   */
  second: DateTimeNumberOptions;

  /**
   * The representation of the weekday.
   * Possible values are "narrow", "short", "long".
   * @attribute
   */
  weekday: DateTimeTextOptions;

  /**
   * The representation of the time zone name.
   *
   * Possible values are "short", "long".
   */
  timeZoneName: any;

  /**
   * The representation of the time zone name.
   *
   * Possible values are "short", "long".
   * @attribute
   */
  'time-zone-name': any;

  /**
   * The time zone to use. The only value implementations must recognize
   * is "UTC"; the default is the runtime's default time zone.
   * Implementations may also recognize the time zone names of the IANA
   * time zone database, such as "Asia/Shanghai", "Asia/Kolkata",
   * "America/New_York".
   */
  timeZone: string;

  /**
   * The time zone to use. The only value implementations must recognize
   * is "UTC"; the default is the runtime's default time zone.
   * Implementations may also recognize the time zone names of the IANA
   * time zone database, such as "Asia/Shanghai", "Asia/Kolkata",
   * "America/New_York".
   * @attribute
   */
  'time-zone': string;

  /**
   * The representation of the era.
   *
   * Possible values are "narrow", "short", "long".
   * @attribute
   */
  era: DateTimeTextOptions;

  /**
   * Whether to use 12-hour time (as opposed to 24-hour time).
   * Possible values are `true` and `false`; the default is locale
   * dependent.
   * @attribute
   */
  hour12: boolean;

  /**
   * A date object to render.
   * It can be a `Date` object, number representing a timestamp
   * or valid date string. The argument is parsed by `Date` constructor
   * to produce the value.
   * @attribute
   */
  date: any;
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(): void;

  /**
   * Parses input `date` to a Date object.
   *
   * @param date A date to parse
   */
  _getParsableDate(date: String|Number|Date|null): Date|null;
  _getIntlOptions(): any;
  _updateLabel(): void;
  _setIso(v: any): void;
}

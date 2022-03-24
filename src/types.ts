import { TemplateResult, SVGTemplateResult } from 'lit';

export type SupportedInputTypes = "hidden" | "text" | "search" | "tel" | "url" | "email" | "password" | "datetime" | "date" | "month" | "week" | "time" | "datetime-local" | "number" | "range" | "color" | "checkbox" | "radio" | "file" | "submit" | "image" | "reset" | "button";
export type SupportedAutocomplete = "on" | "off" | "additional-name" | "street-address" | "address-level1" | "address-level2" | "address-level3" | "address-level4" | "address-line1" | "address-line2" | "address-line3" | "bday" | "bday-year" | "bday-day" | "bday-month" | "billing" | "cc-additional-name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name" | "honorific-suffix" | "nickname" | "username" | "new-password" | "current-password" | "organization-title" | "organization" | "country" | "country-name" | "postal-code" | "cc-name" | "cc-given-name" | "cc-additional-name" | "cc-family-name" | "cc-number" | "cc-exp" | "cc-exp-month" | "cc-exp-year" | "cc-csc" | "cc-type" | "transaction-currency" | "transaction-amount" | "language" | "sex" | "tel" | "tel-country-code" | "tel-national" | "tel-area-code" | "tel-local" | "tel-extension" | "impp" | "url" | "photo";
export type SupportedAutocapitalize = "off" | "none" | "on" | "sentences" | "words" | "characters";

export declare interface Suggestion {
  /**
   * A value to be used to insert into the text field
   */
  value: string;
  /**
   * When set this will be used as the drop down list label
   */
  label?: string | TemplateResult;
  /**
   * When set it renders a second line for the suggestion with help message.
   * Keep it short!
   */
  description?: string | TemplateResult;
  /**
   * WHen set this value is used to filter the suggestions instead of `value`
   */
  filter?: string;
  /**
   * This property is transparent for the component but useful when handling selection
   * events to recognize which suggestion was used. It is up to the author to handle this
   * property.
   */
  id?: string|number;
}

export declare interface ChipSuggestion extends Suggestion {
  /**
   * An instance of `SVGTemplateResult` from `lit-html` library.
   */
  icon?: SVGTemplateResult;
  /**
   * This value will be returned as the value of the input
   */
  id?: string;
}

export declare interface ChipItem {
  label: string;
  removable?: boolean;
  icon?: SVGTemplateResult;
  id?: string;
}

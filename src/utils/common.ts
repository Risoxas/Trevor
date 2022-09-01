export function onlyNumber(str: string): number {
  return Number(str.replace(SIGNED_NUMBER_REGEX, ""));
}

export const URL_REGEX = new RegExp("^(ftp|http|https):\\/\\/[^ ']+$");

export const EMAIL_REGEX = new RegExp("^[\\w\\-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");

export const SIGNED_NUMBER_REGEX = new RegExp("[^0-9.-]+", "g");
export const UNSIGNED_NUMBER_REGEX = new RegExp("[^0-9]", "g");

export const PHONE_MASK = new RegExp("^([0-9]{1})([0-9]{3})([0-9]{3})([0-9]{4})$");

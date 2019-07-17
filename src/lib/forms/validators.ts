import { PhoneNumberUtil } from "google-libphonenumber";
import * as momentjs from "moment";

const moment = momentjs;

export function dateValidator(value: string, format: string) {
  return moment(value, format, true).isValid();
}

export function emailValidator(value: string) {
  // tslint:disable-next-line:max-line-length
  return /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/
    .test(value);
}

export function telephoneValidator(value: string) {
  if (!value) { return false; }

  try {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const phoneNumber     = phoneNumberUtil.parse(value);

    return phoneNumberUtil.isValidNumber(phoneNumber);
  } catch (exception) {
    return false;
  }
}

export function valueMatchValidator(valueA: any, valueB: any) {
  return valueA === valueB;
}

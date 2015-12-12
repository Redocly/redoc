'use strict';

export function statusCodeType(statusCode) {
  if (statusCode < 100 || statusCode > 599) {
    throw 'invalid HTTP code';
  }
  let res = 'success';
  if (statusCode >= 300 && statusCode < 400) {
    res = 'redirect';
  } else if (statusCode >= 400) {
    res = 'error';
  } else if (statusCode < 200) {
    res = 'info';
  }
  return res;
}

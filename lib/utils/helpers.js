'use strict';

export function statusCodeType(statusCode) {
  let res = 'success';
  if (statusCode >= 300 && statusCode < 400) {
    res = 'redirect';
  } else if (statusCode > 400) {
    res = 'error';
  } else if (statusCode < 100) {
    res = 'info';
  }
  return res;
}

const throttle = function(func, wait) {
  var context, args, result;
  var timeout: any = null;
  var previous = 0;
  var later = function() {
    (previous = new Date().getTime()), (timeout = null);
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = new Date().getTime();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

export function Throttle(delay: number) {
  return (_, _2, desc: PropertyDescriptor) => {
    desc.value = throttle(desc.value, delay);
  };
}

export var noop = () => undefined;

export var identity = (x) => x;

// context first, just call this with null
export var ifExpression = (context, cond, tru, fls=noop) => {
  return function() {
    if(cond.apply(context, arguments)) {
      return tru.apply(context, arguments);
    } else {
      return fls.apply(context, arguments);
    }
  };
};

// if a value is below the minimum value, then it will become the minimum
// value.
// if you need to clamp max, just switch the order.
export var clamp = (val, minVal) => {
  if(val < minVal) {
    return minVal;
  }
  return val;
};
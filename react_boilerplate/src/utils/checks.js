
const ensureArray = (value) => {
  if( value ) {
    if( !(value instanceof Array) ) {
      value = [value];
    }
  } else {
    value = [];
  }
  return value;
};

const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

const isEmpty = (value) => {
  if( !value &&
        typeof value !== 'boolean' &&
          !isNumber(value) ) {
    return true;
  }
  return false;
};

export {
  ensureArray,
  isNumber,
  isEmpty
};

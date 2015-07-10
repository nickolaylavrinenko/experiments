
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

const ensureArray = (value) => {
  if( !isEmpty(value) ) {
    if( !(value instanceof Array) ) {
      value = [value];
    }
  } else {
    value = [];
  }
  return value;
};


export default {
  isNumber,
  isEmpty,
  ensureArray
};

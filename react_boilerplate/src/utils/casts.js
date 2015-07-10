
import {isNumber} from './checks';


export const toNumber = (value) => {
  return isNumber(value) ? parseFloat(value) : NaN;
};

export const jsonObjectToUrlEncoded = (data) => {
  return Object.keys(data).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&');
};

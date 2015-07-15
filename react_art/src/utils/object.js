import {ensureArray} from './checks';

export const applyWhiteList = function(obj, whiteList) {
  if (!obj || !Object.keys(obj).length) return null;

  whiteList = ensureArray(whiteList);
  const
    filtered = {},
    rest = {};

  for (name of Object.keys(obj)) {
    if( whiteList.indexOf(name) >= 0 ) {
      filtered[name] = obj[name];
    } else {
      rest[name] = obj[name];
    }
  }

  return [filtered, rest];
};

export const applyBlackList = function(obj, blackList) {
  if (!obj || !Object.keys(obj).length) return null;

  blackList = ensureArray(blackList);
  const
    filtered = {},
    rest = {};

  for (name of Object.keys(obj)) {
    if (blackList.indexOf(name) < 0) {
      filtered[name] = obj[name];
    } else {
      rest[name] = obj[name];
    }
  }

  return [filtered, rest];
};

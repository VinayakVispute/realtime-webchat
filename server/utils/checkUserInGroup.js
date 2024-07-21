const checkUserInGroup = (myMap, key, valueToCheck) => {
  const setForKey = MyMap.get(key);
  if (setForKey) {
    return setForKey.has(valueToCheck);
  } else {
    return false;
  }
};

module.exports = { checkUserInGroup };

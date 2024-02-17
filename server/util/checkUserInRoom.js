const checkUserInRoom = (myMap, key, valueToCheck) => {
  const setForKey = myMap.get(key);
  return setForKey ? setForKey.has(valueToCheck) : false;
};

module.exports = checkUserInRoom;

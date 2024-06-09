const findGroupForUser = (myMap, valueToCheck) => {
  // Iterate over each key-value pair in the map
  for (const [key, set] of myMap.entries()) {
    // Check if the Set associated with the current key contains the value
    // Also, ensure that the value is not equal to the key
    if (set.has(valueToCheck) && valueToCheck !== key) {
      // If both conditions are met, return the current key
      return key;
    }
  }

  // If no match is found, return null
  return null;
};

module.exports = findGroupForUser;

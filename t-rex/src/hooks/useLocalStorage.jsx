import { useState } from "react";

export const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);

      if (value) {
        window.localStorage.setItem(key, value);
        return value;
      } else {
        window.localStorage.setItem(key, defaultValue);
        return defaultValue;
      }
    } catch (error) {
      console.error(
        "Error getting local storage value, returing default: ",
        error
      );
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(key, newValue);
    } catch (error) {
      console.error(
        "Error setting local storage value, setting default: ",
        error
      );
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};

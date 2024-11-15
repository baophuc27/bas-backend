export const unflattenObject = (flatObject: any) => {
  const nestedObject: any = {};

  for (const key in flatObject) {
    const keys = key.split('.');
    let currentObject = nestedObject;

    for (let i = 0; i < keys.length - 1; i++) {
      const nestedKey = keys[i];
      if (!currentObject[nestedKey]) {
        currentObject[nestedKey] = {};
      }
      currentObject = currentObject[nestedKey];
    }

    currentObject[keys[keys.length - 1]] = flatObject[key];
  }

  return nestedObject;
};

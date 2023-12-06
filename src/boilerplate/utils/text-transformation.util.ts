export const kebabToCamel = (inputString: string): string => {
  return inputString.replace(/-([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
};

export const pascalToCamel = (inputString: string): string => {
  return inputString[0].toLowerCase() + inputString.slice(1);
};

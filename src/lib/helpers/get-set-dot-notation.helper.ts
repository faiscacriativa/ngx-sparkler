export function getSetDotNotation(target: object,
                                  property?: Array<string> | string,
                                  newValue?: any): any {

  if (typeof property === "string") {
    return getSetDotNotation(target, property.split("."), newValue);
  }

  if (!property || property.length === 0 || !property[0]) {
    return target;
  }

  if (property.length === 1 && newValue !== undefined) {
    return target[property[0]] = newValue;
  }

  if (!target.hasOwnProperty(property[0]) && property[0]) {
    if (newValue === undefined) {
      return undefined;
    }

    target[property[0]] = { };
  }

  return getSetDotNotation(target[property[0]], property.slice(1), newValue);
}

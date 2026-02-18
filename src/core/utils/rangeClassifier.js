export function classifyByRange(value, rangeMappings) {
  for (const range in rangeMappings) {
    const [description, color] = rangeMappings[range];
    const [min, max] = range.split("-").map(Number);

    if (value >= min && value <= max) {
      return [value, description, color];
    }
  }

  return undefined;
}

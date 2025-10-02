'use server'

export const structureOfVerb = (verb: string): string => {
  if (verb.endsWith("ar")) {
    return "1st";
  } else if (verb.endsWith("er") || verb.endsWith("por") || verb.endsWith("pôr")) {
    return "2nd";
  } else if (verb.endsWith("ir")) {
    return "3rd";
  } else {
    return "unknown";
  }
};

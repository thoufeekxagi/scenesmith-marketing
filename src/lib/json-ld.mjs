/** Serialize JSON data so it cannot terminate an inline script element. */
export function serializeJsonLd(value) {
  const json = JSON.stringify(value);
  if (json === undefined) throw new Error("JSON-LD must be serializable");
  return json.replace(/[<>&\u2028\u2029]/g, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

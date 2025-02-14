// src/lib/word-maps.ts
// import popularMap from "../assets/words/wm-popular.json";
// import completeMap from "../assets/words/wm-complete.json";
import tenK from "../assets/words/wm-10k.json";
// Type assertion to help TypeScript understand the structure
export function getWordMaps() {
  return {
    // popular: new Map(popularMap as [string, string[]][]),
    // complete: new Map(completeMap as [string, string[]][]),
    tenK: new Map(tenK as [string, string[]][]),
  };
}

//TODO: import many, allow the user to pick from them

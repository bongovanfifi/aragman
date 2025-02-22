import tenK from "../assets/words/wm-10k.json";
import twentyK from "../assets/words/wm-20k.json";
import thirtyK from "../assets/words/wm-30k.json";
import popular from "../assets/words/wm-popular.json";
import enable1 from "../assets/words/wm-enable1.json";
import scrabble from "../assets/words/wm-scrabble.json";

const wordMaps = {
  tenK,
  twentyK,
  thirtyK,
  popular,
  enable1,
  scrabble,
} as const;

export function getWordMaps() {
  return Object.fromEntries(
    Object.entries(wordMaps).map(([name, data]) => [
      name,
      new Map(data as [string, string[]][]),
    ])
  );
}

import * as fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// this being .ts was overkill, i wanted to write some .ts but having to run npx for this is silly
/**
 * Creates a map of sorted characters to words for fast lookup
 * @param path - Path to the word list file
 * @returns Map where keys are sorted characters and values are arrays of words that are anagrams
 * @example
 * // Returns Map { "aet" => ["eat", "tea", "ate"], "eilnst" => ["listen", "silent"] }
 * toWordMap("./wordlist.txt")
 */
function toWordMap(path: string): Map<string, string[]> {
  const text = fs.readFileSync(path, "utf-8");
  const wordMap = new Map<string, string[]>();
  text.split("\n").forEach((word) => {
    const key = word.split("").sort().join("").toLowerCase().trim();
    const existing = wordMap.get(key) || [];
    wordMap.set(key, [...existing, word.toLowerCase()]);
  });
  return wordMap;
}
const dir = join(__dirname, "../src/assets/words");
fs.mkdirSync(dir, { recursive: true });
const txtFiles = fs.readdirSync(dir).filter((file) => file.endsWith(".txt"));
txtFiles.forEach((txtFile) => {
  const baseName = txtFile.replace(".txt", "");
  const mapPath = join(dir, `wm-${baseName}.json`);
  const wordListPath = join(dir, txtFile);
  const wordMap = toWordMap(wordListPath);
  fs.writeFileSync(mapPath, JSON.stringify(Array.from(wordMap.entries())));
});

export function getAnagramKeys(wordMap: Map<string, string[]>, input: string) {
  const sorted = input.split("").sort().reverse();
  const anagramKeys = new Map<number, string[]>();
  function helper(remaining: string[], candidate: string) {
    if (candidate && wordMap.has(candidate)) {
      const existingWords = anagramKeys.get(candidate.length) || [];
      existingWords.push(candidate);
      anagramKeys.set(candidate.length, existingWords);
    }
    const remainingWithout = [...remaining];
    const c = remainingWithout.pop();
    if (c) {
      helper(remainingWithout, candidate); // Don't use c
      helper(remainingWithout, candidate + c); // Use c
    }
  }
  helper(sorted, "");
  return anagramKeys;
}

// function rot13(s: string) {
//   s.replace(/[a-zA-Z]/g, function (c) {
//     return String.fromCharCode(
//       // @ts-ignore
//       (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
//     );
//   });
// actually... rot13 will never change, why not just have the map in memory?
// https://stackoverflow.com/questions/617647/where-is-my-implementation-of-rot13-in-javascript-going-wrong
// ts doesnt like this, but i believe this random on se

//     const upperRot13 = {
//     'A': 'N', 'B': 'O', 'C': 'P', 'D': 'Q', 'E': 'R', 'F': 'S', 'G': 'T',
//     'H': 'U', 'I': 'V', 'J': 'W', 'K': 'X', 'L': 'Y', 'M': 'Z', 'N': 'A',
//     'O': 'B', 'P': 'C', 'Q': 'D', 'R': 'E', 'S': 'F', 'T': 'G', 'U': 'H',
//     'V': 'I', 'W': 'J', 'X': 'K', 'Y': 'L', 'Z': 'M'
// };

// const lowerRot13 = {
//     'a': 'n', 'b': 'o', 'c': 'p', 'd': 'q', 'e': 'r', 'f': 's', 'g': 't',
//     'h': 'u', 'i': 'v', 'j': 'w', 'k': 'x', 'l': 'y', 'm': 'z', 'n': 'a',
//     'o': 'b', 'p': 'c', 'q': 'd', 'r': 'e', 's': 'f', 't': 'g', 'u': 'h',
//     'v': 'i', 'w': 'j', 'x': 'k', 'y': 'l', 'z': 'm'
// };

// const rot13Map = { ...upperRot13, ...lowerRot13 };
// rot13 never changes... so just generate it once and store it, its tiny
// }

// GENERATE CHIPS

// DEFINITIONS
// use dictionary.dev for embedded definitions?
// embed definitions as a tooltip? seems potentially slow, but maybe fine
// also: much simpler const wordUrl = `https://www.dictionary.com/browse/${word}`;

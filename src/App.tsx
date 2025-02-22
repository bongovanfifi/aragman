import { useState, useEffect } from "react";
import { Chip, Input, Button, AccordionItem, Select } from "./components";
import { getWordMaps } from "./lib/word-maps";
import { getAnagramKeys } from "./lib/anagrams";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px 5px",
  width: "95%",
  maxWidth: "600px", // Keep the max-width for desktop
};

const inputGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px 5px",
  width: "100%",
};

const inputStyle = {
  width: "75%",
  minWidth: "40%",
};

const sectionStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const lengthStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
};

const wordMaps = getWordMaps();

const options = [
  {
    value: "tenK",
    display: `10,000 Words (${wordMaps["tenK"].size.toLocaleString()} keys)`,
  },
  {
    value: "twentyK",
    display: `20,000 Words (${wordMaps["twentyK"].size.toLocaleString()} keys`,
  },
  {
    value: "thirtyK",
    display: `30,000 Words (${wordMaps["thirtyK"].size.toLocaleString()} keys`,
  },
  {
    value: "popular",
    display: `Popular (${wordMaps["popular"].size.toLocaleString()} keys)`,
  },
  {
    value: "enable1",
    display: `Enable1 (${wordMaps["enable1"].size.toLocaleString()} keys)`,
  },
  {
    value: "scrabble",
    display: `Scrabble (${wordMaps["scrabble"].size.toLocaleString()} keys)`,
  },
];

function App() {
  const [baseWord, setBaseWord] = useState("");
  const [subWord, setSubWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Map<number, Set<string>>>(
    new Map()
  );
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);
  const [excessLetters, setExcessLetters] = useState<string[]>([]);
  const [selectedWordMap, setSelectedWordMap] = useState<string>("enable1");

  console.log(selectedWordMap);

  const cleanInput = (word: string) => {
    return word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  };

  const handleSearch = (word: string) => {
    console.log("search triggered");
    const wordMap = wordMaps[selectedWordMap as keyof typeof wordMaps];
    const results = getAnagramKeys(wordMap, cleanInput(word));
    setCandidates(results);
  };

  const handleSelectWord = (word: string) => {
    if (word) {
      setSelectedWords((prev) => [...prev, word]);
    }
  };

  const handleDeselectWord = (index: number) => {
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
  };

  type CandidateMap = Map<number, Set<string>>;
  const Candidates = (candidates: CandidateMap) => {
    let contents = [];
    for (let [len, words] of candidates.entries()) {
      contents.push(<div style={lengthStyle}>Length: {len}</div>);
      for (let word of words) {
        contents.push(
          <Chip
            label={word}
            selected={selectedWords.includes(word) ? true : false}
            onClick={() => {
              handleSelectWord(word);
            }}
          />
        );
      }
    }
    return contents;
  };

  const makeSelected = (selectedWords: string[]) => {
    return selectedWords.map((word, index) => (
      <Chip
        key={`${word}-${index}`}
        label={word}
        selected={true}
        onClick={() => handleDeselectWord(index)}
      />
    ));
  };

  type Counter = Map<string, number>;
  const makeCounter = (letters: string[]): Counter => {
    const counter = new Map<string, number>();
    letters.forEach((letter) => {
      counter.set(letter, (counter.get(letter) || 0) + 1);
    });
    return counter;
  };

  // const WordDisplay = ({ word }: { word: string }) => {
  //   const ColorChar = ({ char, status }: { char: string; status?: string }) => {
  //     const getColor = () => {
  //       switch (status) {
  //         case "belongs":
  //           return "text-green-500";
  //         case "extra":
  //           return "text-red-500";
  //         default:
  //           return "text-gray-400";
  //       }
  //     };
  //     return (
  //       <span className={`mono ${getColor()} inline-block mx-0.5`}>{char}</span>
  //     );
  //   };
  //   const localBaseWord = word.replace(/[^a-zA-Z\s]/g, "").toLowerCase();
  //   let usedCounter = makeCounter(usedLetters);
  //   let display = [];
  //   for (const char of [...localBaseWord]) {
  //     const count = usedCounter.get(char) ?? 0;
  //     if (count > 0) {
  //       display.push(<ColorChar char={char} status={"belongs"} />);
  //       usedCounter.set(char, count - 1); // Use set() to update      }
  //     } else {
  //       display.push(<ColorChar char={char} />);
  //     }
  //   }
  //   for (const [char, count] of usedCounter) {
  //     for (let i = 0; i < count; i++) {
  //       display.push(<ColorChar char={char} status="extra" />);
  //     }
  //   }
  //   return display;
  // };

  useEffect(() => {
    let baseCounter = makeCounter(cleanInput(baseWord).split(""));
    let usedCounter = makeCounter(
      selectedWords.flatMap((word) => word.split(""))
    );
    let remaining: string[] = [];
    let excess: string[] = [];
    baseCounter.forEach((count, letter) => {
      let usedCount = usedCounter.get(letter) || 0;
      let diff = count - usedCount;
      if (diff > 0) {
        remaining.push(...Array(diff).fill(letter));
      }
    });
    usedCounter.forEach((count, letter) => {
      let baseCount = baseCounter.get(letter) || 0;
      let diff = count - baseCount;
      if (diff > 0) {
        excess.push(...Array(diff).fill(letter));
      }
    });
    let allUsedLetters: string[] = [];
    usedCounter.forEach((count, letter) => {
      allUsedLetters.push(...Array(count).fill(letter));
    });
    setExcessLetters(excess.sort());
    setUsedLetters([...allUsedLetters].sort());
    setRemainingLetters(remaining.sort());
  }, [selectedWords, baseWord]);

  useEffect(() => {
    handleSearch(remainingLetters.join(""));
  }, [remainingLetters, selectedWordMap]);

  return (
    <div style={containerStyle}>
      {/* TODO: add dropdown to select word list. also, add a smaller wordlist */}
      <div>
        <h1>a rag man</h1>
        <AccordionItem title="How To / About">
          Type something in to see candidate anagrams of different lengths. You
          can also add a custom word if the one you want isn't present. There
          are many word lists to choose from right now, as I find which ones are
          not bringing anything of value, I'll remove them.
          <br />
          The 10k, 20k, and 30k word lists seem possibly lower quality, I think
          they were collected with scraping? Source{" "}
          <a href="https://github.com/arstgit/high-frequency-vocabulary">
            here.
          </a>{" "}
          Enable1 and Popular are{" "}
          <a href="https://github.com/dolph/dictionary/tree/master">here.</a>{" "}
          Finally, the "Scrabble" list comes from SOWPODS which is...
          approximately the Scrabble word list? I'm really not sure. But it's
          not copyrighted, unlike the official list. Source{" "}
          <a href="https://www.freescrabbledictionary.com/twl06/download/twl06.txt">
            here.
          </a>
          <br />
          Also, this does searches client side. If you put in a big enough
          string with a big enough word list, you will crash your browser. I
          could have prevented this, but I didn't because it is your God-given
          right to crash your own hardware.
        </AccordionItem>
      </div>
      <div>
        Word List:{" "}
        <Select
          options={options}
          value={selectedWordMap}
          onChange={(e) => setSelectedWordMap(e.target.value)}
        />
      </div>
      <div style={inputGroupStyle}>
        <Input
          type="text"
          placeholder="Enter word to anagram"
          value={baseWord}
          onChange={(e) => setBaseWord(e.target.value)}
          style={inputStyle}
        />
        {/* <Button
          text="Search for anagrams"
          onClick={() => {
            setSelectedWords([]);
            handleSearch(cleanInput(baseWord));
          }}
        /> */}
      </div>
      <div style={inputGroupStyle}>
        <Input
          type="text"
          placeholder="Enter custom word"
          value={subWord}
          onChange={(e) => setSubWord(e.target.value)}
          style={inputStyle}
        />
        <Button text="Add word" onClick={() => handleSelectWord(subWord)} />
      </div>
      {/* <div style={inputGroupStyle}>
        <Button
          text="Search using remaining letters"
          onClick={() => handleSearch(remainingLetters.join(""))}
          disabled={
            remainingLetters.length == 0 &&
            remainingLetters.length > cleanInput(baseWord).length
          }
          // TODO: disabled needs to have a visual indicator! add an option to disable auto search, then enable this, also
        />
      </div> */}
      {usedLetters.length > 0 && (
        <div>
          <div style={sectionStyle}>Letters Used</div>
          {usedLetters.join(" ")}
        </div>
      )}
      {remainingLetters.length > 0 &&
        selectedWords.length > 0 &&
        remainingLetters.length < cleanInput(baseWord).length && (
          <div>
            <div style={sectionStyle}>Letters Remaining</div>
            {remainingLetters.join(" ")}
          </div>
        )}
      {excessLetters.length > 0 && (
        <div>
          <div style={sectionStyle}>Excess Letters!</div>
          {excessLetters.join(" ")}
        </div>
      )}
      {selectedWords.length > 0 && (
        <div>
          <div style={sectionStyle}>Selected Words:</div>
          {makeSelected(selectedWords)}
        </div>
      )}
      {candidates.size > 0 && (
        <div>
          <div style={sectionStyle}>Candidates:</div>
          {Candidates(candidates)}
        </div>
      )}
    </div>
  );
}

export default App;

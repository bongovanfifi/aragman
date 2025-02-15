import { useState, useEffect } from "react";
import { Chip, Input, Button } from "./components";
import { getWordMaps } from "./lib/word-maps";
import { getAnagramKeys } from "./lib/anagrams";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
  width: "95%",
  maxWidth: "600px", // Keep the max-width for desktop
  margin: "10px",
};

const inputGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap" as const,
  width: "100%",
};

const inputStyle = {
  width: "200px",
};

const textBlockStyle = {
  width: "100%", // Changed from fixed 500px to be responsive
  maxWidth: "500px", // Added max-width to maintain readability on larger screens
  textAlign: "left" as const,
};

const lettersStyle = {
  fontSize: "1rem",
};

const sectionStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
};

const lengthStyle = {
  fontSize: "1rem",
  fontWeight: "bold",
};

const { tenK } = getWordMaps();

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

  const cleanInput = (word: string) => {
    return word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  };

  const handleSearch = (word: string) => {
    const results = getAnagramKeys(tenK, cleanInput(word));
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
  }, [remainingLetters]);

  return (
    <div style={containerStyle}>
      {/* TODO: add dropdown to select word list. also, add a smaller wordlist */}
      <div style={textBlockStyle}>
        <h1>Manarag</h1>
        Type something in to see candidate anagrams of different lengths. You
        can also add a custom word if the one you want isn't present. The word
        list it's using right now is apparently full of two letter non-words.
        I'll look for a better one. Also, it does that classic React flicker.
        Why did I use React? The devil you know is better than the devil that
        requires you to learn a new Javascript framework.
        <br />
        <br />
        Also, this does searches client side. If you put in a big enough string
        it will have to do way too much searching and crash your browser. I
        could have prevented this, but I didn't because it is your God-given
        right to crash your own hardware.
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
          <div style={lettersStyle}>{usedLetters.join(" ")}</div>
        </div>
      )}
      {remainingLetters.length > 0 &&
        selectedWords.length > 0 &&
        remainingLetters.length < cleanInput(baseWord).length && (
          <div>
            <div style={sectionStyle}>Letters Remaining</div>
            <div style={lettersStyle}>{remainingLetters.join(" ")}</div>
          </div>
        )}
      {excessLetters.length > 0 && (
        <div>
          <div style={sectionStyle}>Excess Letters!</div>
          <div style={lettersStyle}>{excessLetters.join(" ")}</div>
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

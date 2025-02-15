import { useState, useEffect } from "react";
import "./App.css";
import { Chip, Input, Button } from "./components";
import { getWordMaps } from "./lib/word-maps";
import { getAnagramKeys } from "./lib/anagrams";

const containerStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
  width: "95%",
  maxWidth: "800px", // Keep the max-width for desktop
  margin: "0 auto", // Center the container
};

const inputGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const labelStyle = {
  minWidth: "160px",
};

const inputStyle = {
  width: "200px",
};

const textBlockStyle = {
  width: "100%", // Changed from fixed 500px to be responsive
  maxWidth: "500px", // Added max-width to maintain readability on larger screens
  textAlign: "left" as const,
};

const { tenK } = getWordMaps();

function App() {
  const [baseWord, setBaseWord] = useState("");
  const [subWord, setSubWord] = useState("");

  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<Map<number, Set<string>>>(
    new Map()
  );

  const cleanInput = (word: string) => {
    return word.replace(/[^a-zA-Z]/g, "").toLowerCase();
  };

  const handleSearch = (word: string) => {
    const results = getAnagramKeys(tenK, cleanInput(word));
    setCandidates(results);
  };

  const handleSelectWord = (word: string) => {
    setSelectedWords((prev) => [...prev, word]);
  };

  const handleDeselectWord = (index: number) => {
    setSelectedWords((prev) => prev.filter((_, i) => i !== index));
  };

  type CandidateMap = Map<number, Set<string>>;
  const makeCandidates = (candidates: CandidateMap) => {
    let contents = [];
    for (let [len, words] of candidates.entries()) {
      contents.push(<h3>{len}</h3>);
      for (let word of words) {
        contents.push(
          <Chip
            label={word}
            selected={selectedWords.includes(word) ? true : false}
            onClick={() => handleSelectWord(word)}
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

  useEffect(() => {
    type Counter = Map<string, number>;
    function makeCounter(letters: string[]): Counter {
      const counter = new Map();
      letters.forEach((letter) => {
        counter.set(letter, (counter.get(letter) || 0) + 1);
      });
      return counter;
    }
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

    setRemainingLetters(remaining.sort());
    setExcessLetters(excess.sort());
    setUsedLetters([...usedCounter.keys()].sort());
  }, [selectedWords]);

  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<string[]>([]);
  const [excessLetters, setExcessLetters] = useState<string[]>([]);

  return (
    <div style={containerStyle}>
      <div style={textBlockStyle}>
        <h1>Manarag</h1>
        <p>
          Type something in as base word and hit search to see candidate
          anagrams of different lengths. You can also add a custom word if the
          one you want isn't present. Once you select words, you can search
          again with only the remaining letters. There are very many things to
          add to this, but the core functionality is there.
        </p>
        <p>
          Also, this does a search client side. If you put in a big enough
          string it will have to do way too much searching and crash your
          browser. I could have prevented this, but I didn't because it is your
          God-given right to crash your own hardware if you want to.
        </p>
      </div>
      <div style={inputGroupStyle}>
        <span style={labelStyle}>Base word:</span>
        <Input
          type="text"
          placeholder="Enter text"
          value={baseWord}
          onChange={(e) => setBaseWord(e.target.value)}
          style={inputStyle}
        />
        <Button
          text="Search"
          onClick={() => {
            setSelectedWords([]);
            handleSearch(cleanInput(baseWord));
          }}
        />
      </div>
      <div style={inputGroupStyle}>
        <span style={labelStyle}>Custom sub-word:</span>
        <Input
          type="text"
          placeholder="Enter text"
          value={subWord}
          onChange={(e) => setSubWord(e.target.value)}
          style={inputStyle}
        />
        <Button text="Add" onClick={() => handleSelectWord(subWord)} />
      </div>
      <div>
        {usedLetters.length > 0 && (
          <div>
            <h2>Letters Used</h2>
            {usedLetters.join("")}
          </div>
        )}
      </div>
      <div>
        {remainingLetters.length > 0 &&
          remainingLetters.length < cleanInput(baseWord).length && (
            <div>
              <h2>Letters Remaining</h2>
              {remainingLetters.join("")}
              <br />
              <Button
                text="Search using remaining letters"
                onClick={() => handleSearch(remainingLetters.join(""))}
              />
            </div>
          )}
        <br />
      </div>
      <div>
        {/* should be a function that just hides when empty */}
        {excessLetters.length > 0 && (
          <div>
            <h2>Excess Letters!</h2>
            {excessLetters.join("")}
          </div>
        )}
      </div>
      <div>
        {selectedWords.length > 0 && (
          <div>
            <h2>Selected Words:</h2>
            <br />
            {makeSelected(selectedWords)}
          </div>
        )}
      </div>
      <div>
        {candidates.size > 0 && (
          <div>
            <h2>Candidates:</h2>
            <br />
            {makeCandidates(candidates)}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

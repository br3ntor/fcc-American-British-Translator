// Final version
// I don't know why, but I couldn't decide on the best way to structure this project
// I wrote three different variations. I think I should study the input more carefully
// I am moving on though since I am sick of it for now and I can pass all the tests
import { americanOnly } from "./american-only.js";
import { britishOnly } from "./british-only.js";
import { americanToBritishSpelling } from "./american-to-british-spelling.js";
import { americanToBritishTitles } from "./american-to-british-titles.js";

const textInput = document.getElementById("text-input");
const translateButton = document.getElementById("translate-btn");
const clearButton = document.getElementById("clear-btn");
const dropdown = document.getElementById("locale-select");
const translatedSentence = document.getElementById("translated-sentence");
const errorMessage = document.getElementById("error-msg");

textInput.value =
  "Mangoes are my favorite fruit. Can you toss this in the trashcan for me?";

clearButton.addEventListener("click", clearButtonHandler);
translateButton.addEventListener("click", translateHandler);

function clearButtonHandler(event) {
  textInput.value = "";
  translatedSentence.textContent = "";
  errorMessage.textContent = "";
}

function translateHandler(event) {
  errorMessage.textContent = "";

  if (textInput.value === "") {
    errorMessage.textContent = "Error: No text to translate.";
    return;
  }

  const t = translate(textInput.value);

  let translated = false;

  if (dropdown.value === "american-to-british") {
    translatedSentence.innerHTML = t.htmlB;

    // If they are not equal, a translation HAS occurred
    translated = t.brit !== t.htmlB;
  }

  if (dropdown.value === "british-to-american") {
    translatedSentence.innerHTML = t.htmlA;
    translated = t.amer !== t.htmlA;
  }

  if (!translated) {
    translatedSentence.textContent = "Everything looks good to me!";
  }
}

function highlightWord(word) {
  return `<span class="highlight">${word}</span>`;
}

function flipObj(obj) {
  return Object.assign(
    {},
    ...Object.entries(obj).map(([a, b]) => ({ [b]: a }))
  );
}

function translate(sentence) {
  let british = sentence;
  let american = sentence;
  let britishHtmlStr = sentence;
  let americanHtmlStr = sentence;

  // Combine some of the objects, was just easier to deal with titles separately
  const americanDictionary = {
    ...americanOnly,
    ...americanToBritishSpelling,
    ...americanToBritishTitles,
  };

  const britishDictionary = {
    ...britishOnly,
    ...flipObj(americanToBritishSpelling),
    ...flipObj(americanToBritishTitles),
  };

  // British time
  if (/\d+:\d+/.test(british)) {
    const match = british.match(/\d+:\d+/)[0];
    const newTime = match.replace(":", ".");
    british = british.replace(match, newTime);
    britishHtmlStr = britishHtmlStr.replace(match, highlightWord(newTime));
  }

  // American time
  if (/\d+\.\d+/.test(american)) {
    const match = american.match(/\d+\.\d+/)[0];
    const newTime = match.replace(".", ":");
    american = american.replace(match, newTime);
    americanHtmlStr = americanHtmlStr.replace(match, highlightWord(newTime));
  }

  for (let word in americanDictionary) {
    // Create regex for title or regular word/phrase
    let wordRegex;
    if (word.slice(-1) === ".") {
      wordRegex = new RegExp(word.slice(0, -1) + "\\.(?=\\s|$)", "gi");
    } else {
      wordRegex = new RegExp("\\b" + word + "\\b", "gi");
    }

    if (wordRegex.test(sentence)) {
      // If title with . at the end, copy match and remove dot to preserve case if capitalized
      if (word.slice(-1) === ".") {
        const britishTitle = sentence.match(wordRegex)[0].slice(0, -1);
        british = british.replace(wordRegex, britishTitle);
        britishHtmlStr = britishHtmlStr.replace(
          wordRegex,
          highlightWord(britishTitle)
        );
      } else {
        british = british.replace(wordRegex, americanDictionary[word]);
        britishHtmlStr = britishHtmlStr.replace(
          wordRegex,
          highlightWord(americanDictionary[word])
        );
      }
    }
  }

  for (let word in britishDictionary) {
    let newWord = britishDictionary[word];

    const wordRegex = new RegExp(word + "(?=\\s|\\.$)", "gi");
    if (wordRegex.test(sentence)) {
      if (newWord.slice(-1) === ".") {
        const amerTitle = sentence.match(wordRegex)[0] + ".";
        newWord = amerTitle;
      }

      american = american.replace(wordRegex, newWord);
      americanHtmlStr = americanHtmlStr.replace(
        wordRegex,
        highlightWord(newWord)
      );
    }
  }

  return {
    orig: sentence,
    brit: british,
    amer: american,
    htmlA: americanHtmlStr,
    htmlB: britishHtmlStr,
  };
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translateHandler,
    clearButtonHandler,
    translate,
  };
} catch (e) {}

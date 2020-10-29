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

  let translated = false;

  if (dropdown.value === "american-to-british") {
    let abResult = translateAB(textInput.value);
    translatedSentence.innerHTML = abResult.htmlStr;

    // If they are not equal, a translation HAS occurred
    translated = abResult.translatedStr !== abResult.htmlStr;
  }

  if (dropdown.value === "british-to-american") {
    let baResult = translateBA(textInput.value);
    translatedSentence.innerHTML = baResult.htmlStr;
    translated = baResult.translatedStr !== baResult.htmlStr;
  }

  if (!translated) {
    translatedSentence.textContent = "Everything looks good to me!";
  }

  // This will be the replacement for AB after I make sure it works
  const oneTranslate = translate(textInput.value);
  console.log(oneTranslate);
}

function highlightWord(word) {
  return `<span class="highlight">${word}</span>`;
}

function translate(sentence) {
  let british = sentence;
  let american = sentence;
  let britishHtmlStr = sentence;
  let americanHtmlStr = sentence;

  const flippedBritish = Object.assign(
    {},
    ...Object.entries(britishOnly).map(([a, b]) => ({ [b]: a }))
  );

  // This isn't going to work because the "only" dicts cant be combined
  // Combine some of the objects, was just easier to deal with titles separately
  const dictionary = {
    ...americanOnly,
    ...flippedBritish,
    ...americanToBritishSpelling,
  };

  for (let word in dictionary) {
    const reA = new RegExp(word + "\\b", "gi");
    const reB = new RegExp(dictionary[word] + "\\b", "gi");

    if (reA.test(sentence)) {
      british = british.replace(reA, dictionary[word]);
      britishHtmlStr = britishHtmlStr.replace(
        reA,
        highlightWord(dictionary[word])
      );
    }

    if (reB.test(sentence)) {
      american = american.replace(reB, word);
      americanHtmlStr = americanHtmlStr.replace(reB, highlightWord(word));
    }
  }

  for (let title in americanToBritishTitles) {
    const reA = new RegExp(title.slice(0, -1) + "\\.(?=\\s|$)", "ig");
    const reB = new RegExp(americanToBritishTitles[title] + "(?=\\s|$)", "ig");
    const capA = title[0].toUpperCase() + title.slice(1);
    const capB =
      americanToBritishTitles[title][0].toUpperCase() +
      americanToBritishTitles[title].slice(1);

    if (reA.test(sentence)) {
      british = british.replace(reA, capB);
      britishHtmlStr = britishHtmlStr.replace(reA, highlightWord(capB));
    }

    if (reB.test(sentence)) {
      american = american.replace(reB, capA);
      americanHtmlStr = americanHtmlStr.replace(reB, highlightWord(capA));
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

function translateAB(sentence) {
  let translatedStr = sentence;
  let htmlStr = sentence;

  // Iterate over american-only
  for (let word in americanOnly) {
    const re = new RegExp(word + "\\b", "i");
    if (re.test(translatedStr)) {
      const matched = translatedStr.match(re)[0];
      translatedStr = translatedStr.replace(matched, americanOnly[word]);
      htmlStr = htmlStr.replace(matched, highlightWord(americanOnly[word]));
    }
  }

  // Iterate over american-to-british-spelling
  for (let word in americanToBritishSpelling) {
    if (translatedStr.includes(word)) {
      translatedStr = translatedStr.replace(
        word,
        americanToBritishSpelling[word]
      );
      htmlStr = htmlStr.replace(
        word,
        highlightWord(americanToBritishSpelling[word])
      );
    }
  }

  // Iterate over american-to-british-titles
  // This differs from the b2a equivalent codeblock
  // below which I think is a better approach...
  for (let title in americanToBritishTitles) {
    if (translatedStr.toLowerCase().includes(title)) {
      const re = new RegExp(title, "i");
      const matched = translatedStr.match(re)[0];
      const capitalizedTitle =
        americanToBritishTitles[title][0].toUpperCase() +
        americanToBritishTitles[title].slice(1);
      translatedStr = translatedStr.replace(matched, capitalizedTitle);
      htmlStr = htmlStr.replace(matched, highlightWord(capitalizedTitle));
    }
  }

  // Change time delimiter thingy
  if (/\d+:\d+/.test(translatedStr)) {
    const match = translatedStr.match(/\d+:\d+/)[0];
    const newTime = match.replace(":", ".");
    translatedStr = translatedStr.replace(match, newTime);
    htmlStr = htmlStr.replace(match, highlightWord(newTime));
  }

  return { translatedStr, htmlStr };
}

function translateBA(sentence) {
  let translatedStr = sentence;
  let htmlStr = sentence;

  // Iterate over british-only
  for (let word in britishOnly) {
    const re = new RegExp("(\\s|^)" + word + "\\b", "i");
    if (re.test(translatedStr)) {
      const matched = translatedStr.match(re)[0];
      translatedStr = translatedStr.replace(matched.trim(), britishOnly[word]);
      htmlStr = htmlStr.replace(
        matched.trim(),
        highlightWord(britishOnly[word])
      );
    }
  }

  // Iterate over british-to-american-spelling
  for (let word in americanToBritishSpelling) {
    if (translatedStr.includes(americanToBritishSpelling[word])) {
      translatedStr = translatedStr.replace(
        americanToBritishSpelling[word],
        word
      );
      htmlStr = htmlStr.replace(
        americanToBritishSpelling[word],
        highlightWord(word)
      );
    }
  }

  // Iterate over american-to-british-titles
  for (let title in americanToBritishTitles) {
    const re = new RegExp(americanToBritishTitles[title] + "(?=\\s)", "i");
    if (re.test(translatedStr)) {
      const matched = translatedStr.match(re)[0];
      const capitalizedTitle = title[0].toUpperCase() + title.slice(1);
      translatedStr = translatedStr.replace(matched, capitalizedTitle);
      htmlStr = htmlStr.replace(matched, highlightWord(capitalizedTitle));
    }
  }

  // Change time delimiter thingy
  if (/\d+.\d+/.test(translatedStr)) {
    const match = translatedStr.match(/\d+.\d+/)[0];
    const newTime = match.replace(".", ":");
    translatedStr = translatedStr.replace(match, newTime);
    htmlStr = htmlStr.replace(match, highlightWord(newTime));
  }

  return { translatedStr, htmlStr };
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    translateAB,
    translateBA,
    translateHandler,
    clearButtonHandler,
    translate,
  };
} catch (e) {}

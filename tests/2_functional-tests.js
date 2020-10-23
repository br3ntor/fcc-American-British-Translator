/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

let Translator;

suite("Functional Tests", () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require("../public/translator.js");
  });

  suite("Function translateHandler()", () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", (done) => {
      const translatedSentence = document.getElementById("translated-sentence");
      const textInput = document.getElementById("text-input");
      textInput.value = "We had a party at my friend's condo.";
      Translator.translateHandler();
      assert.isTrue(translatedSentence.textContent.length > 0);
      assert.isTrue(translatedSentence.querySelectorAll("span").length > 0);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", (done) => {
      const translatedSentence = document.getElementById("translated-sentence");
      const textInput = document.getElementById("text-input");
      textInput.value = "Hello there, I am a dog.";
      Translator.translateHandler();
      assert.equal(
        translatedSentence.textContent,
        "Everything looks good to me!"
      );
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", (done) => {
      const errorMessage = document.getElementById("error-msg");
      const textInput = document.getElementById("text-input");
      textInput.value = "";
      Translator.translateHandler();
      assert.equal(errorMessage.textContent, "Error: No text to translate.");
      done();
    });
  });

  suite("Function clearButtonHandler()", () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", (done) => {
      const textInput = document.getElementById("text-input");
      const translatedSentence = document.getElementById("translated-sentence");
      const errorMessage = document.getElementById("error-msg");
      Translator.clearButtonHandler();
      const cleared = [
        textInput.textContent,
        translatedSentence.textContent,
        errorMessage.textContent,
      ].every((el) => el === "");
      assert.isTrue(cleared);
      done();
    });
  });
});

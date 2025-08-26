const input = document.querySelector("input");
const btn = document.querySelector("button");
const dictionary = document.querySelector(".dictionary-app");

// Fetch word details
async function dictionaryFn(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const data = await response.json();
  return data[0];
}

// Event listener
btn.addEventListener("click", fetchAndCreateCard);

async function fetchAndCreateCard() {
  if (!input.value.trim()) return; // ignore empty input

  const data = await dictionaryFn(input.value);
  console.log(data);

  // Collect parts of speech
  let partsOfSpeechArray = [];
  for (let i = 0; i < data.meanings.length; i++) {
    partsOfSpeechArray.push(data.meanings[i].partOfSpeech);
  }

  // Find valid audio
  let audioSrc = "";
  if (data.phonetics && data.phonetics.length > 0) {
    const phoneticWithAudio = data.phonetics.find(p => p.audio);
    audioSrc = phoneticWithAudio ? phoneticWithAudio.audio : "";
  }

  dictionary.innerHTML = `
    <div class="card">
      <div class="property">
        <span>Word:</span>
        <span>${data.word}</span>
      </div>
      <div class="property">
        <span>Phonetics:</span>
        <span>${data.phonetics[0]?.text || "N/A"}</span>
      </div>
      <div class="property">
        <span>Audio:</span>
        ${
          audioSrc 
          ? `<audio controls src="${audioSrc}"></audio>` 
          : `<span>No audio available</span>`
        }
      </div>
      <div class="property">
        <span>Definition:</span>
        <span>${data.meanings[0].definitions[0].definition}</span>
      </div>
      <div class="property">
        <span>Example:</span>
        <span>${data.meanings[0].definitions[0].example || "No example available"}</span>
      </div>
      <div class="property">
        <span>Parts of Speech:</span>
        <span>${partsOfSpeechArray.join(", ")}</span>
      </div>
    </div>
  `;
}

// Run once with default word (optional)
// fetchAndCreateCard();

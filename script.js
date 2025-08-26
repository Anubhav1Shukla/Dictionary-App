const input = document.querySelector("input");
const btn = document.querySelector("button");
const dictionary = document.querySelector(".dictionary-app");

// Fetch word details
async function dictionaryFn(word) {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!response.ok) {
    throw new Error("Word not found"); // handle error
  }
  const data = await response.json();
  return data[0];
}

// Event listener
btn.addEventListener("click", fetchAndCreateCard);

// Allow pressing Enter key too
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchAndCreateCard();
  }
});

async function fetchAndCreateCard() {
  const word = input.value.trim();
  if (!word) return;

 dictionary.innerHTML = `
  <div class="card">
    <div class="property" style="text-align:center;">
      <div class="loading-spinner"></div>
      <span>Searching for "${word}"...</span>
    </div>
  </div>
`;


  try {
    const data = await dictionaryFn(word);

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

  } catch (error) {
    // Show error if word not found
    dictionary.innerHTML = `
      <div class="card">
        <div class="property">
          <span style="color: #ff6b6b;">❌ ${error.message}</span>
        </div>
      </div>
    `;
  }
}

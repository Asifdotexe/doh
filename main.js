import "./style.css";
import dohGif from "./src/assets/doh.gif";
import html2canvas from "html2canvas";

let cachedQuestions = null;
const seenQuestionIds = new Set();
let lastQuestionId = null;

const QUESTIONS_URL = `${import.meta.env.BASE_URL}data/questions.json`;

const topicCategoryEl = document.getElementById("topic-category");
const topicTextEl = document.getElementById("topic-text");
const btnSpin = document.getElementById("btn-spin");
const topicCard = document.querySelector(".topic-card");

const modal = document.getElementById("submit-modal");
const btnSubmitTopic = document.getElementById("btn-submit-topic");
const btnCloseModal = document.getElementById("btn-close-modal");
const formSubmit = document.getElementById("submit-form");
const btnCopyImage = document.getElementById("btn-copy-image");

async function getQuestions() {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  try {
    const res = await fetch(QUESTIONS_URL);
    if (!res.ok) throw new Error("Failed to fetch questions");
    const data = await res.json();
    cachedQuestions = data;
    return data;
  } catch (err) {
    console.error("Error loading questions:", err);
    return [];
  }
}

async function spin() {
  const selectedMode = document.querySelector('input[name="mode"]:checked').value;
  const checkboxes = document.querySelectorAll('#category-checkboxes input[type="checkbox"]:checked');
  const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

  if (selectedCategories.length === 0) {
    topicTextEl.textContent = "Please select at least one battleground.";
    topicCategoryEl.textContent = "EMPTY";
    return;
  }

  const allQuestions = await getQuestions();
  let currentQuestions = allQuestions.filter(q => selectedCategories.includes(q.category));

  const excludeSeen = document.getElementById("exclude-seen-checkbox").checked;
  const isMythOnly = document.getElementById("myth-only-checkbox").checked;

  let filtered = currentQuestions.filter((q) => {
    if (selectedMode === "nice") {
      if (isMythOnly) return q.mode === "myth";
      return q.mode === "nice" || q.mode === "myth";
    }
    return q.mode === selectedMode; // "violence"
  });

  if (excludeSeen) {
    filtered = filtered.filter((q) => !seenQuestionIds.has(q.id));
  } else if (filtered.length > 1) {
    // Better randomisation: prevent immediate back-to-back repeats
    filtered = filtered.filter((q) => q.id !== lastQuestionId);
  }

  if (filtered.length === 0) {
    const totalPossible = currentQuestions.filter((q) => {
      if (selectedMode === "nice") {
        if (isMythOnly) return q.mode === "myth";
        return q.mode === "nice" || q.mode === "myth";
      }
      return q.mode === selectedMode;
    }).length;

    let messageText = "Do'h! No arguments found for this combination.";
    if (excludeSeen && totalPossible > 0) {
      messageText = "Do'h! We ran out of questions. Uncheck 'EXCLUDE SEEN' to restart.";
    }

    topicTextEl.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <img src="${dohGif}" alt="Do'h" style="max-width: 100%; max-height: 250px; border: var(--border-width) solid var(--text-color); box-shadow: 4px 4px 0px var(--text-color);">
      </div>
      ${messageText}<br>
      <button id="btn-suggest-empty" class="btn btn-secondary" style="margin-top: 1.5rem;">SUGGEST A TOPIC</button>
    `;
    topicCategoryEl.textContent = "EMPTY";

    document
      .getElementById("btn-suggest-empty")
      .addEventListener("click", () => {
        modal.showModal();
      });
    return;
  }

  // Zippy glitch effect (Neo-brutalism interaction)
  topicCard.classList.add("glitch");
  setTimeout(() => topicCard.classList.remove("glitch"), 150);

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const selected = filtered[randomIndex];

  seenQuestionIds.add(selected.id);
  lastQuestionId = selected.id;

  // Decrypted Text effect
  topicCategoryEl.textContent = selected.category;
  animateDecryptedText(topicTextEl, selected.topic);
}

function animateDecryptedText(el, text) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
  const availableChars = characters.split('');
  const textLen = text.length;
  let revealedIndices = new Set();
  
  if (el.dataset.intervalId) {
    clearInterval(parseInt(el.dataset.intervalId));
  }
  
  const shuffleText = (revealed) => {
    return text.split('').map((char, i) => {
      if (char === ' ') return ' ';
      if (revealed.has(i)) return char;
      return availableChars[Math.floor(Math.random() * availableChars.length)];
    }).join('');
  };
  
  el.textContent = shuffleText(revealedIndices);
  
  // Slower animation to build more anxiety
  const charsPerTick = Math.max(1, Math.ceil(textLen / 40)); 
  
  const interval = setInterval(() => {
    if (revealedIndices.size < textLen) {
      for (let i = 0; i < charsPerTick; i++) {
        if (revealedIndices.size < textLen) {
          revealedIndices.add(revealedIndices.size);
        }
      }
      el.textContent = shuffleText(revealedIndices);
    } else {
      clearInterval(interval);
      el.textContent = text;
      el.removeAttribute('data-interval-id');
    }
  }, 40);
  
  el.dataset.intervalId = interval.toString();
}

btnSpin.addEventListener("click", () => spin());

btnSubmitTopic.addEventListener("click", () => {
  modal.showModal();
});

btnCloseModal.addEventListener("click", () => {
  modal.close();
});

formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();

  const category = document.getElementById("new-category").value;
  const topic = document.getElementById("new-topic").value;

  const submitBtn = formSubmit.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  submitBtn.disabled = true;

  try {
    const web3FormsAccessKey = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!web3FormsAccessKey) {
      alert(
        "Missing Web3Forms access key! Please set VITE_WEB3FORMS_KEY.",
      );
      return;
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: web3FormsAccessKey,
        subject: `New Do'h Suggestion: [${category}]`,
        category: category,
        topic: topic,
      }),
    });

    if (!res.ok) throw new Error("Failed to submit to Web3Forms");

    alert("Topic submitted for review! Thanks for contributing.");
    formSubmit.reset();
    modal.close();
  } catch (err) {
    alert("Failed to submit topic. Please try again or check the console.");
    console.error(err);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

btnCopyImage.addEventListener("click", async () => {
  if (btnCopyImage.disabled) return;

  const origText = btnCopyImage.textContent;
  btnCopyImage.disabled = true;
  btnCopyImage.textContent = "SNAPPING...";

  try {
    // Add capturing class to adjust UI for the image
    topicCard.classList.add("capturing");
    
    // Pass a Promise to ClipboardItem to handle Safari strict requirements
    const blobPromise = html2canvas(topicCard, { 
      backgroundColor: null,
      scale: 2 // High-res capture
    }).then(canvas => {
      topicCard.classList.remove("capturing");
      return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    }).catch(err => {
      topicCard.classList.remove("capturing");
      throw err;
    });

    const item = new ClipboardItem({ "image/png": blobPromise });
    await navigator.clipboard.write([item]);

    btnCopyImage.textContent = "✔ COPIED!";
    setTimeout(() => {
      btnCopyImage.textContent = origText;
      btnCopyImage.disabled = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy image", err);
    btnCopyImage.textContent = "❌ ERROR";
    topicCard.classList.remove("capturing"); // Just in case
    setTimeout(() => {
      btnCopyImage.textContent = origText;
      btnCopyImage.disabled = false;
    }, 2000);
  }
});

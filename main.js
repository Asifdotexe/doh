import "./style.css";
import dohGif from "./src/assets/doh.gif";
import html2canvas from "html2canvas";

const cachedQuestions = {};
const seenQuestionIds = new Set();
let lastQuestionId = null;

const categoryFiles = {
  Science: `${import.meta.env.BASE_URL}data/science.json`,
  Technology: `${import.meta.env.BASE_URL}data/technology.json`,
  Philosophy: `${import.meta.env.BASE_URL}data/philosophy.json`,
};

const topicCategoryEl = document.getElementById("topic-category");
const topicTextEl = document.getElementById("topic-text");
const btnNice = document.getElementById("btn-nice");
const btnViolence = document.getElementById("btn-violence");
const topicCard = document.querySelector(".topic-card");

const modal = document.getElementById("submit-modal");
const btnSubmitTopic = document.getElementById("btn-submit-topic");
const btnCloseModal = document.getElementById("btn-close-modal");
const formSubmit = document.getElementById("submit-form");
const btnCopyImage = document.getElementById("btn-copy-image");

async function getQuestions(category) {

  if (cachedQuestions[category]) {
    return cachedQuestions[category];
  }

  try {
    const res = await fetch(categoryFiles[category]);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    cachedQuestions[category] = data;
    return data;
  } catch (err) {
    console.error("Error loading category:", category, err);
    return [];
  }
}

async function spin(mode) {
  const checkboxes = document.querySelectorAll('#category-checkboxes input[type="checkbox"]:checked');
  const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

  if (selectedCategories.length === 0) {
    topicTextEl.textContent = "Please select at least one battleground.";
    topicCategoryEl.textContent = "EMPTY";
    return;
  }

  let currentQuestions = [];
  for (const cat of selectedCategories) {
    currentQuestions = currentQuestions.concat(await getQuestions(cat));
  }

  const excludeSeen = document.getElementById("exclude-seen-checkbox").checked;

  let filtered = currentQuestions.filter((q) => q.mode === mode);

  if (excludeSeen) {
    filtered = filtered.filter((q) => !seenQuestionIds.has(q.id));
  } else if (filtered.length > 1) {
    // Better randomisation: prevent immediate back-to-back repeats
    filtered = filtered.filter((q) => q.id !== lastQuestionId);
  }

  if (filtered.length === 0) {
    const totalPossible = currentQuestions.filter(
      (q) => q.mode === mode,
    ).length;
    if (excludeSeen && totalPossible > 0) {
      topicTextEl.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <img src="${dohGif}" alt="Do'h" style="max-width: 100%; max-height: 250px; border: var(--border-width) solid var(--text-color); box-shadow: 4px 4px 0px var(--text-color);">
        </div>
        Do'h! We ran out of questions. Uncheck 'EXCLUDE SEEN' to restart.<br>
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
    topicTextEl.textContent = "No arguments found for this combination.";
    topicCategoryEl.textContent = "EMPTY";
    return;
  }

  // Zippy glitch effect (Neo-brutalism interaction)
  topicCard.classList.add("glitch");
  setTimeout(() => topicCard.classList.remove("glitch"), 150);

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const selected = filtered[randomIndex];

  seenQuestionIds.add(selected.id);
  lastQuestionId = selected.id;

  // Quick text scramble effect
  let scrambleCount = 0;
  const scrambleInterval = setInterval(() => {
    topicTextEl.textContent = generateScramble(selected.topic.length);
    scrambleCount++;
    if (scrambleCount > 3) {
      clearInterval(scrambleInterval);
      topicTextEl.textContent = selected.topic;
      topicCategoryEl.textContent = selected.category;
    }
  }, 30);
}

function generateScramble(length) {
  const chars = "!<>-_\\/[]{}—=+*^?#_";
  let str = "";
  // Limit to avoid overflow during scramble
  for (let i = 0; i < Math.min(length, 30); i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str + "...";
}

btnNice.addEventListener("click", () => spin("nice"));
btnViolence.addEventListener("click", () => spin("violence"));

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
    // STEP 1: Replace this with your actual Web3Forms access key
    const web3FormsAccessKey = "WEB3_FORM_KEY";

    if (web3FormsAccessKey === "WEB3_FORM_KEY") {
      alert(
        "DEVELOPER NOTE: You need to put your Web3Forms access key in main.js!",
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

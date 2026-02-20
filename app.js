const state = {
  mode: 'flashcard',
  domain: 'all',
  questions: [...window.CLFP_QUESTIONS],
  index: 0,
  selectedChoice: null,
  answered: 0,
};

const domainFilter = document.getElementById('domainFilter');
const modeSelect = document.getElementById('modeSelect');
const card = document.getElementById('card');
const checkBtn = document.getElementById('checkBtn');
const nextBtn = document.getElementById('nextBtn');
const quizActions = document.getElementById('quizActions');
const feedback = document.getElementById('feedback');
const progressText = document.getElementById('progressText');

function getFilteredQuestions() {
  return state.domain === 'all'
    ? state.questions
    : state.questions.filter((q) => q.domain === state.domain);
}

function populateDomains() {
  const unique = [...new Set(state.questions.map((q) => q.domain))].sort();
  unique.forEach((domain) => {
    const option = document.createElement('option');
    option.value = domain;
    option.textContent = domain;
    domainFilter.appendChild(option);
  });
}

function render() {
  const questions = getFilteredQuestions();
  const q = questions[state.index % questions.length];

  if (!q) {
    card.innerHTML = '<p>No questions for this domain yet.</p>';
    progressText.textContent = '0/0 answered';
    return;
  }

  if (state.mode === 'flashcard') {
    quizActions.classList.add('hidden');
    card.innerHTML = `
      <p><strong>Domain:</strong> ${q.domain}</p>
      <h2>${q.question}</h2>
      <details>
        <summary>Reveal answer</summary>
        <p><strong>${q.choices[q.answerIndex]}</strong></p>
        <p>${q.explanation}</p>
      </details>
      <button id="flashNext" type="button">Next card</button>
    `;
    document.getElementById('flashNext').addEventListener('click', () => {
      state.index += 1;
      render();
    });
  } else {
    quizActions.classList.remove('hidden');
    card.innerHTML = `
      <p><strong>Domain:</strong> ${q.domain}</p>
      <h2>${q.question}</h2>
      <div class="answers">
        ${q.choices
          .map(
            (choice, i) =>
              `<button class="answer ${state.selectedChoice === i ? 'selected' : ''}" data-index="${i}">${choice}</button>`,
          )
          .join('')}
      </div>
    `;

    card.querySelectorAll('.answer').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        state.selectedChoice = Number(event.currentTarget.dataset.index);
        render();
      });
    });
  }

  progressText.textContent = `${state.answered}/${questions.length} answered`;
}

function checkAnswer() {
  const questions = getFilteredQuestions();
  const q = questions[state.index % questions.length];
  if (state.selectedChoice === null || !q) {
    feedback.className = 'bad';
    feedback.textContent = 'Select an answer first.';
    return;
  }

  const correct = state.selectedChoice === q.answerIndex;
  feedback.className = correct ? 'good' : 'bad';
  feedback.textContent = correct
    ? `Correct. ${q.explanation}`
    : `Not quite. Correct answer: ${q.choices[q.answerIndex]}. ${q.explanation}`;
  state.answered += 1;
}

function nextQuestion() {
  state.index += 1;
  state.selectedChoice = null;
  feedback.textContent = '';
  render();
}

document.getElementById('shuffleBtn').addEventListener('click', () => {
  state.questions.sort(() => Math.random() - 0.5);
  state.index = 0;
  render();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  state.index = 0;
  state.selectedChoice = null;
  state.answered = 0;
  feedback.textContent = '';
  render();
});

domainFilter.addEventListener('change', (event) => {
  state.domain = event.target.value;
  state.index = 0;
  state.selectedChoice = null;
  state.answered = 0;
  feedback.textContent = '';
  render();
});

modeSelect.addEventListener('change', (event) => {
  state.mode = event.target.value;
  state.selectedChoice = null;
  feedback.textContent = '';
  render();
});

checkBtn.addEventListener('click', checkAnswer);
nextBtn.addEventListener('click', nextQuestion);

populateDomains();
render();

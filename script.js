const tabs = [...document.querySelectorAll('.tab-btn')];
const experiments = [...document.querySelectorAll('.experiment')];
const focusToggle = document.getElementById('focus-toggle');
const unitTabs = [...document.querySelectorAll('.unit-tab')];
const unitCards = [...document.querySelectorAll('.unit-card')];
const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const dailyTasks = [
  'הטילו מטבע 20 פעמים ובדקו כמה יצא עץ.',
  'גלגלו קובייה 30 פעמים ובדקו איזה מספר יצא הכי הרבה.',
  'נסו לנחש מה הסיכוי לקבל מספר זוגי בקובייה.',
  'בצעו 15 סיבובי גלגל והשוו בין אדום לכחול.'
];
document.getElementById('daily-task').textContent =
  dailyTasks[new Date().getDate() % dailyTasks.length];

document.querySelectorAll('[data-scroll]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.toggle('active', t === tab));
    experiments.forEach((exp) => exp.classList.toggle('active', exp.id === tab.dataset.tab));
  });
});

unitTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    unitTabs.forEach((t) => t.classList.toggle('active', t === tab));
    unitCards.forEach((card) => card.classList.toggle('active', card.id === tab.dataset.unit));
  });
});

focusToggle.addEventListener('click', () => {
  document.body.classList.toggle('focus-mode');
});

const favInput = document.getElementById('fav-input');
const allInput = document.getElementById('all-input');
const calcOutput = document.getElementById('calc-output');

function runProbabilityCalc() {
  const fav = Number(favInput.value);
  const all = Number(allInput.value);
  if (!Number.isFinite(fav) || !Number.isFinite(all) || all <= 0 || fav < 0 || fav > all) {
    calcOutput.textContent = 'בדקו ערכים: הרצוי צריך להיות בין 0 לבין הסך הכולל.';
    return;
  }

  const percent = ((fav / all) * 100).toFixed(1);
  calcOutput.textContent = `תוצאה: ${fav}/${all} (${percent}%)`;
}

document.getElementById('calc-btn').addEventListener('click', runProbabilityCalc);

let heads = 0;
let tails = 0;
const coinVisual = document.getElementById('coin-visual');
const coinLast = document.getElementById('coin-last');

function updateCoinView() {
  const total = heads + tails;
  const rate = total ? Math.round((heads / total) * 100) : 0;
  document.getElementById('heads-count').textContent = String(heads);
  document.getElementById('tails-count').textContent = String(tails);
  document.getElementById('coin-total').textContent = String(total);
  document.getElementById('heads-bar').style.width = `${rate}%`;
  document.getElementById('heads-rate').textContent = `${rate}%`;
}

function flipCoin(times) {
  let lastResult = 'heads';
  for (let i = 0; i < times; i += 1) {
    if (Math.random() < 0.5) {
      heads += 1;
      lastResult = 'heads';
    } else {
      tails += 1;
      lastResult = 'tails';
    }
  }
  coinVisual.textContent = lastResult === 'heads' ? 'עץ' : 'פלי';
  coinVisual.classList.toggle('tails', lastResult === 'tails');
  coinVisual.classList.remove('flip');
  void coinVisual.offsetWidth;
  coinVisual.classList.add('flip');
  coinLast.textContent = `תוצאה אחרונה: ${lastResult === 'heads' ? 'עץ' : 'פלי'}`;
  updateCoinView();
}

document.getElementById('flip-once').addEventListener('click', () => flipCoin(1));
document.getElementById('flip-ten').addEventListener('click', () => flipCoin(10));
document.getElementById('coin-reset').addEventListener('click', () => {
  heads = 0;
  tails = 0;
  coinVisual.textContent = '?';
  coinVisual.classList.remove('tails');
  coinLast.textContent = 'תוצאה אחרונה: עדיין לא בוצעה הטלה';
  updateCoinView();
});

const diceCounts = [0, 0, 0, 0, 0, 0];
const diceGrid = document.getElementById('dice-grid');
const diceVisual = document.getElementById('dice-visual');
const diceLast = document.getElementById('dice-last');

function renderDice() {
  diceGrid.innerHTML = '';
  diceCounts.forEach((count, idx) => {
    const cell = document.createElement('div');
    cell.className = 'dice-cell';
    cell.textContent = `${idx + 1}: ${count}`;
    diceGrid.appendChild(cell);
  });
}

function rollDice(times) {
  let lastResult = 1;
  for (let i = 0; i < times; i += 1) {
    const result = Math.floor(Math.random() * 6);
    diceCounts[result] += 1;
    lastResult = result + 1;
  }
  diceVisual.textContent = diceSymbols[lastResult - 1];
  diceVisual.classList.remove('roll');
  void diceVisual.offsetWidth;
  diceVisual.classList.add('roll');
  diceLast.textContent = `תוצאה אחרונה: ${lastResult}`;
  renderDice();
}

document.getElementById('roll-once').addEventListener('click', () => rollDice(1));
document.getElementById('roll-twenty').addEventListener('click', () => rollDice(20));
document.getElementById('dice-reset').addEventListener('click', () => {
  diceCounts.fill(0);
  diceVisual.textContent = '⚀';
  diceLast.textContent = 'תוצאה אחרונה: 1';
  renderDice();
});

const spinnerCounts = { red: 0, blue: 0, green: 0 };
const spinnerVisual = document.getElementById('spinner-visual');
const spinnerLast = document.getElementById('spinner-last');

function spin(times) {
  let lastColor = '';
  for (let i = 0; i < times; i += 1) {
    const r = Math.random();
    if (r < 0.5) {
      spinnerCounts.red += 1;
      lastColor = 'אדום';
    } else if (r < 0.8) {
      spinnerCounts.blue += 1;
      lastColor = 'כחול';
    } else {
      spinnerCounts.green += 1;
      lastColor = 'ירוק';
    }
  }

  if (times > 0) {
    spinnerVisual.classList.remove('spin');
    void spinnerVisual.offsetWidth;
    spinnerVisual.classList.add('spin');
    spinnerLast.textContent = `תוצאה אחרונה: ${lastColor}`;
  }

  document.getElementById('red-count').textContent = String(spinnerCounts.red);
  document.getElementById('blue-count').textContent = String(spinnerCounts.blue);
  document.getElementById('green-count').textContent = String(spinnerCounts.green);
}

document.getElementById('spin-once').addEventListener('click', () => spin(1));
document.getElementById('spin-fifteen').addEventListener('click', () => spin(15));
document.getElementById('spin-reset').addEventListener('click', () => {
  spinnerCounts.red = 0;
  spinnerCounts.blue = 0;
  spinnerCounts.green = 0;
  spinnerLast.textContent = 'תוצאה אחרונה: עדיין לא בוצע סיבוב';
  spin(0);
});

const questions = [
  {
    q: 'מה ההסתברות לקבל עץ בהטלת מטבע הוגן?',
    answers: ['1/2', '1/6', '1/3'],
    correct: 0
  },
  {
    q: 'מה הסיכוי לקבל מספר זוגי בקובייה?',
    answers: ['1/2', '1/3', '1/6'],
    correct: 0
  },
  {
    q: 'איזה אירוע הוא בלתי אפשרי בקובייה רגילה?',
    answers: ['לקבל 7', 'לקבל 2', 'לקבל מספר קטן מ־6'],
    correct: 0
  },
  {
    q: 'אם בגלגל אדום=50%, מה הכי סביר שיצא?',
    answers: ['אדום', 'כחול', 'ירוק'],
    correct: 0
  }
];

let streak = 0;
let currentQuestion = 0;
const questionText = document.getElementById('question-text');
const answersWrap = document.getElementById('answers');
const feedback = document.getElementById('quiz-feedback');
const streakValue = document.getElementById('streak-value');

function nextQuestion() {
  const item = questions[currentQuestion % questions.length];
  questionText.textContent = item.q;
  answersWrap.innerHTML = '';

  item.answers.forEach((label, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-ghost answer-btn';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (index === item.correct) {
        streak += 1;
        feedback.textContent = 'נכון מאוד';
      } else {
        streak = 0;
        feedback.textContent = 'כמעט. נסו שוב בשאלה הבאה';
      }

      if (streak === 3) {
        feedback.textContent = 'פתחתם תג הישג: אלופי הסתברות';
      }

      streakValue.textContent = String(streak);
      currentQuestion += 1;
      setTimeout(nextQuestion, 500);
    });
    answersWrap.appendChild(btn);
  });
}

renderDice();
updateCoinView();
spin(0);
nextQuestion();
runProbabilityCalc();

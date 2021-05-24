// variables
let currentQuestionIndex = 0;
let time = questions.length * 10;
let timerId;
let questionsEl = document.getElementById("questions");
let timerEl = document.getElementById("time");
let choicesEl = document.getElementById("choices");
let submitBtn = document.getElementById("submit");
let startBtn = document.getElementById("start");
let initialsEl = document.getElementById("initials");
let feedbackEl = document.getElementById("feedback");
let sfxRight = new Audio("assets/sfx/right.wav");
let sfxWrong = new Audio("assets/sfx/wrong.wav");


function beginQuiz() {
  let startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");
  questionsEl.removeAttribute("class");
  timerId = setInterval(decrementTimer, 1000);
  timerEl.textContent = time;
  getNextQuestion();
}

function getNextQuestion() {
  let currentQuestion = questions[currentQuestionIndex];
  let titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;
  choicesEl.innerHTML = "";
  currentQuestion.choices.forEach(function(choice, i) {
    let choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);
    choiceNode.textContent = i + 1 + ". " + choice;
    choiceNode.onclick = choiceClickHandler;
    choicesEl.appendChild(choiceNode);
  });
}

function choiceClickHandler() {
  if (this.value !== questions[currentQuestionIndex].answer) {
    time -= 15;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    sfxWrong.play();
    feedbackEl.textContent = "Wrong!";
  } else {
    sfxRight.play();
    feedbackEl.textContent = "Correct!";
  }
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);
  currentQuestionIndex++;
  if (currentQuestionIndex === questions.length) {
    stopQuiz();
  } else {
    getNextQuestion();
  }
}

function stopQuiz() {
  clearInterval(timerId);
  let endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");
  let finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;
  questionsEl.setAttribute("class", "hide");
}

function decrementTimer() {
  time--;
  timerEl.textContent = time;
  if (time <= 0) {
    stopQuiz();
  }
}

function saveScore() {
  let initials = initialsEl.value.trim();
  if (initials !== "") {
    let highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];
    let newScore = {
      score: time,
      initials: initials
    };
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));
    window.location.href = "highscores.html";
  }
}

function keyUpHander(event) {
  if (event.key === "Enter") {
    saveScore();
  }
}

submitBtn.onclick = saveScore;
startBtn.onclick = beginQuiz;
initialsEl.onkeyup = keyUpHander;

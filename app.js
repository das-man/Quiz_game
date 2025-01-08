const main = document.querySelector("#main");
const click = document.querySelector("#click");
const questionWord = document.querySelector(".question");
const answerWord = document.querySelector(".answer");
const diffWord = document.querySelector("#difficultyProp");
const catWord = document.querySelector("#catProp");
const iWord = document.querySelector("#indexProp");
const correctAnswer = new Audio("sound/correct.mp3");
const wrongAnswer = new Audio("sound/wrong.mp3");
let questionNum = 0;
let array = [];
let score = 0;

start();

async function start() {
  array = await fetchQuestions(getValues());
  setWords();
}

// submit button do
click.addEventListener("click", (e) => {
  e.preventDefault();
  removeAnswers();
  questionNum = 0;
  score = 0;
  start();
});

// fetching questions
async function fetchQuestions({ typeValue, difficultyValue, catValue }) {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=10${typeValue}${difficultyValue}${catValue}`
  );
  const data = await res.json();
  let fetchedQuestions = data.results;

  return fetchedQuestions;
}

// set words
function setWords() {
  // show properties
  catWord.innerHTML = array[questionNum].category;
  diffWord.innerHTML = array[questionNum].difficulty;
  iWord.innerHTML = questionNum + 1 + " / 10";
  // change diffculty color
  let diff = array[questionNum].difficulty;

  if (diff === "easy") {
    diffWord.style.backgroundColor = "#EE82EE";
  } else if (diff === "medium") {
    diffWord.style.backgroundColor = "green";
  } else if (diff === "hard") {
    diffWord.style.backgroundColor = "#dc3545";
  }
  // show question
  questionWord.innerHTML = array[questionNum].question;
  // get, shuffle
  let answers = array[questionNum].incorrect_answers;
  answers.push(array[questionNum].correct_answer);
  shuffleArray(answers);
  // show answers
  answers.forEach((answer) => {
    let answerBox = document.createElement("span");
    answerBox.classList.add("answerBox");
    answerBox.innerHTML = answer;
    answerWord.appendChild(answerBox);
    main.appendChild(questionWord);
    main.appendChild(answerWord);
  });

  const answerBoxes = document.querySelectorAll(".answerBox");
  answerBoxes.forEach((answerBox) => {
    answerBox.addEventListener("click", (e) => {
      nextQuestion();
      // correct
      if (e.target.innerHTML === array[questionNum].correct_answer) {
        answerBox.classList.add("correct");
        correctAnswer.play();
        score += 10;
      } else {
        // wrong answer
        answerBox.classList.add("wrong");
        wrongAnswer.play();
        // check correct answer
        answerBoxes.forEach((answerBox) => {
          if (answerBox.innerHTML === array[questionNum].correct_answer) {
            answerBox.classList.add("correct");
          }
        });
      }
    });
  });
}

// next question
function nextQuestion() {
  if (questionNum < 9) {
    setTimeout(() => {
      questionNum++;
      removeAnswers();
      setWords();
    }, 1000);
  } else {
    setTimeout(() => {
      alert("GG! 🎉 You scored " + score + " / 100");
    }, 1000);
  }
}

// get dropdown values
function getValues() {
  let typeValue = document.querySelector("#type").value;
  let difficultyValue = document.querySelector("#difficulty").value;
  let catValue = document.querySelector("#category").value;

  return { typeValue, difficultyValue, catValue };
}

// remove ans
function removeAnswers() {
  const answers = document.querySelectorAll(".answerBox");
  answers.forEach((answer) => {
    answer.remove();
  });
}

// shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const main = document.querySelector("#main");
const click = document.querySelector("#click");
const questionWord = document.querySelector(".question");
const answerWord = document.querySelector(".answer");
const diffWord = document.querySelector("#difficultyProp");
const catWord = document.querySelector("#catProp");
const correctAnswer = new Audio("sound/correct.mp3");
const wrongAnswer = new Audio("sound/wrong.mp3");

fetchQuestions();

click.addEventListener("click", (e) => {
  e.preventDefault();
  removeAnswers();
  // get values
  let typeValue = document.querySelector("#type").value;
  switch (typeValue) {
    case "MC":
      typeValue = "&type=multiple";
      break;
    case "T/F":
      typeValue = "&type=boolean";
      break;
    default:
      typeValue = "";
      break;
  }

  let difficultyValue = document.querySelector("#difficulty").value;
  console.log(difficultyValue);
  switch (difficultyValue) {
    case "ez":
      difficultyValue = "&difficulty=easy";
      break;
    case "medium":
      difficultyValue = "&difficulty=medium";
      diffWord.style.backgroundColor = "green";
      break;
    case "hard":
      difficultyValue = "&difficulty=hard";
      diffWord.style.backgroundColor = "red";
      break;
    default:
      difficultyValue = "";
      break;
  }

  let catValue = document.querySelector("#category").value;
  switch (catValue) {
    case "9":
        categoryValue = "&category=9"; // General Knowledge
        break;
    case "10":
        categoryValue = "&category=10"; // Entertainment: Books
        break;
    case "11":
        categoryValue = "&category=11"; // Entertainment: Film
        break;
    case "12":
        categoryValue = "&category=12"; // Entertainment: Music
        break;
    case "13":
        categoryValue = "&category=13"; // Entertainment: Musicals & Theatres
        break;
    case "14":
        categoryValue = "&category=14"; // Entertainment: Television
        break;
    case "15":
        categoryValue = "&category=15"; // Entertainment: Video Games
        break;
    case "16":
        categoryValue = "&category=16"; // Entertainment: Board Games
        break;
    case "17":
        categoryValue = "&category=17"; // Science & Nature
        break;
    case "18":
        categoryValue = "&category=18"; // Science: Computers
        break;
    case "19":
        categoryValue = "&category=19"; // Science: Mathematics
        break;
    case "20":
        categoryValue = "&category=20"; // Mythology
        break;
    case "21":
        categoryValue = "&category=21"; // Sports
        break;
    case "22":
        categoryValue = "&category=22"; // Geography
        break;
    case "23":
        categoryValue = "&category=23"; // History
        break;
    case "24":
        categoryValue = "&category=24"; // Politics
        break;
    case "25":
        categoryValue = "&category=25"; // Art
        break;
    case "26":
        categoryValue = "&category=26"; // Celebrities
        break;
    case "27":
        categoryValue = "&category=27"; // Animals
        break;
    case "28":
        categoryValue = "&category=28"; // Vehicles
        break;
    case "29":
        categoryValue = "&category=29"; // Entertainment: Comics
        break;
    case "30":
        categoryValue = "&category=30"; // Science: Gadgets
        break;
    case "31":
        categoryValue = "&category=31"; // Entertainment: Japanese Anime & Manga
        break;
    case "32":
        categoryValue = "&category=32"; // Entertainment: Cartoon & Animations
        break;
    default:
        categoryValue = "";
}

  fetchQuestions(typeValue, difficultyValue, categoryValue).catch(() => {
    alert("please wait for a moment and try again");
  });
});

async function fetchQuestions(typeValue = "", difficultyValue = "", categoryValue = "") {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=1${typeValue}${difficultyValue}${categoryValue}`
  );
  const data = await res.json();
  let fetchedQuestions = data.results[0];

  // change diffculty color
  if (fetchedQuestions.difficulty === "easy") {
    diffWord.style.backgroundColor = "#ffc107";
  } else if (fetchedQuestions.difficulty === "medium") {
    diffWord.style.backgroundColor = "green";
  } else if (fetchedQuestions.difficulty === "hard") {
    diffWord.style.backgroundColor = "#dc3545";
  }

  // show properties
  diffWord.innerHTML = fetchedQuestions.difficulty;
  catWord.innerHTML = fetchedQuestions.category;

  // show question
  questionWord.innerHTML = fetchedQuestions.question;

  // loop through answers
  let answers = fetchedQuestions.incorrect_answers;
  answers.push(fetchedQuestions.correct_answer);

  shuffleArray(answers);

  answers.forEach((answer) => {
    let answerBox = document.createElement("span");
    answerBox.classList.add("answerBox");
    answerBox.innerHTML = answer;
    answerWord.appendChild(answerBox);
    main.appendChild(questionWord);
    main.appendChild(answerWord);

    answerBox.addEventListener("click", () => {
      if (answerBox.innerHTML === fetchedQuestions.correct_answer) {
        answerBox.classList.add("correct");
        correctAnswer.play();
        // delay
        setTimeout(() => {
          removeAnswers();
          fetchQuestions(typeValue, difficultyValue);
        }, 1000);
      } else {
        answerBox.classList.add("wrong");
        wrongAnswer.play();
      }
    });
  });
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

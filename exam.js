// Question Class
class Question {
    constructor(title, image, answers, correctAnswer) {
        this.title = title;
        this.image = image;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
    }

    shuffleAnswers() {
        for (let i = this.answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.answers[i], this.answers[j]] = [this.answers[j], this.answers[i]];
        }
    }
}

// Exam Class
class Exam {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.studentName = "";
        this.timeLeft = 60;
        this.timer = null;
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    checkAnswer(selectedAnswer) {
        const currentQuestion = this.getCurrentQuestion();
        return selectedAnswer === currentQuestion.correctAnswer;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerUI();
            
            if (this.timeLeft <= 0) {
                this.endExam();
            }
        }, 1000);
    }

    updateTimerUI() {
        const timerBar = document.getElementById('timer-bar');
        const timerText = document.getElementById('timer-text');
        
        const percentage = (this.timeLeft / 60) * 100;
        timerBar.style.width = `${percentage}%`;
        timerText.textContent = this.timeLeft;
    }

    endExam() {
        clearInterval(this.timer);
        const percentage = (this.score / this.questions.length) * 100;
        
        document.getElementById('exam-page').classList.remove('active');
        document.getElementById('result-page').classList.add('active');
        
        document.getElementById('percentage').textContent = `${Math.round(percentage)}%`;
        document.getElementById('score-text').textContent = 
            `You have ${this.score} out of ${this.questions.length} correct answers`;
        document.getElementById('student-name-display').textContent = 
            `Student: ${this.studentName}`;
    }
}

// Questions Data
const questionsData = [
    new Question(
        "Do you know the breed?",
        "/Images/img1.jpg",
        ["Siberian Husky", "Bulldog", "Saint Bernard"],
        "Siberian Husky"
    ),
    new Question(
        "Which bird is this?",
        "/Images/img2.jpg",
        ["Eagle", "Hawk", "Falcon"],
        "Eagle"
    ),
    new Question(
        "Identify this car brand",
        "/Images/img3.jpg",
        ["BMW", "Mercedes", "Audi"],
        "BMW"
    ),
    new Question(
        "What flower is this?",
        "/Images/img4.jpg",
        ["Rose", "Tulip", "Lily"],
        "Rose"
    ),
    new Question(
        "Name this programming language logo",
        "/Images/img5.jpg",
        ["Python", "Java", "JavaScript"],
        "Python"
    ),
    new Question(
        "Which famous landmark is this?",
        "/Images/img6.jpg",
        ["Eiffel Tower", "Big Ben", "Taj Mahal"],
        "Eiffel Tower"
    ),
    new Question(
        "Identify this musical instrument",
        "/Images/img7.jpg",
        ["Piano", "Guitar", "Violin"],
        "Piano"
    ),
    new Question(
        "What sport is this?",
        "/Images/img8.jpg",
        ["Football", "Basketball", "Tennis"],
        "Basketball"
    ),
    new Question(
        "Name this planet",
        "/Images/img9.jpg",
        ["Mars", "Jupiter", "Saturn"],
        "Saturn"
    ),
    new Question(
        "Which animal is this?",
        "/Images/img10.jpg",
        ["Lion", "Tiger", "Leopard"],
        "Lion"
    )
];


let exam;

document.addEventListener('DOMContentLoaded', () => {
    initializeExam();
    setupEventListeners();
});

function initializeExam() {
    const questionsCopy = questionsData.map(q => 
        new Question(q.title, q.image, [...q.answers], q.correctAnswer)
    );
    exam = new Exam(questionsCopy);
}

function setupEventListeners() {
    const startBtn = document.getElementById('start-btn');
    
    Swal.fire({
        title: 'Enter your name',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: 'Submit',
        allowOutsideClick: false,
        preConfirm: (name) => {
            if (!name) {
                Swal.showValidationMessage('Please enter your name');
            }
            return name;
        }
    }).then((result) => {
        if (result.value) {
            exam.studentName = result.value;
            startBtn.disabled = false;
        }
    });

    startBtn.addEventListener('click', startExam);
    document.getElementById('next-btn').addEventListener('click', showNextQuestion);
}

function startExam() {
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('exam-page').classList.add('active');
    
    exam.shuffleQuestions();
    showQuestion();
    exam.startTimer();
}

function showQuestion() {
    const question = exam.getCurrentQuestion();
    question.shuffleAnswers();
    
    document.getElementById('question-title').textContent = question.title;
    document.getElementById('question-image').src = question.image;
    
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    question.answers.forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = answer;
        answerDiv.addEventListener('click', () => selectAnswer(answerDiv, answer));
        answersContainer.appendChild(answerDiv);
    });
    
    document.getElementById('next-btn').disabled = true;
}

function selectAnswer(answerDiv, selectedAnswer) {
    document.querySelectorAll('.answer-option').forEach(div => {
        div.classList.remove('selected');
    });
    
    answerDiv.classList.add('selected');
    document.getElementById('next-btn').disabled = false;
    
    if (exam.checkAnswer(selectedAnswer)) {
        exam.score++;
    }
}

function showNextQuestion() {
    exam.currentQuestionIndex++;
    
    if (exam.currentQuestionIndex >= exam.questions.length) {
        exam.endExam();
    } else {
        showQuestion();
    }
}
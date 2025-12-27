const LOAD_DURATION = 2050;
const WIN_DURATION = 2600;
const LOSS_DURATION = 1600;

const typeSound = new Audio('../sound/type.mp3');
typeSound.loop = true;
typeSound.volume = 0.6;

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;
  
  typeSound.play().then(() => {
    typeSound.pause();
    typeSound.currentTime = 0;
  }).catch(() => {});
  
  audioUnlocked = true;
  console.log('✅ Audio unlocked!');
}

document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('keydown', unlockAudio, { once: true });

function playTypeSound() {
  if (!audioUnlocked) unlockAudio();
  typeSound.currentTime = 0;
  typeSound.play().then(() => {
    console.log('✅ ⌨️ Type sound playing');
  }).catch(err => console.log('Type sound error:', err));
}

function stopTypeSound() {
  typeSound.pause();
  typeSound.currentTime = 0;
  console.log('⏸️ Type sound stopped');
}

const LEVEL = 3;
const THEORY_TEXT = "Giai đoạn 1965 – 1973, miền Bắc thực hiện hai nhiệm vụ: chống chiến tranh phá hoại và chi viện tiền tuyến. Ta bắn rơi 3.243 máy bay (1965 – 1968) và đánh bại cuộc tập kích B-52 bằng thắng lợi “Điện Biên Phủ trên không” (1972), buộc Mỹ ký Hiệp định Pa-ri (1973). Với vai trò hậu phương lớn, miền Bắc đã chi viện hơn 30 vạn quân cùng khối lượng khổng lồ vũ khí, vật chất cho miền Nam qua đường bộ và đường biển.";

const QUESTIONS = [
  {
    question: "Đâu không phải là nguyên nhân khiến Mĩ tiến hành cuộc chiến tranh phá hoại miền Bắc lần thứ nhất (1965-1968)?",
    answers: [
      "Để phá tiềm lực kinh tế, quốc phòng và công cuộc xây dựng CNXH ở miền Bắc",
      "Ngăn chặn nguồn chi viện từ bên ngoài vào miền Bắc và từ miền Bắc cho miền Nam",
      "Uy hiếp tinh thần, làm lung lay ý chí chống Mĩ của nhân dân ở hai miền đất nước",
      "Tạo ưu thế cho cuộc đàm phán ngoại giao giữa Mĩ và Việt Nam tại Pa-ri"
    ],
    correct: 3
  },
  {
    question: "Quân dân miền Bắc đánh bại chiến tranh phá hoại lần thứ nhất của Mĩ mang ý nghĩa gì quan trọng nhất?",
    answers: [
      "Thể hiện quyết tâm đánh thắng giặc Mĩ của quân dân ta.",
      "Làm lung lay ý chí xâm lược của đế quốc Mĩ.",
      "Bảo vệ thành quả chủ nghĩa xã hội ở miền Bắc",
      "Đánh bại âm mưu phá hoại miền Bắc của đế quốc Mĩ, đảm bảo sự chi viện cho miền Nam"
    ],
    correct: 3
  },
  {
    question: "Ý nghĩa lớn nhất của chiến thắng “Điện Biên Phủ trên không” năm 1972 là gì?",
    answers: [
      "Đập an âm mưu xâm lược của đế quốc Mĩ",
      "Khẳng định ý chí quyết chiến, quyết thắng của quân dân ta",
      "Buộc Mĩ phải kí hiệp định Pa – ri chấm dứt chiến tranh xâm lược Việt Nam.",
      "Đập an âm mưu xâm lược của thực dân Pháp"
    ],
    correct: 2
  }
];


let currentQuestionIndex = 0;
let timerInterval;

const theoryBtn = document.getElementById('theoryBtn');
const theoryPopup = document.getElementById('theoryPopup');

if (theoryBtn) {
  theoryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    theoryPopup.classList.add('active');
    console.log('📖 Theory popup opened');
  });
}

if (theoryPopup) {
  theoryPopup.addEventListener('click', (e) => {
    if (e.target === theoryPopup) {
      theoryPopup.classList.remove('active');
      console.log('📖 Theory popup closed');
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && theoryPopup.classList.contains('active')) {
    theoryPopup.classList.remove('active');
  }
});

function showPhase(phase) {
  console.log('🎬 Showing phase:', phase);
  
  stopTypeSound();
  
  document.getElementById('theoryPhase').style.display = 'none';
  document.getElementById('loadPhase').style.display = 'none';
  document.getElementById('questionPhase').style.display = 'none';
  document.getElementById('winPhase').style.display = 'none';
  document.getElementById('lossPhase').style.display = 'none';
  
  if (phase === 'theory') {
    document.getElementById('theoryPhase').style.display = 'flex';
    createStars();
    startTheoryTypewriter();
    
  } else if (phase === 'load') {
    document.getElementById('loadPhase').style.display = 'block';
    const iframe = document.getElementById('loadIframe');
    iframe.src = '../video/load.html';
    console.log('✅ Load iframe src:', iframe.src);
    
    setTimeout(() => {
      showPhase('question');
    }, LOAD_DURATION);
    
  } else if (phase === 'question') {
    document.getElementById('questionPhase').style.display = 'flex';
    loadQuestion();
    
  } else if (phase === 'win') {
    document.getElementById('winPhase').style.display = 'block';
    const iframe = document.getElementById('winIframe');
    iframe.src = '../video/win.html';
    console.log('✅ Win iframe src:', iframe.src);
    
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < QUESTIONS.length) {
        showPhase('load');
      } else {
        completeLevelAndUnlockNext();
      }
    }, WIN_DURATION);
    
  } else if (phase === 'loss') {
    console.log('💥 LOSS PHASE TRIGGERED!');
    document.getElementById('lossPhase').style.display = 'block';
    const iframe = document.getElementById('lossIframe');
    iframe.src = '../video/loss.html';
    console.log('✅ Loss iframe src:', iframe.src);
    
    iframe.onload = () => {
      console.log('✅ Loss iframe loaded successfully!');
    };
    iframe.onerror = () => {
      console.error('❌ Loss iframe failed to load!');
    };
    
    setTimeout(() => {
      console.log('⏰ Loss timeout finished, redirecting to menu');
      window.location.href = 'menu.html';
    }, LOSS_DURATION);
  }
}

function createStars() {
  const starsContainer = document.getElementById('stars');
  starsContainer.innerHTML = '';
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
  }
}

function startTheoryTypewriter() {
  let index = 0;
  const element = document.getElementById('theoryText');
  element.textContent = '';
  
  function type() {
    if (index < THEORY_TEXT.length) {
      if (index === 0) {
        playTypeSound();
      }
      
      element.textContent += THEORY_TEXT.charAt(index);
      index++;
      setTimeout(type, 30);
    } else {
      stopTypeSound();
      
      setTimeout(() => {
        showPhase('load');
      }, 2000);
    }
  }
  
  setTimeout(type, 500);
}

function loadQuestion() {
  if (currentQuestionIndex >= QUESTIONS.length) {
    completeLevelAndUnlockNext();
    return;
  }
  
  const q = QUESTIONS[currentQuestionIndex];
  document.getElementById('questionNumber').textContent = `Màn ${LEVEL} - Câu ${currentQuestionIndex + 1}/${QUESTIONS.length}`;
  document.getElementById('questionText').textContent = q.question;
  
  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  
  const letters = ['A', 'B', 'C', 'D'];
  q.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = `
      <span class="answer-letter">${letters[index]}</span>
      <span class="answer-text">${answer}</span>
    `;
    btn.onclick = () => checkAnswer(index);
    answersDiv.appendChild(btn);
  });
  
  startTimer();
}

function startTimer() {
  let timeLeft = 90;
  document.getElementById('timer').textContent = timeLeft;
  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      checkAnswer(-1);
    }
  }, 1000);
}

function checkAnswer(selectedIndex) {
  clearInterval(timerInterval);
  
  const q = QUESTIONS[currentQuestionIndex];
  const timeLeft = parseInt(document.getElementById('timer').textContent);
  
  console.log('Selected:', selectedIndex, 'Correct:', q.correct);
  
  if (selectedIndex === q.correct) {
    const earnedScore = Math.max(0, timeLeft);
    
    console.log(`✅ CORRECT! Time left: ${timeLeft}s, Earned: ${earnedScore} points`);
    
    saveScore(LEVEL, currentQuestionIndex + 1, earnedScore);
    
    showPhase('win');
  } else {
    console.log('❌ WRONG! No points earned');
    showPhase('loss');
  }
}

function saveScore(level, questionNumber, score) {
  let totalScore = parseInt(localStorage.getItem('totalScore') || '0');
  let levelScores = JSON.parse(localStorage.getItem('levelScores') || '{}');
  
  if (!levelScores[level]) {
    levelScores[level] = {};
  }
  
  const key = `q${questionNumber}`;
  if (!levelScores[level][key] || score > levelScores[level][key]) {
    const oldScore = levelScores[level][key] || 0;
    totalScore = totalScore - oldScore + score;
    
    levelScores[level][key] = score;
    
    console.log(`💾 Saved: Level ${level}, Question ${questionNumber}, Score: ${score}`);
  }
  
  localStorage.setItem('totalScore', totalScore.toString());
  localStorage.setItem('levelScores', JSON.stringify(levelScores));
  
  console.log(`📊 Total Score: ${totalScore}`);
}

function completeLevelAndUnlockNext() {
  let completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
  if (!completedLevels.includes(LEVEL)) {
    completedLevels.push(LEVEL);
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
  }
  
  let currentUnlockedLevel = parseInt(localStorage.getItem('currentUnlockedLevel') || '1');
  if (LEVEL >= currentUnlockedLevel && LEVEL < 5) {
    localStorage.setItem('currentUnlockedLevel', (LEVEL + 1).toString());
  }
  
  setTimeout(() => {
    window.location.href = 'menu.html';
  }, 2000);
}

window.addEventListener('beforeunload', () => {
  stopTypeSound();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (typeSound) typeSound.pause();
  }
});

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
}

window.addEventListener('scroll', () => {
  window.scrollTo(0, 0);
});

showPhase('theory');

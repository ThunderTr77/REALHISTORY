// ==================== TIMING CONFIG ====================
const LOAD_DURATION = 8500;
const WIN_DURATION = 10000;
const LOSS_DURATION = 6000;


// ==================== AUDIO SETUP ====================
const typeSound = new Audio('../sound/type.mp3');
typeSound.loop = true;
typeSound.volume = 0.6;

function playTypeSound() {
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

// ==================== DATA ====================
const LEVEL = 5;

const THEORY_TEXT = "Hồi 10h45 ngày 30/4/1975, xe tăng 390 húc đổ cổng phụ Dinh Độc Lập. Lúc 11h30, lá cờ Giải phóng tung bay trên nóc dinh – Chiến tranh kết thúc.";

const QUESTIONS = [
  {
    question: "Chiếc xe tăng nào húc đổ cổng Dinh Độc Lập?",
    answers: ["Tăng 843", "Tăng 707", "Tăng 390", "Tăng 101"],
    correct: 2
  },
  {
    question: "Sự kiện 30/4/1975 còn được gọi là tên gì?",
    answers: ["Đại thắng Xuân Mậu Thân", "Chiến dịch Tây Nguyên", "Đại thắng Mùa Xuân 1975", "Toàn thắng Miền Nam"],
    correct: 2
  }
];

// ==================== GAME STATE ====================
let currentQuestionIndex = 0;
let timerInterval;

// ==================== PHASE CONTROL ====================
function showPhase(phase) {
  console.log('🎬 Showing phase:', phase);
  
  stopTypeSound();
  
  // ✅ FIX: Dừng hết âm thanh trong iframe trước khi chuyển phase
  const loadIframe = document.getElementById('loadIframe');
  const winIframe = document.getElementById('winIframe');
  const lossIframe = document.getElementById('lossIframe');
  const endingIframe = document.getElementById('endingIframe');
  
  // Clear src để browser unload iframe và dừng âm thanh
  if (loadIframe && phase !== 'load') loadIframe.src = '';
  if (winIframe && phase !== 'win') winIframe.src = '';
  if (lossIframe && phase !== 'loss') lossIframe.src = '';
  if (endingIframe && phase !== 'ending') endingIframe.src = '';
  // -------------------------
  
  document.getElementById('theoryPhase').style.display = 'none';
  document.getElementById('loadPhase').style.display = 'none';
  document.getElementById('questionPhase').style.display = 'none';
  document.getElementById('winPhase').style.display = 'none';
  document.getElementById('lossPhase').style.display = 'none';
  document.getElementById('endingPhase').style.display = 'none';
  
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
        showPhase('ending');
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
    
  } else if (phase === 'ending') {
 
    console.log('🎉 ENDING PHASE - GAME COMPLETED!');
    
    
    completeLevelAndUnlockNext();
    
   
    console.log('🎬 Redirecting to ending.html...');
    window.location.href = '../video/ending.html';
  }
}

// ==================== CREATE STARS ====================
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

// ==================== THEORY TYPEWRITER ====================
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
      setTimeout(type, 50);
    } else {
      stopTypeSound();
      
      setTimeout(() => {
        showPhase('load');
      }, 2000);
    }
  }
  
  setTimeout(type, 500);
}

// ==================== QUESTION PHASE ====================
function loadQuestion() {
  if (currentQuestionIndex >= QUESTIONS.length) {
    showPhase('ending');
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
  let timeLeft = 30;
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
  
  console.log('Selected:', selectedIndex, 'Correct:', q.correct);
  
  if (selectedIndex === q.correct) {
    console.log('✅ CORRECT! Showing win');
    showPhase('win');
  } else {
    console.log('❌ WRONG! Showing loss');
    showPhase('loss');
  }
}

// ==================== COMPLETE LEVEL ====================
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
  

  if (LEVEL === 5) {
    localStorage.setItem('gameCompleted', 'true');
    console.log('🎊 GAME COMPLETED! All levels finished!');
  }
}

// ==================== CLEANUP ====================
window.addEventListener('beforeunload', () => {
  stopTypeSound();
});

// ==================== START ====================
showPhase('theory');
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

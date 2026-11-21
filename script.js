/* =========================================================
   1. NAVIGASI HALAMAN (SPA ROUTING)
   ========================================================= */
function navigateTo(pageId) {
  if (pageId !== 'ruang-tenang' && breathState.isRunning) {
    stopBreathingSession();
  }

  document.querySelectorAll('.page-section').forEach((sec) => {
    sec.classList.remove('active');
  });

  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
  }

  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  const topBarText = document.getElementById('topBarText');
  if (pageId === 'ruang-tenang') {
    topBarText.textContent = 'Tidak apa-apa untuk mengambil jeda.';
  } else {
    topBarText.textContent = 'Kamu tidak harus menghadapi semuanya sendirian.';
  }

  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToSection(elementId) {
  navigateTo('beranda');
  setTimeout(() => {
    const el = document.getElementById(elementId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

/* =========================================================
   2. KENALI DIRI — KUIS REFLEKSI 3 MODUL & UNDUH PDF
   ========================================================= */
const REFLECTION_QUESTIONS = [
  {
    module: 'MODULE 01 • REAKSI KOGNITIF',
    category: 'kognitif',
    question: 'Seberapa sering kamu merasa sulit berkonsentrasi saat melakukan aktivitas?'
  },
  {
    module: 'MODULE 01 • REAKSI KOGNITIF',
    category: 'kognitif',
    question: 'Seberapa sering pikiranmu terasa penuh atau berputar pada hal yang sama?'
  },
  {
    module: 'MODULE 01 • REAKSI KOGNITIF',
    category: 'kognitif',
    question: 'Seberapa sering kamu merasa ragu atau lelah saat harus mengambil keputusan sederhana?'
  },
  {
    module: 'MODULE 02 • SKALA EMOSI',
    category: 'emosi',
    question: 'Seberapa sering kamu merasa gelisah, tegang, atau sulit merasa tenang?'
  },
  {
    module: 'MODULE 02 • SKALA EMOSI',
    category: 'emosi',
    question: 'Seberapa sering suasana hatimu terasa turun atau kehilangan semangat menjalani hari?'
  },
  {
    module: 'MODULE 02 • SKALA EMOSI',
    category: 'emosi',
    question: 'Seberapa sering energimu terasa cepat habis meski aktivitas tidak terlalu berat?'
  },
  {
    module: 'MODULE 03 • GAYA COPING',
    category: 'coping',
    question: 'Saat menghadapi tekanan, seberapa sering kamu berusaha mencari jeda atau menenangkan diri terlebih dahulu?'
  },
  {
    module: 'MODULE 03 • GAYA COPING',
    category: 'coping',
    question: 'Seberapa sering kamu mencoba menguraikan masalah menjadi langkah-langkah kecil yang bisa dilakukan?'
  },
  {
    module: 'MODULE 03 • GAYA COPING',
    category: 'coping',
    question: 'Seberapa sering kamu merasa terbuka untuk berbagi cerita atau meminta dukungan saat keadaan terasa berat?'
  }
];

const ANSWER_CHOICES = [
  { label: 'Tidak pernah', value: 0 },
  { label: 'Jarang', value: 1 },
  { label: 'Sering', value: 2 },
  { label: 'Hampir selalu', value: 3 }
];

let reflectState = {
  currentIndex: 0,
  answers: new Array(REFLECTION_QUESTIONS.length).fill(null)
};

function startReflectionQuiz() {
  reflectState.currentIndex = 0;
  reflectState.answers = new Array(REFLECTION_QUESTIONS.length).fill(null);

  document.getElementById('reflectIntroView').classList.add('hidden');
  document.getElementById('reflectResultView').classList.add('hidden');
  document.getElementById('reflectQuizView').classList.remove('hidden');

  renderQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exitReflectionQuiz() {
  document.getElementById('reflectQuizView').classList.add('hidden');
  document.getElementById('reflectResultView').classList.add('hidden');
  document.getElementById('reflectIntroView').classList.remove('hidden');
}

function renderQuestion() {
  const idx = reflectState.currentIndex;
  const total = REFLECTION_QUESTIONS.length;
  const item = REFLECTION_QUESTIONS[idx];

  const stepStr = String(idx + 1).padStart(2, '0');
  const totalStr = String(total).padStart(2, '0');

  document.getElementById('quizStepCounter').textContent = `${stepStr}/${totalStr}`;
  document.getElementById('quizProgressBar').style.width = `${((idx + 1) / total) * 100}%`;
  document.getElementById('quizModuleBadge').textContent = item.module;
  document.getElementById('quizQuestionLabel').textContent = `PERTANYAAN ${stepStr}`;
  document.getElementById('quizQuestionText').textContent = item.question;

  const optionsContainer = document.getElementById('quizOptionsList');
  optionsContainer.innerHTML = '';

  ANSWER_CHOICES.forEach((choice) => {
    const isSelected = reflectState.answers[idx] === choice.value;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `quiz-option-btn ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span class="option-check">${isSelected ? '&#10003;' : ''}</span>
      <span>${choice.label}</span>
    `;
    btn.addEventListener('click', () => selectAnswer(choice.value));
    optionsContainer.appendChild(btn);
  });

  document.getElementById('quizPrevBtn').disabled = idx === 0;
  const nextBtn = document.getElementById('quizNextBtn');
  nextBtn.disabled = reflectState.answers[idx] === null;
  nextBtn.innerHTML = idx === total - 1 ? 'Lihat ringkasan &rarr;' : 'Selanjutnya &rarr;';
}

function selectAnswer(val) {
  reflectState.answers[reflectState.currentIndex] = val;
  renderQuestion();
}

function prevQuestion() {
  if (reflectState.currentIndex > 0) {
    reflectState.currentIndex -= 1;
    renderQuestion();
  }
}

function nextQuestion() {
  if (reflectState.answers[reflectState.currentIndex] === null) return;

  if (reflectState.currentIndex < REFLECTION_QUESTIONS.length - 1) {
    reflectState.currentIndex += 1;
    renderQuestion();
  } else {
    showReflectionResult();
  }
}

function showReflectionResult() {
  const sumRange = (start, end) =>
    reflectState.answers.slice(start, end).reduce((acc, v) => acc + (v || 0), 0);

  const kognitif = sumRange(0, 3);
  const emosi = sumRange(3, 6);
  const coping = sumRange(6, 9);

  document.getElementById('scoreKognitif').textContent = `${kognitif}/9 poin refleksi`;
  document.getElementById('scoreEmosi').textContent = `${emosi}/9 poin refleksi`;
  document.getElementById('scoreCoping').textContent = `${coping}/9 poin refleksi`;

  document.getElementById('noteKognitif').textContent =
    kognitif >= 6
      ? 'Beban pikiran terasa cukup padat akhir-akhir ini. Coba beri jeda sejenak.'
      : 'Fokus dan kejernihan pikiranmu terlihat cukup terjaga.';

  document.getElementById('noteEmosi').textContent =
    emosi >= 6
      ? 'Suasana hati dan energimu sedang butuh perhatian lebih lembut.'
      : 'Ritme emosi dan energimu berada pada kondisi yang cukup stabil.';

  document.getElementById('noteCoping').textContent =
    coping >= 5
      ? 'Kamu sudah memiliki langkah adaptif yang baik saat menghadapi tekanan.'
      : 'Kamu bisa mencoba langkah kecil untuk memberi ruang istirahat saat tertekan.';

  const now = new Date();
  document.getElementById('resultDateLabel').textContent = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  document.getElementById('reflectQuizView').classList.add('hidden');
  document.getElementById('reflectResultView').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadReflectionPDF() {
  const dateText = document.getElementById('resultDateLabel').textContent;
  const kogScore = document.getElementById('scoreKognitif').textContent;
  const kogNote = document.getElementById('noteKognitif').textContent;
  const emoScore = document.getElementById('scoreEmosi').textContent;
  const emoNote = document.getElementById('noteEmosi').textContent;
  const copScore = document.getElementById('scoreCoping').textContent;
  const copNote = document.getElementById('noteCoping').textContent;

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('Pustaka PDF sedang dimuat. Pastikan koneksi internet aktif saat pertama membuka halaman, lalu coba klik kembali.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Latar belakang header lembut
  doc.setFillColor(20, 29, 40);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(250, 247, 238);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ruangdengar.', 20, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(196, 209, 223);
  doc.text('Ringkasan Refleksi Mandiri  |  ' + dateText, 20, 27);

  // Judul dokumen
  doc.setTextColor(24, 34, 48);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('Hasil Refleksi Diri', 20, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 101, 117);
  doc.text('Terima kasih sudah meluangkan waktu untuk mendengarkan dirimu hari ini.', 20, 59);

  // Helper menggambar kartu modul
  const drawModuleCard = (yPos, fillRGB, title, score, desc, note) => {
    doc.setFillColor(...fillRGB);
    doc.roundedRect(20, yPos, 170, 38, 4, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 29, 40);
    doc.text(title, 26, yPos + 10);

    doc.setFontSize(10);
    doc.text(score, 184, yPos + 10, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(70, 80, 95);
    doc.text(desc, 26, yPos + 18);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(20, 29, 40);
    const wrappedNote = doc.splitTextToSize(note, 158);
    doc.text(wrappedNote, 26, yPos + 26);
  };

  drawModuleCard(
    68,
    [216, 230, 243],
    '01. Reaksi Kognitif',
    kogScore,
    'Berkaitan dengan fokus, konsentrasi, dan beban pikiran.',
    kogNote
  );

  drawModuleCard(
    112,
    [244, 239, 225],
    '02. Skala Emosi',
    emoScore,
    'Berkaitan dengan suasana hati, kegelisahan, dan energi.',
    emoNote
  );

  drawModuleCard(
    156,
    [246, 230, 223],
    '03. Gaya Coping',
    copScore,
    'Berkaitan dengan cara menghadapi masalah dan mengelola tekanan.',
    copNote
  );

  // Kotak Disclaimer Non-Diagnosis
  doc.setFillColor(250, 247, 238);
  doc.setDrawColor(210, 205, 190);
  doc.roundedRect(20, 206, 170, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(20, 29, 40);
  doc.text('Catatan Penting (Non-Diagnosis)', 26, 214);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(90, 101, 117);
  const disclaimerLines = doc.splitTextToSize(
    'Angka yang ditampilkan merupakan ringkasan pilihan jawaban refleksi mandiri, bukan skor klinis kesehatan mental, tingkat keparahan, atau diagnosis medis. Pelan-pelan saja. Kamu tetap berarti.',
    158
  );
  doc.text(disclaimerLines, 26, 221);

  // Footer PDF
  doc.setFontSize(8.5);
  doc.setTextColor(130, 140, 150);
  doc.text('© 2026 Ruang Dengar — Ruang aman untuk mengenali diri, menemukan jeda, dan didengarkan.', 20, 280);

  doc.save('hasil-refleksi-ruang-dengar.pdf');
}

/* =========================================================
   3. RUANG TENANG — LATIHAN PERNAPASAN & AUDIO AMBIENT
   ========================================================= */
const BREATH_METHODS = {
  box: {
    label: 'BOX BREATHING',
    phases: [
      { name: 'Tarik napas', duration: 4, type: 'inhale', title: 'Tarik napas perlahan.', sub: 'Biarkan udara masuk dengan lembut.' },
      { name: 'Tahan', duration: 4, type: 'hold', title: 'Tahan sejenak.', sub: 'Rasakan ketenangan di dadamu.' },
      { name: 'Hembuskan', duration: 4, type: 'exhale', title: 'Hembuskan perlahan.', sub: 'Lepaskan ketegangan bersama napasmu.' },
      { name: 'Jeda', duration: 4, type: 'exhale', title: 'Istirahat sejenak.', sub: 'Tidak perlu terburu-buru.' }
    ]
  },
  '478': {
    label: 'RELAKSASI 4-7-8',
    phases: [
      { name: 'Tarik napas', duration: 4, type: 'inhale', title: 'Tarik napas lewat hidung.', sub: 'Isi paru-parumu dengan tenang.' },
      { name: 'Tahan', duration: 7, type: 'hold', title: 'Tahan napas dengan lembut.', sub: 'Tetap rilekskan bahumu.' },
      { name: 'Hembuskan', duration: 8, type: 'exhale', title: 'Hembuskan panjang dan perlahan.', sub: 'Biarkan tubuhmu terasa lebih ringan.' }
    ]
  },
  calm: {
    label: 'NAPAS DALAM 4-2-6',
    phases: [
      { name: 'Tarik napas', duration: 4, type: 'inhale', title: 'Tarik napas dalam.', sub: 'Fokus pada aliran udara yang masuk.' },
      { name: 'Tahan', duration: 2, type: 'hold', title: 'Jeda singkat.', sub: 'Tetap nyaman.' },
      { name: 'Hembuskan', duration: 6, type: 'exhale', title: 'Hembuskan lembut.', sub: 'Ulangi dengan ritme yang alami.' }
    ]
  }
};

let breathState = {
  selectedMethod: 'box',
  selectedMinutes: 3,
  isRunning: false,
  isPaused: false,
  totalSeconds: 180,
  remainingSeconds: 180,
  phaseIndex: 0,
  phaseTimeLeft: 4,
  intervalId: null
};

document.querySelectorAll('#breathMethodOptions .pill-choice').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#breathMethodOptions .pill-choice').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    breathState.selectedMethod = btn.dataset.method;
  });
});

document.querySelectorAll('#breathDurationOptions .dur-choice').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#breathDurationOptions .dur-choice').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    breathState.selectedMinutes = parseInt(btn.dataset.minutes, 10);
  });
});

function startBreathingSession() {
  const methodObj = BREATH_METHODS[breathState.selectedMethod];
  breathState.totalSeconds = breathState.selectedMinutes * 60;
  breathState.remainingSeconds = breathState.totalSeconds;
  breathState.phaseIndex = 0;
  breathState.phaseTimeLeft = methodObj.phases[0].duration;
  breathState.isRunning = true;
  breathState.isPaused = false;

  document.getElementById('activeMethodLabel').textContent = methodObj.label;
  document.getElementById('pauseBreathBtn').textContent = 'Jeda';
  document.getElementById('breathSetupView').classList.add('hidden');
  document.getElementById('breathActiveView').classList.remove('hidden');

  updateBreathingUI();
  clearInterval(breathState.intervalId);
  breathState.intervalId = setInterval(tickBreathing, 1000);
}

function tickBreathing() {
  if (breathState.isPaused) return;

  breathState.remainingSeconds -= 1;
  breathState.phaseTimeLeft -= 1;

  if (breathState.remainingSeconds <= 0) {
    stopBreathingSession(true);
    return;
  }

  const methodObj = BREATH_METHODS[breathState.selectedMethod];
  if (breathState.phaseTimeLeft <= 0) {
    breathState.phaseIndex = (breathState.phaseIndex + 1) % methodObj.phases.length;
    breathState.phaseTimeLeft = methodObj.phases[breathState.phaseIndex].duration;
  }

  updateBreathingUI();
}

function updateBreathingUI() {
  const methodObj = BREATH_METHODS[breathState.selectedMethod];
  const currentPhase = methodObj.phases[breathState.phaseIndex];

  const mins = String(Math.floor(breathState.remainingSeconds / 60)).padStart(2, '0');
  const secs = String(breathState.remainingSeconds % 60).padStart(2, '0');
  document.getElementById('breathTimeLeft').textContent = `${mins}:${secs}`;

  const elapsed = breathState.totalSeconds - breathState.remainingSeconds;
  const pct = (elapsed / breathState.totalSeconds) * 100;
  document.getElementById('breathProgressBar').style.width = `${pct}%`;

  const circle = document.getElementById('breathCircle');
  circle.className = `breath-circle ${currentPhase.type}`;
  document.getElementById('breathPhaseText').textContent = currentPhase.name;
  document.getElementById('breathPhaseCounter').textContent = breathState.phaseTimeLeft;
  document.getElementById('breathInstructionTitle').textContent = currentPhase.title;
  document.getElementById('breathInstructionSub').textContent = currentPhase.sub;
}

function togglePauseBreathing() {
  breathState.isPaused = !breathState.isPaused;
  document.getElementById('pauseBreathBtn').textContent = breathState.isPaused ? 'Lanjutkan' : 'Jeda';
}

function stopBreathingSession(completed = false) {
  clearInterval(breathState.intervalId);
  breathState.isRunning = false;
  breathState.isPaused = false;
  stopAmbientSound();

  document.getElementById('breathActiveView').classList.add('hidden');
  document.getElementById('breathSetupView').classList.remove('hidden');

  if (completed) {
    alert('Sesi pernapasan selesai. Terima kasih sudah meluangkan waktu untuk dirimu hari ini.');
  }
}

let audioCtx = null;
let ambientGain = null;
let isAmbientOn = false;

function toggleAmbientSound() {
  const btn = document.getElementById('ambientToggleBtn');
  if (!isAmbientOn) {
    startAmbientSound();
    btn.innerHTML = '&#9835; Matikan suara ambient';
  } else {
    stopAmbientSound();
    btn.innerHTML = '&#9835; Nyalakan suara ambient';
  }
}

function startAmbientSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const freqs = [130.81, 196.00, 246.94, 293.66];
  ambientGain = audioCtx.createGain();
  ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  ambientGain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 2);
  ambientGain.connect(audioCtx.destination);

  freqs.forEach((f) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, audioCtx.currentTime);
    osc.connect(ambientGain);
    osc.start();
  });

  isAmbientOn = true;
}

function stopAmbientSound() {
  if (audioCtx && isAmbientOn) {
    audioCtx.close();
    audioCtx = null;
  }
  isAmbientOn = false;
  const btn = document.getElementById('ambientToggleBtn');
  if (btn) btn.innerHTML = '&#9835; Nyalakan suara ambient';
}

/* =========================================================
   4. ULAR TANGGA EMOSI (PAPAN 36 LANGKAH + SVG ULAR & TANGGA)
   ========================================================= */
const LADDERS = {
  3: 11,
  8: 16,
  15: 23,
  21: 30
};

const SNAKES = {
  19: 10,
  27: 13,
  34: 25
};

const STEP_AFFIRMATIONS = {
  start: {
    title: 'Kamu sudah memulai.',
    body: 'Mengambil langkah pertama juga merupakan sebuah keberanian.'
  },
  ladder: {
    title: 'Langkah dukungan terbuka!',
    body: 'Kebaikan kecil, jeda yang cukup, atau obrolan hangat bisa membantu melangkah lebih ringan.'
  },
  snake: {
    title: 'Turun bukan berarti gagal.',
    body: 'Melambat sejenak membantu kita menata napas dan melihat hal-hal dengan lebih jernih.'
  },
  finish: {
    title: 'Kamu sampai di garis akhir perjalanan ini!',
    body: 'Setiap langkah—baik cepat maupun pelan—tetap memiliki makna bagi dirimu.'
  },
  normal: [
    {
      title: 'Kamu boleh berjalan dengan ritmemu sendiri.',
      body: 'Tidak ada keharusan untuk selalu sempurna setiap hari.'
    },
    {
      title: 'Perasaan yang muncul layak dikenali.',
      body: 'Menyadari apa yang sedang dirasakan adalah awal dari merawat diri.'
    },
    {
      title: 'Istirahat sejenak itu wajar.',
      body: 'Memberi ruang bernapas membantu pikiran kembali tenang.'
    }
  ]
};

let snakeState = {
  position: 1,
  rolls: 0,
  laddersHit: 0,
  snakesHit: 0,
  soundEnabled: true,
  isRolling: false
};

function startSnakeGame() {
  document.getElementById('snakeIntroView').classList.add('hidden');
  document.getElementById('snakeBoardView').classList.remove('hidden');
  resetSnakeGame();
}

function exitSnakeGame() {
  document.getElementById('snakeBoardView').classList.add('hidden');
  document.getElementById('snakeIntroView').classList.remove('hidden');
}

function resetSnakeGame() {
  snakeState.position = 1;
  snakeState.rolls = 0;
  snakeState.laddersHit = 0;
  snakeState.snakesHit = 0;
  snakeState.isRolling = false;

  document.getElementById('diceFaceDisplay').textContent = '1';
  document.getElementById('diceStatusLabel').textContent = 'Siap memulai perjalananmu?';
  document.getElementById('diceMoveDetail').textContent = 'Lempar dadu untuk melangkah di papan 36 kotak.';
  document.getElementById('rollDiceBtn').disabled = false;
  setAffirmation(STEP_AFFIRMATIONS.start.title, STEP_AFFIRMATIONS.start.body);
  updateSnakeStatsAndBoard();
}

function toggleSnakeSound() {
  snakeState.soundEnabled = !snakeState.soundEnabled;
  document.getElementById('snakeSoundBtn').textContent = snakeState.soundEnabled ? 'Sound On' : 'Sound Off';
}

function playDiceTone(freq = 520) {
  if (!snakeState.soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.17);
  } catch (_) {}
}

function rollSnakeDice() {
  if (snakeState.isRolling || snakeState.position >= 36) return;
  snakeState.isRolling = true;
  document.getElementById('rollDiceBtn').disabled = true;

  const diceEl = document.getElementById('diceFaceDisplay');
  diceEl.classList.add('rolling');
  playDiceTone(480);

  let ticks = 0;
  const rollAnim = setInterval(() => {
    ticks += 1;
    diceEl.textContent = String(Math.floor(Math.random() * 6) + 1);
    if (ticks >= 6) {
      clearInterval(rollAnim);
      diceEl.classList.remove('rolling');
      const rolled = Math.floor(Math.random() * 6) + 1;
      diceEl.textContent = String(rolled);
      applySnakeMove(rolled);
    }
  }, 80);
}

function applySnakeMove(rolled) {
  snakeState.rolls += 1;
  let nextPos = snakeState.position + rolled;
  let detail = `Dadu menunjukkan ${rolled}. Melangkah ke kotak ${Math.min(nextPos, 36)}.`;

  if (nextPos >= 36) {
    snakeState.position = 36;
    detail = `Dadu menunjukkan ${rolled}. Kamu tiba di kotak 36 (FINISH)!`;
    setAffirmation(STEP_AFFIRMATIONS.finish.title, STEP_AFFIRMATIONS.finish.body);
    document.getElementById('rollDiceBtn').disabled = true;
  } else if (LADDERS[nextPos]) {
    const target = LADDERS[nextPos];
    snakeState.laddersHit += 1;
    snakeState.position = target;
    detail = `Dadu ${rolled} (kotak ${nextPos}) -> Menemukan tangga naik ke kotak ${target}!`;
    setAffirmation(STEP_AFFIRMATIONS.ladder.title, STEP_AFFIRMATIONS.ladder.body);
    playDiceTone(680);
    document.getElementById('rollDiceBtn').disabled = false;
  } else if (SNAKES[nextPos]) {
    const target = SNAKES[nextPos];
    snakeState.snakesHit += 1;
    snakeState.position = target;
    detail = `Dadu ${rolled} (kotak ${nextPos}) -> Bertemu ular, turun ke kotak ${target}.`;
    setAffirmation(STEP_AFFIRMATIONS.snake.title, STEP_AFFIRMATIONS.snake.body);
    playDiceTone(340);
    document.getElementById('rollDiceBtn').disabled = false;
  } else {
    snakeState.position = nextPos;
    const msg = STEP_AFFIRMATIONS.normal[snakeState.rolls % STEP_AFFIRMATIONS.normal.length];
    setAffirmation(msg.title, msg.body);
    document.getElementById('rollDiceBtn').disabled = false;
  }

  document.getElementById('diceStatusLabel').textContent = `Langkah ke-${snakeState.position}`;
  document.getElementById('diceMoveDetail').textContent = detail;
  snakeState.isRolling = false;
  updateSnakeStatsAndBoard();
}

function setAffirmation(title, body) {
  document.getElementById('snakeAffirmationTitle').textContent = title;
  document.getElementById('snakeAffirmationBody').textContent = body;
}

// Menghitung titik tengah koordinat (0..600) tiap nomor kotak 1..36
function getCellCenterSVG(cellNum) {
  const zeroIdx = cellNum - 1;
  const rowFromBottom = Math.floor(zeroIdx / 6); // 0..5
  const colInRow = zeroIdx % 6;
  const col = rowFromBottom % 2 === 0 ? colInRow : 5 - colInRow;
  const visualRow = 5 - rowFromBottom; // 0 di atas, 5 di bawah

  return {
    x: col * 100 + 50,
    y: visualRow * 100 + 50
  };
}

function renderBoardOverlaySVG() {
  const svg = document.getElementById('snakeBoardOverlay');
  if (!svg) return;
  let markup = '';

  // 1. Gambar Tangga (2 rel sejajar + anak tangga)
  Object.entries(LADDERS).forEach(([fromStr, toStr]) => {
    const p1 = getCellCenterSVG(Number(fromStr));
    const p2 = getCellCenterSVG(Number(toStr));
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * 9;
    const ny = (dx / len) * 9;

    // Rel kiri dan kanan
    markup += `<line x1="${p1.x + nx}" y1="${p1.y + ny}" x2="${p2.x + nx}" y2="${p2.y + ny}" stroke="#3B82F6" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />`;
    markup += `<line x1="${p1.x - nx}" y1="${p1.y - ny}" x2="${p2.x - nx}" y2="${p2.y - ny}" stroke="#3B82F6" stroke-width="4.5" stroke-linecap="round" opacity="0.85" />`;

    // Anak tangga
    const steps = Math.max(4, Math.floor(len / 26));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      markup += `<line x1="${rx + nx}" y1="${ry + ny}" x2="${rx - nx}" y2="${ry - ny}" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round" opacity="0.85" />`;
    }
  });

  // 2. Gambar Ular (tubuh berkelok, sisik putus-putus, kepala & mata)
  Object.entries(SNAKES).forEach(([headStr, tailStr]) => {
    const head = getCellCenterSVG(Number(headStr));
    const tail = getCellCenterSVG(Number(tailStr));

    const midX = (head.x + tail.x) / 2;
    const midY = (head.y + tail.y) / 2;
    const ctrl1X = head.x + (tail.y - head.y) * 0.28;
    const ctrl1Y = midY - 35;
    const ctrl2X = tail.x - (tail.y - head.y) * 0.28;
    const ctrl2Y = midY + 35;

    const pathD = `M ${head.x} ${head.y} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${tail.x} ${tail.y}`;

    // Badan ular utama
    markup += `<path d="${pathD}" fill="none" stroke="#C2593F" stroke-width="11" stroke-linecap="round" opacity="0.88" />`;
    // Motif garis sisik di tengah tubuh ular
    markup += `<path d="${pathD}" fill="none" stroke="#FADAD1" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round" opacity="0.9" />`;

    // Lidah bercabang kecil di dekat kepala ular
    markup += `<path d="M ${head.x} ${head.y - 9} L ${head.x - 4} ${head.y - 16} M ${head.x} ${head.y - 9} L ${head.x + 4} ${head.y - 16}" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />`;

    // Kepala ular bulat + dua mata
    markup += `<circle cx="${head.x}" cy="${head.y}" r="11" fill="#A9442C" />`;
    markup += `<circle cx="${head.x - 3.8}" cy="${head.y - 2}" r="2.2" fill="#FFFFFF" />`;
    markup += `<circle cx="${head.x + 3.8}" cy="${head.y - 2}" r="2.2" fill="#FFFFFF" />`;
    markup += `<circle cx="${head.x - 3.8}" cy="${head.y - 2}" r="1" fill="#141D28" />`;
    markup += `<circle cx="${head.x + 3.8}" cy="${head.y - 2}" r="1" fill="#141D28" />`;
  });

  svg.innerHTML = markup;
}

function updateSnakeStatsAndBoard() {
  document.getElementById('snakePositionText').textContent = `${snakeState.position} dari 36 langkah`;
  document.getElementById('statRolls').textContent = String(snakeState.rolls);
  document.getElementById('statLadders').textContent = String(snakeState.laddersHit);
  document.getElementById('statSnakes').textContent = String(snakeState.snakesHit);

  const boardEl = document.getElementById('snakeBoardGrid');
  boardEl.innerHTML = '';

  const orderedCells = [];
  for (let row = 5; row >= 0; row--) {
    const rowNums = [];
    for (let col = 0; col < 6; col++) {
      const base = row * 6;
      const num = row % 2 === 0 ? base + col + 1 : base + (6 - col);
      rowNums.push(num);
    }
    orderedCells.push(...rowNums);
  }

  orderedCells.forEach((num) => {
    const cell = document.createElement('div');
    let cls = 'board-cell';
    if (num === 1) cls += ' cell-start';
    else if (num === 36) cls += ' cell-finish';
    else if (num % 2 === 0) cls += ' cell-blue';
    else cls += ' cell-peach';

    cell.className = cls;

    const topLabel = document.createElement('span');
    topLabel.textContent = num === 1 ? '1 START' : num === 36 ? '36 FINISH' : String(num);
    cell.appendChild(topLabel);

    if (LADDERS[num]) {
      const marker = document.createElement('span');
      marker.className = 'cell-marker marker-ladder';
      marker.textContent = `↑${LADDERS[num]}`;
      cell.appendChild(marker);
    } else if (SNAKES[num]) {
      const marker = document.createElement('span');
      marker.className = 'cell-marker marker-snake';
      marker.textContent = `↓${SNAKES[num]}`;
      cell.appendChild(marker);
    }

    if (snakeState.position === num) {
      const token = document.createElement('div');
      token.className = 'player-token';
      token.textContent = '●';
      cell.appendChild(token);
    }

    boardEl.appendChild(cell);
  });

  renderBoardOverlaySVG();
}

/* =========================================================
   5. RUANG CERITA — CHATBOT AI PENDAMPING EMPATIK
   ========================================================= */
function getCurrentTimeStr() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function appendChatMessage(sender, text) {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = `
    <div>${text}</div>
    <span class="chat-bubble-time">${sender === 'bot' ? 'Teman Dengar AI • ' : 'Kamu • '}${getCurrentTimeStr()}</span>
  `;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function resetChatSession() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;
  container.innerHTML = '';
  appendChatMessage(
    'bot',
    'Halo, selamat datang di Ruang Cerita. Aku Teman Dengar AI. Kamu boleh menceritakan apa pun yang sedang terasa berat atau memenuhi pikiranmu hari ini—pelan-pelan saja, aku siap mendengarkan.'
  );
}

function generateEmpatheticAIReply(userMsg) {
  const lower = userMsg.toLowerCase();

  // Deteksi kata kunci krisis / bahaya diri
  if (
    lower.includes('bunuh diri') ||
    lower.includes('akhiri hidup') ||
    lower.includes('menyakiti diri') ||
    lower.includes('tidak ingin hidup') ||
    lower.includes('putus asa')
  ) {
    return 'Terima kasih sudah berani mengungkapkan perasaan seberat ini. Kamu tidak harus menanggungnya sendirian. Karena aku adalah pendamping AI dengan keterbatasan, aku sangat menyarankan kamu segera menghubungi layanan darurat 119 atau tenaga profesional di menu Bantuan agar mendapat dukungan langsung yang aman.';
  }

  if (lower.includes('capek') || lower.includes('lelah') || lower.includes('penuh') || lower.includes('burnout')) {
    return 'Kedengarannya kamu sudah membawa banyak hal akhir-akhir ini, dan wajar sekali kalau tubuh maupun pikiranmu merasa lelah. Kamu tidak harus menyelesaikan semuanya hari ini. Kalau mau, kita bisa coba ambil jeda napas 1–3 menit di Ruang Tenang, atau lanjut cerita saja di sini.';
  }

  if (lower.includes('cemas') || lower.includes('overthinking') || lower.includes('takut') || lower.includes('gelisah')) {
    return 'Saat pikiran berputar memikirkan banyak kemungkinan, rasanya memang melelahkan. Coba tarik napas pelan sebentar. Dari sekian banyak hal yang sedang kamu pikirkan sekarang, mana satu hal paling kecil yang paling terasa mengganggu?';
  }

  if (lower.includes('sedih') || lower.includes('nangis') || lower.includes('kecewa') || lower.includes('sendiri')) {
    return 'Perasaan sedih dan kecewa itu valid, dan kamu tidak perlu berpura-pura baik-baik saja di sini. Aku mendengarkanmu. Kalau kamu ingin menuliskan lebih lanjut apa yang membuatmu merasa seperti itu, silakan lanjutkan.';
  }

  if (lower.includes('didengar') || lower.includes('tanpa dinasihati')) {
    return 'Baik, aku di sini sepenuhnya untuk mendengarkan tanpa memberi nasihat apa pun. Tuangkan saja semua yang ingin kamu keluarkan—sebanyak atau sesingkat apa pun.';
  }

  if (lower.includes('terima kasih') || lower.includes('makasih') || lower.includes('lega')) {
    return 'Sama-sama. Terima kasih juga sudah memberi ruang bagi dirimu sendiri hari ini. Pelan-pelan saja ya, kamu tetap berarti.';
  }

  const generalReplies = [
    'Terima kasih sudah berbagi cerita itu denganku. Perasaanmu layak didengarkan. Bagaimana rasanya setelah menuliskannya barusan?',
    'Aku menangkap bahwa situasi itu cukup berarti buatmu. Kamu boleh ceritakan bagian mana yang paling terasa berat saat ini.',
    'Pelan-pelan saja, tidak perlu terburu-buru merangkai kata. Aku tetap di sini menyimak ceritamu.'
  ];
  return generalReplies[Math.floor(Math.random() * generalReplies.length)];
}

function sendQuickPrompt(text) {
  const input = document.getElementById('chatUserInput');
  input.value = text;
  handleChatSubmit(new Event('submit'));
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chatUserInput');
  const text = input.value.trim();
  if (!text) return;

  appendChatMessage('user', text);
  input.value = '';

  // Simulasi indikator mengetik singkat
  const container = document.getElementById('chatMessagesContainer');
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-bubble bot';
  typingEl.id = 'botTypingIndicator';
  typingEl.textContent = 'Teman Dengar AI sedang menyimak...';
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;

  setTimeout(() => {
    const existingTyping = document.getElementById('botTypingIndicator');
    if (existingTyping) existingTyping.remove();
    const reply = generateEmpatheticAIReply(text);
    appendChatMessage('bot', reply);
  }, 650);
}

// Inisialisasi pesan pembuka chatbot saat halaman pertama kali dimuat
resetChatSession();
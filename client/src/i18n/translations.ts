/**
 * translations.ts — MathQuest Kids i18n
 * ─────────────────────────────────────────────────────────────
 * All UI strings in English and Arabic.
 *
 * CRITICAL: Numbers in math equations and scores are ALWAYS
 * rendered in Western Arabic numerals (0-9) and wrapped in
 * dir="ltr" spans. This file contains only UI text strings.
 * ─────────────────────────────────────────────────────────────
 */

export type Language = "en" | "ar";

export interface Translations {
  // ── App-wide ─────────────────────────────────────────────
  appName: string;
  appTagline: string;
  settings: string;
  backHome: string;
  loading: string;

  // ── Language toggle ───────────────────────────────────────
  switchToArabic: string;
  switchToEnglish: string;

  // ── Home Screen ───────────────────────────────────────────
  homeTitle: string;
  homeSubtitle: string;
  playNow: string;
  parentsDashboard: string;
  starsEarned: string;

  // ── Level Select ──────────────────────────────────────────
  chooseLevelTitle: string;
  chooseLevelSubtitle: string;
  locked: string;
  unlocked: string;
  gamesPlayed: string;
  game: string;
  games: string;
  practiceThis: string;
  allPassed: string;
  passed: string;
  notStarted: string;
  startLevel: string;
  levelMastered: string;
  subLevelProgress: string;

  // ── Grade names ───────────────────────────────────────────
  gradeKG: string;
  gradeKGSub: string;
  grade1: string;
  grade1Sub: string;
  grade2: string;
  grade2Sub: string;
  grade3: string;
  grade3Sub: string;

  // ── Game Screen ───────────────────────────────────────────
  score: string;
  lives: string;
  question: string;
  of: string;
  nextQuestion: string;
  subLevelProgressLabel: string;
  correctToPass: string;

  // ── Feedback messages ─────────────────────────────────────
  feedbackCorrect1: string;
  feedbackCorrect2: string;
  feedbackCorrect3: string;
  feedbackCorrect4: string;
  feedbackWrong1: string;
  feedbackWrong2: string;
  feedbackWrong3: string;

  // ── Question prompts ──────────────────────────────────────
  questionCountPrompt: string;  // "How many [emoji] are there?"
  questionPickNumber: string;   // "Pick the number:"
  questionSolve: string;        // "Solve:"
  questionFraction: string;     // "What fraction is shaded?"

  // ── Summary Screen ────────────────────────────────────────
  roundComplete: string;
  excellentScore: string;
  goodScore: string;
  keepPracticing: string;
  yourScore: string;
  correct: string;
  incorrect: string;
  starsEarnedRound: string;
  playAgain: string;
  chooseLevel: string;
  goHome: string;
  newRecord: string;

  // ── Math Gate ─────────────────────────────────────────────
  gateTitle: string;
  gateSubtitle: string;
  gateAnswerPlaceholder: string;
  gateSubmit: string;
  gateGoBack: string;
  gateWrong: string;
  gateSuccess: string;
  gateParentsOnly: string;

  // ── Parents Dashboard ─────────────────────────────────────
  parentsDashboardTitle: string;
  parentsWelcome: string;
  overviewTitle: string;
  totalPlayTime: string;
  questionsAnswered: string;
  overallAccuracy: string;
  operationsPassed: string;
  areasToImproveTitle: string;
  areasToImproveIntro: string;
  areasToImproveTip: string;
  accuracyByOperation: string;
  levelStarsTitle: string;
  recentActivityTitle: string;
  noActivityYet: string;
  settingsTitle: string;
  dailyReminders: string;
  dailyRemindersDesc: string;
  sessionDuration: string;
  sessionDurationDesc: string;
  soundEffects: string;
  soundEffectsDesc: string;
  language: string;
  languageDesc: string;
  featureComingSoon: string;
  dataManagement: string;
  resetProgressTitle: string;
  resetProgressDesc: string;
  resetProgressBtn: string;
  resetConfirmTitle: string;
  resetConfirmBody: string;
  resetConfirmYes: string;
  resetConfirmCancel: string;
  resetSuccessToast: string;

  // ── Accuracy labels ───────────────────────────────────────
  accuracyExcellent: string;
  accuracyGood: string;
  accuracyDeveloping: string;
  accuracyNeedsPractice: string;
  accuracyLegendExcellent: string;
  accuracyLegendGood: string;
  accuracyLegendNeeds: string;

  // ── Table headers ─────────────────────────────────────────
  tableQuestion: string;
  tableOperation: string;
  tableResult: string;

  // ── Focus badge ───────────────────────────────────────────
  focusBadge: string;

  // ── Trophy Room ───────────────────────────────────────────
  trophyRoom: string;
  trophyRoomSubtitle: string;
  trophyUnlocked: string;
  trophyLocked: string;
  trophyProgress: string;
  trophyRarityBronze: string;
  trophyRaritySilver: string;
  trophyRarityGold: string;
  trophyRarityPlatinum: string;
  trophyBadgeUnlocked: string;

  // ── Game formats ──────────────────────────────────────────
  formatFillGapPrompt: string;
  formatBubblePopPrompt: string;

  // ── Adaptive difficulty ───────────────────────────────────
  streakLabel: string;
  diffHard: string;
  diffEasy: string;
  // ── Multiplication Practice ──────────────────────────────
  multPractice: string;
  multPracticeTitle: string;
  multCurrentStreak: string;
  multBestStreak: string;
  multAccuracy: string;
  multExit: string;
  multQuestionPrompt: string;
  multCorrect: string;
  multWeakPointsTitle: string;
  multWeakPointsSubtitle: string;
  multWeakPointsEmpty: string;
  multFactLabel: string;
  multErrorRate: string;
  multAttempts: string;
  // u2500u2500 PWA u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500u2500
  offlineMessage: string;
  installApp: string;
  installAppHint: string;
}

// ── English ───────────────────────────────────────────────────

export const en: Translations = {
  appName: "MathQuest Kids",
  appTagline: "Ready to become a Math Hero? 🦸",
  settings: "⚙️ Settings",
  backHome: "← Home",
  loading: "Loading…",

  switchToArabic: "العربية",
  switchToEnglish: "English",

  homeTitle: "MathQuest!",
  homeSubtitle: "Ready to become a Math Hero? 🦸",
  playNow: "🎮 Play Now!",
  parentsDashboard: "👨‍👩‍👧 Parents Dashboard",
  starsEarned: "Stars Earned!",

  chooseLevelTitle: "Choose Your Level",
  chooseLevelSubtitle: "Pick a grade and start your math adventure!",
  locked: "🔒 Locked",
  unlocked: "✅ Unlocked",
  gamesPlayed: "games played",
  game: "game",
  games: "games",
  practiceThis: "Practise this →",
  allPassed: "All Passed! 🎉",
  passed: "Passed ✅",
  notStarted: "Not started",
  startLevel: "Start Level →",
  levelMastered: "Level Mastered! 🏆",
  subLevelProgress: "Sub-level Progress",

  gradeKG: "Kindergarten",
  gradeKGSub: "Counting & Numbers",
  grade1: "Grade 1",
  grade1Sub: "Adding & Subtracting",
  grade2: "Grade 2",
  grade2Sub: "Bigger Numbers & Times",
  grade3: "Grade 3",
  grade3Sub: "Multiply, Divide & Fractions",

  score: "Score",
  lives: "Lives",
  question: "Question",
  of: "of",
  nextQuestion: "Next Question →",
  subLevelProgressLabel: "Progress",
  correctToPass: "correct to pass",

  feedbackCorrect1: "Great Job! 🌟",
  feedbackCorrect2: "Awesome! 🎉",
  feedbackCorrect3: "You Rock! 🚀",
  feedbackCorrect4: "Brilliant! ⭐",
  feedbackWrong1: "Try Again! 💪",
  feedbackWrong2: "Almost! Keep Going! 🤔",
  feedbackWrong3: "Don't Give Up! 🌈",

  questionCountPrompt: "How many are there?",
  questionPickNumber: "Pick the number:",
  questionSolve: "Solve:",
  questionFraction: "What fraction is shaded?",

  roundComplete: "Round Complete!",
  excellentScore: "Outstanding! 🏆",
  goodScore: "Well Done! 🌟",
  keepPracticing: "Keep Practising! 💪",
  yourScore: "Your Score",
  correct: "Correct",
  incorrect: "Incorrect",
  starsEarnedRound: "Stars Earned",
  playAgain: "🔄 Play Again",
  chooseLevel: "📚 Choose Level",
  goHome: "🏠 Home",
  newRecord: "🎉 New Record!",

  gateTitle: "Parents Only Area",
  gateSubtitle: "Answer this question to continue",
  gateAnswerPlaceholder: "Your answer…",
  gateSubmit: "Go →",
  gateGoBack: "← Go back",
  gateWrong: "Oops! Try a new question 🔄",
  gateSuccess: "✓ Correct! Opening dashboard…",
  gateParentsOnly: "👨‍👩‍👧",

  parentsDashboardTitle: "Parents Dashboard",
  parentsWelcome: "Here's a full picture of your child's math progress! 🦉",
  overviewTitle: "📊 Overview",
  totalPlayTime: "Total Play Time",
  questionsAnswered: "Questions Answered",
  overallAccuracy: "Overall Accuracy",
  operationsPassed: "Operations Passed",
  areasToImproveTitle: "🔍 Areas to Improve",
  areasToImproveIntro: "💡 Your child needs more practice with:",
  areasToImproveTip: "Try practising this operation a few more times to build confidence.",
  accuracyByOperation: "📚 Accuracy by Operation",
  levelStarsTitle: "⭐ Level Stars",
  recentActivityTitle: "🕐 Recent Activity",
  noActivityYet: "No activity yet — play a game to see results here! 🎮",
  settingsTitle: "⚙️ Settings",
  dailyReminders: "Daily Reminders",
  dailyRemindersDesc: "Set practice time",
  sessionDuration: "Session Duration",
  sessionDurationDesc: "10 min / session",
  soundEffects: "Sound Effects",
  soundEffectsDesc: "Currently: On",
  language: "Language",
  languageDesc: "English / العربية",
  featureComingSoon: "Feature coming soon! 🚀",
  dataManagement: "🗑️ Data Management",
  resetProgressTitle: "Reset All Progress",
  resetProgressDesc: "Erases all stars, history, and unlocked levels. Cannot be undone.",
  resetProgressBtn: "🗑️ Reset Progress",
  resetConfirmTitle: "Reset All Progress?",
  resetConfirmBody: "This will permanently erase all stars, unlocked levels, answer history, and play time. This action cannot be undone.",
  resetConfirmYes: "Yes, Reset",
  resetConfirmCancel: "Cancel",
  resetSuccessToast: "Progress has been reset. Starting fresh! 🌱",

  accuracyExcellent: "Excellent",
  accuracyGood: "Good",
  accuracyDeveloping: "Developing",
  accuracyNeedsPractice: "Needs Practice",
  accuracyLegendExcellent: "Excellent (≥80%)",
  accuracyLegendGood: "Good (55–79%)",
  accuracyLegendNeeds: "Needs Practice (<55%)",

  tableQuestion: "Question",
  tableOperation: "Operation",
  tableResult: "✓/✗",

  focusBadge: "⚠️ Focus",

  trophyRoom: "🏆 Trophy Room",
  trophyRoomSubtitle: "Your badges and achievements",
  trophyUnlocked: "Unlocked",
  trophyLocked: "Locked",
  trophyProgress: "badges unlocked",
  trophyRarityBronze: "Bronze",
  trophyRaritySilver: "Silver",
  trophyRarityGold: "Gold",
  trophyRarityPlatinum: "Platinum",
  trophyBadgeUnlocked: "Badge Unlocked!",

  formatFillGapPrompt: "Pick the missing number:",
  formatBubblePopPrompt: "Pop the correct bubble! 🫧",

  streakLabel: "streak",
  diffHard: "↑ hard",
  diffEasy: "↓ easy",
  // ── Multiplication Practice ──────────────────────────────
  multPractice: "⚡ Times Tables",
  multPracticeTitle: "Multiplication Practice",
  multCurrentStreak: "Current Streak",
  multBestStreak: "Best Streak",
  multAccuracy: "Accuracy",
  multExit: "Exit",
  multQuestionPrompt: "What is:",
  multCorrect: "Correct! ✅",
  multWeakPointsTitle: "⚡ Multiplication Weak Points",
  multWeakPointsSubtitle: "Facts your child misses most often (min. 2 attempts)",
  multWeakPointsEmpty: "No weak points yet — keep practising! 🌟",
  multFactLabel: "Fact",
  multErrorRate: "Error Rate",
  multAttempts: "Attempts",
  offlineMessage: "You are playing offline! All features still work.",
  installApp: "📲 Install App",
  installAppHint: "Play without a browser!",
};

// ── Arabic ────────────────────────────────────────────────────

export const ar: Translations = {
  appName: "ماث كويست للأطفال",
  appTagline: "هل أنت مستعد لتصبح بطل الرياضيات؟ 🦸",
  settings: "⚙️ الإعدادات",
  backHome: "الرئيسية →",
  loading: "جارٍ التحميل…",

  switchToArabic: "العربية",
  switchToEnglish: "English",

  homeTitle: "ماث كويست!",
  homeSubtitle: "هل أنت مستعد لتصبح بطل الرياضيات؟ 🦸",
  playNow: "🎮 العب الآن!",
  parentsDashboard: "👨‍👩‍👧 لوحة تحكم الآباء",
  starsEarned: "نجوم مكتسبة!",

  chooseLevelTitle: "اختر مستواك",
  chooseLevelSubtitle: "اختر صفًّا وابدأ مغامرتك في الرياضيات!",
  locked: "🔒 مقفل",
  unlocked: "✅ مفتوح",
  gamesPlayed: "ألعاب تمّت",
  game: "لعبة",
  games: "ألعاب",
  practiceThis: "تدرّب على هذا ←",
  allPassed: "كلّها اجتُزت! 🎉",
  passed: "اجتُزت ✅",
  notStarted: "لم تبدأ بعد",
  startLevel: "ابدأ المستوى ←",
  levelMastered: "أتقنت المستوى! 🏆",
  subLevelProgress: "تقدّم المستوى الفرعي",

  gradeKG: "رياض الأطفال",
  gradeKGSub: "العدّ والأرقام",
  grade1: "الصف الأول",
  grade1Sub: "الجمع والطرح",
  grade2: "الصف الثاني",
  grade2Sub: "أعداد أكبر والضرب",
  grade3: "الصف الثالث",
  grade3Sub: "الضرب والقسمة والكسور",

  score: "النتيجة",
  lives: "الأرواح",
  question: "سؤال",
  of: "من",
  nextQuestion: "السؤال التالي ←",
  subLevelProgressLabel: "التقدّم",
  correctToPass: "إجابات صحيحة للاجتياز",

  feedbackCorrect1: "عمل رائع! 🌟",
  feedbackCorrect2: "ممتاز! 🎉",
  feedbackCorrect3: "أنت رائع! 🚀",
  feedbackCorrect4: "بارع جدًّا! ⭐",
  feedbackWrong1: "حاول مجدّدًا! 💪",
  feedbackWrong2: "تقريبًا! واصل المحاولة! 🤔",
  feedbackWrong3: "لا تستسلم! 🌈",

  questionCountPrompt: "كم عددها؟",
  questionPickNumber: "اختر الرقم:",
  questionSolve: "احسب:",
  questionFraction: "ما الكسر الممثَّل بالتظليل؟",

  roundComplete: "انتهت الجولة!",
  excellentScore: "ممتاز! 🏆",
  goodScore: "أحسنت! 🌟",
  keepPracticing: "واصل التدرّب! 💪",
  yourScore: "نتيجتك",
  correct: "صحيح",
  incorrect: "خطأ",
  starsEarnedRound: "نجوم مكتسبة",
  playAgain: "🔄 العب مجدّدًا",
  chooseLevel: "📚 اختر المستوى",
  goHome: "🏠 الرئيسية",
  newRecord: "🎉 رقم قياسي جديد!",

  gateTitle: "منطقة الآباء فقط",
  gateSubtitle: "أجب عن هذا السؤال للمتابعة",
  gateAnswerPlaceholder: "إجابتك…",
  gateSubmit: "تأكيد ←",
  gateGoBack: "→ العودة",
  gateWrong: "عفوًا! جرّب سؤالًا جديدًا 🔄",
  gateSuccess: "✓ صحيح! جارٍ فتح اللوحة…",
  gateParentsOnly: "👨‍👩‍👧",

  parentsDashboardTitle: "لوحة تحكم الآباء",
  parentsWelcome: "إليك صورة كاملة عن تقدّم طفلك في الرياضيات! 🦉",
  overviewTitle: "📊 نظرة عامة",
  totalPlayTime: "إجمالي وقت اللعب",
  questionsAnswered: "الأسئلة المُجابة",
  overallAccuracy: "الدقة الإجمالية",
  operationsPassed: "العمليات المُجتازة",
  areasToImproveTitle: "🔍 مجالات التحسين",
  areasToImproveIntro: "💡 يحتاج طفلك إلى مزيد من التدرّب على:",
  areasToImproveTip: "جرّب التدرّب على هذه العملية مرات أكثر لبناء الثقة.",
  accuracyByOperation: "📚 الدقة حسب العملية",
  levelStarsTitle: "⭐ نجوم المستويات",
  recentActivityTitle: "🕐 النشاط الأخير",
  noActivityYet: "لا يوجد نشاط بعد — العب لعبة لرؤية النتائج هنا! 🎮",
  settingsTitle: "⚙️ الإعدادات",
  dailyReminders: "التذكيرات اليومية",
  dailyRemindersDesc: "تحديد وقت التدرّب",
  sessionDuration: "مدة الجلسة",
  sessionDurationDesc: "10 دقائق / جلسة",
  soundEffects: "المؤثرات الصوتية",
  soundEffectsDesc: "الحالة: مفعّلة",
  language: "اللغة",
  languageDesc: "العربية / English",
  featureComingSoon: "الميزة قادمة قريبًا! 🚀",
  dataManagement: "🗑️ إدارة البيانات",
  resetProgressTitle: "إعادة تعيين كل التقدّم",
  resetProgressDesc: "يمحو جميع النجوم والمستويات المفتوحة وسجل الإجابات. لا يمكن التراجع.",
  resetProgressBtn: "🗑️ إعادة التعيين",
  resetConfirmTitle: "إعادة تعيين كل التقدّم؟",
  resetConfirmBody: "سيؤدي هذا إلى محو جميع النجوم والمستويات المفتوحة وسجل الإجابات ووقت اللعب بشكل دائم. لا يمكن التراجع عن هذا الإجراء.",
  resetConfirmYes: "نعم، أعد التعيين",
  resetConfirmCancel: "إلغاء",
  resetSuccessToast: "تمت إعادة التعيين. نبدأ من جديد! 🌱",

  accuracyExcellent: "ممتاز",
  accuracyGood: "جيد",
  accuracyDeveloping: "في تطوّر",
  accuracyNeedsPractice: "يحتاج تدرّبًا",
  accuracyLegendExcellent: "ممتاز (≥80%)",
  accuracyLegendGood: "جيد (55–79%)",
  accuracyLegendNeeds: "يحتاج تدرّبًا (<55%)",

  tableQuestion: "السؤال",
  tableOperation: "العملية",
  tableResult: "✓/✗",

  focusBadge: "⚠️ تركيز",

  trophyRoom: "🏆 غرفة الكؤوس",
  trophyRoomSubtitle: "شاراتك وإنجازاتك",
  trophyUnlocked: "مفتوحة",
  trophyLocked: "مقفلة",
  trophyProgress: "شارات مفتوحة",
  trophyRarityBronze: "برونزي",
  trophyRaritySilver: "فضي",
  trophyRarityGold: "ذهبي",
  trophyRarityPlatinum: "بلاتيني",
  trophyBadgeUnlocked: "شارة جديدة!",

  formatFillGapPrompt: "اختر الرقم الناقص:",
  formatBubblePopPrompt: "افقع الفقاعة الصحيحة! 🫧",

  streakLabel: "متتالية",
  diffHard: "↑ صعب",
  diffEasy: "↓ سهل",
  // ── Multiplication Practice ──────────────────────────────
  multPractice: "⚡ جدول الضرب",
  multPracticeTitle: "تدريب جدول الضرب",
  multCurrentStreak: "التسلسل الحالي",
  multBestStreak: "أعلى رقم قياسي",
  multAccuracy: "الدقة",
  multExit: "خروج",
  multQuestionPrompt: "ما هو ناتج:",
  multCorrect: "ممتاز! ✅",
  multWeakPointsTitle: "⚡ نقاط ضعف جدول الضرب",
  multWeakPointsSubtitle: "الحقائق التي يخطئ فيها طفلك أكثر (2 محاولات على الأقل)",
  multWeakPointsEmpty: "لا توجد نقاط ضعف بعد — واصل التدريب! 🌟",
  multFactLabel: "الحقيقة",
  multErrorRate: "معدل الخطأ",
  multAttempts: "المحاولات",
  offlineMessage: "أنت تلعب بدون إنترنت! جميع الميزات تعمل.",
  installApp: "📲 تثبيت التطبيق",
  installAppHint: "العب بدون متصفح!",
};

export const translations: Record<Language, Translations> = { en, ar };

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Share2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getQuizQuestions, gradeQuiz } from '../services/api';

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "At what age can you apply in advance to get your Voter ID generated when you turn 18?",
    options: [
      { id: 0, text: "16 years" },
      { id: 1, text: "17 years" },
      { id: 2, text: "18 years" },
      { id: 3, text: "You cannot apply in advance" }
    ],
    correct: 1
  },
  {
    id: 2,
    question: "If you live in a hostel for college, where can you register to vote?",
    options: [
      { id: 0, text: "Only at your parents' house" },
      { id: 1, text: "Only at the hostel" },
      { id: 2, text: "At the hostel OR your parents' house (not both)" },
      { id: 3, text: "Anywhere in the state" }
    ],
    correct: 2
  },
  {
    id: 3,
    question: "Which form do you need to fill out as a new voter?",
    options: [
      { id: 0, text: "Form 6" },
      { id: 1, text: "Form 7" },
      { id: 2, text: "Form 8" },
      { id: 3, text: "Form 6A" }
    ],
    correct: 0
  }
];

const QuizBadges = () => {
  const { setPhase, setProgress, addXP } = useAppStore();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuizQuestions();
        if (data && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          setQuestions(DEFAULT_QUESTIONS);
        }
      } catch (err) {
        console.error("Failed to fetch questions, using fallback:", err);
        setQuestions(DEFAULT_QUESTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
  };

  const handleNext = async () => {
    const currentQuestionId = questions[currentQ].id;
    const currentAnswer = questions[currentQ].options[selected].id;
    
    const newAnswers = [...userAnswers, { id: currentQuestionId, answer: currentAnswer }];
    setUserAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setGrading(true);
      try {
        const payloadIds = newAnswers.map(a => a.id);
        const payloadAns = newAnswers.map(a => a.answer);
        const result = await gradeQuiz(payloadIds, payloadAns);
        
        if (result && typeof result.score === 'number') {
          setGradeResult(result);
        } else {
          throw new Error("Invalid grading response");
        }
        
        setQuizFinished(true);
        setProgress(100);
        addXP(result.score * 50, 'Quiz Score XP');
        if (result.score === result.maxScore) {
          addXP(200, 'Perfect Score Bonus!');
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        }
      } catch (err) {
        console.error("Grading failed, using local calculation:", err);
        // Fallback local grading
        let localScore = 0;
        newAnswers.forEach((ans, idx) => {
          const q = questions.find(q => q.id === ans.id);
          if (q && q.correct === ans.answer) localScore++;
        });
        
        const fallbackResult = { score: localScore, maxScore: questions.length };
        setGradeResult(fallbackResult);
        setQuizFinished(true);
        setProgress(100);
        addXP(localScore * 50, 'Quiz Score XP');
        if (localScore === questions.length) {
          addXP(200, 'Perfect Score Bonus!');
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
        }
      } finally {
        setGrading(false);
      }
    }
  };

  const handleShare = () => {
    const text = `I just scored ${gradeResult?.score}/${gradeResult?.maxScore} on the Election Quest guide! I'm officially ready to register as an Indian Voter. #Form6Pro`;
    navigator.clipboard.writeText(text);
    alert("Share text copied to clipboard!");
  };

  if (loading || grading) {
    return (
      <div className="max-w-3xl mx-auto mt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
          {loading ? "Loading the final challenge..." : "Grading your voter knowledge..."}
        </p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-8 mt-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-12 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <Award size={80} className="mx-auto mb-6 text-white drop-shadow-md" />
            <h1 className="text-4xl font-black mb-4">Quiz Complete!</h1>
            <p className="text-xl mb-2 font-bold text-yellow-900">Score: {gradeResult?.score} out of {gradeResult?.maxScore}</p>
            
            <div className="bg-white/20 backdrop-blur border border-white/30 p-6 rounded-2xl mt-8">
              <h2 className="text-2xl font-bold mb-2">
                {gradeResult?.score === gradeResult?.maxScore ? "🎖️ Form 6 Pro Badge Unlocked!" : "Good Job! Keep Learning."}
              </h2>
              <p className="text-sm font-medium">
                {gradeResult?.score === gradeResult?.maxScore 
                  ? "You have mastered the ECI rules for new voters. You are completely ready to register." 
                  : "Review the forms and documents phase to get a perfect score next time!"}
              </p>
            </div>
            
            <button onClick={handleShare} className="mt-8 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto">
              <Share2 size={20} /> Share Achievement
            </button>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="text-center">
          <Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 font-medium flex items-center justify-center gap-2">
            View Official Sources & Help <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Final Check</h1>
        <div className="text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-xl">
          Question {currentQ + 1} / {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">{q.question}</h2>
          
          <div className="space-y-3 mb-8">
            {q.options.map((opt, idx) => {
              let btnClass = "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-teal-500 text-gray-800 dark:text-gray-200";
              let icon = null;
              
              if (showResult && idx === selected) {
                btnClass = "bg-teal-50 border-teal-500 text-teal-800 dark:bg-teal-900/30 dark:border-teal-500 dark:text-teal-300";
                icon = <CheckCircle2 className="text-teal-500" />;
              }

              return (
                <button
                  key={opt.id}
                  disabled={showResult}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${btnClass}`}
                >
                  {opt.text}
                  {icon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50 mb-6">
                  <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">Answer locked! Complete the quiz to see your score and official ECI explanations.</p>
                </div>
                <button onClick={handleNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold transition-colors">
                  {currentQ < questions.length - 1 ? 'Next Question' : 'Finish & Grade Quiz'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizBadges;

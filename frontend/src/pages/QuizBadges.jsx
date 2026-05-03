import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, Share2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const quizData = [
  {
    id: 1,
    q: "At what age can you apply in advance to get your Voter ID generated when you turn 18?",
    options: ["16 years", "17 years", "18 years", "You cannot apply in advance"],
    correct: 1,
    explanation: "ECI allows youth who are 17+ years to file their advance applications so that they are enrolled and their EPIC is generated immediately upon turning 18."
  },
  {
    id: 2,
    q: "If you live in a hostel for college, where can you register to vote?",
    options: ["Only at your parents' house", "Only at the hostel", "At the hostel OR your parents' house (not both)", "Anywhere in the state"],
    correct: 2,
    explanation: "Students living in a hostel can choose to be registered at their native place or at their hostel address (by providing a student declaration). They cannot be registered at both."
  },
  {
    id: 3,
    q: "Which form do you need to fill out as a new voter?",
    options: ["Form 6", "Form 7", "Form 8", "Form 6A"],
    correct: 0,
    explanation: "Form 6 is the application form for new voters. Form 7 is for deletion, Form 8 is for shifting/corrections, and Form 6A is for overseas electors."
  }
];

const QuizBadges = () => {
  const { setPhase, setProgress } = useAppStore();
  const navigate = useNavigate();
  
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    
    if (idx === quizData[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < quizData.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      setProgress(100);
      if (score === quizData.length) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }
    }
  };

  const handleShare = () => {
    const text = `I just scored ${score}/${quizData.length} on the Election Quest guide! I'm officially ready to register as an Indian Voter. #Form6Pro`;
    navigator.clipboard.writeText(text);
    alert("Share text copied to clipboard!");
  };

  if (quizFinished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-8 mt-8">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-12 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <Award size={80} className="mx-auto mb-6 text-white drop-shadow-md" />
            <h1 className="text-4xl font-black mb-4">Quiz Complete!</h1>
            <p className="text-xl mb-2 font-bold text-yellow-900">Score: {score} out of {quizData.length}</p>
            
            <div className="bg-white/20 backdrop-blur border border-white/30 p-6 rounded-2xl mt-8">
              <h2 className="text-2xl font-bold mb-2">
                {score === quizData.length ? "🎖️ Form 6 Pro Badge Unlocked!" : "Good Job! Keep Learning."}
              </h2>
              <p className="text-sm font-medium">
                {score === quizData.length 
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

  const q = quizData[currentQ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Final Check</h1>
        <div className="text-teal-600 dark:text-teal-400 font-bold bg-teal-50 dark:bg-teal-900/30 px-4 py-2 rounded-xl">
          Question {currentQ + 1} / {quizData.length}
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
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-snug">{q.q}</h2>
          
          <div className="space-y-3 mb-8">
            {q.options.map((opt, idx) => {
              let btnClass = "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-teal-500 text-gray-800 dark:text-gray-200";
              let icon = null;
              
              if (showResult) {
                if (idx === q.correct) {
                  btnClass = "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300";
                  icon = <CheckCircle2 className="text-green-500" />;
                } else if (idx === selected) {
                  btnClass = "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300";
                  icon = <XCircle className="text-red-500" />;
                } else {
                  btnClass = "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ${btnClass}`}
                >
                  {opt}
                  {icon}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800/50 mb-6">
                  <p className="text-sm text-blue-900 dark:text-blue-200"><span className="font-bold">Explanation:</span> {q.explanation}</p>
                </div>
                <button onClick={handleNext} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-xl font-bold transition-colors">
                  {currentQ < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
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

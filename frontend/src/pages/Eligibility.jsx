import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Info, ArrowRight, Lightbulb } from 'lucide-react';

const questions = [
  {
    id: 'age',
    title: 'Are you 18 years old or older?',
    description: 'You must be 18 years of age on or before the qualifying date (usually Jan 1st, April 1st, July 1st, or Oct 1st of the year).',
    didYouKnow: 'If you are 17+ you can still apply in advance, and your card will be issued once you turn 18!',
    hint: 'Age is the primary criteria. Without this, your name cannot be added to the electoral roll.',
  },
  {
    id: 'citizenship',
    title: 'Are you an Indian Citizen?',
    description: 'Only citizens of India are eligible to be enrolled as voters.',
    didYouKnow: 'NRIs holding an Indian Passport can also register as overseas electors.',
    hint: 'You must possess valid Indian citizenship. Foreign nationals cannot vote.',
  },
  {
    id: 'residence',
    title: 'Are you ordinarily resident at the address you want to register?',
    description: 'You must be living at the address where you wish to cast your vote.',
    didYouKnow: 'Students living in hostels can choose to register at their hostel address or their native place.',
    hint: 'The Election Commission uses "ordinary residence" to map you to a specific polling booth.',
  }
];

const Eligibility = () => {
  const { setPhase, setProgress, audienceType, setAIPanelOpen } = useAppStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);

  const isUnder18 = audienceType === 'Under 18';
  const isEligible = answers.age === 'yes' && answers.citizenship === 'yes' && answers.residence === 'yes';

  const handleAnswer = (answer) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: answer }));
    setShowHint(false);
    
    // Progress calculation based on step
    setProgress(10 + ((currentStep + 1) * 15)); // 10 -> 25 -> 40 -> 55

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      setTimeout(() => setCurrentStep(questions.length), 300); // Move to results
    }
  };

  const handleNextPhase = () => {
    if (isEligible || isUnder18) {
      setPhase(2);
      navigate('/residence');
    } else {
      navigate('/');
    }
  };

  // Result screen logic
  if (currentStep === questions.length) {
    
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className="mx-auto w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} className="text-teal-600 dark:text-teal-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isUnder18 ? "You're on the right track!" : (isEligible ? "You are eligible to register!" : "Let's review your eligibility")}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            {isUnder18 
              ? "Since you're under 18, you can't vote yet, but you can apply in advance if you're 17+. Let's continue the journey so you know exactly what to do when the time comes."
              : (isEligible 
                  ? "Great news! Based on your answers, you meet the primary criteria for enrolling as a new voter using Form 6."
                  : "It looks like you might not meet all the standard criteria right now. However, let's continue to learn about the process and residency rules.")}
          </p>

          <button 
            onClick={handleNextPhase}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mx-auto ${(isEligible || isUnder18) ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
          >
            {(isEligible || isUnder18) ? "Continue to Residence & Mapping" : "Return to Home"} <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentStep];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {questions.map((q, idx) => (
            <div key={q.id} className="flex-1 relative">
              <div className={`h-2 rounded-full mx-1 ${idx <= currentStep ? 'bg-teal-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>
          ))}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center mt-4 uppercase tracking-wider">
          Step {currentStep + 1} of {questions.length}
        </p>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8 sm:p-12 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{question.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{question.description}</p>
            
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl flex gap-3 items-start">
              <Lightbulb className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-blue-800 dark:text-blue-200"><span className="font-bold">Did you know?</span> {question.didYouKnow}</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleAnswer('yes')}
                className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-800 dark:text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-sm"
              >
                Yes
              </button>
              <button 
                onClick={() => handleAnswer('no')}
                className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-800 dark:text-white text-lg font-bold py-5 rounded-2xl transition-all shadow-sm"
              >
                No
              </button>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => setShowHint(!showHint)}
                className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-2 hover:underline"
              >
                <Info size={18} /> Why does this matter?
              </button>
              
              <AnimatePresence>
                {showHint && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="bg-teal-50 dark:bg-teal-900/30 p-4 border border-teal-100 dark:border-teal-800 rounded-xl">
                      <p className="text-sm text-teal-800 dark:text-teal-200">
                        {question.hint}
                      </p>
                      <button 
                        onClick={() => setAIPanelOpen(true)}
                        className="mt-2 font-medium text-teal-600 dark:text-teal-400 cursor-pointer hover:underline text-left"
                      >
                        Ask AI about this rule →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Eligibility;

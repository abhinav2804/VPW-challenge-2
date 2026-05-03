import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Info, ArrowRight, Lightbulb } from 'lucide-react';
import { checkEligibility } from '../services/api';

const questions = [
  {
    id: 'age_years',
    title: 'Are you 18 years old or older?',
    description: 'You must be 18 years of age on or before the qualifying date (usually Jan 1st, April 1st, July 1st, or Oct 1st of the year).',
    didYouKnow: 'If you are 17+ you can still apply in advance, and your card will be issued once you turn 18!',
    hint: 'Age is the primary criteria. Without this, your name cannot be added to the electoral roll.',
  },
  {
    id: 'citizen',
    title: 'Are you an Indian Citizen?',
    description: 'Only citizens of India are eligible to be enrolled as voters.',
    didYouKnow: 'NRIs holding an Indian Passport can also register as overseas electors.',
    hint: 'You must possess valid Indian citizenship. Foreign nationals cannot vote.',
  },
  {
    id: 'resident_in_india',
    title: 'Are you ordinarily resident at the address you want to register?',
    description: 'You must be living at the address where you wish to cast your vote.',
    didYouKnow: 'Students living in hostels can choose to register at their hostel address or their native place.',
    hint: 'The Election Commission uses "ordinary residence" to map you to a specific polling booth.',
  }
];

const Eligibility = () => {
  const { setPhase, setProgress, audienceType, setAIPanelOpen, addXP } = useAppStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const isUnder18 = audienceType === 'Under 18';

  const handleAnswer = async (answer) => {
    const updatedAnswers = { ...answers, [questions[currentStep].id]: answer === 'yes' };
    setAnswers(updatedAnswers);
    setShowHint(false);
    
    // Progress calculation based on step
    setProgress(10 + ((currentStep + 1) * 15)); // 10 -> 25 -> 40 -> 55

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    } else {
      // Last question answered - call backend
      setLoading(true);
      setCurrentStep(questions.length);
      try {
        const eligibilityData = {
          ageYears: updatedAnswers.age_years ? 19 : 17, // Simplified for mock logic
          citizen: updatedAnswers.citizen,
          residentInIndia: updatedAnswers.resident_in_india,
          currentlyRegistered: false
        };
        const data = await checkEligibility(eligibilityData);
        setResult(data);
      } catch (error) {
        console.error("Eligibility check failed, using local fallback:", error);
        // Local fallback result
        const isEligibleLocal = updatedAnswers.age_years && updatedAnswers.citizen && updatedAnswers.resident_in_india;
        setResult({
          eligible: isEligibleLocal,
          summary: isEligibleLocal 
            ? "Based on your answers, you meet the primary ECI criteria for registration." 
            : "Based on your answers, you may not be eligible to register at this time.",
          reasons: [
            { text: updatedAnswers.age_years ? "Age criteria met" : "You must be 18+ to register", severity: updatedAnswers.age_years ? "info" : "warn" },
            { text: updatedAnswers.citizen ? "Citizenship verified" : "You must be an Indian citizen", severity: updatedAnswers.citizen ? "info" : "warn" },
            { text: updatedAnswers.resident_in_india ? "Residency verified" : "You must be a resident of the area", severity: updatedAnswers.resident_in_india ? "info" : "warn" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNextPhase = () => {
    if (result?.eligible || isUnder18) {
      addXP(50, 'Eligibility Criteria Met');
      setPhase(2);
      navigate('/residence');
    } else {
      navigate('/');
    }
  };

  // Result screen logic
  if (currentStep === questions.length) {
    if (loading) {
      return (
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Calculating your eligibility...</p>
        </div>
      );
    }
    
    const displayEligible = isUnder18 || result?.eligible;

    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${displayEligible ? 'bg-teal-100 dark:bg-teal-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
            <CheckCircle2 size={40} className={displayEligible ? "text-teal-600 dark:text-teal-400" : "text-red-600 dark:text-red-400"} />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isUnder18 ? "You're on the right track!" : (result?.eligible ? "You are eligible to register!" : "Let's review your eligibility")}
          </h2>
          
          <div className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            {isUnder18 
              ? "Since you're under 18, you can't vote yet, but you can apply in advance if you're 17+. Let's continue the journey so you know exactly what to do when the time comes."
              : result?.summary}
          </div>

          {result?.reasons && !isUnder18 && (
            <div className="mb-8 text-left space-y-3">
              {result.reasons.map((reason, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex items-center gap-3 ${reason.severity === 'warn' ? 'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-300' : 'bg-teal-50 border-teal-100 text-teal-800 dark:bg-teal-900/20 dark:border-teal-800/50 dark:text-teal-300'}`}>
                   <div className={`w-2 h-2 rounded-full ${reason.severity === 'warn' ? 'bg-red-500' : 'bg-teal-500'}`}></div>
                   <p className="text-sm font-medium">{reason.text}</p>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={handleNextPhase}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 mx-auto ${displayEligible ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
          >
            {displayEligible ? "Continue to Residence & Mapping" : "Return to Home"} <ArrowRight size={20} />
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

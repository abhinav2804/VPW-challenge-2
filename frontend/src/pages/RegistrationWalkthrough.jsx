import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, ExternalLink, Smartphone, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  { id: 1, title: 'Create Account', desc: 'Sign up on the official ECI portal.', action: 'Use mobile number and OTP to create your account.' },
  { id: 2, title: 'Choose Form 6', desc: 'Select "New Voter Registration".', action: 'Ensure you select Form 6, not Form 8 (which is for shifting).' },
  { id: 3, title: 'Personal Details', desc: 'Enter name, age, and relative info.', action: 'Type your name exactly as it appears on your age proof.' },
  { id: 4, title: 'Address Details', desc: 'Fill your ordinary residence address.', action: 'Upload your address proof and ensure the PIN code is correct.' },
  { id: 5, title: 'Upload Photo', desc: 'Upload a clear passport size photo.', action: 'Must be <2MB, facing forward, white background.' },
  { id: 6, title: 'Preview & Submit', desc: 'Review all details and submit.', action: 'Note down the Reference ID generated after submission.' }
];

const RegistrationWalkthrough = () => {
  const { setPhase, setProgress } = useAppStore();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const handleNextPhase = () => {
    setPhase(6);
    setProgress(90);
    navigate('/status');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-teal-700 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Official Portal Walkthrough</h1>
          <p className="text-teal-100 text-lg mb-8">Let's simulate the actual official Voter Portal so you know exactly what to click when you do it for real.</p>
          <div className="flex flex-wrap gap-4">
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" className="bg-white text-teal-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-lg">
              Open Official Portal <ExternalLink size={18} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.eci.citizen" target="_blank" rel="noreferrer" className="bg-teal-800/50 hover:bg-teal-800 text-white border border-teal-600 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
              Get Voter Helpline App <Smartphone size={18} />
            </a>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <MonitorPlay size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Nav List */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Process Steps</h3>
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-4 ${
                activeStep === step.id 
                  ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-500 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                activeStep === step.id ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
                {step.id}
              </div>
              <div>
                <h4 className={`font-bold ${activeStep === step.id ? 'text-teal-900 dark:text-teal-100' : 'text-gray-900 dark:text-white'}`}>{step.title}</h4>
              </div>
            </button>
          ))}
        </div>

        {/* Mock Portal View & Explanations */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm min-h-[300px] flex flex-col justify-center relative overflow-hidden"
            >
              {/* Fake Portal UI Background element */}
              <div className="absolute top-0 left-0 w-full h-12 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 text-xs text-gray-400 font-mono">voters.eci.gov.in / mock-view</div>
              </div>

              <div className="mt-8 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MonitorPlay size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{steps[activeStep-1].title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">{steps[activeStep-1].desc}</p>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/50 text-left flex gap-3 items-start">
                  <AlertTriangle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Action Required</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{steps[activeStep-1].action}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <button 
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1}
              className="px-6 py-2 rounded-xl font-medium text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Previous Step
            </button>
            {activeStep < 6 ? (
              <button 
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={handleNextPhase}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Continue <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationWalkthrough;

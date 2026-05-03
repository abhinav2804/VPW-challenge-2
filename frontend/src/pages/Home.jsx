import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, FileText, MousePointerClick } from 'lucide-react';

const Home = () => {
  const { setPhase, setProgress, audienceType, setAudienceType } = useAppStore();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!audienceType) {
      alert("Please select your age group to tailor your journey.");
      return;
    }
    setPhase(1);
    setProgress(10);
    navigate('/eligibility');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-12"
    >
      {/* Hero Mission Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-800 dark:to-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-teal-500/30">
        <div className="relative z-10 text-white max-w-2xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-semibold tracking-wide mb-6 border border-white/30 text-white shadow-sm">
              ✨ Interactive Guide
            </span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Learn how to register as a voter in India.
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 dark:text-gray-300 mb-8 font-medium">
            Based on official Election Commission of India guidelines. Understand eligibility, documents, and the exact steps to register.
          </p>

          {/* Audience Selector Chips */}
          <div className="mb-10">
            <p className="text-sm font-medium text-teal-100 mb-3">Select your age group to personalize the guide:</p>
            <div className="flex flex-wrap gap-3">
              {['Under 18', '18 - 20', '21+'].map((type) => (
                <button
                  key={type}
                  onClick={() => setAudienceType(type)}
                  className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
                    audienceType === type 
                      ? 'bg-yellow-400 text-yellow-900 shadow-md transform scale-105 ring-2 ring-yellow-400 ring-offset-2 ring-offset-teal-700' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:scale-105 hover:shadow-sm'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="bg-white text-teal-800 hover:bg-gray-50 px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              Start My Journey <MousePointerClick size={18} />
            </motion.button>
            <button 
              onClick={() => {
                setAudienceType('Under 18');
                setPhase(1);
                setProgress(10);
                navigate('/eligibility');
              }}
              className="px-8 py-3.5 rounded-xl font-medium text-white bg-teal-700/50 hover:bg-teal-700/80 border border-teal-500/50 backdrop-blur transition-all flex items-center gap-2 hover:scale-105"
            >
              I'm under 18, just teach me
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mission Preview Strip */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/eligibility" onClick={() => { setPhase(1); setProgress(10); }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="bg-blue-100 dark:bg-blue-900/50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <BookOpen size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Eligibility</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Understand who can register and ordinary residence rules.</p>
          </Link>
          
          <Link to="/checklist" onClick={() => { setPhase(4); setProgress(70); }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="bg-purple-100 dark:bg-purple-900/50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Forms & Docs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Know exactly what age and address proofs you need for Form 6.</p>
          </Link>

          <Link to="/walkthrough" onClick={() => { setPhase(5); setProgress(80); }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="bg-orange-100 dark:bg-orange-900/50 w-12 h-12 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
              <MousePointerClick size={24} />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Online Reg</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step walkthrough of the official ECI Voter Portal.</p>
          </Link>
        </div>

        {/* Intro Video Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Watch Quick Guide</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">A short overview directly from the Election Commission of India.</p>
          </div>
          
          <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-inner">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/TAAc2-IXyq4" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;

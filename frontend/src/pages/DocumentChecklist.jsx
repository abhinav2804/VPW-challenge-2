import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, ChevronDown, ChevronUp, FileText, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getDocumentChecklist } from '../services/api';

const DEFAULT_CHECKLIST = [
  {
    id: 'photo',
    title: 'Passport Size Photograph',
    subtitle: 'Recent colored photograph with light background.',
    options: ['Must show full face directly facing the camera', 'No dark glasses or tinted lenses', 'White/Off-white background preferred']
  },
  {
    id: 'ageProof',
    title: 'Proof of Age',
    subtitle: 'Required primarily if you are between 18-21 years of age.',
    options: ['Birth Certificate issued by Municipal Authority', 'Class X / XII Certificate containing birth date', 'Indian Passport', 'PAN Card', 'Driving License', 'Aadhaar Card']
  },
  {
    id: 'addressProof',
    title: 'Proof of Ordinary Residence',
    subtitle: 'Must be in the name of the applicant or their parents.',
    options: ['Water/Electricity/Gas Bill (recent 1 year)', 'Aadhaar Card', 'Current Passbook of Nationalized Bank/Post Office', 'Indian Passport', 'Registered Rent Agreement']
  },
  {
    id: 'relativeDetails',
    title: 'Relative Details',
    subtitle: 'EPIC number of a family member already enrolled.',
    options: ["Father, Mother, Husband, or Guardian's voter ID number", "Helps in keeping the family's polling station same"]
  }
];

const DEFAULT_FAQS = [
  { q: "Is Aadhaar strictly mandatory?", a: "No. You can provide your Aadhaar number voluntarily. If you don't have it, you can select 'I am not able to furnish my Aadhaar Number' on the form and use other documents." },
  { q: "Can I use an un-registered rent agreement?", a: "Generally, ECI prefers a Registered Rent Agreement. If unregistered, BLO verification at the residence might be strictly conducted." },
  { q: "What if my age proof doesn't match my address proof?", a: "That is completely fine. Age proof verifies your date of birth, while address proof verifies where you live. They serve two different purposes." }
];

const DocumentChecklist = () => {
  const { setPhase, setProgress, setAIPanelOpen, addXP } = useAppStore();
  const navigate = useNavigate();
  
  const [checkedItems, setCheckedItems] = useState({});
  const [checklistSections, setChecklistSections] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const data = await getDocumentChecklist();
        if (data && data.categories) {
          const sections = data.categories.map(cat => ({
            id: cat.id,
            title: cat.title,
            subtitle: "Required for registration",
            options: cat.items.map(item => `${item.text}: ${item.description}`)
          }));
          setChecklistSections(sections);
          
          const initialChecked = {};
          sections.forEach(s => initialChecked[s.id] = false);
          setCheckedItems(initialChecked);
          
          if (data.faqs) setFaqs(data.faqs);
          else setFaqs(DEFAULT_FAQS);
        } else {
          setChecklistSections(DEFAULT_CHECKLIST);
          setFaqs(DEFAULT_FAQS);
          const initialChecked = {};
          DEFAULT_CHECKLIST.forEach(s => initialChecked[s.id] = false);
          setCheckedItems(initialChecked);
        }
      } catch (err) {
        console.error("Failed to fetch checklist, using fallback:", err);
        setChecklistSections(DEFAULT_CHECKLIST);
        setFaqs(DEFAULT_FAQS);
        const initialChecked = {};
        DEFAULT_CHECKLIST.forEach(s => initialChecked[s.id] = false);
        setCheckedItems(initialChecked);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, []);

  const totalItems = Object.keys(checkedItems).length;
  const completedItems = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const toggleItem = (key) => {
    setCheckedItems(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      const newCompleted = Object.values(newState).filter(Boolean).length;
      
      if (!prev[key]) {
        addXP(20, 'Document Prepared');
      }

      if (newCompleted === totalItems && !prev[key]) {
        triggerConfetti();
        addXP(100, 'Backpack Ready!');
      }
      return newState;
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0D9488', '#F59E0B', '#14B8A6']
    });
  };

  const handleNextPhase = () => {
    setPhase(5);
    setProgress(80);
    navigate('/walkthrough');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Gathering official requirements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header & Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Prepare Your Backpack</h1>
          <p className="text-gray-600 dark:text-gray-300">Gather these documents before opening the official portal.</p>
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">Readiness Score</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', bounce: 0 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {checklistSections.map(section => (
            <div key={section.id} className={`bg-white dark:bg-gray-800 rounded-2xl border transition-colors ${checkedItems[section.id] ? 'border-teal-500 shadow-sm' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {checkedItems[section.id] && <CheckCircle2 className="text-teal-500" size={20} />}
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{section.subtitle}</p>
                    <div className="space-y-2">
                      {section.options.map((opt, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 flex-shrink-0" />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => toggleItem(section.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      checkedItems[section.id] 
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {checkedItems[section.id] ? (
                      <><Check size={16} /> Ready</>
                    ) : (
                      'Mark as ready'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {progressPercent === 100 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
              <button onClick={handleNextPhase} className="w-full bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2 text-lg">
                Start Portal Walkthrough <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </div>

        {/* FAQs & Info */}
        <div className="space-y-6">
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl border border-orange-100 dark:border-orange-800/50">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="text-orange-600 dark:text-orange-400" size={20} />
              Common Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-orange-100 dark:border-orange-800/30">
                  <button 
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-left font-medium text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {faq.q}
                    {expandedFaq === idx ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <p className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-50 dark:border-gray-700/50">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setAIPanelOpen(true)}
              className="w-full mt-6 text-sm font-bold text-orange-700 dark:text-orange-400 border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-800/50 py-3 rounded-xl transition-colors"
            >
              Ask AI about Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentChecklist;

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, FileCheck, User, Camera, MapPin, Eye, Smartphone, Keyboard, AlertTriangle, ArrowRight } from 'lucide-react';
import { getRegistrationSteps } from '../services/api';

// Sub-components
import { WalkthroughHeader } from '../components/walkthrough/WalkthroughHeader';
import { SimulatorUI } from '../components/walkthrough/SimulatorUI';

const DEFAULT_STEPS = [
  { 
    id: 1, 
    title: 'Create Account', 
    desc: 'The journey starts at the ECI Voter Portal or the Helpline App.', 
    action: 'Enter your mobile number and the OTP sent to you. Keep your phone handy!',
    videoUrl: 'https://www.youtube.com/embed/TAAc2-IXyq4',
    icon: 'Smartphone'
  },
  { 
    id: 2, 
    title: 'Choose Form 6', 
    desc: 'Select the right form for new voter registration.', 
    action: 'Look for "New Voter Registration" or "Form 6". Do not confuse it with Form 8 (shifting) or Form 7 (deletion).',
    videoUrl: 'https://www.youtube.com/embed/S2k2YwQZkY8',
    icon: 'FileCheck'
  },
  { 
    id: 3, 
    title: 'Personal Details', 
    desc: 'Enter your basic information exactly as it appears on your ID documents.', 
    action: 'Ensure your First Name and Surname match your Age Proof (e.g., Aadhaar or Class 10 Certificate).',
    videoUrl: 'https://www.youtube.com/embed/TAAc2-IXyq4?start=45',
    icon: 'User'
  },
  { 
    id: 4, 
    title: 'Address Details', 
    desc: 'Provide your current "Ordinary Residence" address.', 
    action: 'The PIN code determines your Assembly Constituency. Check it twice!',
    videoUrl: 'https://www.youtube.com/embed/TAAc2-IXyq4?start=90',
    icon: 'MapPin'
  },
  { 
    id: 5, 
    title: 'Upload Documents', 
    desc: 'Digital upload of your photo and proof documents.', 
    action: 'Photo must be <2MB, facing forward, white background. Age and Address proofs must be clear scans.',
    videoUrl: 'https://www.youtube.com/embed/S2k2YwQZkY8?start=120',
    icon: 'Camera'
  },
  { 
    id: 6, 
    title: 'Preview & Submit', 
    desc: 'Review your generated Form 6 before final submission.', 
    action: 'Wait for the Reference ID! This is your only way to track your application later.',
    videoUrl: 'https://www.youtube.com/embed/TAAc2-IXyq4?start=180',
    icon: 'Eye'
  }
];

const iconMap = {
  Smartphone: <Smartphone size={24} />,
  FileCheck: <FileCheck size={24} />,
  User: <User size={24} />,
  MapPin: <MapPin size={24} />,
  Camera: <Camera size={24} />,
  Eye: <Eye size={24} />,
  MonitorPlay: <MonitorPlay size={24} />
};

const RegistrationWalkthrough = () => {
  const { setPhase, setProgress, setAIPanelOpen, addXP, audienceType } = useAppStore();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [channel, setChannel] = useState('portal');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', mobile: '', otp: '', pin: '', relativeName: '', address: ''
  });

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      try {
        const data = await getRegistrationSteps(channel);
        const sourceSteps = (data?.steps?.length > 0) ? data.steps : DEFAULT_STEPS;
        setSteps(sourceSteps.map(s => ({
          ...s,
          id: s.stepNumber || s.id,
          icon: iconMap[s.icon] || <FileCheck size={24} />
        })));
      } catch (err) {
        setSteps(DEFAULT_STEPS.map(s => ({ ...s, icon: iconMap[s.icon] || <FileCheck size={24} /> })));
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [channel]);

  const handleStepChange = (newStep) => {
    if (newStep > activeStep && !completedSteps.includes(activeStep)) {
      addXP(40, `Step ${activeStep} Training Complete`);
      setCompletedSteps([...completedSteps, activeStep]);
    }
    setActiveStep(newStep);
  };

  const handleNextPhase = () => {
    addXP(100, 'Portal Mission Success');
    setPhase(6);
    setProgress(90);
    navigate('/status');
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto mt-20 text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium italic">Preparing your mission brief...</p>
    </div>
  );

  const currentStepData = steps[activeStep - 1] || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <WalkthroughHeader audienceType={audienceType} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Keyboard className="text-teal-600" size={18} />
            <h3 className="font-black text-gray-400 text-xs uppercase tracking-widest">Mission Progress</h3>
          </div>
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => handleStepChange(step.id)}
              className={`w-full text-left p-5 rounded-[1.5rem] transition-all duration-300 border-2 flex items-center gap-5 group ${
                activeStep === step.id 
                  ? 'bg-teal-600 border-teal-500 shadow-xl shadow-teal-500/20 translate-x-2' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                activeStep === step.id ? 'bg-white text-teal-600 rotate-12 scale-110' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <div>
                <h4 className={`font-black text-sm tracking-tight ${activeStep === step.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{step.title}</h4>
                <p className={`text-[10px] font-bold ${activeStep === step.id ? 'text-teal-100' : 'text-gray-400'}`}>Step {step.id} of 6</p>
              </div>
            </button>
          ))}
          <div className="pt-8">
            <button onClick={() => setAIPanelOpen(true)} className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] bg-orange-100/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border-2 border-dashed border-orange-200 font-black hover:bg-orange-100 transition-all group">
              <MonitorPlay className="group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-tighter">Need live AI help?</span>
            </button>
          </div>
        </div>

        {/* Simulator View */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeStep} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border-2 border-gray-100 dark:border-gray-700 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-14 bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-100 dark:border-gray-700 flex items-center px-6 gap-3">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400 shadow-inner"></div><div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner"></div><div className="w-3 h-3 rounded-full bg-green-400 shadow-inner"></div></div>
                <div className="flex-1 max-w-sm mx-auto h-7 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <span className="text-[10px] text-gray-400 font-mono truncate tracking-tight">https://voters.eci.gov.in/registration/step-{activeStep}</span>
                </div>
              </div>

              <div className="mt-16 flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{currentStepData.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{currentStepData.desc}</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2rem] shadow-lg relative">
                    <div className="absolute -top-3 -left-3 bg-teal-600 text-white text-[10px] font-black px-4 py-1.5 rounded-xl shadow-lg">LIVE SIMULATION</div>
                    <SimulatorUI activeStep={activeStep} formData={formData} setFormData={setFormData} isPhotoUploaded={isPhotoUploaded} setIsPhotoUploaded={setIsPhotoUploaded} />
                  </div>
                  <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[1.5rem] border-2 border-amber-100 dark:border-amber-900/50 flex gap-5 items-start">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={28} />
                    <div><h4 className="font-black text-amber-900 dark:text-amber-400 text-sm uppercase tracking-widest">Official Rule</h4><p className="text-amber-800/80 dark:text-amber-300 mt-1 leading-relaxed font-bold text-sm">{currentStepData.action}</p></div>
                  </div>
                </div>

                <div className="w-full lg:w-72 space-y-6">
                  {currentStepData.videoUrl ? (
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-700">
                        <iframe width="100%" height="100%" src={currentStepData.videoUrl.replace('watch?v=', 'embed/')} title="Walkthrough Guide" frameBorder="0" allowFullScreen></iframe>
                      </div>
                      <p className="mt-3 text-[10px] text-center font-black text-gray-400 uppercase tracking-widest">Official Guide Video</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                      <MonitorPlay className="text-gray-300 mb-2" size={40} /><p className="text-[10px] font-bold text-gray-400 italic">No video for this step.</p>
                    </div>
                  )}
                  <div className="p-5 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800">
                    <h5 className="text-[10px] font-black text-teal-800 dark:text-teal-400 uppercase mb-2">Pro Tip</h5>
                    <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">Use Tab key to navigate fields quickly.</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10 flex justify-between items-center border-t-2 border-gray-50 dark:border-gray-700/50">
                <button onClick={() => handleStepChange(Math.max(1, activeStep - 1))} disabled={activeStep === 1} className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 disabled:opacity-20 hover:bg-gray-100 transition-all">Back</button>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex gap-1">{steps.map(s => (<div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${activeStep === s.id ? 'w-8 bg-teal-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}></div>))}</div>
                  {activeStep < 6 ? (
                    <button onClick={() => handleStepChange(activeStep + 1)} className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-500/30 hover:scale-105">Next Step</button>
                  ) : (
                    <button onClick={handleNextPhase} className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-500/30 hover:scale-105 flex items-center gap-2">SUBMIT MISSION <ArrowRight size={18} /></button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RegistrationWalkthrough;

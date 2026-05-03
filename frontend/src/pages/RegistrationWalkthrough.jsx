import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MonitorPlay, ExternalLink, Smartphone, AlertTriangle, ArrowRight, FileCheck, Upload, User, Camera, MapPin, Eye, Keyboard } from 'lucide-react';
import { getRegistrationSteps } from '../services/api';

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
  const [channel, setChannel] = useState('portal'); // 'portal' or 'app'
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      try {
        const data = await getRegistrationSteps(channel);
        if (data && data.steps && data.steps.length > 0) {
          setSteps(data.steps.map(s => ({
            ...s,
            id: s.stepNumber || s.id,
            icon: iconMap[s.icon] || <FileCheck size={24} />
          })));
        } else {
          setSteps(DEFAULT_STEPS.map(s => ({
            ...s,
            id: s.id,
            icon: iconMap[s.icon] || <FileCheck size={24} />
          })));
        }
      } catch (err) {
        console.error("Failed to fetch steps, using fallback:", err);
        setSteps(DEFAULT_STEPS.map(s => ({
          ...s,
          id: s.id,
          icon: iconMap[s.icon] || <FileCheck size={24} />
        })));
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    otp: '',
    pin: '',
    relativeName: '',
    address: ''
  });

  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);

  const handleNextPhase = () => {
    addXP(100, 'Portal Mission Success');
    setPhase(6);
    setProgress(90);
    navigate('/status');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium italic">Preparing your mission brief...</p>
      </div>
    );
  }

  const currentStepData = steps[activeStep - 1] || {};

  const renderMockUI = () => {
    switch(activeStep) {
      case 1:
        return (
          <div className="space-y-4 max-w-xs mx-auto">
            <div className="text-left">
              <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
              <input 
                type="text" 
                placeholder="98765 43210" 
                className="w-full mt-1 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              />
            </div>
            <div className="text-left">
              <label className="text-xs font-bold text-gray-500 uppercase">Enter OTP</label>
              <div className="flex gap-2 mt-1">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="w-10 h-10 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-teal-600 font-bold">
                    {formData.otp[i-1] || ''}
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold shadow-md">Verify & Login</button>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border-2 border-teal-500 bg-teal-50 dark:bg-teal-900/20 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-[10px] font-bold rounded-bl-xl">POPULAR</div>
              <FileCheck className="mx-auto mb-2 text-teal-600" size={32} />
              <h4 className="font-bold text-teal-900 dark:text-teal-100 text-sm">New Voter Registration</h4>
              <p className="text-[10px] text-teal-700 dark:text-teal-400 mt-1">(Form 6)</p>
            </div>
            <div className="p-4 border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl text-center opacity-40 grayscale">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-200 rounded-full"></div>
              <h4 className="font-bold text-gray-400 text-sm">Shifting / Correction</h4>
              <p className="text-[10px] text-gray-400 mt-1">(Form 8)</p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">First Name</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
                  placeholder="Rahul"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Surname</label>
                <input 
                  type="text" 
                  className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
                  placeholder="Kumar"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Father/Mother Name</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm" 
                placeholder="Ramesh Kumar"
                value={formData.relativeName}
                onChange={(e) => setFormData({...formData, relativeName: e.target.value})}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-3 text-left">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">PIN Code</label>
              <input 
                type="text" 
                className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono" 
                placeholder="110001"
                value={formData.pin}
                onChange={(e) => setFormData({...formData, pin: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">Full House Address</label>
              <textarea 
                className="w-full mt-1 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm h-20" 
                placeholder="House No 123, Sector 4..."
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div 
              onClick={() => setIsPhotoUploaded(true)}
              className={`border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
                isPhotoUploaded 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : 'border-teal-200 dark:border-teal-800 hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/10'
              }`}
            >
              {isPhotoUploaded ? (
                <>
                  <div className="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-md border border-green-500 flex items-center justify-center overflow-hidden">
                    <User className="text-gray-400" size={32} />
                  </div>
                  <p className="text-xs font-bold text-green-600">photo_final.jpg uploaded!</p>
                </>
              ) : (
                <>
                  <Upload className="text-teal-600" size={32} />
                  <p className="text-xs font-medium text-gray-500">Click to upload Passport Photo (Max 2MB)</p>
                </>
              )}
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-xl flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-500 uppercase">Age Proof</span>
              <div className="w-24 h-2 bg-teal-600 rounded-full"></div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="bg-stone-50 dark:bg-gray-900 p-6 rounded-2xl border-2 border-stone-200 dark:border-gray-700 shadow-inner">
            <div className="text-[10px] font-bold text-stone-400 uppercase border-b border-stone-200 pb-2 mb-4 text-center">FORM 6 - APPLICATION FOR ENROLMENT</div>
            <div className="space-y-3 text-left">
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-[8px] font-bold text-stone-400">APPLICANT NAME:</span>
                <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.firstName || 'Rahul'} {formData.lastName || 'Kumar'}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-[8px] font-bold text-stone-400">RELATIVE NAME:</span>
                <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.relativeName || 'Ramesh Kumar'}</span>
              </div>
              <div className="flex justify-between border-b border-stone-100 pb-1">
                <span className="text-[8px] font-bold text-stone-400">ADDRESS PIN:</span>
                <span className="text-[10px] font-bold text-stone-800 dark:text-stone-200">{formData.pin || '110001'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[8px] font-bold text-stone-400">DOCS ATTACHED:</span>
                <span className="text-[10px] font-bold text-green-600">PHOTO, AGE_PROOF, ADDR_PROOF</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-12 h-12 border border-stone-200 rounded flex items-center justify-center text-[8px] text-stone-300 font-mono italic">Signature</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-indigo-900 rounded-[2.5rem] p-8 sm:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-white/30">Simulator 1.0</span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight italic">
              {audienceType === 'Under 18' ? 'Learning for the Future.' : (audienceType === '18 - 20' ? 'First-Time Voter Mission.' : 'Voter Duty Training.')}
            </h1>
            <p className="text-teal-50/80 text-lg mb-10 font-medium">
              {audienceType === 'Under 18' 
                ? 'Get a head start! Learn the official registration process so you are ready to lead the nation when you turn 18.'
                : 'Welcome to your first mission. We have simplified the ECI registration into 6 easy steps. Complete them to get your Pro Voter badge.'}
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-4">
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noreferrer" className="bg-white text-teal-900 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
              GO TO OFFICIAL PORTAL <ExternalLink size={20} />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.eci.citizen" target="_blank" rel="noreferrer" className="bg-teal-950/40 hover:bg-teal-950/60 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 transition-all backdrop-blur-sm">
              MOBILE APP <Smartphone size={20} />
            </a>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <MonitorPlay size={400} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step Nav List (Left Column) */}
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
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-900'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${
                activeStep === step.id ? 'bg-white text-teal-600 rotate-12 scale-110' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30'
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
            <button 
              onClick={() => setAIPanelOpen(true)}
              className="w-full flex flex-col items-center justify-center gap-2 p-6 rounded-[2rem] bg-orange-100/50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-400 border-2 border-dashed border-orange-200 dark:border-orange-800/50 font-black hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all group"
            >
              <MonitorPlay className="group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-tighter">Need live AI help?</span>
            </button>
          </div>
        </div>

        {/* Mock Portal View (Main Content) */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border-2 border-gray-100 dark:border-gray-700 shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden"
            >
              {/* Browser Header Bar */}
              <div className="absolute top-0 left-0 w-full h-14 bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-100 dark:border-gray-700 flex items-center px-6 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner"></div>
                </div>
                <div className="flex-1 max-w-sm mx-auto h-7 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <span className="text-[10px] text-gray-400 font-mono truncate tracking-tight">https://voters.eci.gov.in/registration/step-{activeStep}</span>
                </div>
              </div>

              <div className="mt-16 flex flex-col lg:flex-row gap-10">
                {/* Left: Interactive Mock UI */}
                <div className="flex-1">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{currentStepData.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{currentStepData.desc}</p>
                  </div>

                  <div className="p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-[2rem] shadow-lg relative">
                    <div className="absolute -top-3 -left-3 bg-teal-600 text-white text-[10px] font-black px-4 py-1.5 rounded-xl shadow-lg">LIVE SIMULATION</div>
                    {renderMockUI()}
                  </div>

                  <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[1.5rem] border-2 border-amber-100 dark:border-amber-900/50 flex gap-5 items-start">
                    <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" size={28} />
                    <div>
                      <h4 className="font-black text-amber-900 dark:text-amber-400 text-sm uppercase tracking-widest">Official Rule</h4>
                      <p className="text-amber-800/80 dark:text-amber-300 mt-1 leading-relaxed font-bold text-sm">{currentStepData.action}</p>
                    </div>
                  </div>
                </div>

                {/* Right: Video / Meta Info */}
                <div className="w-full lg:w-72 space-y-6">
                  {currentStepData.videoUrl ? (
                    <div className="group relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-700">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={currentStepData.videoUrl.replace('watch?v=', 'embed/')} 
                          title="Walkthrough Guide" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <p className="mt-3 text-[10px] text-center font-black text-gray-400 uppercase tracking-widest">Official Guide Video</p>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center">
                      <MonitorPlay className="text-gray-300 mb-2" size={40} />
                      <p className="text-[10px] font-bold text-gray-400 italic">No video for this step. Focus on the form simulation!</p>
                    </div>
                  )}

                  <div className="p-5 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-100 dark:border-teal-800">
                    <h5 className="text-[10px] font-black text-teal-800 dark:text-teal-400 uppercase mb-2">Pro Tip</h5>
                    <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">Use your Tab key to navigate fields quickly just like on the real portal.</p>
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="mt-auto pt-10 flex justify-between items-center border-t-2 border-gray-50 dark:border-gray-700/50">
                <button 
                  onClick={() => handleStepChange(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                  className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 disabled:opacity-20 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
                >
                  Back
                </button>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex gap-1">
                    {steps.map(s => (
                      <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${activeStep === s.id ? 'w-8 bg-teal-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}></div>
                    ))}
                  </div>
                  {activeStep < 6 ? (
                    <button 
                      onClick={() => handleStepChange(activeStep + 1)}
                      className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-500/30 hover:scale-105"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      onClick={handleNextPhase}
                      className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-500/30 hover:scale-105 flex items-center gap-2"
                    >
                      SUBMIT MISSION <ArrowRight size={18} />
                    </button>
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Download, CheckCircle, Clock, FileWarning, ArrowRight } from 'lucide-react';
import { getStatusStages } from '../services/api';

const DEFAULT_STAGES = [
  { label: 'Submitted', desc: 'Form 6 submitted online.', icon: 'CheckCircle' },
  { label: 'BLO Appointed', desc: 'Booth Level Officer assigned for verification.', icon: 'Clock' },
  { label: 'Field Verified', desc: 'BLO visits residence to verify details.', icon: 'MapPin' },
  { label: 'Accepted', desc: 'ERO accepts the application.', icon: 'CheckCircle' },
  { label: 'EPIC Generated', desc: 'Voter ID number assigned.', icon: 'CheckCircle' }
];

const iconMap = {
  CheckCircle: <CheckCircle size={16} />,
  Clock: <Clock size={16} />,
  MapPin: <MapPin size={16} />
};

const StatusNextSteps = () => {
  const { setPhase, setProgress } = useAppStore();
  const navigate = useNavigate();
  const [refNum, setRefNum] = useState('');
  const [statusStep, setStatusStep] = useState(0); // 0: None, 1: Submitted, 2: Verified, 3: Accepted, 4: EPIC Generated
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const data = await getStatusStages();
        if (data && data.stages && data.stages.length > 0) {
          setTimelineSteps(data.stages.map(s => ({
            ...s,
            icon: iconMap[s.icon] || <CheckCircle size={16} />
          })));
        } else {
          setTimelineSteps(DEFAULT_STAGES.map(s => ({
            ...s,
            icon: iconMap[s.icon] || <CheckCircle size={16} />
          })));
        }
      } catch (err) {
        console.error("Failed to fetch status stages, using fallback:", err);
        setTimelineSteps(DEFAULT_STAGES.map(s => ({
          ...s,
          icon: iconMap[s.icon] || <CheckCircle size={16} />
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchStages();
  }, []);

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!refNum) return;
    if (statusStep < timelineSteps.length - 1) setStatusStep(s => s + 1);
  };

  const handleNextPhase = () => {
    setPhase(7);
    setProgress(95);
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto mt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Connecting to ECI tracker...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Track Your Status</h1>
        <p className="text-gray-600 dark:text-gray-300">After submitting Form 6, you will receive a Reference ID via SMS. Let's simulate how you can use it to track your application.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Simulator Panel */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Status Tracker Simulator</h2>
          
          <form onSubmit={handleSimulate} className="flex gap-2 mb-8">
            <input 
              type="text" 
              value={refNum}
              onChange={e => setRefNum(e.target.value)}
              placeholder="Enter mock Ref ID (e.g., O12345)" 
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 rounded-xl font-bold transition-colors">
              Track
            </button>
          </form>

          {statusStep > 0 && (
            <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 dark:before:via-gray-700 before:to-transparent">
              {timelineSteps.map((step, idx) => {
                const isActive = idx <= statusStep;
                return (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${isActive ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                      {step.icon}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shadow-sm">
                      <div className={`font-bold ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>{step.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <p className="text-xs text-center text-gray-400 mt-6">Tip: Click 'Track' multiple times to advance the simulation state.</p>
        </div>

        {/* Next Steps List */}
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What happens next?</h2>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-xl"><Search size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Check Electoral Roll</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Once accepted, your name will be added to the official voter list (Electoral Roll).</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-3 rounded-xl"><Download size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Download e-EPIC</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">You can download a digital PDF version of your Voter ID from the portal immediately after generation.</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 p-3 rounded-xl"><FileWarning size={20} /></div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Physical Card Delivery</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">The physical PVC Voter ID card will be delivered to your registered address via Speed Post.</p>
                </div>
              </div>
            </div>

            <button onClick={handleNextPhase} className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold transition-colors shadow-lg flex items-center justify-center gap-2">
              Ready for the Final Quiz <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusNextSteps;

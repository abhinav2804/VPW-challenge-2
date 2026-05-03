import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronRight, ChevronLeft, Phone, Navigation, ArrowRight, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';
import { getResidenceExamples, getDelhiCentres } from '../services/api';

const DEFAULT_SLIDES = [
  { title: "What is Ordinary Residence?", desc: "It means the place where you normally live and sleep. You can only be registered at one place." },
  { title: "What if you study in a hostel?", desc: "Students can choose to register either at their hostel address (with a declaration) or at their parents' house." },
  { title: "What if you moved recently?", desc: "If you shift to a new constituency, you must register there and get your name deleted from the old place." }
];

const DEFAULT_CENTRES = [
  { id: 1, name: "AERO Office - Burari", address: "Govt Boys Senior Secondary School, Burari, Delhi", phone: "011-27612345", pin: "110084" },
  { id: 2, name: "Voter Centre - Mukharjee Nagar", address: "Community Hall, Near Batra Cinema, Delhi", phone: "011-27654321", pin: "110009" },
  { id: 3, name: "AERO Office - Saket", address: "MCD School, Block J, Saket, New Delhi", phone: "011-26512345", pin: "110017" }
];

const ResidenceMaps = () => {
  const { setPhase, setProgress, addXP } = useAppStore();
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(DEFAULT_CENTRES);
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_CENTRES[0]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const data = await getResidenceExamples();
        if (data && data.examples) {
          setSlides(data.examples.map(ex => ({ title: ex.title, desc: ex.description })));
        }
      } catch (err) {
        console.error("Failed to fetch residence examples, using fallback:", err);
        setSlides(DEFAULT_SLIDES);
      }
    };
    fetchExamples();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const data = await getDelhiCentres({ q: searchQuery });
      if (data && data.centres && data.centres.length > 0) {
        setSearchResults(data.centres);
        setSelectedLocation(data.centres[0]);
      } else {
        // Local fallback filter
        const filtered = DEFAULT_CENTRES.filter(l => l.pin.includes(searchQuery) || l.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(filtered);
        if (filtered.length > 0) setSelectedLocation(filtered[0]);
      }
    } catch (err) {
      console.error("Search failed, using local filter:", err);
      const filtered = DEFAULT_CENTRES.filter(l => l.pin.includes(searchQuery) || l.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filtered);
      if (filtered.length > 0) setSelectedLocation(filtered[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPhase = () => {
    addXP(50, 'Residency Rules Learned');
    setPhase(4);
    setProgress(70);
    navigate('/checklist');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Explainer Carousel */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 relative overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Understanding Residence Rules</h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-h-[120px]"
              >
                <h3 className="font-semibold text-lg text-teal-600 dark:text-teal-400 mb-2">{slides[slide].title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{slides[slide].desc}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center mt-6">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div key={i} className={`h-2 w-2 rounded-full ${i === slide ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSlide(s => (s === 0 ? slides.length - 1 : s - 1))} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button onClick={() => setSlide(s => (s === slides.length - 1 ? 0 : s + 1))} className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Map Search */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find your local Voter Centre</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your Delhi PIN code or area to see sample AERO offices.</p>
            
            <form onSubmit={handleSearch} className="relative mb-6">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. 110084 or Saket" 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-xl py-3 pl-4 pr-12 text-gray-900 dark:text-white transition-all outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
                <Search size={18} />
              </button>
            </form>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent mb-2"></div>
                  <p className="text-sm">Searching centres...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  {searchQuery ? "No sample centres found for this area." : "Search by PIN or area name above."}
                </p>
              ) : (
                searchResults.map(loc => (
                  <div 
                    key={loc.id} 
                    onClick={() => setSelectedLocation(loc)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedLocation?.id === loc.id 
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-sm' 
                        : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className={`mt-0.5 ${selectedLocation?.id === loc.id ? 'text-teal-600' : 'text-gray-400'}`} size={20} />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{loc.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{loc.address}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8 flex flex-col">
          {/* Map & Detail Sheet */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
            <div className="h-64 sm:h-80 w-full bg-gray-200 dark:bg-gray-700 relative">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" style={{ border: 0 }} 
                src={`https://www.google.com/maps?q=${encodeURIComponent(selectedLocation?.address || 'Delhi')}&output=embed`} 
                allowFullScreen
              ></iframe>
            </div>
            {selectedLocation && (
              <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{selectedLocation.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{selectedLocation.address}</p>
                <div className="flex flex-wrap gap-3">
                  <a href={`tel:${selectedLocation.phone}`} className="flex-1 flex justify-center items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                    <Phone size={16} /> {selectedLocation.phone}
                  </a>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(selectedLocation.address)}`} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm">
                    <Navigation size={16} /> Directions
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Card */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-3xl p-6 border border-orange-100 dark:border-orange-800/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="text-orange-600 dark:text-orange-400" size={20} />
                <h3 className="font-bold text-gray-900 dark:text-white">Scenario Check</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">Ravi studies in Delhi but his home is in Jaipur. Where can he register as a voter?</p>
              
              {!quizAnswered ? (
                <div className="space-y-2">
                  <button onClick={() => setQuizAnswered('delhi')} className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 hover:border-orange-400 transition-colors text-sm font-medium dark:text-white">Only in Delhi (Hostel)</button>
                  <button onClick={() => setQuizAnswered('jaipur')} className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 hover:border-orange-400 transition-colors text-sm font-medium dark:text-white">Only in Jaipur (Home)</button>
                  <button onClick={() => { setQuizAnswered('either'); addXP(30, 'Scenario Mastered'); }} className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 hover:border-orange-400 transition-colors text-sm font-medium dark:text-white">He can choose either Delhi or Jaipur (but not both)</button>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-200 dark:border-green-800/50">
                  <div className={`flex items-center gap-2 font-bold mb-2 ${quizAnswered === 'either' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {quizAnswered === 'either' ? <CheckCircle2 size={18} /> : <XCircle size={18} />} 
                    {quizAnswered === 'either' ? 'Correct!' : 'Actually...'}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As per ECI rules, a student living in a hostel can choose to be registered at their native place or at their hostel address (by providing a declaration). They cannot be registered at both places simultaneously.
                  </p>
                  <button onClick={handleNextPhase} className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 text-sm">
                    Move to Document Checklist <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidenceMaps;

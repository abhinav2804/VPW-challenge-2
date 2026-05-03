import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, PhoneCall, ShieldAlert, Heart } from 'lucide-react';
import { getSources } from '../services/api';

const DEFAULT_SOURCES = [
  { 
    title: "Guidelines for Form 6", 
    url: "https://voters.eci.gov.in/guidelines/Form-6_en.pdf",
    description: "Official ECI PDF containing all rules."
  },
  { 
    title: "Voters Service Portal", 
    url: "https://voters.eci.gov.in/",
    description: "The official site to submit your application."
  },
  { 
    title: "CEO Delhi Website", 
    url: "https://ceodelhi.gov.in/",
    description: "State specific guidelines and AERO lists."
  }
];

const HelpSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const data = await getSources();
        if (data && data.sources && data.sources.length > 0) {
          setSources(data.sources);
        } else {
          setSources(DEFAULT_SOURCES);
        }
      } catch (err) {
        console.error("Failed to fetch sources, using fallback:", err);
        setSources(DEFAULT_SOURCES);
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading official references...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Official Sources & Help</h1>
        <p className="text-gray-600 dark:text-gray-300">All information in this guide is derived directly from the Election Commission of India.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sources List */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="text-teal-600" /> Reference Documents
          </h2>
          <div className="space-y-4">
            {sources.map((source, idx) => (
              <a key={idx} href={source.url} target="_blank" rel="noreferrer" className="block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-gray-200 dark:border-gray-700 transition-colors group">
                <h3 className="font-bold text-gray-900 dark:text-white flex justify-between items-center text-sm">
                  {source.title} <ExternalLink size={16} className="text-gray-400 group-hover:text-teal-600" />
                </h3>
                <p className="text-[11px] text-gray-500 mt-1">{source.description}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {/* Helpline Card */}
          <div className="bg-teal-600 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <PhoneCall /> Voter Helpline
              </h2>
              <p className="text-teal-100 mb-6 text-sm">For any official queries, you can dial the national toll-free helpline.</p>
              <div className="text-5xl font-black mb-2 tracking-wider">1950</div>
              <p className="text-teal-200 text-xs">(Please add your STD code before dialing 1950)</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
              <PhoneCall size={150} />
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-3xl p-6 border border-orange-200 dark:border-orange-800/50">
            <h3 className="font-bold text-orange-900 dark:text-orange-400 text-sm flex items-center gap-2 mb-2">
              <ShieldAlert size={16} /> Disclaimer
            </h3>
            <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed">
              This application is a prototype built for the Virtual Prompt Wars hackathon. It is designed to assist and educate citizens based on ECI guidelines but is <strong>NOT</strong> an official government application. Always refer to voters.eci.gov.in for the final authority on voter registration.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-8 text-sm text-gray-400 flex items-center justify-center gap-1">
        Built with <Heart size={14} className="text-red-500 mx-1" /> for Indian Voters
      </div>
    </div>
  );
};

export default HelpSources;

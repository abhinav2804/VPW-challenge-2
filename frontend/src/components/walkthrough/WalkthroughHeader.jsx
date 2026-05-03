import React from 'react';
import { motion } from 'framer-motion';
import { MonitorPlay, ExternalLink, Smartphone } from 'lucide-react';

export const WalkthroughHeader = ({ audienceType }) => (
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
);

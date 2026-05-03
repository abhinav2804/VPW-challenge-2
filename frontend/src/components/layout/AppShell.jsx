import React, { useState } from 'react';
import HeaderBar from './HeaderBar';
import ProgressTracker from '../ui/ProgressTracker';
import FloatingAIAssistantButton from '../ai/FloatingAIAssistantButton';
import AIAssistantPanel from '../ai/AIAssistantPanel';
import { useAppStore } from '../../store/useAppStore';

const AppShell = ({ children }) => {
  const { theme, isAIPanelOpen, setAIPanelOpen } = useAppStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-stone-50 text-gray-900'}`}>
      <HeaderBar />
      <ProgressTracker />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${isAIPanelOpen ? 'lg:mr-96' : ''}`}>
          {children}
        </div>
        
        {/* AI Assistant Panel (Desktop Side Panel / Mobile Drawer) */}
        <AIAssistantPanel isOpen={isAIPanelOpen} onClose={() => setAIPanelOpen(false)} />
      </main>

      <FloatingAIAssistantButton onClick={() => setAIPanelOpen(!isAIPanelOpen)} isOpen={isAIPanelOpen} />
    </div>
  );
};

export default AppShell;

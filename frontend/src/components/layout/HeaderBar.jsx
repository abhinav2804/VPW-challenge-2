import React from 'react';
import { Moon, Sun, Languages, Map } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';

const HeaderBar = () => {
  const { theme, toggleTheme, language, toggleLanguage } = useAppStore();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:border-gray-50/[0.06] bg-white/95 dark:bg-gray-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-teal-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform shadow-sm">
              <Map size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              Election Quest
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Hidden div for Google Translate widget initialization */}
            <div id="google_translate_element" className="hidden"></div>
            
            <button 
              onClick={() => {
                const targetLang = language === 'en' ? 'hi' : 'en';
                toggleLanguage();
                // Use the reliable cookie method to trigger Google Translate
                document.cookie = `googtrans=/en/${targetLang}; path=/`;
                document.cookie = `googtrans=/en/${targetLang}; domain=${window.location.hostname}; path=/`;
                window.location.reload();
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm font-medium"
              aria-label="Toggle language"
            >
              <Languages size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="hidden sm:inline-block text-gray-600 dark:text-gray-300">
                {language === 'en' ? 'HI' : 'EN'}
              </span>
            </button>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-600" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;

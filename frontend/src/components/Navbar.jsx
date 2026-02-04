import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  const navLinks = [
    { path: '/', label: t(language, 'nav.home') },
    { path: '/events', label: t(language, 'nav.events') },
    { path: '/weekly', label: t(language, 'nav.weekly') },
    { path: '/hall-hire', label: t(language, 'nav.hallHire') },
    { path: '/committee', label: t(language, 'nav.committee') },
    { path: '/groups', label: t(language, 'nav.groups') },
    { path: '/constitution', label: t(language, 'nav.constitution') }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">PAN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold text-lg leading-tight">Polish Association</span>
                <span className="text-red-600 text-sm font-medium">Newcastle</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="ml-4 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 flex items-center"
              title={language === 'en' ? 'Przełącz na polski' : 'Switch to English'}
            >
              <img 
                src={language === 'en' ? 'https://flagcdn.com/w40/pl.png' : 'https://flagcdn.com/w40/gb.png'}
                alt={language === 'en' ? 'Polish' : 'English'}
                className="w-6 h-4 rounded"
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <img 
                src={language === 'en' ? 'https://flagcdn.com/w40/pl.png' : 'https://flagcdn.com/w40/gb.png'}
                alt={language === 'en' ? 'Polish' : 'English'}
                className="w-6 h-4 rounded"
              />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-600 p-2 transition-colors duration-200"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

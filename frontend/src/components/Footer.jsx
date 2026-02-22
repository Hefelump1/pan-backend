import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

export const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PAN</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-base leading-tight">Polish Association</span>
                <span className="text-red-400 text-xs">Newcastle</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              {t(language, 'footer.aboutText')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t(language, 'footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-sm hover:text-red-400 transition-colors duration-200">
                  {t(language, 'nav.events')}
                </Link>
              </li>
              <li>
                <Link to="/weekly" className="text-sm hover:text-red-400 transition-colors duration-200">
                  {t(language, 'nav.weekly')}
                </Link>
              </li>
              <li>
                <Link to="/hall-hire" className="text-sm hover:text-red-400 transition-colors duration-200">
                  {t(language, 'nav.hallHire')}
                </Link>
              </li>
              <li>
                <Link to="/committee" className="text-sm hover:text-red-400 transition-colors duration-200">
                  {t(language, 'nav.committee')}
                </Link>
              </li>
              <li>
                <Link to="/constitution" className="text-sm hover:text-red-400 transition-colors duration-200">
                  {t(language, 'nav.constitution')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t(language, 'footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-red-400 mt-1 flex-shrink-0" />
                <span className="text-sm">Polish Community Hall<br />123 Polonia Street<br />Newcastle NSW 2300</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-red-400 flex-shrink-0" />
                <span className="text-sm">(02) 4920 1234</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-red-400 flex-shrink-0" />
                <span className="text-sm">admin@polishassociationnewcastle.org.au</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">{t(language, 'footer.hallHours')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3">
                <Clock size={18} className="text-red-400 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-white">{t(language, 'footer.monFri')}</div>
                  <div>9:00 AM - 9:00 PM</div>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Clock size={18} className="text-red-400 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-white">{t(language, 'footer.satSun')}</div>
                  <div>10:00 AM - 10:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-center md:text-left">
              © {new Date().getFullYear()} Polish Association of Newcastle. {t(language, 'footer.allRights')}.
            </p>
            <div className="flex space-x-6">
              <Link to="/constitution" className="text-sm hover:text-red-400 transition-colors duration-200">
                {t(language, 'footer.privacy')}
              </Link>
              <Link to="/constitution" className="text-sm hover:text-red-400 transition-colors duration-200">
                {t(language, 'footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

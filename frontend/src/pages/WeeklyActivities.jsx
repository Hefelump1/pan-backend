import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

export const WeeklyActivities = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Clock size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">{t(language, 'weekly.title')}</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            {t(language, 'weekly.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Monday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Polish Seniors Group</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  10:00 - 13:00
                </span>
              </div>
              <p className="text-gray-700 mb-2">Social gathering for Polish seniors with coffee and conversation.</p>
              <p className="text-red-600 font-medium">seniors@polishassociation.com.au</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Tuesday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Little Poland Dining</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  17:00 - 21:00
                </span>
              </div>
              <p className="text-gray-700 mb-2">Enjoy authentic Polish cuisine in our restaurant.</p>
              <p className="text-red-600 font-medium">dining@polishassociation.com.au</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Wednesday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Children's Polish School</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  16:30 - 18:30
                </span>
              </div>
              <p className="text-gray-700 mb-2">Polish language and culture classes for children aged 5-15.</p>
              <p className="text-red-600 font-medium">school@polishassociation.com.au</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Thursday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Rzeszowiacy Dance Practice</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  18:00 - 20:00
                </span>
              </div>
              <p className="text-gray-700 mb-2">Traditional Polish folk dance rehearsals. New members welcome!</p>
              <p className="text-red-600 font-medium">dance@polishassociation.com.au</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Friday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Little Poland Dining</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  17:00 - 22:00
                </span>
              </div>
              <p className="text-gray-700 mb-2">Enjoy authentic Polish cuisine in our restaurant.</p>
              <p className="text-red-600 font-medium">dining@polishassociation.com.au</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Saturday</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Adults Polish School</h3>
                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                    <Clock size={18} className="mr-2" />
                    10:00 - 12:00
                  </span>
                </div>
                <p className="text-gray-700 mb-2">Polish language classes for adults - all levels welcome.</p>
                <p className="text-red-600 font-medium">adultschool@polishassociation.com.au</p>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Little Poland Dining</h3>
                  <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                    <Clock size={18} className="mr-2" />
                    17:00 - 22:00
                  </span>
                </div>
                <p className="text-gray-700 mb-2">Enjoy authentic Polish cuisine in our restaurant.</p>
                <p className="text-red-600 font-medium">dining@polishassociation.com.au</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">Sunday</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Little Poland Dining</h3>
                <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                  <Clock size={18} className="mr-2" />
                  12:00 - 20:00
                </span>
              </div>
              <p className="text-gray-700 mb-2">Sunday lunch and dinner service with traditional Polish dishes.</p>
              <p className="text-red-600 font-medium">dining@polishassociation.com.au</p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t(language, 'weekly.joinTitle')}</h2>
          <p className="text-gray-600 mb-8">
            {t(language, 'weekly.joinDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@polishassociation.com.au" className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
              {t(language, 'weekly.contactUs')}
            </a>
            <a href="tel:0249201234" className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all duration-300">
              {t(language, 'weekly.call')} (02) 4920 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

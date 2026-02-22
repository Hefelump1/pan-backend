import React, { useState, useEffect } from 'react';
import { Users, Mail } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AssociatedGroups = () => {
  const { language } = useLanguage();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Users size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">{t(language, 'groups.title')}</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            {t(language, 'groups.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t(language, 'common.loading')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {groups.map((group) => {
                const name = language === 'pl' ? (group.name_pl || group.name) : (group.name_en || group.name);
                const description = language === 'pl' ? (group.description_pl || group.description) : (group.description_en || group.description);
                const schedule = language === 'pl' ? (group.schedule_pl || group.schedule) : (group.schedule_en || group.schedule);
                
                return (
                  <div key={group.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid md:grid-cols-2">
                      <img src={group.image} alt={name} className="w-full h-full object-cover min-h-[300px]" />
                      <div className="p-8 md:p-12 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{name}</h2>
                        <p className="text-gray-700 mb-6">{description}</p>
                        <div className="space-y-3 mb-6">
                          <div>
                            <p className="font-semibold text-gray-900">{t(language, 'groups.schedule')}</p>
                            <p className="text-gray-600">{schedule}</p>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{t(language, 'groups.contact')}</p>
                            <a href={`mailto:${group.contact}`} className="text-red-600 hover:text-red-700">{group.contact}</a>
                          </div>
                        </div>
                        <a href={`mailto:${group.contact}`} className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 w-fit">
                          <Mail size={18} className="mr-2" />
                          {t(language, 'groups.getInTouch')}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t(language, 'groups.startGroupTitle')}</h2>
          <p className="text-gray-600 mb-8">
            {t(language, 'groups.startGroupDesc')}
          </p>
          <a href="mailto:admin@polishassociationnewcastle.org.au" className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
            <Mail size={20} className="mr-2" />
            {t(language, 'groups.contactUs')}
          </a>
        </div>
      </section>
    </div>
  );
};

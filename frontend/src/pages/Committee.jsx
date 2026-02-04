import React, { useState, useEffect } from 'react';
import { Users, Mail } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Committee = () => {
  const { language } = useLanguage();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommittee();
  }, []);

  const fetchCommittee = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/committee`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching committee:', error);
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
          <h1 className="text-5xl font-bold text-center mb-4">{t(language, 'committee.title')}</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            {t(language, 'committee.subtitle')}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {members.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-80">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-red-300 font-semibold">{member.position}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">{t(language, 'committee.joinTitle')}</h2>
            <p className="text-red-100 mb-8 leading-relaxed">
              {t(language, 'committee.joinDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:committee@polishassociation.com.au" className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
                <Mail size={20} className="mr-2" />
                {t(language, 'committee.contactCommittee')}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t(language, 'committee.commitmentTitle')}</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(language, 'committee.generations')}</h3>
              <p className="text-gray-600">{t(language, 'committee.generationsDesc')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">50+</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(language, 'committee.eventsAnnually')}</h3>
              <p className="text-gray-600">{t(language, 'committee.eventsDesc')}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">100%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t(language, 'committee.volunteerRun')}</h3>
              <p className="text-gray-600">{t(language, 'committee.volunteerDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

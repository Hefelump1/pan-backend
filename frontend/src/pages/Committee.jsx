import React, { useState, useEffect } from 'react';
import { Users, Mail, Download, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Committee = () => {
  const { language } = useLanguage();
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [committeeRes, settingsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/committee`),
        axios.get(`${BACKEND_URL}/api/settings`)
      ]);
      setMembers(committeeRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Volunteer Box */}
            <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-10 text-center shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">{t(language, 'committee.joinTitle')}</h2>
              <p className="text-red-100 mb-8 leading-relaxed">
                {t(language, 'committee.joinDesc')}
              </p>
              <a 
                href="mailto:admin@polishassociationnewcastle.org.au" 
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                data-testid="contact-volunteer-btn"
              >
                <Mail size={20} className="mr-2" />
                {t(language, 'committee.contactCommittee')}
              </a>
            </div>

            {/* Membership Box */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-10 text-center shadow-xl">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {language === 'pl' ? 'Chcesz zostać członkiem?' : 'Interested in becoming a Member?'}
              </h2>
              <p className="text-red-100 mb-8 leading-relaxed">
                {language === 'pl' 
                  ? 'Dołącz do naszej społeczności i pomagaj w zachowaniu polskiej kultury w Newcastle. Pobierz formularz zgłoszeniowy i wyślij go do nas.'
                  : 'Join our community and help preserve Polish culture in Newcastle. Download the membership form and submit it to us.'}
              </p>
              {settings?.membership_form_url ? (
                <a 
                  href={settings.membership_form_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  data-testid="download-membership-form-btn"
                >
                  <Download size={20} className="mr-2" />
                  {language === 'pl' ? 'Pobierz formularz członkowski' : 'Download Membership Form'}
                </a>
              ) : (
                <a 
                  href="mailto:admin@polishassociationnewcastle.org.au?subject=Membership%20Enquiry" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  data-testid="contact-membership-btn"
                >
                  <Mail size={20} className="mr-2" />
                  {language === 'pl' ? 'Zapytaj o członkostwo' : 'Enquire About Membership'}
                </a>
              )}
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

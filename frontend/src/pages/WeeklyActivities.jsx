import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_PL = {
  'Monday': 'Poniedziałek',
  'Tuesday': 'Wtorek',
  'Wednesday': 'Środa',
  'Thursday': 'Czwartek',
  'Friday': 'Piątek',
  'Saturday': 'Sobota',
  'Sunday': 'Niedziela'
};

export const WeeklyActivities = () => {
  const { language } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Use /visible endpoint to only get activities that are not hidden
      const response = await axios.get(`${BACKEND_URL}/api/activities/visible`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group activities by day
  const groupedActivities = DAYS.reduce((acc, day) => {
    acc[day] = activities.filter(a => a.day === day);
    return acc;
  }, {});

  const getDayName = (day) => {
    return language === 'pl' ? DAYS_PL[day] : day;
  };

  const getActivityName = (activity) => {
    if (language === 'pl' && activity.name_pl) return activity.name_pl;
    return activity.name_en || activity.name || '';
  };

  const getActivityDescription = (activity) => {
    if (language === 'pl' && activity.description_pl) return activity.description_pl;
    return activity.description_en || activity.description || '';
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="weekly-activities-page">
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t(language, 'common.loading')}</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">{t(language, 'weekly.noActivities')}</p>
            </div>
          ) : (
            DAYS.map((day) => {
              const dayActivities = groupedActivities[day];
              if (dayActivities.length === 0) return null;
              
              return (
                <div key={day} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-red-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">{getDayName(day)}</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {dayActivities.map((activity, index) => (
                      <div key={activity.id} className={index > 0 ? 'pt-6 border-t border-gray-200' : ''}>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">
                            {getActivityName(activity)}
                          </h3>
                          <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                            <Clock size={18} className="mr-2" />
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{getActivityDescription(activity)}</p>
                        <p className="text-red-600 font-medium">{activity.contact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'pl' ? 'Dołącz do naszych zajęć' : 'Join Our Activities'}
          </h2>
          <p className="text-gray-600 mb-8">
            {language === 'pl' 
              ? 'Wszystkie zajęcia odbywają się w Polskim Domu Kultury. Chcesz prowadzić własne cotygodniowe zajęcia? Skontaktuj się z naszym koordynatorem sali.'
              : 'All activities are held at the Polish Cultural Centre. Are you looking to host your own weekly activity? Get in touch with our hall coordinator.'}
          </p>
          <a href="mailto:hallhire@polishassociationnewcastle.org.au" className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
            {t(language, 'weekly.contactUs')}
          </a>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Clock } from 'lucide-react';
import { weeklyActivities } from '../data/mock';

export const WeeklyActivities = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Clock size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Weekly Activities</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Regular programs and activities at the Polish Community Hall
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {weeklyActivities.map((dayItem) => (
              <div key={dayItem.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-600 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white">{dayItem.day}</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {dayItem.activities.map((activity, actIndex) => (
                      <div key={actIndex} className={actIndex !== 0 ? 'pt-6 border-t border-gray-200' : ''}>
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{activity.name}</h3>
                          <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg">
                            <Clock size={18} className="mr-2" />
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2 leading-relaxed">{activity.description}</p>
                        <p className="text-red-600 font-medium">{activity.contact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Activities</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            All activities are held at the Polish Community Hall. New members are always welcome! 
            Contact us for more information about any of our programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@polishassociation.com.au"
              className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </a>
            <a
              href="tel:0249201234"
              className="inline-block px-8 py-4 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Call (02) 4920 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

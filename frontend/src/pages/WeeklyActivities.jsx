import React from 'react';
import { Clock } from 'lucide-react';

const weeklyData = [
  { day: 'Monday', activities: [{ name: 'Polish Seniors Group', time: '10:00 - 13:00', desc: 'Social gathering for Polish seniors', contact: 'seniors@polishassociation.com.au' }] },
  { day: 'Tuesday', activities: [{ name: 'Little Poland Dining', time: '17:00 - 21:00', desc: 'Authentic Polish cuisine', contact: 'dining@polishassociation.com.au' }] },
  { day: 'Wednesday', activities: [{ name: "Children's Polish School", time: '16:30 - 18:30', desc: 'Language classes for ages 5-15', contact: 'school@polishassociation.com.au' }] },
  { day: 'Thursday', activities: [{ name: 'Rzeszowiacy Dance Practice', time: '18:00 - 20:00', desc: 'Traditional Polish folk dance', contact: 'dance@polishassociation.com.au' }] },
  { day: 'Friday', activities: [{ name: 'Little Poland Dining', time: '17:00 - 22:00', desc: 'Authentic Polish cuisine', contact: 'dining@polishassociation.com.au' }] },
  { day: 'Saturday', activities: [
    { name: 'Adults Polish School', time: '10:00 - 12:00', desc: 'Language classes for adults', contact: 'adultschool@polishassociation.com.au' },
    { name: 'Little Poland Dining', time: '17:00 - 22:00', desc: 'Authentic Polish cuisine', contact: 'dining@polishassociation.com.au' }
  ]},
  { day: 'Sunday', activities: [{ name: 'Little Poland Dining', time: '12:00 - 20:00', desc: 'Sunday lunch and dinner', contact: 'dining@polishassociation.com.au' }] }
];

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-red-600 px-6 py-4">
                <h2 className="text-2xl font-bold text-white">{item.day}</h2>
              </div>
              <div className="p-6 space-y-6">
                {item.activities.map((act, i) => (
                  <div key={i} className={i > 0 ? 'pt-6 border-t border-gray-200' : ''}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">{act.name}</h3>
                      <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg w-fit">
                        <Clock size={18} className="mr-2" />
                        {act.time}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{act.desc}</p>
                    <p className="text-red-600 font-medium">{act.contact}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Activities</h2>
          <p className="text-gray-600 mb-8">
            All activities are held at the Polish Community Hall. New members are always welcome!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@polishassociation.com.au" className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
              Contact Us
            </a>
            <a href="tel:0249201234" className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all duration-300">
              Call (02) 4920 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

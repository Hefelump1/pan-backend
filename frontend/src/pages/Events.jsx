import React from 'react';
import { Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { events } from '../data/mock';

export const Events = () => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const getCategoryColor = (category) => {
    const colors = {
      cultural: 'bg-red-100 text-red-700',
      meeting: 'bg-blue-100 text-blue-700',
      education: 'bg-green-100 text-green-700',
      performance: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <CalendarIcon size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Events Calendar</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Join us for cultural celebrations, educational programs, and community gatherings throughout the year
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-56">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                      {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-red-600 mb-3">
                    <CalendarIcon size={18} className="mr-2" />
                    <span className="font-semibold">
                      {new Date(event.date).toLocaleDateString('en-AU', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <div className="flex items-start text-gray-600 mb-2">
                    <Clock size={18} className="mr-2 mt-1 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start text-gray-600 mb-4">
                    <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Want to be notified about upcoming events? Contact us to join our mailing list.
          </p>
          <a
            href="mailto:info@polishassociation.com.au"
            className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Subscribe to Updates
          </a>
        </div>
      </section>
    </div>
  );
};

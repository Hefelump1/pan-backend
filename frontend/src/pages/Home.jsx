import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Building2, BookOpen, ArrowRight, Heart } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setUpcomingEvents(sorted.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1768333377265-cb6c3ca2885a"
            alt="Polish Community"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-gray-900/70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Polish Association of Newcastle
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Preserving Polish culture and heritage in Newcastle for three generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/events"
                className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Events
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link
                to="/hall-hire"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hire Our Hall
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Community</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1763733593826-d51c270cc8b4"
                alt="Polish Community"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Heritage</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Polish Association of Newcastle represents the achievements of three generations of Poles who have made Newcastle their home. We are dedicated to preserving and celebrating Polish culture, traditions, and heritage while fostering a strong sense of community.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Our community hall serves as a vibrant hub for cultural activities, language education, traditional dance, dining, and social gatherings. Join us in celebrating the rich tapestry of Polish heritage in Australia.
              </p>
              <Link
                to="/committee"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
              >
                Meet Our Committee
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/events" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                <Calendar size={28} className="text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Events Calendar</h3>
              <p className="text-gray-600 mb-4">Discover upcoming cultural celebrations and community events</p>
              <span className="text-red-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                View Calendar
                <ArrowRight size={16} className="ml-2" />
              </span>
            </Link>

            <Link to="/weekly" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                <BookOpen size={28} className="text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Activities</h3>
              <p className="text-gray-600 mb-4">Regular programs including language classes and cultural activities</p>
              <span className="text-red-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                See Schedule
                <ArrowRight size={16} className="ml-2" />
              </span>
            </Link>

            <Link to="/hall-hire" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                <Building2 size={28} className="text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hall Hire</h3>
              <p className="text-gray-600 mb-4">Book our beautiful venue for weddings, parties, and events</p>
              <span className="text-red-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Enquire Now
                <ArrowRight size={16} className="ml-2" />
              </span>
            </Link>

            <Link to="/groups" className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                <Users size={28} className="text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Associated Groups</h3>
              <p className="text-gray-600 mb-4">Connect with our schools, dance groups, and dining services</p>
              <span className="text-red-600 font-semibold inline-flex items-center group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <ArrowRight size={16} className="ml-2" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Join us for these exciting upcoming celebrations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-red-600 font-semibold mb-2">
                    {new Date(event.date).toLocaleDateString('en-AU', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <Link
                    to="/events"
                    className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
                  >
                    Learn More
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Events
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart size={48} className="text-white mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Become part of our vibrant Polish community and help us preserve our rich cultural heritage for future generations
          </p>
          <Link
            to="/committee"
            className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Involved
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

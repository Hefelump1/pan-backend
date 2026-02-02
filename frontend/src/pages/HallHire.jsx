import React, { useState } from 'react';
import { Building2, Users, Check, Calendar as CalendarIcon, Send } from 'lucide-react';
import { hallHireInfo } from '../data/mock';
import { Calendar } from '../components/ui/calendar';
import { toast } from 'sonner';

export const HallHire = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guests: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission - will be replaced with actual backend
    toast.success('Enquiry submitted successfully! We will contact you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      guests: '',
      message: ''
    });
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Hall Hire</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Book our beautiful Polish Community Hall for your special event
          </p>
        </div>
      </section>

      {/* Hall Images Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Venue</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {hallHireInfo.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={image}
                  alt={`Hall view ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Facilities */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Check size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Facilities Included</h2>
              </div>
              <ul className="space-y-3">
                {hallHireInfo.facilities.map((facility, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={20} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{facility}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-700">
                  <Users size={20} className="mr-2 text-red-600" />
                  <span className="font-semibold">Capacity: {hallHireInfo.capacity}</span>
                </div>
              </div>
            </div>

            {/* Suitable For */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <CalendarIcon size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Perfect For</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {hallHireInfo.suitableFor.map((event, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-800 font-medium">{event}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-bold text-red-900 mb-2">Competitive Rates</h3>
                <p className="text-gray-700">
                  Contact us for detailed pricing information and package options tailored to your event needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Make an Enquiry</h2>
            <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Calendar */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Check Availability</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                {selectedDate && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      Selected: {selectedDate.toLocaleDateString('en-AU', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="0400 000 000"
                  />
                </div>

                <div>
                  <label htmlFor="eventType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    required
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday Party</option>
                    <option value="christening">Christening</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="community">Community Gathering</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="guests" className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Number of Guests *
                  </label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    required
                    min="1"
                    max="200"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tell us more about your event..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  Submit Enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

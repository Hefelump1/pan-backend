import React, { useState } from 'react';
import { Building2, Users, Check, Send } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const facilities = [
  'Full kitchen facilities', 'Tables and chairs included', 'Sound system available',
  'Dance floor', 'Bar facilities', 'Parking available', 'Air conditioning/heating', 'Disabled access'
];

const suitableFor = ['Weddings', 'Birthdays', 'Christenings', 'Corporate events', 'Community gatherings', 'Cultural celebrations'];

const hallImages = [
  'https://images.unsplash.com/photo-1747296252929-ca8fbe6d238c',
  'https://images.pexels.com/photos/12909650/pexels-photo-12909650.jpeg',
  'https://images.pexels.com/photos/35723946/pexels-photo-35723946.jpeg'
];

export const HallHire = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventType: '', guests: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...formData,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        guests: parseInt(formData.guests)
      };
      
      await axios.post(`${BACKEND_URL}/api/bookings`, bookingData);
      toast.success('Enquiry submitted successfully! We will contact you within 24 hours.');
      
      setFormData({ name: '', email: '', phone: '', eventType: '', guests: '', message: '' });
      setSelectedDate(null);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit enquiry. Please try again or contact us directly.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Our Venue</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {hallImages.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-lg">
                <img src={img} alt={`Hall ${i + 1}`} className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <Check size={24} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Facilities Included</h2>
              </div>
              <ul className="space-y-3">
                {facilities.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <Check size={20} className="text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center text-gray-700">
                <Users size={20} className="mr-2 text-red-600" />
                <span className="font-semibold">Capacity: Up to 200 people</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
              <div className="grid grid-cols-2 gap-4">
                {suitableFor.map((event, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-800 font-medium">{event}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-red-50 rounded-lg border border-red-100">
                <h3 className="font-bold text-red-900 mb-2">Competitive Rates</h3>
                <p className="text-gray-700">Contact us for pricing and package options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Make an Enquiry</h2>
            <p className="text-gray-600">Fill out the form and we'll get back to you within 24 hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Check Availability</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date()} />
                </div>
                {selectedDate && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">Selected: {selectedDate.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="John Smith" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="0400 000 000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
                  <select required value={formData.eventType} onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="christening">Christening</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guests *</label>
                  <input type="number" required min="1" max="200" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Tell us about your event..." />
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center">
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

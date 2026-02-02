import React from 'react';
import { Users, Mail, Linkedin } from 'lucide-react';
import { committeeMembers } from '../data/mock';

export const Committee = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Users size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Our Committee</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Meet the dedicated team leading the Polish Association of Newcastle
          </p>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {committeeMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-80">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
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
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Interested in Joining Our Committee?</h2>
            <p className="text-red-100 mb-8 leading-relaxed">
              We're always looking for passionate individuals who want to contribute to preserving Polish culture and strengthening our community. 
              Contact us to learn about volunteer opportunities and committee positions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:committee@polishassociation.com.au"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail size={20} className="mr-2" />
                Contact Committee
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Generations</h3>
              <p className="text-gray-600">Serving Polish families in Newcastle for three generations</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">50+</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Events Annually</h3>
              <p className="text-gray-600">Cultural celebrations, educational programs, and community gatherings</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-red-600">100%</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Volunteer Run</h3>
              <p className="text-gray-600">Dedicated volunteers committed to our community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

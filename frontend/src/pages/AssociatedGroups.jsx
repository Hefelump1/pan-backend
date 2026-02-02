import React from 'react';
import { Users, ExternalLink, Mail, Clock } from 'lucide-react';
import { associatedGroups } from '../data/mock';

export const AssociatedGroups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Users size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Associated Groups</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Connect with our vibrant community organizations and programs
          </p>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {associatedGroups.map((group, index) => (
              <div key={group.id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${index % 2 === 0 ? '' : ''}`}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover min-h-[300px]"
                    />
                  </div>
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{group.name}</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">{group.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start">
                        <Clock size={20} className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Schedule</p>
                          <p className="text-gray-600">{group.schedule}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail size={20} className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">Contact</p>
                          <a href={`mailto:${group.contact}`} className="text-red-600 hover:text-red-700 transition-colors duration-200">
                            {group.contact}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`mailto:${group.contact}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <Mail size={18} className="mr-2" />
                        Get in Touch
                      </a>
                      {group.website !== '#' && (
                        <a
                          href={group.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Visit Website
                          <ExternalLink size={18} className="ml-2" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to Start Your Own Group?</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We welcome new initiatives and groups that promote Polish culture and community engagement. 
            If you have an idea for a new program or organization, we'd love to hear from you!
          </p>
          <a
            href="mailto:info@polishassociation.com.au"
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Mail size={20} className="mr-2" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

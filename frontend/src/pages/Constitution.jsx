import React from 'react';
import { FileText, Download, Calendar as CalendarIcon, Scale } from 'lucide-react';
import { constitutionInfo } from '../data/mock';

export const Constitution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Scale size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Constitution & Governance</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Official documents and governance information for the Polish Association of Newcastle
          </p>
        </div>
      </section>

      {/* AGM Notice */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-12 text-center shadow-xl">
            <CalendarIcon size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Annual General Meeting 2025</h2>
            <p className="text-2xl text-red-100 mb-2">
              {new Date(constitutionInfo.agmDate).toLocaleDateString('en-AU', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-xl text-red-100 mb-8">Polish Community Hall, 3:00 PM</p>
            <p className="text-red-100 leading-relaxed mb-8">
              All members are encouraged to attend our Annual General Meeting. We'll review the past year's achievements, 
              discuss future plans, and hold elections for committee positions. Light refreshments will be served.
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Download size={20} className="mr-2" />
              Download AGM Notice
            </button>
          </div>
        </div>
      </section>

      {/* Documents Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Official Documents</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Access our constitution, meeting minutes, and annual reports</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {constitutionInfo.documents.map((doc, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{doc.name}</h3>
                <p className="text-gray-600 text-center mb-6">PDF Document</p>
                <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
                  <Download size={18} className="mr-2" />
                  Download {doc.type}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About Our Constitution</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The Constitution of the Polish Association of Newcastle outlines the fundamental principles and rules 
                that govern our organization. It defines our mission, membership requirements, committee structure, 
                and operational procedures.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our constitution ensures transparent and democratic governance, protecting the interests of all members 
                while preserving our commitment to Polish culture and heritage.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The document is regularly reviewed and updated to reflect the evolving needs of our community while 
                maintaining our core values and traditions.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Membership Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Who Can Join?</h4>
                  <p className="text-gray-700">
                    Membership is open to all individuals of Polish descent and those interested in Polish culture and heritage.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Member Benefits</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Voting rights at AGM</li>
                    <li>Discounted event tickets</li>
                    <li>Priority hall hire booking</li>
                    <li>Access to member-only events</li>
                    <li>Monthly newsletter</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <a
                    href="mailto:membership@polishassociation.com.au"
                    className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Apply for Membership
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Queries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Governance?</h2>
          <p className="text-gray-600 mb-8">
            If you have any questions about our constitution, governance, or membership, please don't hesitate to contact our committee.
          </p>
          <a
            href="mailto:committee@polishassociation.com.au"
            className="inline-block px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Committee
          </a>
        </div>
      </section>
    </div>
  );
};

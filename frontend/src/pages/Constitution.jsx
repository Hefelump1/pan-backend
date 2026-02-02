import React from 'react';
import { FileText, Download, Calendar as CalendarIcon, Scale } from 'lucide-react';

const documents = [
  { name: 'Constitution 2025', type: 'PDF' },
  { name: 'AGM Notice 2025', type: 'PDF' },
  { name: 'Annual Report 2024', type: 'PDF' }
];

export const Constitution = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Scale size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Constitution & Governance</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Official documents and governance information
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-12 text-center">
            <CalendarIcon size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Annual General Meeting 2025</h2>
            <p className="text-2xl text-red-100 mb-2">Saturday, 15 March 2025</p>
            <p className="text-xl text-red-100 mb-8">Polish Community Hall, 3:00 PM</p>
            <p className="text-red-100 mb-8">
              All members are encouraged to attend our AGM. We'll review achievements and hold committee elections.
            </p>
            <button className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300">
              <Download size={20} className="inline mr-2" />
              Download AGM Notice
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Official Documents</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Access our constitution, minutes, and reports</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {documents.map((doc, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{doc.name}</h3>
                <p className="text-gray-600 text-center mb-6">PDF Document</p>
                <button className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
                  <Download size={18} className="inline mr-2" />
                  Download {doc.type}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About Our Constitution</h3>
              <p className="text-gray-700 mb-4">
                The Constitution outlines fundamental principles governing our organization, defining our mission, membership, and structure.
              </p>
              <p className="text-gray-700">
                Ensures transparent democratic governance while maintaining our commitment to Polish culture and heritage.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Membership Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Who Can Join?</h4>
                  <p className="text-gray-700">Open to all interested in Polish culture and heritage.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Benefits</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Voting rights at AGM</li>
                    <li>Discounted event tickets</li>
                    <li>Priority hall booking</li>
                    <li>Member-only events</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <a href="mailto:membership@polishassociation.com.au" className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
                    Apply for Membership
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions About Governance?</h2>
          <p className="text-gray-600 mb-8">Contact our committee for any questions.</p>
          <a href="mailto:committee@polishassociation.com.au" className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 inline-block">
            Contact Committee
          </a>
        </div>
      </section>
    </div>
  );
};

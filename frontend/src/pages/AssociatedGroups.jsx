import React from 'react';
import { Users, Mail } from 'lucide-react';

const groups = [
  {
    name: "Children's Polish School",
    desc: 'Polish language and culture classes for children aged 5-15.',
    schedule: 'Wednesdays 16:30 - 18:30',
    contact: 'school@polishassociation.com.au',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop'
  },
  {
    name: 'Adults Polish School',
    desc: 'Polish language classes for adults of all levels.',
    schedule: 'Saturdays 10:00 - 12:00',
    contact: 'adultschool@polishassociation.com.au',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
  },
  {
    name: 'Little Poland Dining',
    desc: 'Experience authentic Polish cuisine in our restaurant.',
    schedule: 'Tue-Sun (see weekly schedule)',
    contact: 'dining@polishassociation.com.au',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop'
  },
  {
    name: 'Rzeszowiacy Dance Group',
    desc: 'Traditional Polish folk dance ensemble. New dancers welcome!',
    schedule: 'Thursdays 18:00 - 20:00',
    contact: 'dance@polishassociation.com.au',
    image: 'https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg'
  },
  {
    name: 'Polish Seniors Group',
    desc: 'Social group for Polish seniors to connect and share stories.',
    schedule: 'Mondays 10:00 - 13:00',
    contact: 'seniors@polishassociation.com.au',
    image: 'https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=600&h=400&fit=crop'
  }
];

export const AssociatedGroups = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Users size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">Associated Groups</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            Connect with our vibrant community organizations
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {groups.map((group, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <img src={group.image} alt={group.name} className="w-full h-full object-cover min-h-[300px]" />
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{group.name}</h2>
                  <p className="text-gray-700 mb-6">{group.desc}</p>
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="font-semibold text-gray-900">Schedule</p>
                      <p className="text-gray-600">{group.schedule}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Contact</p>
                      <a href={`mailto:${group.contact}`} className="text-red-600 hover:text-red-700">{group.contact}</a>
                    </div>
                  </div>
                  <a href={`mailto:${group.contact}`} className="inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 w-fit">
                    <Mail size={18} className="mr-2" />
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to Start Your Own Group?</h2>
          <p className="text-gray-600 mb-8">
            We welcome new initiatives that promote Polish culture and community engagement.
          </p>
          <a href="mailto:info@polishassociation.com.au" className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
            <Mail size={20} className="mr-2" />
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
};

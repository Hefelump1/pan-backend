import React from 'react';
import { FileText, Download, Calendar as CalendarIcon, Scale, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

const documents = [
  { name: 'Constitution 2025', type: 'PDF' },
  { name: 'AGM Notice 2025', type: 'PDF' },
  { name: 'Annual Report 2024', type: 'PDF' }
];

const usefulLinks = [
  { name_en: 'Federation of Polish Organisations in NSW', name_pl: 'Federacja Polskich Organizacji w NSW', url: 'https://www.polishfederation.org.au/' },
  { name_en: 'Polish Community Council in Australia', name_pl: 'Rada Polonii Australijskiej', url: 'https://www.polishcommunitycouncil.org.au/' },
  { name_en: 'Embassy of Poland', name_pl: 'Ambasada RP', url: 'https://www.gov.pl/web/australia' },
  { name_en: 'Consulate General of Poland', name_pl: 'Konsulat Generalny RP', url: 'https://www.gov.pl/web/australia' },
  { name_en: 'Link to Poland', name_pl: 'Link to Poland', url: 'https://linktopoland.com/' },
  { name_en: 'Mt Kosciuszko Inc.', name_pl: 'Mt Kosciuszko Inc.', url: 'https://mtkosciuszko.org.au/' },
  { name_en: 'Polish Australian Business Forum', name_pl: 'Polsko-Australijskie Forum Biznesu', url: 'https://pabf.org.au/' }
];

export const Constitution = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Scale size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">{t(language, 'constitution.title')}</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            {t(language, 'constitution.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-xl p-12 text-center">
            <CalendarIcon size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">{t(language, 'constitution.agmTitle')}</h2>
            <p className="text-2xl text-red-100 mb-2">{t(language, 'constitution.agmDate')}</p>
            <p className="text-xl text-red-100 mb-8">{t(language, 'constitution.agmTime')}</p>
            <p className="text-red-100 mb-8">
              {t(language, 'constitution.agmDesc')}
            </p>
            <button className="px-8 py-4 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300">
              <Download size={20} className="inline mr-2" />
              {t(language, 'constitution.downloadNotice')}
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t(language, 'constitution.officialDocs')}</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t(language, 'constitution.docsDesc')}</p>
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
                  {t(language, 'constitution.download')} {doc.type}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t(language, 'constitution.aboutConstitution')}</h3>
              <p className="text-gray-700 mb-4">
                {t(language, 'constitution.constitutionDesc1')}
              </p>
              <p className="text-gray-700">
                {t(language, 'constitution.constitutionDesc2')}
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t(language, 'constitution.membershipTitle')}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{t(language, 'constitution.whoCanJoin')}</h4>
                  <p className="text-gray-700">{t(language, 'constitution.whoDesc')}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">{t(language, 'constitution.benefits')}</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>{t(language, 'constitution.benefit1')}</li>
                    <li>{t(language, 'constitution.benefit2')}</li>
                    <li>{t(language, 'constitution.benefit3')}</li>
                    <li>{t(language, 'constitution.benefit4')}</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <a href="mailto:membership@polishassociation.com.au" className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300">
                    {t(language, 'constitution.applyMembership')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t(language, 'constitution.usefulLinks')}</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t(language, 'constitution.usefulLinksDesc')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usefulLinks.map((link, i) => {
              const name = language === 'pl' ? link.name_pl : link.name_en;
              return (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between group"
                >
                  <span className="text-gray-800 font-medium group-hover:text-red-600 transition-colors">{name}</span>
                  <ExternalLink size={20} className="text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-3" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t(language, 'constitution.questionsTitle')}</h2>
          <p className="text-gray-600 mb-8">{t(language, 'constitution.questionsDesc')}</p>
          <a href="mailto:committee@polishassociation.com.au" className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 inline-block">
            {t(language, 'constitution.contactCommittee')}
          </a>
        </div>
      </section>
    </div>
  );
};

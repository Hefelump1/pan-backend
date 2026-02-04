import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';

// Sample news data - in a real app this would come from an API
const newsData = [
  {
    id: 1,
    date: '2025-01-28',
    title_en: 'Polish Independence Day Celebration a Great Success',
    title_pl: 'Obchody Święta Niepodległości wielkim sukcesem',
    summary_en: 'Over 200 community members gathered at the Polish Community Hall to celebrate Polish Independence Day with traditional music, dance, and cuisine.',
    summary_pl: 'Ponad 200 członków społeczności zebrało się w Polskiej Sali Społeczności, aby uczcić Święto Niepodległości tradycyjną muzyką, tańcem i kuchnią.',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    date: '2025-01-15',
    title_en: 'New Polish Language Classes Starting in February',
    title_pl: 'Nowe zajęcia z języka polskiego od lutego',
    summary_en: 'We are excited to announce new beginner Polish language classes for adults starting in February. Register now to secure your place.',
    summary_pl: 'Z radością ogłaszamy nowe zajęcia z języka polskiego dla początkujących dorosłych, rozpoczynające się w lutym. Zarejestruj się teraz, aby zarezerwować miejsce.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    date: '2025-01-08',
    title_en: 'Rzeszowiacy Dance Group Wins Regional Competition',
    title_pl: 'Zespół Taneczny Rzeszowiacy wygrywa konkurs regionalny',
    summary_en: 'Congratulations to our Rzeszowiacy Dance Group for their outstanding performance and first place win at the NSW Folk Dance Competition.',
    summary_pl: 'Gratulacje dla naszego Zespołu Tanecznego Rzeszowiacy za wspaniały występ i zajęcie pierwszego miejsca w Konkursie Tańców Ludowych NSW.',
    image: 'https://images.pexels.com/photos/34337833/pexels-photo-34337833.jpeg?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    date: '2024-12-20',
    title_en: 'Christmas Wigilia Dinner Brings Community Together',
    title_pl: 'Kolacja Wigilijna jednoczy społeczność',
    summary_en: 'Our annual Wigilia dinner was a wonderful evening of traditional Polish Christmas customs, delicious food, and community spirit.',
    summary_pl: 'Nasza coroczna kolacja wigilijna była wspaniałym wieczorem tradycyjnych polskich zwyczajów bożonarodzeniowych, pysznego jedzenia i ducha wspólnoty.',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600&h=400&fit=crop'
  },
  {
    id: 5,
    date: '2024-12-05',
    title_en: 'Hall Renovations Complete',
    title_pl: 'Remont sali zakończony',
    summary_en: 'We are pleased to announce the completion of our hall renovation project, including new flooring, lighting, and air conditioning.',
    summary_pl: 'Z przyjemnością ogłaszamy zakończenie projektu remontu naszej sali, w tym nowe podłogi, oświetlenie i klimatyzację.',
    image: 'https://images.unsplash.com/photo-1747296252929-ca8fbe6d238c?w=600&h=400&fit=crop'
  }
];

export const News = () => {
  const { language } = useLanguage();
  const [news] = useState(newsData);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-red-700 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-4">
            <Newspaper size={48} />
          </div>
          <h1 className="text-5xl font-bold text-center mb-4">{t(language, 'news.title')}</h1>
          <p className="text-xl text-center text-red-100 max-w-2xl mx-auto">
            {t(language, 'news.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {news.map((item, index) => {
              const title = language === 'pl' ? item.title_pl : item.title_en;
              const summary = language === 'pl' ? item.summary_pl : item.summary_en;
              
              return (
                <article key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <img 
                        src={item.image} 
                        alt={title} 
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      <div className="flex items-center text-red-600 mb-3">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm font-medium">{formatDate(item.date)}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
                      <p className="text-gray-600 mb-6">{summary}</p>
                      <button className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors w-fit">
                        {t(language, 'news.readMore')}
                        <ArrowRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t(language, 'news.stayConnected')}</h2>
          <p className="text-gray-600 mb-8">
            {t(language, 'news.stayConnectedDesc')}
          </p>
          <a 
            href="mailto:info@polishassociation.com.au" 
            className="inline-flex items-center px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            {t(language, 'news.subscribe')}
          </a>
        </div>
      </section>
    </div>
  );
};

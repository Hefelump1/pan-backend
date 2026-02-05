import React, { useState, useEffect } from 'react';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations/translations';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const News = () => {
  const { language } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/news/published`);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="news-page">
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t(language, 'common.loading')}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No news articles available.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {news.map((item, index) => {
                const title = language === 'pl' ? item.title_pl : item.title_en;
                const summary = language === 'pl' ? item.summary_pl : item.summary_en;
                
                return (
                  <article key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" data-testid={`news-article-${item.id}`}>
                    <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                      <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={title} 
                            className="w-full h-64 md:h-full object-cover"
                          />
                        )}
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
          )}
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

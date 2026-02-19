import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageUpload } from '../components/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminNews = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_pl: '',
    summary_en: '',
    summary_pl: '',
    content_en: '',
    content_pl: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    published: true
  });

  useEffect(() => {
    checkAuth();
    fetchNews();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${BACKEND_URL}/api/news`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '',
      title_pl: '',
      summary_en: '',
      summary_pl: '',
      content_en: '',
      content_pl: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: true
    });
    setEditingNews(null);
  };

  const handleEdit = (article) => {
    setEditingNews(article);
    setFormData({
      title_en: article.title_en || '',
      title_pl: article.title_pl || '',
      summary_en: article.summary_en || '',
      summary_pl: article.summary_pl || '',
      content_en: article.content_en || '',
      content_pl: article.content_pl || '',
      image: article.image || '',
      date: article.date || new Date().toISOString().split('T')[0],
      published: article.published !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingNews) {
        await axios.put(`${BACKEND_URL}/api/news/${editingNews.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('News article updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/news`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('News article created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Failed to save news article');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('News article deleted');
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Failed to delete news article');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-news-page">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                data-testid="back-to-dashboard"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage News</h1>
                <p className="text-gray-600">Create and edit news articles</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              data-testid="add-news-btn"
            >
              <Plus size={20} className="mr-2" />
              Add News
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading news...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No news articles yet</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Create your first article
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`news-item-${article.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {article.published ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <Eye size={14} className="mr-1" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500 text-sm">
                          <EyeOff size={14} className="mr-1" /> Draft
                        </span>
                      )}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 text-sm">{article.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{article.title_en}</h3>
                    <p className="text-gray-500 text-sm mb-2">{article.title_pl}</p>
                    <p className="text-gray-600 line-clamp-2">{article.summary_en}</p>
                  </div>
                  {article.image && (
                    <img 
                      src={article.image} 
                      alt={article.title_en} 
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(article)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    data-testid={`edit-news-${article.id}`}
                  >
                    <Pencil size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    data-testid={`delete-news-${article.id}`}
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNews ? 'Edit News Article' : 'Create News Article'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-title-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title (Polish) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_pl}
                    onChange={(e) => setFormData({ ...formData, title_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-title-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Summary (English) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.summary_en}
                    onChange={(e) => setFormData({ ...formData, summary_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-summary-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Summary (Polish) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.summary_pl}
                    onChange={(e) => setFormData({ ...formData, summary_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-summary-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Content (English)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-content-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Content (Polish)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.content_pl}
                    onChange={(e) => setFormData({ ...formData, content_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="news-content-pl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  data-testid="news-date"
                />
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Article Image"
                testId="news-image"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  data-testid="news-published"
                />
                <label htmlFor="published" className="ml-2 text-sm font-medium text-gray-700">
                  Published (visible on website)
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                  data-testid="save-news-btn"
                >
                  {editingNews ? 'Update Article' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

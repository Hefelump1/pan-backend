import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Type, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageUpload } from '../components/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminHomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hero_image: '',
    welcome_image: '',
    hero_title_en: '',
    hero_title_pl: '',
    hero_subtitle_en: '',
    hero_subtitle_pl: '',
    welcome_text1_en: '',
    welcome_text1_pl: '',
    welcome_text2_en: '',
    welcome_text2_pl: ''
  });

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/settings`);
      setSettings({
        hero_image: response.data.hero_image || '',
        welcome_image: response.data.welcome_image || '',
        hero_title_en: response.data.hero_title_en || '',
        hero_title_pl: response.data.hero_title_pl || '',
        hero_subtitle_en: response.data.hero_subtitle_en || '',
        hero_subtitle_pl: response.data.hero_subtitle_pl || '',
        welcome_text1_en: response.data.welcome_text1_en || '',
        welcome_text1_pl: response.data.welcome_text1_pl || '',
        welcome_text2_en: response.data.welcome_text2_en || '',
        welcome_text2_pl: response.data.welcome_text2_pl || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${BACKEND_URL}/api/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Home page settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-homepage-settings">
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
                <h1 className="text-2xl font-bold text-gray-900">Home Page Settings</h1>
                <p className="text-gray-600">Customize the home page content and images</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              data-testid="save-settings-btn"
            >
              {saving ? <RefreshCw size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 mr-3 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Images</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <ImageUpload
                value={settings.hero_image}
                onChange={(url) => setSettings({ ...settings, hero_image: url })}
                label="Hero Background Image"
                testId="hero-image"
                previewClassName="h-40"
              />
              <ImageUpload
                value={settings.welcome_image}
                onChange={(url) => setSettings({ ...settings, welcome_image: url })}
                label="Welcome Section Image"
                testId="welcome-image"
                previewClassName="h-40"
              />
            </div>
          </div>

          {/* Hero Text Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Type size={24} className="text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Hero Section Text</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">Leave blank to use default translations</p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Title (English)
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title_en}
                    onChange={(e) => setSettings({ ...settings, hero_title_en: e.target.value })}
                    placeholder="Polish Association of Newcastle"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="hero-title-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Main Title (Polish)
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title_pl}
                    onChange={(e) => setSettings({ ...settings, hero_title_pl: e.target.value })}
                    placeholder="Polskie Stowarzyszenie w Newcastle"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="hero-title-pl"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtitle (English)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hero_subtitle_en}
                    onChange={(e) => setSettings({ ...settings, hero_subtitle_en: e.target.value })}
                    placeholder="Preserving Polish culture and heritage..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="hero-subtitle-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtitle (Polish)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.hero_subtitle_pl}
                    onChange={(e) => setSettings({ ...settings, hero_subtitle_pl: e.target.value })}
                    placeholder="Zachowujemy polską kulturę i dziedzictwo..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="hero-subtitle-pl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Section Text */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Type size={24} className="text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Welcome Section Text</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">Leave blank to use default translations</p>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Paragraph (English)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.welcome_text1_en}
                    onChange={(e) => setSettings({ ...settings, welcome_text1_en: e.target.value })}
                    placeholder="The Polish Association of Newcastle represents..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="welcome-text1-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Paragraph (Polish)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.welcome_text1_pl}
                    onChange={(e) => setSettings({ ...settings, welcome_text1_pl: e.target.value })}
                    placeholder="Polskie Stowarzyszenie w Newcastle reprezentuje..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="welcome-text1-pl"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Second Paragraph (English)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.welcome_text2_en}
                    onChange={(e) => setSettings({ ...settings, welcome_text2_en: e.target.value })}
                    placeholder="Our community hall serves as a vibrant hub..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="welcome-text2-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Second Paragraph (Polish)
                  </label>
                  <textarea
                    rows={4}
                    value={settings.welcome_text2_pl}
                    onChange={(e) => setSettings({ ...settings, welcome_text2_pl: e.target.value })}
                    placeholder="Nasza sala społeczności służy jako tętniący życiem ośrodek..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="welcome-text2-pl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
            >
              {saving ? <RefreshCw size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />}
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, RefreshCw, Image, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageUpload } from '../components/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminHallHire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hallImages, setHallImages] = useState({
    hall_image_1: '',
    hall_image_2: '',
    hall_image_3: '',
    hall_image_4: '',
    hall_image_5: '',
    hall_image_6: ''
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
      setHallImages({
        hall_image_1: response.data.hall_image_1 || '',
        hall_image_2: response.data.hall_image_2 || '',
        hall_image_3: response.data.hall_image_3 || '',
        hall_image_4: response.data.hall_image_4 || '',
        hall_image_5: response.data.hall_image_5 || '',
        hall_image_6: response.data.hall_image_6 || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load hall images');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${BACKEND_URL}/api/settings`, hallImages, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Hall images saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save hall images');
    } finally {
      setSaving(false);
    }
  };

  const getActiveImageCount = () => {
    return Object.values(hallImages).filter(img => img && img.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading hall images...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-hallhire-page">
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
                <h1 className="text-2xl font-bold text-gray-900">Hall Hire Images</h1>
                <p className="text-gray-600">Manage photos displayed on the Hall Hire page</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
              data-testid="save-hall-images-btn"
            >
              {saving ? <RefreshCw size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Image size={20} className="text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">Hall Gallery Images</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Upload up to 6 images to showcase your hall on the Hall Hire page. 
                  Images will be displayed in a gallery format. Only images that are uploaded will be shown.
                </p>
                <p className="text-blue-600 text-sm mt-2 font-medium">
                  Currently showing: {getActiveImageCount()} image{getActiveImageCount() !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Hall Images Grid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Building2 size={24} className="text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Hall Photos</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ImageUpload
                value={hallImages.hall_image_1}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_1: url })}
                label="Image 1"
                testId="hall-image-1"
                previewClassName="h-40"
              />
              <ImageUpload
                value={hallImages.hall_image_2}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_2: url })}
                label="Image 2"
                testId="hall-image-2"
                previewClassName="h-40"
              />
              <ImageUpload
                value={hallImages.hall_image_3}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_3: url })}
                label="Image 3"
                testId="hall-image-3"
                previewClassName="h-40"
              />
              <ImageUpload
                value={hallImages.hall_image_4}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_4: url })}
                label="Image 4"
                testId="hall-image-4"
                previewClassName="h-40"
              />
              <ImageUpload
                value={hallImages.hall_image_5}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_5: url })}
                label="Image 5"
                testId="hall-image-5"
                previewClassName="h-40"
              />
              <ImageUpload
                value={hallImages.hall_image_6}
                onChange={(url) => setHallImages({ ...hallImages, hall_image_6: url })}
                label="Image 6"
                testId="hall-image-6"
                previewClassName="h-40"
              />
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

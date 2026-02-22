import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Save, Loader2, Upload, FileText, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminAGM = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    agm_title_en: '',
    agm_title_pl: '',
    agm_date_en: '',
    agm_date_pl: '',
    agm_time_en: '',
    agm_time_pl: '',
    agm_description_en: '',
    agm_description_pl: '',
    agm_document_url: ''
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
      const data = response.data;
      setFormData({
        agm_title_en: data.agm_title_en || '',
        agm_title_pl: data.agm_title_pl || '',
        agm_date_en: data.agm_date_en || '',
        agm_date_pl: data.agm_date_pl || '',
        agm_time_en: data.agm_time_en || '',
        agm_time_pl: data.agm_time_pl || '',
        agm_description_en: data.agm_description_en || '',
        agm_description_pl: data.agm_description_pl || '',
        agm_document_url: data.agm_document_url || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load AGM settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${BACKEND_URL}/api/settings`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('AGM notice updated successfully');
    } catch (error) {
      console.error('Error saving AGM settings:', error);
      toast.error('Failed to save AGM settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, DOC, or DOCX files.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 50MB.');
      return;
    }

    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${BACKEND_URL}/api/upload/document`, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const fileUrl = `${BACKEND_URL}${response.data.url}`;
      setFormData(prev => ({ ...prev, agm_document_url: fileUrl }));
      toast.success('AGM notice document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = () => {
    setFormData(prev => ({ ...prev, agm_document_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-agm">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/admin/dashboard"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                data-testid="back-to-dashboard"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AGM Notice Settings</h1>
                <p className="text-gray-600">Edit the AGM notice displayed on the Governance page</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              data-testid="save-agm-btn"
            >
              {saving ? (
                <Loader2 size={20} className="mr-2 animate-spin" />
              ) : (
                <Save size={20} className="mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* AGM Title */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-2 text-red-600" />
              AGM Title
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  value={formData.agm_title_en}
                  onChange={(e) => setFormData({ ...formData, agm_title_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Annual General Meeting"
                  data-testid="agm-title-en"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title (Polish)
                </label>
                <input
                  type="text"
                  value={formData.agm_title_pl}
                  onChange={(e) => setFormData({ ...formData, agm_title_pl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Walne Zebranie Członków"
                  data-testid="agm-title-pl"
                />
              </div>
            </div>
          </div>

          {/* AGM Date & Time */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Date & Time</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date (English)
                </label>
                <input
                  type="text"
                  value={formData.agm_date_en}
                  onChange={(e) => setFormData({ ...formData, agm_date_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Saturday, 15 March 2025"
                  data-testid="agm-date-en"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date (Polish)
                </label>
                <input
                  type="text"
                  value={formData.agm_date_pl}
                  onChange={(e) => setFormData({ ...formData, agm_date_pl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Sobota, 15 marca 2025"
                  data-testid="agm-date-pl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time/Location (English)
                </label>
                <input
                  type="text"
                  value={formData.agm_time_en}
                  onChange={(e) => setFormData({ ...formData, agm_time_en: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Polish Cultural Centre, 3:00 PM"
                  data-testid="agm-time-en"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time/Location (Polish)
                </label>
                <input
                  type="text"
                  value={formData.agm_time_pl}
                  onChange={(e) => setFormData({ ...formData, agm_time_pl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Polski Dom Kultury, godz. 15:00"
                  data-testid="agm-time-pl"
                />
              </div>
            </div>
          </div>

          {/* AGM Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (English)
                </label>
                <textarea
                  value={formData.agm_description_en}
                  onChange={(e) => setFormData({ ...formData, agm_description_en: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter description for the AGM notice..."
                  data-testid="agm-description-en"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Polish)
                </label>
                <textarea
                  value={formData.agm_description_pl}
                  onChange={(e) => setFormData({ ...formData, agm_description_pl: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Wprowadź opis zawiadomienia o WZC..."
                  data-testid="agm-description-pl"
                />
              </div>
            </div>
          </div>

          {/* AGM Document Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FileText size={20} className="mr-2 text-red-600" />
              AGM Notice Document
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload the official AGM notice document (PDF, DOC, or DOCX) that visitors can download.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="agm-document-input"
            />

            {formData.agm_document_url ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">AGM Notice Document</p>
                      <a 
                        href={formData.agm_document_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:underline"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveDocument}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label 
                className={`
                  border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200
                  flex flex-col items-center justify-center
                  ${uploading ? 'pointer-events-none opacity-60' : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'}
                `}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {uploading ? (
                  <>
                    <Loader2 size={32} className="text-red-600 animate-spin mb-2" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                      <Upload size={24} className="text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Click to upload AGM notice document
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, or DOCX (max 50MB)
                    </p>
                  </>
                )}
              </label>
            )}
          </div>

          {/* Preview Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> Leave fields empty to use the default translations. The AGM notice will be displayed on the Governance page with a download button for the uploaded document.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAGM;

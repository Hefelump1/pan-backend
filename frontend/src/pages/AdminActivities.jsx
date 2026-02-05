import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Clock, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AdminActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    name_en: '',
    name_pl: '',
    time: '',
    description_en: '',
    description_pl: '',
    contact: '',
    order: 0
  });

  useEffect(() => {
    checkAuth();
    fetchActivities();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/activities`);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      day: 'Monday',
      name_en: '',
      name_pl: '',
      time: '',
      description_en: '',
      description_pl: '',
      contact: '',
      order: 0
    });
    setEditingActivity(null);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      day: activity.day || 'Monday',
      name_en: activity.name_en || activity.name || '',
      name_pl: activity.name_pl || '',
      time: activity.time || '',
      description_en: activity.description_en || activity.description || '',
      description_pl: activity.description_pl || '',
      contact: activity.contact || '',
      order: activity.order || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingActivity) {
        await axios.put(`${BACKEND_URL}/api/activities/${editingActivity.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Activity updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/activities`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Activity created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Activity deleted');
      fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  };

  // Group activities by day
  const groupedActivities = DAYS.reduce((acc, day) => {
    acc[day] = activities.filter(a => a.day === day);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-activities-page">
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
                <h1 className="text-2xl font-bold text-gray-900">Manage Weekly Activities</h1>
                <p className="text-gray-600">Add and edit activities for each day of the week</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              data-testid="add-activity-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Activity
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No weekly activities yet</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Add your first activity
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {DAYS.map((day) => (
              <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-red-600 px-6 py-3">
                  <h2 className="text-xl font-bold text-white">{day}</h2>
                </div>
                <div className="p-4">
                  {groupedActivities[day].length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No activities scheduled</p>
                  ) : (
                    <div className="space-y-4">
                      {groupedActivities[day].map((activity) => (
                        <div key={activity.id} className="border border-gray-200 rounded-lg p-4" data-testid={`activity-item-${activity.id}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{activity.name_en || activity.name}</h3>
                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                                  <Clock size={14} className="mr-1" />
                                  {activity.time}
                                </span>
                              </div>
                              {activity.name_pl && (
                                <p className="text-gray-500 text-sm mb-2">{activity.name_pl}</p>
                              )}
                              <p className="text-gray-600 mb-2">{activity.description_en || activity.description}</p>
                              <p className="text-red-600 text-sm">{activity.contact}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEdit(activity)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                data-testid={`edit-activity-${activity.id}`}
                              >
                                <Pencil size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(activity.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                data-testid={`delete-activity-${activity.id}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingActivity ? 'Edit Activity' : 'Add Activity'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Day of Week *
                  </label>
                  <select
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-day"
                  >
                    {DAYS.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 10:00 - 13:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-time"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Activity Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="e.g., Polish Seniors Group"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-name-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Activity Name (Polish) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_pl}
                    onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                    placeholder="e.g., Grupa Seniorów Polskich"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-name-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (English) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description_en}
                    onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-description-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Polish) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description_pl}
                    onChange={(e) => setFormData({ ...formData, description_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-description-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g., seniors@polishassociation.com.au"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    data-testid="activity-order"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first within each day</p>
                </div>
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
                  data-testid="save-activity-btn"
                >
                  {editingActivity ? 'Update Activity' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

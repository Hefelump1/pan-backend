import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Clock, X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ActivityCard = ({ activity, onEdit, onDelete, onToggleVisibility }) => (
  <div className={`border rounded-lg p-4 ${activity.is_visible === false ? 'border-gray-300 bg-gray-50 opacity-60' : 'border-gray-200'}`}>
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 className="text-lg font-bold text-gray-900">{activity.name_en || activity.name}</h3>
          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            <Clock size={14} className="mr-1" />
            {activity.time}
          </span>
          {activity.is_visible === false && (
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              <EyeOff size={12} className="mr-1" />
              Hidden
            </span>
          )}
        </div>
        {activity.name_pl && <p className="text-gray-500 text-sm mb-2">{activity.name_pl}</p>}
        <p className="text-gray-600 mb-2">{activity.description_en || activity.description}</p>
        <p className="text-red-600 text-sm">{activity.contact}</p>
      </div>
      <div className="flex gap-1 ml-4">
        <button 
          onClick={() => onToggleVisibility(activity)} 
          className={`p-2 rounded-lg ${activity.is_visible === false ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
          title={activity.is_visible === false ? 'Show activity' : 'Hide activity'}
        >
          {activity.is_visible === false ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <button onClick={() => onEdit(activity)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
          <Pencil size={18} />
        </button>
        <button onClick={() => onDelete(activity.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

const DaySection = ({ day, activities, onEdit, onDelete, onToggleVisibility }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="bg-red-600 px-6 py-3 flex justify-between items-center">
      <h2 className="text-xl font-bold text-white">{day}</h2>
      {activities.some(a => a.is_visible === false) && (
        <span className="text-red-200 text-sm">{activities.filter(a => a.is_visible === false).length} hidden</span>
      )}
    </div>
    <div className="p-4">
      {activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No activities scheduled</p>
      ) : (
        <div className="space-y-4">
          {activities.map(a => <ActivityCard key={a.id} activity={a} onEdit={onEdit} onDelete={onDelete} onToggleVisibility={onToggleVisibility} />)}
        </div>
      )}
    </div>
  </div>
);

export const AdminActivities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    day: 'Monday', name_en: '', name_pl: '', time: '',
    description_en: '', description_pl: '', contact: '', order: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    fetchActivities();
  }, [navigate]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/activities`);
      setActivities(response.data);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ day: 'Monday', name_en: '', name_pl: '', time: '', description_en: '', description_pl: '', contact: '', order: 0 });
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
        await axios.put(`${BACKEND_URL}/api/activities/${editingActivity.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Activity updated');
      } else {
        await axios.post(`${BACKEND_URL}/api/activities`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('Activity created');
      }
      setShowModal(false);
      resetForm();
      fetchActivities();
    } catch (error) {
      toast.error('Failed to save activity');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this activity?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/activities/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Activity deleted');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleToggleVisibility = async (activity) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(`${BACKEND_URL}/api/activities/${activity.id}/visibility`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(activity.is_visible === false ? 'Activity is now visible' : 'Activity is now hidden');
      fetchActivities();
    } catch (error) {
      toast.error('Failed to toggle visibility');
    }
  };

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
              <button onClick={() => navigate('/admin/dashboard')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Weekly Activities</h1>
                <p className="text-gray-600">Add and edit activities for each day</p>
              </div>
            </div>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <Plus size={20} className="mr-2" /> Add Activity
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-center py-12 text-gray-600">Loading...</p>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No activities yet</p>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="text-red-600 font-medium">Add first activity</button>
          </div>
        ) : (
          <div className="space-y-6">
            {DAYS.map(day => <DaySection key={day} day={day} activities={groupedActivities[day]} onEdit={handleEdit} onDelete={handleDelete} />)}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingActivity ? 'Edit Activity' : 'Add Activity'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Day *</label>
                  <select required value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500">
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time *</label>
                  <input type="text" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="10:00 - 13:00" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name (EN) *</label>
                  <input type="text" required value={formData.name_en} onChange={(e) => setFormData({ ...formData, name_en: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name (PL) *</label>
                  <input type="text" required value={formData.name_pl} onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (EN) *</label>
                  <textarea required rows={3} value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (PL) *</label>
                  <textarea required rows={3} value={formData.description_pl} onChange={(e) => setFormData({ ...formData, description_pl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact *</label>
                  <input type="text" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
                  <input type="number" min="0" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 px-4 py-3 border text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700">{editingActivity ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

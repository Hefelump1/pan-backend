import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, Globe, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminGroups = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_pl: '',
    description_en: '',
    description_pl: '',
    schedule_en: '',
    schedule_pl: '',
    contact: '',
    website: '',
    image: ''
  });

  useEffect(() => {
    checkAuth();
    fetchGroups();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/groups`);
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_pl: '',
      description_en: '',
      description_pl: '',
      schedule_en: '',
      schedule_pl: '',
      contact: '',
      website: '',
      image: ''
    });
    setEditingGroup(null);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name_en: group.name_en || '',
      name_pl: group.name_pl || '',
      description_en: group.description_en || '',
      description_pl: group.description_pl || '',
      schedule_en: group.schedule_en || '',
      schedule_pl: group.schedule_pl || '',
      contact: group.contact || '',
      website: group.website || '',
      image: group.image || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingGroup) {
        await axios.put(`${BACKEND_URL}/api/groups/${editingGroup.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Group updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/groups`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Group created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      toast.error('Failed to save group');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Group deleted');
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-groups-page">
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
                <h1 className="text-2xl font-bold text-gray-900">Manage Groups</h1>
                <p className="text-gray-600">Add and edit associated groups</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              data-testid="add-group-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Group
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No associated groups yet</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Add your first group
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.id} className="bg-white rounded-lg shadow-md p-6" data-testid={`group-item-${group.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{group.name_en}</h3>
                    <p className="text-gray-500 text-sm mb-3">{group.name_pl}</p>
                    <p className="text-gray-600 mb-3">{group.description_en}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Schedule: {group.schedule_en}</span>
                      <span>Contact: {group.contact}</span>
                      {group.website && (
                        <a href={group.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                          <Globe size={14} className="mr-1" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                  {group.image && (
                    <img 
                      src={group.image} 
                      alt={group.name_en} 
                      className="w-24 h-24 object-cover rounded-lg ml-4"
                    />
                  )}
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(group)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    data-testid={`edit-group-${group.id}`}
                  >
                    <Pencil size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    data-testid={`delete-group-${group.id}`}
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
                {editingGroup ? 'Edit Group' : 'Add Group'}
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
                    Group Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Polish Saturday School"
                    data-testid="group-name-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Group Name (Polish) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_pl}
                    onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Polska Szkoła Sobotnia"
                    data-testid="group-name-pl"
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
                    data-testid="group-description-en"
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
                    data-testid="group-description-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Schedule (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schedule_en}
                    onChange={(e) => setFormData({ ...formData, schedule_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Saturdays 9:00 AM - 1:00 PM"
                    data-testid="group-schedule-en"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Schedule (Polish) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.schedule_pl}
                    onChange={(e) => setFormData({ ...formData, schedule_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Soboty 9:00 - 13:00"
                    data-testid="group-schedule-pl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., school@example.com or (02) 1234 5678"
                    data-testid="group-contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="https://example.com"
                    data-testid="group-website"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  data-testid="group-image"
                />
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
                  data-testid="save-group-btn"
                >
                  {editingGroup ? 'Update Group' : 'Add Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

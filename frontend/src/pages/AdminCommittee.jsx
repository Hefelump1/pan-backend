import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, User, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { ImageUpload } from '../components/ImageUpload';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminCommittee = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    position_pl: '',
    bio: '',
    bio_pl: '',
    image: '',
    order: 0
  });

  useEffect(() => {
    checkAuth();
    fetchMembers();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/committee`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching committee:', error);
      toast.error('Failed to load committee members');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      position_pl: '',
      bio: '',
      bio_pl: '',
      image: '',
      order: members.length
    });
    setEditingMember(null);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      position: member.position || '',
      position_pl: member.position_pl || '',
      bio: member.bio || '',
      bio_pl: member.bio_pl || '',
      image: member.image || '',
      order: member.order || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      if (editingMember) {
        await axios.put(`${BACKEND_URL}/api/committee/${editingMember.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Committee member updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/committee`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Committee member added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Failed to save committee member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this committee member?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/committee/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Committee member removed');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to remove committee member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-committee-page">
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
                <h1 className="text-2xl font-bold text-gray-900">Manage Committee</h1>
                <p className="text-gray-600">Add and edit committee members</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              data-testid="add-member-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Member
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading committee members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No committee members yet</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Add your first committee member
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden" data-testid={`member-item-${member.id}`}>
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">Order: {member.order}</div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-2">{member.position}</p>
                  <p className="text-gray-600 text-sm line-clamp-3">{member.bio}</p>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(member)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      data-testid={`edit-member-${member.id}`}
                    >
                      <Pencil size={16} className="mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      data-testid={`delete-member-${member.id}`}
                    >
                      <Trash2 size={16} className="mr-1" /> Remove
                    </button>
                  </div>
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
                {editingMember ? 'Edit Committee Member' : 'Add Committee Member'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Jan Kowalski"
                  data-testid="member-name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., President"
                  data-testid="member-position"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position (Polish)
                </label>
                <input
                  type="text"
                  value={formData.position_pl}
                  onChange={(e) => setFormData({ ...formData, position_pl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Prezes"
                  data-testid="member-position-pl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biography (English) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Brief biography in English..."
                  data-testid="member-bio"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Biography (Polish)
                </label>
                <textarea
                  rows={4}
                  value={formData.bio_pl}
                  onChange={(e) => setFormData({ ...formData, bio_pl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Krótka biografia po polsku..."
                  data-testid="member-bio-pl"
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
                  data-testid="member-order"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                label="Member Photo"
                testId="member-image"
              />

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
                  data-testid="save-member-btn"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

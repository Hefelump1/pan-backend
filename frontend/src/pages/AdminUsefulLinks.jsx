import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, X, GripVertical, Loader2, LinkIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminUsefulLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_pl: '',
    url: '',
    order: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) navigate('/admin/login');
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/useful-links`);
      setLinks(response.data);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast.error('Failed to load useful links');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name_en: '', name_pl: '', url: '', order: 0 });
    setEditingLink(null);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormData({
      name_en: link.name_en || '',
      name_pl: link.name_pl || '',
      url: link.url || '',
      order: link.order || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_en.trim() || !formData.url.trim()) {
      toast.error('Please fill in the English name and URL');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      if (editingLink) {
        await axios.put(`${BACKEND_URL}/api/useful-links/${editingLink.id}`, formData, config);
        toast.success('Link updated successfully');
      } else {
        const payload = { ...formData, order: links.length };
        await axios.post(`${BACKEND_URL}/api/useful-links`, payload, config);
        toast.success('Link added successfully');
      }
      setShowModal(false);
      resetForm();
      fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      toast.error(error.response?.data?.detail || 'Failed to save link');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/useful-links/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Link deleted');
      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const reordered = [...links];
    const dragged = reordered[draggedItem];
    reordered.splice(draggedItem, 1);
    reordered.splice(index, 0, dragged);
    setLinks(reordered);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;
    setDraggedItem(null);
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await Promise.all(
        links.map((link, i) =>
          axios.put(`${BACKEND_URL}/api/useful-links/${link.id}`, { ...link, order: i }, config)
        )
      );
      toast.success('Order saved');
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to save order');
      fetchLinks();
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
    <div className="min-h-screen bg-gray-50" data-testid="admin-useful-links">
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
                <h1 className="text-2xl font-bold text-gray-900">Useful Links</h1>
                <p className="text-gray-600">Manage links on the Governance page</p>
              </div>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              data-testid="add-link-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Link
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {links.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <LinkIcon size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Useful Links Yet</h3>
            <p className="text-gray-600 mb-6">Add links that will appear on the Governance page.</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              data-testid="add-first-link-btn"
            >
              Add Your First Link
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder links. The order will be reflected on the public Governance page.
            </p>
            {links.map((link, index) => (
              <div
                key={link.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg shadow-md p-4 flex items-center gap-4 cursor-move transition-all ${
                  draggedItem === index ? 'opacity-50 scale-[1.02]' : ''
                }`}
                data-testid={`link-item-${link.id}`}
              >
                <div className="text-gray-400 hover:text-gray-600">
                  <GripVertical size={20} />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{link.name_en}</h3>
                  {link.name_pl && (
                    <p className="text-sm text-gray-500 truncate">{link.name_pl}</p>
                  )}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline truncate block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.url}
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open link"
                    data-testid={`open-link-${link.id}`}
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit link"
                    data-testid={`edit-link-${link.id}`}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                    data-testid={`delete-link-${link.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingLink ? 'Edit Link' : 'Add New Link'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
                data-testid="close-modal-btn"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., NSW Fair Trading"
                    data-testid="link-name-en-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link Name (Polish)
                  </label>
                  <input
                    type="text"
                    value={formData.name_pl}
                    onChange={(e) => setFormData({ ...formData, name_pl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., NSW Fair Trading"
                    data-testid="link-name-pl-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com"
                  data-testid="link-url-input"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="cancel-link-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="save-link-btn"
                >
                  {saving ? 'Saving...' : editingLink ? 'Update Link' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsefulLinks;

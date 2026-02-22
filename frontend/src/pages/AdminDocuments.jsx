import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Plus, Trash2, GripVertical, 
  Upload, Loader2, FileIcon, X, Edit2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AdminDocuments = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [formData, setFormData] = useState({ title: '', file_url: '', file_type: '', file_size: 0 });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchDocuments();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
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
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${BACKEND_URL}/api/upload/document`, formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const fileUrl = `${BACKEND_URL}${response.data.url}`;
      const ext = file.name.split('.').pop().toLowerCase();

      setFormData(prev => ({
        ...prev,
        file_url: fileUrl,
        file_type: ext,
        file_size: file.size,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    if (!formData.file_url) {
      toast.error('Please upload a document file');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingDocument) {
        await axios.put(`${BACKEND_URL}/api/documents/${editingDocument.id}`, formData, config);
        toast.success('Document updated successfully');
      } else {
        await axios.post(`${BACKEND_URL}/api/documents`, formData, config);
        toast.success('Document added successfully');
      }

      setShowModal(false);
      setEditingDocument(null);
      setFormData({ title: '', file_url: '', file_type: '', file_size: 0 });
      fetchDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error(error.response?.data?.detail || 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingDocument(doc);
    setFormData({
      title: doc.title,
      file_url: doc.file_url,
      file_type: doc.file_type,
      file_size: doc.file_size || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${BACKEND_URL}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newDocuments = [...documents];
    const draggedDoc = newDocuments[draggedItem];
    newDocuments.splice(draggedItem, 1);
    newDocuments.splice(index, 0, draggedDoc);
    
    setDocuments(newDocuments);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const documentIds = documents.map(doc => doc.id);
      
      await axios.put(`${BACKEND_URL}/api/documents/reorder`, { document_ids: documentIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Documents reordered successfully');
    } catch (error) {
      console.error('Error reordering documents:', error);
      toast.error('Failed to save order');
      fetchDocuments();
    }
    
    setDraggedItem(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FileIcon className="text-blue-500" size={24} />;
      default:
        return <FileIcon className="text-gray-500" size={24} />;
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
    <div className="min-h-screen bg-gray-50" data-testid="admin-documents">
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
                <h1 className="text-2xl font-bold text-gray-900">Governance Documents</h1>
                <p className="text-gray-600">Manage documents for the Constitution & Governance page</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingDocument(null);
                setFormData({ title: '', file_url: '', file_type: '', file_size: 0 });
                setShowModal(true);
              }}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              data-testid="add-document-btn"
            >
              <Plus size={20} className="mr-2" />
              Add Document
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {documents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
            <p className="text-gray-600 mb-6">Add your first governance document to get started.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Add Your First Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder documents. The order will be reflected on the public page.
            </p>
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg shadow-md p-4 flex items-center gap-4 cursor-move transition-all ${
                  draggedItem === index ? 'opacity-50 scale-[1.02]' : ''
                }`}
                data-testid={`document-item-${doc.id}`}
              >
                <div className="text-gray-400 hover:text-gray-600">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-shrink-0">
                  {getFileIcon(doc.file_type)}
                </div>
                
                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                  <p className="text-sm text-gray-500">
                    {doc.file_type?.toUpperCase()} • {formatFileSize(doc.file_size)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View document"
                    data-testid={`view-document-${doc.id}`}
                  >
                    <FileText size={18} />
                  </a>
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit document"
                    data-testid={`edit-document-${doc.id}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                    data-testid={`delete-document-${doc.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Document Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingDocument ? 'Edit Document' : 'Add New Document'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDocument(null);
                  setFormData({ title: '', file_url: '', file_type: '', file_size: 0 });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document File *
                </label>
                
                {formData.file_url ? (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3">
                      {getFileIcon(formData.file_type)}
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formData.file_type?.toUpperCase()} Document
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(formData.file_size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, file_url: '', file_type: '', file_size: 0 }))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className={`
                    border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200
                    flex flex-col items-center justify-center
                    ${uploading ? 'pointer-events-none opacity-60' : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'}
                  `}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="document-file-input"
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
                          Click to upload document
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, or DOCX (max 50MB)
                        </p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Document Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Constitution 2025"
                  data-testid="document-title-input"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDocument(null);
                    setFormData({ title: '', file_url: '', file_type: '', file_size: 0 });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="save-document-btn"
                >
                  {saving ? 'Saving...' : editingDocument ? 'Update Document' : 'Add Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;

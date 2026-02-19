import React, { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const ImageUpload = ({ 
  value, 
  onChange, 
  label = "Image",
  className = "",
  previewClassName = "h-32",
  testId = "image-upload"
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload an image (JPG, PNG, GIF, WebP, or SVG)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      // Construct the full URL for the uploaded image
      const imageUrl = `${BACKEND_URL}${response.data.url}`;
      onChange(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
        data-testid={`${testId}-input`}
      />

      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className={`w-full object-cover rounded-lg ${previewClassName}`}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="12">Image</text></svg>';
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              title="Replace image"
              data-testid={`${testId}-replace`}
            >
              <Upload size={16} className="text-gray-600" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              title="Remove image"
              data-testid={`${testId}-remove`}
            >
              <X size={16} className="text-red-600" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200
            flex flex-col items-center justify-center
            ${dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'}
            ${uploading ? 'pointer-events-none opacity-60' : ''}
          `}
          data-testid={`${testId}-dropzone`}
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-red-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                <Image size={24} className="text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WebP or SVG (max 10MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

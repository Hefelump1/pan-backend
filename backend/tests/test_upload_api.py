"""
Test file for image upload API functionality
Tests: POST /api/upload, DELETE /api/upload/{filename}, static file serving
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestUploadAPI:
    """Tests for image upload endpoint"""

    # ============== POST /api/upload Tests ==============
    
    def test_upload_jpg_image(self):
        """Test uploading a valid JPG image"""
        # Create a simple test image (1x1 white pixel JPG)
        jpg_data = bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
            0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
            0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
            0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
            0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
            0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
            0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
            0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
            0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
            0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
            0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
            0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
            0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
            0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
            0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
            0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD5, 0xFF, 0xD9
        ])
        
        files = {'file': ('test_image.jpg', io.BytesIO(jpg_data), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        
        assert 'filename' in data, "Response missing filename"
        assert 'url' in data, "Response missing url"
        assert 'size' in data, "Response missing size"
        assert 'content_type' in data, "Response missing content_type"
        assert data['url'].startswith('/api/uploads/'), "URL format incorrect"
        assert data['filename'].endswith('.jpg'), "Filename should end with .jpg"
        print(f"Upload successful: {data}")

    def test_upload_png_image(self):
        """Test uploading a valid PNG image"""
        # Minimal valid PNG (1x1 transparent pixel)
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,  # PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,  # IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,  # IDAT chunk
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,  # IEND chunk
            0x42, 0x60, 0x82
        ])
        
        files = {'file': ('test_image.png', io.BytesIO(png_data), 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.png'), "Filename should end with .png"
        print(f"PNG upload successful: {data}")

    def test_upload_gif_image(self):
        """Test uploading a valid GIF image"""
        # Minimal valid GIF (1x1 pixel)
        gif_data = bytes([
            0x47, 0x49, 0x46, 0x38, 0x39, 0x61,  # GIF89a
            0x01, 0x00, 0x01, 0x00,              # Width=1, Height=1
            0x00, 0x00, 0x00,                    # Flags
            0x2C, 0x00, 0x00, 0x00, 0x00,        # Image descriptor
            0x01, 0x00, 0x01, 0x00, 0x00,
            0x02, 0x02, 0x44, 0x01, 0x00,        # Image data
            0x3B                                 # Trailer
        ])
        
        files = {'file': ('test_image.gif', io.BytesIO(gif_data), 'image/gif')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.gif'), "Filename should end with .gif"
        print(f"GIF upload successful: {data}")

    def test_upload_webp_image(self):
        """Test uploading a valid WebP image"""
        # Minimal valid WebP
        webp_data = bytes([
            0x52, 0x49, 0x46, 0x46,  # RIFF
            0x1A, 0x00, 0x00, 0x00,  # File size
            0x57, 0x45, 0x42, 0x50,  # WEBP
            0x56, 0x50, 0x38, 0x4C,  # VP8L
            0x0D, 0x00, 0x00, 0x00,  # Chunk size
            0x2F, 0x00, 0x00, 0x00,  # Signature
            0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00
        ])
        
        files = {'file': ('test_image.webp', io.BytesIO(webp_data), 'image/webp')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.webp'), "Filename should end with .webp"
        print(f"WebP upload successful: {data}")

    def test_upload_svg_image(self):
        """Test uploading a valid SVG image"""
        svg_data = b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect fill="red"/></svg>'
        
        files = {'file': ('test_image.svg', io.BytesIO(svg_data), 'image/svg+xml')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.svg'), "Filename should end with .svg"
        print(f"SVG upload successful: {data}")

    def test_upload_invalid_file_type_txt(self):
        """Test that uploading a text file is rejected"""
        files = {'file': ('test.txt', io.BytesIO(b'Hello World'), 'text/plain')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert 'detail' in data, "Response should have detail message"
        assert 'not allowed' in data['detail'].lower(), f"Unexpected error: {data['detail']}"
        print(f"Text file correctly rejected: {data['detail']}")

    def test_upload_invalid_file_type_pdf(self):
        """Test that uploading a PDF file is rejected"""
        files = {'file': ('test.pdf', io.BytesIO(b'%PDF-1.4 test'), 'application/pdf')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"PDF file correctly rejected")

    def test_upload_invalid_file_type_exe(self):
        """Test that uploading an executable is rejected"""
        files = {'file': ('test.exe', io.BytesIO(b'MZ executable'), 'application/x-executable')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print(f"Executable file correctly rejected")

    def test_upload_file_too_large(self):
        """Test that files over 10MB are rejected"""
        # Create a file just over 10MB (10MB + 1KB)
        large_file = b'x' * (10 * 1024 * 1024 + 1024)
        files = {'file': ('large.jpg', io.BytesIO(large_file), 'image/jpeg')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert 'too large' in data['detail'].lower() or 'size' in data['detail'].lower(), f"Unexpected error: {data['detail']}"
        print(f"Large file correctly rejected: {data['detail']}")

    def test_upload_and_serve_static_file(self):
        """Test uploading an image and then accessing it via static file serving"""
        # Create simple PNG
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        ])
        
        # Upload the file
        files = {'file': ('test_serve.png', io.BytesIO(png_data), 'image/png')}
        upload_response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert upload_response.status_code == 200, f"Upload failed: {upload_response.text}"
        data = upload_response.json()
        
        # Try to fetch the uploaded file
        file_url = f"{BASE_URL}{data['url']}"
        serve_response = requests.get(file_url)
        
        assert serve_response.status_code == 200, f"Failed to serve file: {serve_response.status_code}"
        print(f"File uploaded and served successfully: {file_url}")

    def test_upload_response_structure(self):
        """Test that upload response has all required fields"""
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        ])
        
        files = {'file': ('response_test.png', io.BytesIO(png_data), 'image/png')}
        response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert response.status_code == 200
        data = response.json()
        
        # Validate response structure
        assert 'filename' in data, "Missing filename field"
        assert 'url' in data, "Missing url field"
        assert 'size' in data, "Missing size field"
        assert 'content_type' in data, "Missing content_type field"
        
        # Validate types
        assert isinstance(data['filename'], str), "filename should be string"
        assert isinstance(data['url'], str), "url should be string"
        assert isinstance(data['size'], int), "size should be integer"
        assert isinstance(data['content_type'], str), "content_type should be string"
        
        # Validate URL format
        assert data['url'].startswith('/api/uploads/'), f"URL should start with /api/uploads/, got: {data['url']}"
        
        print(f"Response structure valid: {data}")


class TestDeleteAPI:
    """Tests for image delete endpoint"""

    def test_delete_uploaded_file(self):
        """Test uploading and then deleting a file"""
        # First upload a file
        png_data = bytes([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        ])
        
        files = {'file': ('delete_test.png', io.BytesIO(png_data), 'image/png')}
        upload_response = requests.post(f"{BASE_URL}/api/upload", files=files)
        assert upload_response.status_code == 200
        
        filename = upload_response.json()['filename']
        
        # Delete the file
        delete_response = requests.delete(f"{BASE_URL}/api/upload/{filename}")
        assert delete_response.status_code == 200, f"Delete failed: {delete_response.text}"
        
        data = delete_response.json()
        assert 'message' in data, "Delete response should have message"
        print(f"File deleted successfully: {data['message']}")
        
        # Verify file is no longer accessible
        serve_response = requests.get(f"{BASE_URL}/api/uploads/{filename}")
        assert serve_response.status_code == 404, f"File should not exist after delete, got {serve_response.status_code}"
        print(f"Verified file no longer accessible")

    def test_delete_nonexistent_file(self):
        """Test deleting a file that doesn't exist"""
        response = requests.delete(f"{BASE_URL}/api/upload/nonexistent-file-12345.png")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"Non-existent file deletion correctly returned 404")

    def test_delete_path_traversal_prevention(self):
        """Test that path traversal attacks are blocked"""
        # Try to delete with path traversal
        response = requests.delete(f"{BASE_URL}/api/upload/../../../etc/passwd")
        # 400 if caught by validation, 404 if route doesn't match - both block the attack
        assert response.status_code in [400, 404], f"Path traversal should be blocked, got {response.status_code}"
        print(f"Path traversal attack blocked with status {response.status_code}")

    def test_delete_with_slash_in_filename(self):
        """Test that filenames with slashes are rejected"""
        response = requests.delete(f"{BASE_URL}/api/upload/subdir/file.png")
        # 400 if caught by validation, 404 if route doesn't match - both block the attack
        assert response.status_code in [400, 404], f"Slash in filename should be blocked, got {response.status_code}"
        print(f"Slash in filename correctly rejected with status {response.status_code}")


class TestStaticFileServing:
    """Tests for static file serving at /api/uploads/"""

    def test_access_nonexistent_file(self):
        """Test accessing a file that doesn't exist"""
        response = requests.get(f"{BASE_URL}/api/uploads/nonexistent-file-99999.png")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"Non-existent file correctly returns 404")

    def test_upload_and_verify_content(self):
        """Test that uploaded file content is preserved"""
        # Create specific test content
        test_content = b'<svg xmlns="http://www.w3.org/2000/svg"><rect fill="blue"/></svg>'
        
        files = {'file': ('content_test.svg', io.BytesIO(test_content), 'image/svg+xml')}
        upload_response = requests.post(f"{BASE_URL}/api/upload", files=files)
        
        assert upload_response.status_code == 200
        data = upload_response.json()
        
        # Fetch and verify content
        serve_response = requests.get(f"{BASE_URL}{data['url']}")
        assert serve_response.status_code == 200
        
        # Verify content matches
        assert serve_response.content == test_content, "File content doesn't match uploaded content"
        print(f"File content verified successfully")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/upload/{data['filename']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

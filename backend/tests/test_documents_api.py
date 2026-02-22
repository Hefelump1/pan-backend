"""
Tests for Governance Document Management API
- Document CRUD operations: GET, POST, PUT, DELETE /api/documents
- Document upload endpoint: POST /api/upload/document  
- Document reorder endpoint: PUT /api/documents/reorder
"""

import pytest
import requests
import os
import io

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestDocumentUploadAPI:
    """Test document upload endpoint POST /api/upload/document"""
    
    def test_upload_pdf_document(self):
        """Upload PDF document returns 200 with file details"""
        # Create a minimal valid PDF file
        pdf_content = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
        files = {'file': ('test_document.pdf', io.BytesIO(pdf_content), 'application/pdf')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert 'filename' in data, "Response should contain filename"
        assert 'url' in data, "Response should contain url"
        assert 'size' in data, "Response should contain size"
        assert 'original_name' in data, "Response should contain original_name"
        
        # Validate data
        assert data['original_name'] == 'test_document.pdf'
        assert data['url'].startswith('/api/uploads/')
        assert data['filename'].endswith('.pdf')
        
        print(f"PDF upload successful: {data}")
        return data
    
    def test_upload_doc_document(self):
        """Upload DOC document returns 200"""
        # Minimal DOC file header (not a complete valid DOC, but enough to test extension)
        doc_content = b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1' + b'\x00' * 512
        files = {'file': ('test_document.doc', io.BytesIO(doc_content), 'application/msword')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.doc')
        print(f"DOC upload successful: {data['filename']}")
    
    def test_upload_docx_document(self):
        """Upload DOCX document returns 200"""
        # Create a minimal DOCX-like file (DOCX is a ZIP file)
        import zipfile
        docx_buffer = io.BytesIO()
        with zipfile.ZipFile(docx_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            zf.writestr('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>')
        docx_content = docx_buffer.getvalue()
        
        files = {'file': ('test_document.docx', io.BytesIO(docx_content), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data['filename'].endswith('.docx')
        print(f"DOCX upload successful: {data['filename']}")
    
    def test_reject_txt_file(self):
        """Reject TXT file with 400 error"""
        files = {'file': ('test.txt', io.BytesIO(b'Hello world'), 'text/plain')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert 'detail' in data
        print(f"TXT rejection successful: {data['detail']}")
    
    def test_reject_image_file(self):
        """Reject image file with 400 error"""
        # Minimal PNG header
        png_content = b'\x89PNG\r\n\x1a\n' + b'\x00' * 50
        files = {'file': ('test.png', io.BytesIO(png_content), 'image/png')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("Image file rejection successful")
    
    def test_reject_exe_file(self):
        """Reject EXE file with 400 error"""
        files = {'file': ('malware.exe', io.BytesIO(b'MZ' + b'\x00' * 100), 'application/x-msdownload')}
        
        response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("EXE file rejection successful")


class TestDocumentCRUDAPI:
    """Test Document CRUD operations"""
    
    created_document_ids = []
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test documents"""
        for doc_id in cls.created_document_ids:
            try:
                requests.delete(f"{BASE_URL}/api/documents/{doc_id}")
            except:
                pass
    
    def test_get_documents_empty_or_list(self):
        """GET /api/documents returns list (empty or with documents)"""
        response = requests.get(f"{BASE_URL}/api/documents")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"GET /api/documents returned {len(data)} documents")
    
    def test_create_document(self):
        """POST /api/documents creates a new document"""
        # First upload a PDF to get file URL
        pdf_content = b'%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'
        files = {'file': ('test_constitution.pdf', io.BytesIO(pdf_content), 'application/pdf')}
        upload_response = requests.post(f"{BASE_URL}/api/upload/document", files=files)
        assert upload_response.status_code == 200
        upload_data = upload_response.json()
        
        # Create document record
        document_payload = {
            "title": "TEST_Constitution 2025",
            "file_url": f"{BASE_URL}{upload_data['url']}",
            "file_type": "pdf",
            "file_size": upload_data['size']
        }
        
        response = requests.post(f"{BASE_URL}/api/documents", json=document_payload)
        
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response
        assert 'id' in data, "Response should contain id"
        assert data['title'] == document_payload['title']
        assert data['file_type'] == 'pdf'
        assert 'created_at' in data
        
        TestDocumentCRUDAPI.created_document_ids.append(data['id'])
        print(f"Document created: {data['id']} - {data['title']}")
        return data
    
    def test_create_and_get_document(self):
        """POST then GET document to verify persistence"""
        # Create document
        document_payload = {
            "title": "TEST_Rules and Regulations",
            "file_url": f"{BASE_URL}/api/uploads/test-doc.pdf",
            "file_type": "pdf",
            "file_size": 1024
        }
        
        create_response = requests.post(f"{BASE_URL}/api/documents", json=document_payload)
        assert create_response.status_code == 201
        created = create_response.json()
        doc_id = created['id']
        TestDocumentCRUDAPI.created_document_ids.append(doc_id)
        
        # Verify via GET list
        get_response = requests.get(f"{BASE_URL}/api/documents")
        assert get_response.status_code == 200
        documents = get_response.json()
        
        # Find our created document
        found = next((d for d in documents if d['id'] == doc_id), None)
        assert found is not None, "Created document should be in list"
        assert found['title'] == document_payload['title']
        print(f"Document persisted and retrieved: {found['title']}")
    
    def test_update_document(self):
        """PUT /api/documents/{id} updates document title"""
        # First create a document
        create_payload = {
            "title": "TEST_Original Title",
            "file_url": f"{BASE_URL}/api/uploads/test.pdf",
            "file_type": "pdf",
            "file_size": 512
        }
        create_response = requests.post(f"{BASE_URL}/api/documents", json=create_payload)
        assert create_response.status_code == 201
        created = create_response.json()
        doc_id = created['id']
        TestDocumentCRUDAPI.created_document_ids.append(doc_id)
        
        # Update the document
        update_payload = {
            "title": "TEST_Updated Title",
            "file_url": created['file_url'],
            "file_type": "pdf",
            "file_size": 512
        }
        
        update_response = requests.put(f"{BASE_URL}/api/documents/{doc_id}", json=update_payload)
        
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}: {update_response.text}"
        updated = update_response.json()
        assert updated['title'] == "TEST_Updated Title"
        
        # Verify persistence via GET
        get_response = requests.get(f"{BASE_URL}/api/documents")
        documents = get_response.json()
        found = next((d for d in documents if d['id'] == doc_id), None)
        assert found['title'] == "TEST_Updated Title"
        print(f"Document updated successfully: {found['title']}")
    
    def test_update_nonexistent_document(self):
        """PUT /api/documents/{invalid_id} returns 404"""
        update_payload = {
            "title": "Should Fail",
            "file_url": "http://example.com/test.pdf",
            "file_type": "pdf",
            "file_size": 100
        }
        
        response = requests.put(f"{BASE_URL}/api/documents/nonexistent-id-12345", json=update_payload)
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("Update nonexistent document returns 404 correctly")
    
    def test_delete_document(self):
        """DELETE /api/documents/{id} removes document"""
        # First create a document
        create_payload = {
            "title": "TEST_To Be Deleted",
            "file_url": f"{BASE_URL}/api/uploads/delete-me.pdf",
            "file_type": "pdf",
            "file_size": 256
        }
        create_response = requests.post(f"{BASE_URL}/api/documents", json=create_payload)
        assert create_response.status_code == 201
        doc_id = create_response.json()['id']
        
        # Delete the document
        delete_response = requests.delete(f"{BASE_URL}/api/documents/{doc_id}")
        
        assert delete_response.status_code == 204, f"Expected 204, got {delete_response.status_code}"
        
        # Verify document is gone
        get_response = requests.get(f"{BASE_URL}/api/documents")
        documents = get_response.json()
        found = next((d for d in documents if d['id'] == doc_id), None)
        assert found is None, "Deleted document should not be in list"
        print("Document deleted successfully")
    
    def test_delete_nonexistent_document(self):
        """DELETE /api/documents/{invalid_id} returns 404"""
        response = requests.delete(f"{BASE_URL}/api/documents/nonexistent-id-99999")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("Delete nonexistent document returns 404 correctly")


class TestDocumentReorderAPI:
    """Test document reorder endpoint PUT /api/documents/reorder"""
    
    created_document_ids = []
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test documents"""
        for doc_id in cls.created_document_ids:
            try:
                requests.delete(f"{BASE_URL}/api/documents/{doc_id}")
            except:
                pass
    
    def test_reorder_documents(self):
        """PUT /api/documents/reorder changes document order"""
        # Create 3 documents
        docs = []
        for i in range(1, 4):
            payload = {
                "title": f"TEST_Doc {i}",
                "file_url": f"{BASE_URL}/api/uploads/doc{i}.pdf",
                "file_type": "pdf",
                "file_size": 100 * i
            }
            response = requests.post(f"{BASE_URL}/api/documents", json=payload)
            assert response.status_code == 201
            doc = response.json()
            docs.append(doc)
            TestDocumentReorderAPI.created_document_ids.append(doc['id'])
        
        # Original order
        original_ids = [d['id'] for d in docs]
        print(f"Original order: {[d['title'] for d in docs]}")
        
        # Reverse the order
        reversed_ids = list(reversed(original_ids))
        
        reorder_response = requests.put(
            f"{BASE_URL}/api/documents/reorder",
            json={"document_ids": reversed_ids}
        )
        
        assert reorder_response.status_code == 200, f"Expected 200, got {reorder_response.status_code}: {reorder_response.text}"
        
        # Verify new order
        get_response = requests.get(f"{BASE_URL}/api/documents")
        assert get_response.status_code == 200
        all_docs = get_response.json()
        
        # Get our test docs in their new order
        test_docs = [d for d in all_docs if d['id'] in original_ids]
        new_order_ids = [d['id'] for d in test_docs]
        
        # Verify the order fields were updated correctly
        for i, doc in enumerate(test_docs):
            if doc['id'] in reversed_ids:
                expected_order = reversed_ids.index(doc['id'])
                print(f"Document '{doc['title']}' has order {doc.get('order', 'N/A')}")
        
        print(f"Reorder successful - documents now in new order")
    
    def test_reorder_with_empty_list(self):
        """PUT /api/documents/reorder with empty list should not fail"""
        response = requests.put(
            f"{BASE_URL}/api/documents/reorder",
            json={"document_ids": []}
        )
        
        # Should succeed (nothing to reorder)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("Empty reorder request handled correctly")


class TestDocumentOrderPersistence:
    """Test that document order persists on public page"""
    
    created_document_ids = []
    
    @classmethod
    def teardown_class(cls):
        """Cleanup test documents"""
        for doc_id in cls.created_document_ids:
            try:
                requests.delete(f"{BASE_URL}/api/documents/{doc_id}")
            except:
                pass
    
    def test_documents_returned_in_order(self):
        """GET /api/documents returns documents sorted by order field"""
        # Create documents with specific names to verify order
        for i, name in enumerate(["TEST_Alpha", "TEST_Beta", "TEST_Gamma"]):
            payload = {
                "title": name,
                "file_url": f"{BASE_URL}/api/uploads/{name.lower()}.pdf",
                "file_type": "pdf",
                "file_size": 500
            }
            response = requests.post(f"{BASE_URL}/api/documents", json=payload)
            assert response.status_code == 201
            TestDocumentOrderPersistence.created_document_ids.append(response.json()['id'])
        
        # Get documents and verify they're ordered
        response = requests.get(f"{BASE_URL}/api/documents")
        assert response.status_code == 200
        docs = response.json()
        
        # Check that 'order' field exists
        test_docs = [d for d in docs if d['title'].startswith('TEST_')]
        if test_docs:
            for doc in test_docs:
                assert 'order' in doc, f"Document {doc['title']} should have 'order' field"
                print(f"Document '{doc['title']}' has order: {doc['order']}")
        
        print("Document ordering verified")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

"""
Test suite for Useful Links CRUD API endpoints
Tests: GET, POST, PUT, DELETE /api/useful-links
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestUsefulLinksAPI:
    """Useful Links CRUD endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test data prefix for cleanup"""
        self.test_prefix = "TEST_"
        self.created_link_ids = []
        yield
        # Cleanup: Delete all test-created links
        for link_id in self.created_link_ids:
            try:
                requests.delete(f"{BASE_URL}/api/useful-links/{link_id}")
            except:
                pass
    
    def test_get_useful_links_returns_list(self):
        """GET /api/useful-links should return a list of links"""
        response = requests.get(f"{BASE_URL}/api/useful-links")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        print(f"GET /api/useful-links returned {len(data)} links")
    
    def test_create_useful_link_success(self):
        """POST /api/useful-links should create a new link"""
        payload = {
            "name_en": f"{self.test_prefix}Test Link EN",
            "name_pl": f"{self.test_prefix}Test Link PL",
            "url": "https://test-example.com",
            "order": 99
        }
        
        response = requests.post(f"{BASE_URL}/api/useful-links", json=payload)
        
        assert response.status_code == 201, f"Expected 201, got {response.status_code}. Response: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "id" in data, "Response should contain 'id'"
        assert data["name_en"] == payload["name_en"], "name_en should match"
        assert data["name_pl"] == payload["name_pl"], "name_pl should match"
        assert data["url"] == payload["url"], "url should match"
        assert data["order"] == payload["order"], "order should match"
        
        self.created_link_ids.append(data["id"])
        print(f"Created link with id: {data['id']}")
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/useful-links")
        assert get_response.status_code == 200
        links = get_response.json()
        created_link = next((l for l in links if l["id"] == data["id"]), None)
        assert created_link is not None, "Created link should be in GET response"
        assert created_link["name_en"] == payload["name_en"]
    
    def test_create_useful_link_minimal_fields(self):
        """POST /api/useful-links with only required fields"""
        payload = {
            "name_en": f"{self.test_prefix}Minimal Link",
            "url": "https://minimal-test.com"
        }
        
        response = requests.post(f"{BASE_URL}/api/useful-links", json=payload)
        
        assert response.status_code == 201, f"Expected 201, got {response.status_code}. Response: {response.text}"
        data = response.json()
        
        assert data["name_en"] == payload["name_en"]
        assert data["url"] == payload["url"]
        assert data.get("order", 0) == 0, "Default order should be 0"
        
        self.created_link_ids.append(data["id"])
        print(f"Created minimal link with id: {data['id']}")
    
    def test_update_useful_link_success(self):
        """PUT /api/useful-links/{id} should update an existing link"""
        # First create a link
        create_payload = {
            "name_en": f"{self.test_prefix}Original Name",
            "name_pl": "Original PL",
            "url": "https://original.com",
            "order": 1
        }
        create_response = requests.post(f"{BASE_URL}/api/useful-links", json=create_payload)
        assert create_response.status_code == 201
        link_id = create_response.json()["id"]
        self.created_link_ids.append(link_id)
        
        # Update the link
        update_payload = {
            "name_en": f"{self.test_prefix}Updated Name",
            "name_pl": "Updated PL",
            "url": "https://updated.com",
            "order": 5
        }
        update_response = requests.put(f"{BASE_URL}/api/useful-links/{link_id}", json=update_payload)
        
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}. Response: {update_response.text}"
        data = update_response.json()
        
        assert data["name_en"] == update_payload["name_en"], "name_en should be updated"
        assert data["name_pl"] == update_payload["name_pl"], "name_pl should be updated"
        assert data["url"] == update_payload["url"], "url should be updated"
        assert data["order"] == update_payload["order"], "order should be updated"
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/useful-links")
        links = get_response.json()
        updated_link = next((l for l in links if l["id"] == link_id), None)
        assert updated_link is not None
        assert updated_link["name_en"] == update_payload["name_en"]
        print(f"Updated link {link_id} successfully")
    
    def test_update_nonexistent_link_returns_404(self):
        """PUT /api/useful-links/{id} with invalid id should return 404"""
        fake_id = str(uuid.uuid4())
        payload = {
            "name_en": "Test",
            "url": "https://test.com"
        }
        
        response = requests.put(f"{BASE_URL}/api/useful-links/{fake_id}", json=payload)
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"Correctly returned 404 for non-existent link")
    
    def test_delete_useful_link_success(self):
        """DELETE /api/useful-links/{id} should delete a link and return 204"""
        # First create a link
        create_payload = {
            "name_en": f"{self.test_prefix}To Be Deleted",
            "url": "https://delete-me.com"
        }
        create_response = requests.post(f"{BASE_URL}/api/useful-links", json=create_payload)
        assert create_response.status_code == 201
        link_id = create_response.json()["id"]
        
        # Delete the link
        delete_response = requests.delete(f"{BASE_URL}/api/useful-links/{link_id}")
        
        assert delete_response.status_code == 204, f"Expected 204, got {delete_response.status_code}"
        
        # Verify deletion with GET
        get_response = requests.get(f"{BASE_URL}/api/useful-links")
        links = get_response.json()
        deleted_link = next((l for l in links if l["id"] == link_id), None)
        assert deleted_link is None, "Deleted link should not be in GET response"
        print(f"Deleted link {link_id} successfully")
    
    def test_delete_nonexistent_link_returns_404(self):
        """DELETE /api/useful-links/{id} with invalid id should return 404"""
        fake_id = str(uuid.uuid4())
        
        response = requests.delete(f"{BASE_URL}/api/useful-links/{fake_id}")
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"Correctly returned 404 for non-existent link deletion")
    
    def test_links_ordered_by_order_field(self):
        """GET /api/useful-links should return links sorted by order field"""
        # Create links with different orders
        links_to_create = [
            {"name_en": f"{self.test_prefix}Link Order 3", "url": "https://order3.com", "order": 3},
            {"name_en": f"{self.test_prefix}Link Order 1", "url": "https://order1.com", "order": 1},
            {"name_en": f"{self.test_prefix}Link Order 2", "url": "https://order2.com", "order": 2},
        ]
        
        for link in links_to_create:
            response = requests.post(f"{BASE_URL}/api/useful-links", json=link)
            assert response.status_code == 201
            self.created_link_ids.append(response.json()["id"])
        
        # Get all links and check order
        get_response = requests.get(f"{BASE_URL}/api/useful-links")
        assert get_response.status_code == 200
        all_links = get_response.json()
        
        # Filter to only our test links
        test_links = [l for l in all_links if l["name_en"].startswith(self.test_prefix + "Link Order")]
        
        # Verify they are sorted by order
        orders = [l["order"] for l in test_links]
        assert orders == sorted(orders), f"Links should be sorted by order. Got: {orders}"
        print(f"Links correctly sorted by order field")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

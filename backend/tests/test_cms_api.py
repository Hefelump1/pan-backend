"""
CMS API Tests for Polish Association of Newcastle
Tests: News, Events, Committee, Groups CRUD operations
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "#ZwiazekPolski1"


class TestHealthAndBasicEndpoints:
    """Basic health and connectivity tests"""
    
    def test_health_endpoint(self):
        """Test health endpoint returns 200"""
        response = requests.get(f"{BASE_URL}/health")
        assert response.status_code == 200
        print(f"Health check: {response.status_code}")
    
    def test_api_events_endpoint(self):
        """Test events endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/events")
        assert response.status_code == 200
        print(f"Events endpoint: {response.status_code}, count: {len(response.json())}")
    
    def test_api_news_endpoint(self):
        """Test news endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        print(f"News endpoint: {response.status_code}, count: {len(response.json())}")
    
    def test_api_committee_endpoint(self):
        """Test committee endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/committee")
        assert response.status_code == 200
        print(f"Committee endpoint: {response.status_code}, count: {len(response.json())}")
    
    def test_api_groups_endpoint(self):
        """Test groups endpoint is accessible"""
        response = requests.get(f"{BASE_URL}/api/groups")
        assert response.status_code == 200
        print(f"Groups endpoint: {response.status_code}, count: {len(response.json())}")


class TestAdminAuthentication:
    """Admin authentication flow tests"""
    
    def test_login_with_valid_credentials(self):
        """Test admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        print(f"Login response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            assert "access_token" in data
            assert data["token_type"] == "bearer"
            print("SUCCESS: Admin login works correctly")
        elif response.status_code == 401:
            # Admin user may not exist yet - need to register first
            print("INFO: Admin user not found - may need registration")
            pytest.skip("Admin user not registered yet")
        else:
            print(f"Login failed with status: {response.status_code}, response: {response.text}")
            pytest.fail(f"Unexpected login response: {response.status_code}")
    
    def test_login_with_invalid_credentials(self):
        """Test login fails with wrong credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": "wronguser",
            "password": "wrongpass"
        })
        assert response.status_code == 401
        print("SUCCESS: Invalid credentials correctly rejected")
    
    def test_register_admin_if_not_exists(self):
        """Register admin user if not exists"""
        # First try to login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        
        if login_response.status_code == 200:
            print("Admin user already exists")
            return
        
        # Try to register
        register_response = requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        if register_response.status_code == 201:
            print("SUCCESS: Admin user registered")
        elif register_response.status_code == 400:
            print("INFO: Admin user already exists")
        else:
            print(f"Registration response: {register_response.status_code}, {register_response.text}")


class TestNewsCRUD:
    """News CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        # First ensure admin exists
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate")
    
    def test_create_news_article(self, auth_token):
        """Test creating a news article"""
        test_id = str(uuid.uuid4())[:8]
        news_data = {
            "title_en": f"TEST_News Article {test_id}",
            "title_pl": f"TEST_Artykuł {test_id}",
            "summary_en": "This is a test news article summary in English",
            "summary_pl": "To jest podsumowanie testowego artykułu po polsku",
            "content_en": "Full content in English",
            "content_pl": "Pełna treść po polsku",
            "date": "2025-01-15",
            "published": True
        }
        
        response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["title_en"] == news_data["title_en"]
        assert data["title_pl"] == news_data["title_pl"]
        assert "id" in data
        print(f"SUCCESS: Created news article with ID: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/news/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_get_all_news(self):
        """Test getting all news articles"""
        response = requests.get(f"{BASE_URL}/api/news")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        print(f"SUCCESS: Got {len(response.json())} news articles")
    
    def test_get_published_news(self):
        """Test getting only published news"""
        response = requests.get(f"{BASE_URL}/api/news/published")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned articles should be published
        for article in data:
            assert article.get("published", True) == True
        print(f"SUCCESS: Got {len(data)} published news articles")
    
    def test_news_crud_full_cycle(self, auth_token):
        """Test full CRUD cycle for news"""
        test_id = str(uuid.uuid4())[:8]
        
        # CREATE
        news_data = {
            "title_en": f"TEST_CRUD News {test_id}",
            "title_pl": f"TEST_CRUD Artykuł {test_id}",
            "summary_en": "Test summary EN",
            "summary_pl": "Test summary PL",
            "date": "2025-01-15",
            "published": False
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        news_id = created["id"]
        print(f"Created news: {news_id}")
        
        # READ
        get_response = requests.get(f"{BASE_URL}/api/news/{news_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["title_en"] == news_data["title_en"]
        print(f"Read news: {fetched['title_en']}")
        
        # UPDATE
        update_data = {
            "title_en": f"TEST_UPDATED News {test_id}",
            "title_pl": f"TEST_UPDATED Artykuł {test_id}",
            "summary_en": "Updated summary EN",
            "summary_pl": "Updated summary PL",
            "date": "2025-01-16",
            "published": True
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/news/{news_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title_en"] == update_data["title_en"]
        assert updated["published"] == True
        print(f"Updated news: {updated['title_en']}")
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/news/{news_id}")
        assert verify_response.status_code == 200
        verified = verify_response.json()
        assert verified["title_en"] == update_data["title_en"]
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/news/{news_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 204
        print(f"Deleted news: {news_id}")
        
        # Verify deletion
        verify_delete = requests.get(f"{BASE_URL}/api/news/{news_id}")
        assert verify_delete.status_code == 404
        print("SUCCESS: Full news CRUD cycle completed")


class TestEventsCRUD:
    """Events CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate")
    
    def test_create_event(self, auth_token):
        """Test creating an event"""
        test_id = str(uuid.uuid4())[:8]
        event_data = {
            "title": f"TEST_Event {test_id}",
            "date": "2025-02-15",
            "time": "18:00",
            "location": "Polish Cultural Centre",
            "description": "Test event description",
            "category": "cultural"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/events",
            json=event_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == event_data["title"]
        assert "id" in data
        print(f"SUCCESS: Created event with ID: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/events/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_events_crud_full_cycle(self, auth_token):
        """Test full CRUD cycle for events"""
        test_id = str(uuid.uuid4())[:8]
        
        # CREATE
        event_data = {
            "title": f"TEST_CRUD Event {test_id}",
            "date": "2025-03-01",
            "time": "19:00",
            "location": "Main Hall",
            "description": "Test event for CRUD",
            "category": "social"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/events",
            json=event_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        event_id = created["id"]
        print(f"Created event: {event_id}")
        
        # READ
        get_response = requests.get(f"{BASE_URL}/api/events/{event_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["title"] == event_data["title"]
        
        # UPDATE
        update_data = {
            "title": f"TEST_UPDATED Event {test_id}",
            "date": "2025-03-02",
            "time": "20:00",
            "location": "Updated Hall",
            "description": "Updated description",
            "category": "educational"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/events/{event_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == update_data["title"]
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/events/{event_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 204
        
        # Verify deletion
        verify_delete = requests.get(f"{BASE_URL}/api/events/{event_id}")
        assert verify_delete.status_code == 404
        print("SUCCESS: Full events CRUD cycle completed")


class TestCommitteeCRUD:
    """Committee CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate")
    
    def test_create_committee_member(self, auth_token):
        """Test creating a committee member"""
        test_id = str(uuid.uuid4())[:8]
        member_data = {
            "name": f"TEST_Member {test_id}",
            "position": "Test Position",
            "bio": "Test biography",
            "order": 99
        }
        
        response = requests.post(
            f"{BASE_URL}/api/committee",
            json=member_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == member_data["name"]
        assert "id" in data
        print(f"SUCCESS: Created committee member with ID: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/committee/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_committee_crud_full_cycle(self, auth_token):
        """Test full CRUD cycle for committee"""
        test_id = str(uuid.uuid4())[:8]
        
        # CREATE
        member_data = {
            "name": f"TEST_CRUD Member {test_id}",
            "position": "Secretary",
            "bio": "Test bio",
            "order": 99
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/committee",
            json=member_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        member_id = created["id"]
        
        # UPDATE
        update_data = {
            "name": f"TEST_UPDATED Member {test_id}",
            "position": "Vice President",
            "bio": "Updated bio",
            "order": 2
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/committee/{member_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/committee/{member_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 204
        print("SUCCESS: Full committee CRUD cycle completed")


class TestGroupsCRUD:
    """Groups CRUD operations tests"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate")
    
    def test_create_group(self, auth_token):
        """Test creating an associated group"""
        test_id = str(uuid.uuid4())[:8]
        group_data = {
            "name_en": f"TEST_Group {test_id}",
            "name_pl": f"TEST_Grupa {test_id}",
            "description_en": "Test group description EN",
            "description_pl": "Test group description PL",
            "schedule_en": "Saturdays 10:00 AM",
            "schedule_pl": "Soboty 10:00",
            "contact": "test@example.com"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/groups",
            json=group_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name_en"] == group_data["name_en"]
        assert "id" in data
        print(f"SUCCESS: Created group with ID: {data['id']}")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/groups/{data['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_groups_crud_full_cycle(self, auth_token):
        """Test full CRUD cycle for groups"""
        test_id = str(uuid.uuid4())[:8]
        
        # CREATE
        group_data = {
            "name_en": f"TEST_CRUD Group {test_id}",
            "name_pl": f"TEST_CRUD Grupa {test_id}",
            "description_en": "Test description EN",
            "description_pl": "Test description PL",
            "schedule_en": "Mondays 6 PM",
            "schedule_pl": "Poniedziałki 18:00",
            "contact": "crud@test.com"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/groups",
            json=group_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        group_id = created["id"]
        
        # UPDATE
        update_data = {
            "name_en": f"TEST_UPDATED Group {test_id}",
            "name_pl": f"TEST_UPDATED Grupa {test_id}",
            "description_en": "Updated description EN",
            "description_pl": "Updated description PL",
            "schedule_en": "Tuesdays 7 PM",
            "schedule_pl": "Wtorki 19:00",
            "contact": "updated@test.com"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/groups/{group_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/groups/{group_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 204
        print("SUCCESS: Full groups CRUD cycle completed")


class TestBilingualSupport:
    """Test bilingual (EN/PL) support for news articles"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        requests.post(f"{BASE_URL}/api/auth/register", json={
            "username": ADMIN_USERNAME,
            "email": "admin@polishassociationnewcastle.org.au",
            "password": ADMIN_PASSWORD,
            "full_name": "Admin User"
        })
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "username": ADMIN_USERNAME,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not authenticate")
    
    def test_news_has_bilingual_fields(self, auth_token):
        """Test that news articles have both EN and PL fields"""
        test_id = str(uuid.uuid4())[:8]
        
        news_data = {
            "title_en": f"English Title {test_id}",
            "title_pl": f"Polski Tytuł {test_id}",
            "summary_en": "English summary text",
            "summary_pl": "Polskie podsumowanie",
            "content_en": "Full English content",
            "content_pl": "Pełna polska treść",
            "date": "2025-01-15",
            "published": True
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/news",
            json=news_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        
        # Verify all bilingual fields are present
        assert created["title_en"] == news_data["title_en"]
        assert created["title_pl"] == news_data["title_pl"]
        assert created["summary_en"] == news_data["summary_en"]
        assert created["summary_pl"] == news_data["summary_pl"]
        assert created["content_en"] == news_data["content_en"]
        assert created["content_pl"] == news_data["content_pl"]
        
        print("SUCCESS: News article has all bilingual fields")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/news/{created['id']}", headers={"Authorization": f"Bearer {auth_token}"})
    
    def test_groups_have_bilingual_fields(self, auth_token):
        """Test that groups have both EN and PL fields"""
        test_id = str(uuid.uuid4())[:8]
        
        group_data = {
            "name_en": f"English Group Name {test_id}",
            "name_pl": f"Polska Nazwa Grupy {test_id}",
            "description_en": "English description",
            "description_pl": "Polski opis",
            "schedule_en": "Saturdays 10 AM",
            "schedule_pl": "Soboty 10:00",
            "contact": "test@example.com"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/groups",
            json=group_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        
        # Verify all bilingual fields
        assert created["name_en"] == group_data["name_en"]
        assert created["name_pl"] == group_data["name_pl"]
        assert created["description_en"] == group_data["description_en"]
        assert created["description_pl"] == group_data["description_pl"]
        assert created["schedule_en"] == group_data["schedule_en"]
        assert created["schedule_pl"] == group_data["schedule_pl"]
        
        print("SUCCESS: Group has all bilingual fields")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/groups/{created['id']}", headers={"Authorization": f"Bearer {auth_token}"})

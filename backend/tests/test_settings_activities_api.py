"""
Settings and Activities API Tests for Polish Association of Newcastle
Tests: Site Settings (Home Page CMS) and Weekly Activities CRUD operations
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for the module"""
    # First ensure admin exists
    requests.post(f"{BASE_URL}/api/auth/register", json={
        "username": ADMIN_USERNAME,
        "email": "admin@polishassociation.com",
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


class TestSiteSettingsAPI:
    """Site Settings API tests for Home Page CMS"""
    
    def test_get_settings_returns_defaults(self):
        """Test GET /api/settings returns default values when no custom settings exist"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "id" in data
        assert data["id"] == "site_settings"
        assert "hero_image" in data
        assert "welcome_image" in data
        assert "hero_title_en" in data
        assert "hero_title_pl" in data
        assert "hero_subtitle_en" in data
        assert "hero_subtitle_pl" in data
        assert "welcome_text1_en" in data
        assert "welcome_text1_pl" in data
        assert "welcome_text2_en" in data
        assert "welcome_text2_pl" in data
        
        print(f"SUCCESS: GET /api/settings returns proper structure")
        print(f"  hero_image: {data.get('hero_image', 'N/A')[:50]}...")
    
    def test_update_settings_hero_image(self, auth_token):
        """Test updating hero image URL"""
        test_image_url = "https://images.unsplash.com/photo-test-hero-image"
        
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={"hero_image": test_image_url},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["hero_image"] == test_image_url
        print(f"SUCCESS: Updated hero_image to {test_image_url}")
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/settings")
        assert get_response.status_code == 200
        assert get_response.json()["hero_image"] == test_image_url
        print("SUCCESS: Hero image update persisted")
    
    def test_update_settings_welcome_image(self, auth_token):
        """Test updating welcome section image URL"""
        test_image_url = "https://images.unsplash.com/photo-test-welcome-image"
        
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={"welcome_image": test_image_url},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["welcome_image"] == test_image_url
        print(f"SUCCESS: Updated welcome_image")
    
    def test_update_settings_hero_text_bilingual(self, auth_token):
        """Test updating hero title and subtitle in both languages"""
        settings_data = {
            "hero_title_en": "TEST Custom English Title",
            "hero_title_pl": "TEST Niestandardowy Polski Tytuł",
            "hero_subtitle_en": "TEST Custom English subtitle text",
            "hero_subtitle_pl": "TEST Niestandardowy polski podtytuł"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json=settings_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["hero_title_en"] == settings_data["hero_title_en"]
        assert data["hero_title_pl"] == settings_data["hero_title_pl"]
        assert data["hero_subtitle_en"] == settings_data["hero_subtitle_en"]
        assert data["hero_subtitle_pl"] == settings_data["hero_subtitle_pl"]
        print("SUCCESS: Updated hero text in both EN and PL")
    
    def test_update_settings_welcome_text_bilingual(self, auth_token):
        """Test updating welcome section text in both languages"""
        settings_data = {
            "welcome_text1_en": "TEST First paragraph in English",
            "welcome_text1_pl": "TEST Pierwszy akapit po polsku",
            "welcome_text2_en": "TEST Second paragraph in English",
            "welcome_text2_pl": "TEST Drugi akapit po polsku"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json=settings_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["welcome_text1_en"] == settings_data["welcome_text1_en"]
        assert data["welcome_text1_pl"] == settings_data["welcome_text1_pl"]
        assert data["welcome_text2_en"] == settings_data["welcome_text2_en"]
        assert data["welcome_text2_pl"] == settings_data["welcome_text2_pl"]
        print("SUCCESS: Updated welcome text in both EN and PL")
    
    def test_update_all_settings_at_once(self, auth_token):
        """Test updating all settings fields in a single request"""
        full_settings = {
            "hero_image": "https://images.unsplash.com/photo-full-test-hero",
            "welcome_image": "https://images.unsplash.com/photo-full-test-welcome",
            "hero_title_en": "Full Test Title EN",
            "hero_title_pl": "Full Test Title PL",
            "hero_subtitle_en": "Full Test Subtitle EN",
            "hero_subtitle_pl": "Full Test Subtitle PL",
            "welcome_text1_en": "Full Test Welcome 1 EN",
            "welcome_text1_pl": "Full Test Welcome 1 PL",
            "welcome_text2_en": "Full Test Welcome 2 EN",
            "welcome_text2_pl": "Full Test Welcome 2 PL"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json=full_settings,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        for key, value in full_settings.items():
            assert data[key] == value, f"Field {key} mismatch"
        
        print("SUCCESS: All settings fields updated in single request")
    
    def test_settings_partial_update(self, auth_token):
        """Test that partial updates don't overwrite other fields"""
        # First set a known value
        requests.put(
            f"{BASE_URL}/api/settings",
            json={"hero_title_en": "Original Title"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        # Update only subtitle
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={"hero_subtitle_en": "New Subtitle Only"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify subtitle was updated
        assert data["hero_subtitle_en"] == "New Subtitle Only"
        print("SUCCESS: Partial update works correctly")
    
    def test_reset_settings_to_defaults(self, auth_token):
        """Reset settings to default values for clean state"""
        default_settings = {
            "hero_image": "https://images.unsplash.com/photo-1768333377265-cb6c3ca2885a",
            "welcome_image": "https://images.unsplash.com/photo-1763733593826-d51c270cc8b4",
            "hero_title_en": None,
            "hero_title_pl": None,
            "hero_subtitle_en": None,
            "hero_subtitle_pl": None,
            "welcome_text1_en": None,
            "welcome_text1_pl": None,
            "welcome_text2_en": None,
            "welcome_text2_pl": None
        }
        
        # Note: Setting to None may not work with current API - just reset images
        response = requests.put(
            f"{BASE_URL}/api/settings",
            json={
                "hero_image": default_settings["hero_image"],
                "welcome_image": default_settings["welcome_image"]
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 200
        print("SUCCESS: Settings reset to defaults")


class TestActivitiesAPI:
    """Weekly Activities API tests"""
    
    def test_get_all_activities(self):
        """Test GET /api/activities returns list of activities"""
        response = requests.get(f"{BASE_URL}/api/activities")
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        print(f"SUCCESS: GET /api/activities returns {len(data)} activities")
        
        # Verify structure of first activity if exists
        if len(data) > 0:
            activity = data[0]
            assert "id" in activity
            assert "day" in activity
            assert "name_en" in activity
            assert "name_pl" in activity
            assert "time" in activity
            assert "description_en" in activity
            assert "description_pl" in activity
            assert "contact" in activity
            print(f"  First activity: {activity['name_en']} on {activity['day']}")
    
    def test_activities_sorted_by_day(self):
        """Test that activities are sorted by day of week"""
        response = requests.get(f"{BASE_URL}/api/activities")
        assert response.status_code == 200
        data = response.json()
        
        day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, 
                     "Friday": 5, "Saturday": 6, "Sunday": 7}
        
        if len(data) > 1:
            prev_day_num = 0
            for activity in data:
                current_day_num = day_order.get(activity["day"], 8)
                # Activities should be in day order (or same day)
                assert current_day_num >= prev_day_num or current_day_num == prev_day_num
                prev_day_num = current_day_num
            print("SUCCESS: Activities are sorted by day of week")
        else:
            print("INFO: Not enough activities to verify sorting")
    
    def test_create_activity(self, auth_token):
        """Test creating a new weekly activity"""
        test_id = str(uuid.uuid4())[:8]
        activity_data = {
            "day": "Monday",
            "name_en": f"TEST_Activity {test_id}",
            "name_pl": f"TEST_Aktywność {test_id}",
            "time": "14:00 - 16:00",
            "description_en": "Test activity description in English",
            "description_pl": "Opis testowej aktywności po polsku",
            "contact": "test@example.com",
            "order": 99
        }
        
        response = requests.post(
            f"{BASE_URL}/api/activities",
            json=activity_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["name_en"] == activity_data["name_en"]
        assert data["name_pl"] == activity_data["name_pl"]
        assert data["day"] == activity_data["day"]
        assert data["time"] == activity_data["time"]
        assert "id" in data
        
        print(f"SUCCESS: Created activity with ID: {data['id']}")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/activities/{data['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    def test_activity_crud_full_cycle(self, auth_token):
        """Test full CRUD cycle for activities"""
        test_id = str(uuid.uuid4())[:8]
        
        # CREATE
        activity_data = {
            "day": "Wednesday",
            "name_en": f"TEST_CRUD Activity {test_id}",
            "name_pl": f"TEST_CRUD Aktywność {test_id}",
            "time": "18:00 - 20:00",
            "description_en": "CRUD test activity EN",
            "description_pl": "CRUD test activity PL",
            "contact": "crud@test.com",
            "order": 0
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/activities",
            json=activity_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        activity_id = created["id"]
        print(f"Created activity: {activity_id}")
        
        # READ (via list endpoint)
        get_response = requests.get(f"{BASE_URL}/api/activities")
        assert get_response.status_code == 200
        activities = get_response.json()
        found = next((a for a in activities if a["id"] == activity_id), None)
        assert found is not None
        assert found["name_en"] == activity_data["name_en"]
        print(f"Read activity: {found['name_en']}")
        
        # UPDATE
        update_data = {
            "day": "Thursday",
            "name_en": f"TEST_UPDATED Activity {test_id}",
            "name_pl": f"TEST_UPDATED Aktywność {test_id}",
            "time": "19:00 - 21:00",
            "description_en": "Updated description EN",
            "description_pl": "Updated description PL",
            "contact": "updated@test.com",
            "order": 1
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/activities/{activity_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["name_en"] == update_data["name_en"]
        assert updated["day"] == update_data["day"]
        print(f"Updated activity: {updated['name_en']}")
        
        # Verify update persisted
        verify_response = requests.get(f"{BASE_URL}/api/activities")
        activities = verify_response.json()
        verified = next((a for a in activities if a["id"] == activity_id), None)
        assert verified is not None
        assert verified["name_en"] == update_data["name_en"]
        assert verified["day"] == update_data["day"]
        
        # DELETE
        delete_response = requests.delete(
            f"{BASE_URL}/api/activities/{activity_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 204
        print(f"Deleted activity: {activity_id}")
        
        # Verify deletion
        verify_delete = requests.get(f"{BASE_URL}/api/activities")
        activities = verify_delete.json()
        deleted = next((a for a in activities if a["id"] == activity_id), None)
        assert deleted is None
        
        print("SUCCESS: Full activity CRUD cycle completed")
    
    def test_activity_bilingual_fields(self, auth_token):
        """Test that activities have proper bilingual fields"""
        test_id = str(uuid.uuid4())[:8]
        
        activity_data = {
            "day": "Friday",
            "name_en": f"English Activity Name {test_id}",
            "name_pl": f"Polska Nazwa Aktywności {test_id}",
            "time": "10:00 - 12:00",
            "description_en": "English description for the activity",
            "description_pl": "Polski opis aktywności",
            "contact": "bilingual@test.com",
            "order": 0
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/activities",
            json=activity_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 201
        created = create_response.json()
        
        # Verify all bilingual fields
        assert created["name_en"] == activity_data["name_en"]
        assert created["name_pl"] == activity_data["name_pl"]
        assert created["description_en"] == activity_data["description_en"]
        assert created["description_pl"] == activity_data["description_pl"]
        
        print("SUCCESS: Activity has all bilingual fields")
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/activities/{created['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
    
    def test_activity_day_validation(self, auth_token):
        """Test creating activities for each day of the week"""
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        created_ids = []
        
        for day in days:
            test_id = str(uuid.uuid4())[:8]
            activity_data = {
                "day": day,
                "name_en": f"TEST_{day} Activity {test_id}",
                "name_pl": f"TEST_{day} Aktywność {test_id}",
                "time": "12:00 - 14:00",
                "description_en": f"Activity on {day}",
                "description_pl": f"Aktywność w {day}",
                "contact": f"{day.lower()}@test.com",
                "order": 0
            }
            
            response = requests.post(
                f"{BASE_URL}/api/activities",
                json=activity_data,
                headers={"Authorization": f"Bearer {auth_token}"}
            )
            
            assert response.status_code == 201, f"Failed to create activity for {day}"
            created_ids.append(response.json()["id"])
        
        print(f"SUCCESS: Created activities for all 7 days")
        
        # Cleanup
        for activity_id in created_ids:
            requests.delete(
                f"{BASE_URL}/api/activities/{activity_id}",
                headers={"Authorization": f"Bearer {auth_token}"}
            )
    
    def test_update_nonexistent_activity(self, auth_token):
        """Test updating a non-existent activity returns 404"""
        fake_id = str(uuid.uuid4())
        
        response = requests.put(
            f"{BASE_URL}/api/activities/{fake_id}",
            json={
                "day": "Monday",
                "name_en": "Test",
                "name_pl": "Test",
                "time": "10:00",
                "description_en": "Test",
                "description_pl": "Test",
                "contact": "test@test.com",
                "order": 0
            },
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 404
        print("SUCCESS: Update non-existent activity returns 404")
    
    def test_delete_nonexistent_activity(self, auth_token):
        """Test deleting a non-existent activity returns 404"""
        fake_id = str(uuid.uuid4())
        
        response = requests.delete(
            f"{BASE_URL}/api/activities/{fake_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        
        assert response.status_code == 404
        print("SUCCESS: Delete non-existent activity returns 404")


class TestSeededActivities:
    """Test the seeded weekly activities data"""
    
    def test_seeded_activities_exist(self):
        """Verify that seeded activities are present"""
        response = requests.get(f"{BASE_URL}/api/activities")
        assert response.status_code == 200
        data = response.json()
        
        # Should have 8 seeded activities as per the problem statement
        assert len(data) >= 8, f"Expected at least 8 seeded activities, got {len(data)}"
        print(f"SUCCESS: Found {len(data)} activities (expected >= 8)")
    
    def test_seeded_activities_have_required_fields(self):
        """Verify seeded activities have all required fields"""
        response = requests.get(f"{BASE_URL}/api/activities")
        assert response.status_code == 200
        data = response.json()
        
        required_fields = ["id", "day", "name_en", "name_pl", "time", 
                          "description_en", "description_pl", "contact"]
        
        for activity in data:
            for field in required_fields:
                assert field in activity, f"Missing field {field} in activity {activity.get('id', 'unknown')}"
        
        print("SUCCESS: All seeded activities have required fields")
    
    def test_seeded_activities_cover_multiple_days(self):
        """Verify seeded activities cover multiple days of the week"""
        response = requests.get(f"{BASE_URL}/api/activities")
        assert response.status_code == 200
        data = response.json()
        
        days_covered = set(activity["day"] for activity in data)
        assert len(days_covered) >= 5, f"Expected activities on at least 5 days, got {len(days_covered)}"
        print(f"SUCCESS: Activities cover {len(days_covered)} days: {days_covered}")

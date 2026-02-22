import requests
import sys
import json
from datetime import datetime, timedelta

class PolishAssociationAPITester:
    def __init__(self, base_url="https://newcastle-cms.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.text else {}
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_get_events(self):
        """Test getting all events"""
        return self.run_test("Get Events", "GET", "api/events", 200)

    def test_get_committee(self):
        """Test getting committee members"""
        return self.run_test("Get Committee", "GET", "api/committee", 200)

    def test_get_groups(self):
        """Test getting associated groups"""
        return self.run_test("Get Groups", "GET", "api/groups", 200)

    def test_get_activities(self):
        """Test getting activities"""
        return self.run_test("Get Activities", "GET", "api/activities", 200)

    def test_get_bookings(self):
        """Test getting bookings (admin endpoint)"""
        return self.run_test("Get Bookings", "GET", "api/bookings", 200)

    def test_create_booking(self):
        """Test creating a hall booking"""
        booking_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "0400000000",
            "event_type": "wedding",
            "guests": 50,
            "date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
            "message": "Test booking for API testing"
        }
        success, response = self.run_test("Create Booking", "POST", "api/bookings", 201, booking_data)
        return success, response

    def test_create_event(self):
        """Test creating an event (admin endpoint)"""
        event_data = {
            "title": "Test Event",
            "date": (datetime.now() + timedelta(days=15)).strftime("%Y-%m-%d"),
            "time": "18:00",
            "location": "Polish Cultural Centre",
            "description": "Test event for API testing",
            "category": "cultural",
            "image": "https://images.unsplash.com/photo-1768333377265-cb6c3ca2885a"
        }
        return self.run_test("Create Event", "POST", "api/events", 201, event_data)

    def test_invalid_endpoints(self):
        """Test invalid endpoints return 404"""
        success1, _ = self.run_test("Invalid Endpoint", "GET", "api/invalid", 404)
        success2, _ = self.run_test("Invalid Event ID", "GET", "api/events/invalid-id", 404)
        return success1 and success2

def main():
    print("🚀 Starting Polish Association API Tests")
    print("=" * 50)
    
    tester = PolishAssociationAPITester()
    
    # Test health check first
    print("\n📋 BASIC CONNECTIVITY TESTS")
    tester.test_health_check()
    
    # Test main GET endpoints
    print("\n📋 DATA RETRIEVAL TESTS")
    tester.test_get_events()
    tester.test_get_committee()
    tester.test_get_groups()
    tester.test_get_activities()
    tester.test_get_bookings()
    
    # Test POST endpoints
    print("\n📋 DATA CREATION TESTS")
    booking_success, booking_response = tester.test_create_booking()
    event_success, event_response = tester.test_create_event()
    
    # Test error handling
    print("\n📋 ERROR HANDLING TESTS")
    tester.test_invalid_endpoints()
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print(f"Tests run: {tester.tests_run}")
    print(f"Tests passed: {tester.tests_passed}")
    print(f"Tests failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"  - {test['name']}: {error_msg}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
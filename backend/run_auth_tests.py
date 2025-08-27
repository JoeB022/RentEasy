#!/usr/bin/env python3
"""
Simple script to run authentication tests.
"""

import subprocess
import sys
import os

def run_auth_tests():
    """Run the authentication tests."""
    print("🧪 Running Authentication Tests")
    print("=" * 50)
    
    # Check if backend is running
    try:
        import requests
        response = requests.get("http://localhost:8000/dashboard/health", timeout=2)
        if response.status_code in [401, 422]:  # Expected for unauthenticated access
            print("✅ Backend is running on port 8000")
        else:
            print(f"⚠️ Backend responded with status: {response.status_code}")
    except Exception as e:
        print("❌ Backend is not running or not accessible")
        print("Please start the Flask backend first:")
        print("  cd backend && source venv/bin/activate && python app_simple.py")
        return False
    
    # Install test dependencies if needed
    print("\n📦 Installing test dependencies...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "test_requirements.txt"
        ], check=True, capture_output=True)
        print("✅ Test dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Could not install all dependencies: {e}")
        print("Some tests might fail")
    
    # Run the tests
    print("\n🚀 Running tests...")
    result = subprocess.run([
        sys.executable, "-m", "pytest", "tests/test_auth.py",
        "-v", "-s", "--tb=short"
    ], cwd=os.path.dirname(os.path.abspath(__file__)))
    
    if result.returncode == 0:
        print("\n" + "=" * 50)
        print("✅ All authentication tests passed!")
    else:
        print("\n" + "=" * 50)
        print("❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_auth_tests()

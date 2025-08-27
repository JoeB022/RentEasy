#!/usr/bin/env python3
"""
Test runner script for the Flask backend.
Run this script to execute all tests with coverage reporting.
"""

import subprocess
import sys
import os

def run_tests():
    """Run the test suite with coverage."""
    print("Running Flask backend tests...")
    print("=" * 50)
    
    # Run tests with coverage
    result = subprocess.run([
        sys.executable, "-m", "pytest", "tests/",
        "--cov=.",
        "--cov-report=term-missing",
        "--cov-report=html",
        "-v"
    ], cwd=os.path.dirname(os.path.abspath(__file__)))
    
    if result.returncode == 0:
        print("\n" + "=" * 50)
        print("✅ All tests passed!")
        print("📊 Coverage report generated in htmlcov/ directory")
    else:
        print("\n" + "=" * 50)
        print("❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()

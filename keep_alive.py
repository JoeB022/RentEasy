#!/usr/bin/env python3
"""
keep_alive.py
Simple script to ping your Render backend every 5 minutes to keep it awake.
This is a backup solution if UptimeRobot is not available.

Usage:
    python keep_alive.py https://your-backend.onrender.com
"""

import requests
import time
import sys
import json
from datetime import datetime

def ping_backend(url, interval_minutes=5):
    """Ping the backend health endpoint every specified interval."""
    
    health_url = f"{url.rstrip('/')}/healthz"
    interval_seconds = interval_minutes * 60
    
    print(f"🔄 Starting keep-alive for: {health_url}")
    print(f"⏰ Ping interval: {interval_minutes} minutes")
    print(f"🛑 Press Ctrl+C to stop")
    print("-" * 50)
    
    ping_count = 0
    
    try:
        while True:
            ping_count += 1
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            try:
                # Make request to health endpoint
                response = requests.get(health_url, timeout=30)
                
                if response.status_code == 200:
                    print(f"✅ [{timestamp}] Ping #{ping_count} - Backend is awake (Status: {response.status_code})")
                    
                    # Try to parse JSON response
                    try:
                        data = response.json()
                        if 'status' in data:
                            print(f"   📊 Health Status: {data['status']}")
                    except:
                        pass
                        
                else:
                    print(f"⚠️  [{timestamp}] Ping #{ping_count} - Unexpected status: {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                print(f"❌ [{timestamp}] Ping #{ping_count} - Error: {str(e)}")
                print(f"   🔄 Retrying in {interval_minutes} minutes...")
            
            # Wait for next ping
            time.sleep(interval_seconds)
            
    except KeyboardInterrupt:
        print(f"\n🛑 Keep-alive stopped after {ping_count} pings")
        print("👋 Goodbye!")

def main():
    if len(sys.argv) != 2:
        print("❌ Usage: python keep_alive.py <BACKEND_URL>")
        print("📝 Example: python keep_alive.py https://renteasy-backend.onrender.com")
        sys.exit(1)
    
    backend_url = sys.argv[1]
    
    # Validate URL
    if not backend_url.startswith(('http://', 'https://')):
        print("❌ Error: URL must start with http:// or https://")
        sys.exit(1)
    
    print("🚀 RentEasy Backend Keep-Alive Script")
    print("=" * 40)
    
    # Start pinging
    ping_backend(backend_url)

if __name__ == "__main__":
    main()

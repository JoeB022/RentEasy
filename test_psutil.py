#!/usr/bin/env python3
"""
Test script to verify psutil can be imported
"""

try:
    import psutil
    print("✅ psutil imported successfully")
    print(f"   Version: {psutil.__version__}")
    print(f"   CPU count: {psutil.cpu_count()}")
    print(f"   Memory: {psutil.virtual_memory().total / (1024**3):.1f} GB")
except ImportError as e:
    print(f"❌ Failed to import psutil: {e}")
    exit(1)
except Exception as e:
    print(f"⚠️  psutil imported but error: {e}")
    exit(1)

print("✅ psutil test passed!")

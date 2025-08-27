#!/usr/bin/env python3
"""
Quick database inspection script to see what's in the database.
"""

import sqlite3
import os
from pathlib import Path

def inspect_database():
    """Inspect the database contents."""
    # Look for database files
    possible_paths = [
        "instance/test.db",
        "test.db", 
        "app.db",
        "instance/app.db"
    ]
    
    db_path = None
    for path in possible_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ No database file found!")
        print("Searched in:")
        for path in possible_paths:
            print(f"  - {path}")
        print("\n💡 Try running the Flask app first to create the database.")
        return
    
    print(f"🔍 Found database: {db_path}")
    print("=" * 60)
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Show database info
        cursor.execute("SELECT sqlite_version();")
        version = cursor.fetchone()[0]
        print(f"📊 SQLite Version: {version}")
        
        # Show tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print(f"\n🗂️ Tables found: {len(tables)}")
        for i, table in enumerate(tables, 1):
            print(f"  {i}. {table[0]}")
        
        print()
        
        # Show users table structure and data
        if ('users',) in tables:
            print("👥 USERS TABLE:")
            print("-" * 40)
            
            # Table structure
            cursor.execute("PRAGMA table_info(users);")
            columns = cursor.fetchall()
            
            print("📋 Structure:")
            for col in columns:
                nullable = "NOT NULL" if col[3] else "NULLABLE"
                default = f" DEFAULT {col[4]}" if col[4] else ""
                print(f"  - {col[1]} ({col[2]}) {nullable}{default}")
            
            print()
            
            # User data
            cursor.execute("SELECT id, username, email, role, created_at FROM users;")
            users = cursor.fetchall()
            
            print(f"👤 Users found: {len(users)}")
            if users:
                print("📊 Data:")
                for user in users:
                    print(f"  - ID: {user[0]}")
                    print(f"    Username: {user[1]}")
                    print(f"    Email: {user[2]}")
                    print(f"    Role: {user[3]}")
                    print(f"    Created: {user[4]}")
                    print()
            else:
                print("  (No users in database yet)")
                print("\n💡 To add users, start the Flask app and use the /auth/register endpoint")
        
        # Show other tables if they exist
        for table in tables:
            if table[0] != 'users' and table[0] != 'sqlite_sequence':
                print(f"\n📋 {table[0].upper()} TABLE:")
                print("-" * 40)
                
                # Count rows
                cursor.execute(f"SELECT COUNT(*) FROM {table[0]};")
                count = cursor.fetchone()[0]
                print(f"Rows: {count}")
                
                # Show sample data
                if count > 0:
                    cursor.execute(f"SELECT * FROM {table[0]} LIMIT 3;")
                    sample = cursor.fetchall()
                    print("Sample data:")
                    for row in sample:
                        print(f"  {row}")
        
        conn.close()
        
        print("\n" + "=" * 60)
        print("💡 To view this database in Cursor:")
        print("   1. Install a SQLite extension (SQLite Viewer)")
        print("   2. Right-click on the .db file")
        print("   3. Select 'Open With' → 'SQLite Viewer'")
        print(f"   4. Or navigate to: {os.path.abspath(db_path)}")
        
    except Exception as e:
        print(f"❌ Error inspecting database: {e}")
        print(f"Database path: {db_path}")

if __name__ == "__main__":
    inspect_database()

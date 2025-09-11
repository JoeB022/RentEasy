#!/usr/bin/env python3
"""
Dependency checker for RentEasy Backend
This script checks for missing dependencies and potential deployment issues.
"""

import os
import sys
import re
from pathlib import Path

def find_python_files(directory):
    """Find all Python files in the directory."""
    python_files = []
    for root, dirs, files in os.walk(directory):
        # Skip __pycache__ directories
        dirs[:] = [d for d in dirs if d != '__pycache__']
        for file in files:
            if file.endswith('.py'):
                python_files.append(os.path.join(root, file))
    return python_files

def extract_imports(file_path):
    """Extract all import statements from a Python file."""
    imports = set()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all import statements
        import_patterns = [
            r'^from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import',
            r'^import\s+([a-zA-Z_][a-zA-Z0-9_.]*)',
        ]
        
        for line in content.split('\n'):
            line = line.strip()
            for pattern in import_patterns:
                match = re.match(pattern, line)
                if match:
                    module = match.group(1).split('.')[0]  # Get top-level module
                    if module and not module.startswith('.'):
                        imports.add(module)
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return imports

def get_installed_packages():
    """Get list of packages from requirements files."""
    packages = set()
    
    # Read requirements-prod.txt
    req_file = Path("backend/requirements-prod.txt")
    if req_file.exists():
        with open(req_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    # Extract package name (before == or >=)
                    package = re.split(r'[>=<]', line)[0]
                    packages.add(package)
    
    # Add common import name mappings
    package_mappings = {
        'Flask': 'flask',
        'Flask-CORS': 'flask_cors',
        'Flask-JWT-Extended': 'flask_jwt_extended',
        'Flask-SQLAlchemy': 'flask_sqlalchemy',
        'Flask-Migrate': 'flask_migrate',
        'Flask-WTF': 'flask_wtf',
        'Flask-Limiter': 'flask_limiter',
        'Flask-Talisman': 'flask_talisman',
        'Flask-Caching': 'flask_caching',
        'Werkzeug': 'werkzeug',
        'SQLAlchemy': 'sqlalchemy',
        'PyJWT': 'jwt',
        'sentry-sdk': 'sentry_sdk',
        'python-dotenv': 'dotenv',
        'psycopg2-binary': 'psycopg2',
    }
    
    # Add mapped names
    for req_name, import_name in package_mappings.items():
        if req_name in packages:
            packages.add(import_name)
    
    return packages

def check_dependencies():
    """Check for missing dependencies."""
    print("🔍 Checking RentEasy Backend Dependencies")
    print("=" * 50)
    
    # Find all Python files
    backend_dir = "backend"
    python_files = find_python_files(backend_dir)
    
    # Extract all imports
    all_imports = set()
    for file_path in python_files:
        imports = extract_imports(file_path)
        all_imports.update(imports)
    
    # Get installed packages
    installed_packages = get_installed_packages()
    
    # Standard library modules (don't need to be installed)
    stdlib_modules = {
        'os', 'sys', 'json', 'time', 'datetime', 'uuid', 'enum', 'typing',
        'functools', 'subprocess', 'sqlite3', 're', 'pathlib', 'collections',
        'itertools', 'math', 'random', 'string', 'io', 'base64', 'hashlib',
        'urllib', 'http', 'email', 'calendar', 'locale', 'gettext', 'copy',
        'pickle', 'csv', 'xml', 'html', 'urllib', 'socket', 'threading',
        'multiprocessing', 'queue', 'asyncio', 'concurrent', 'logging',
        'warnings', 'traceback', 'inspect', 'gc', 'weakref', 'contextlib',
        'abc', 'atexit', 'signal', 'argparse', 'configparser', 'getopt',
        'tempfile', 'shutil', 'glob', 'fnmatch', 'linecache', 'fileinput',
        'stat', 'filecmp', 'gzip', 'bz2', 'lzma', 'zipfile', 'tarfile',
        'hashlib', 'hmac', 'secrets', 'ssl', 'socket', 'select', 'selectors',
        'asyncio', 'concurrent', 'subprocess', 'sched', 'queue', 'threading',
        'multiprocessing', 'mmap', 'ctypes', 'struct', 'array', 'memoryview',
        'codecs', 'unicodedata', 'stringprep', 'readline', 'rlcompleter',
        'difflib', 'textwrap', 'unicodedata', 'stringprep', 'codecs',
        'io', 'time', 'datetime', 'zoneinfo', 'calendar', 'collections',
        'heapq', 'bisect', 'array', 'weakref', 'types', 'copy', 'pprint',
        'reprlib', 'enum', 'numbers', 'math', 'cmath', 'decimal', 'fractions',
        'random', 'statistics', 'itertools', 'functools', 'operator',
        'pathlib', 'os', 'io', 'time', 'argparse', 'getopt', 'logging',
        'getpass', 'curses', 'platform', 'errno', 'ctypes', 'threading',
        'multiprocessing', 'concurrent', 'subprocess', 'sched', 'queue',
        'contextvars', 'dataclasses', 'typing', 'pydoc', 'doctest', 'unittest',
        'test', 'bdb', 'faulthandler', 'pdb', 'profile', 'pstats', 'timeit',
        'trace', 'tracemalloc', 'distutils', 'ensurepip', 'venv', 'zipapp'
    }
    
    # Local project modules (don't need to be installed)
    local_modules = {
        'app', 'config', 'models', 'auth', 'routes', 'middleware', 'utils',
        'manage', 'app_simple', 'dotenv'
    }
    
    # Third-party modules that might be missing
    third_party_modules = all_imports - stdlib_modules - local_modules - installed_packages
    
    print(f"📁 Found {len(python_files)} Python files")
    print(f"📦 Found {len(all_imports)} unique imports")
    print(f"✅ Found {len(installed_packages)} packages in requirements-prod.txt")
    print()
    
    if third_party_modules:
        print("❌ Missing Dependencies:")
        for module in sorted(third_party_modules):
            print(f"   - {module}")
        print()
    else:
        print("✅ All dependencies appear to be covered!")
        print()
    
    # Check for specific known issues
    print("🔍 Checking for Known Issues:")
    
    # Check if Flask-WTF is properly configured
    if 'flask_wtf' in all_imports and 'Flask-WTF' in installed_packages:
        print("✅ Flask-WTF dependency found")
    elif 'flask_wtf' in all_imports:
        print("❌ Flask-WTF imported but not in requirements")
    
    # Check if psutil is available
    if 'psutil' in all_imports and 'psutil' in installed_packages:
        print("✅ psutil dependency found")
    elif 'psutil' in all_imports:
        print("❌ psutil imported but not in requirements")
    
    # Check if Werkzeug is available
    if 'werkzeug' in all_imports and 'Werkzeug' in installed_packages:
        print("✅ Werkzeug dependency found")
    elif 'werkzeug' in all_imports:
        print("❌ Werkzeug imported but not in requirements")
    
    print()
    print("📋 All imports found:")
    for module in sorted(all_imports):
        status = "✅" if module in stdlib_modules or module in installed_packages else "❌"
        print(f"   {status} {module}")
    
    return len(third_party_modules) == 0

if __name__ == "__main__":
    success = check_dependencies()
    sys.exit(0 if success else 1)

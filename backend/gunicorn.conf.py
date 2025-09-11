"""
Gunicorn configuration file for RentEasy Backend
"""
import os
import multiprocessing

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
backlog = 2048

# Worker processes
workers = int(os.environ.get('WEB_CONCURRENCY', multiprocessing.cpu_count() * 2 + 1))
worker_class = os.environ.get('WORKER_CLASS', 'sync')
worker_connections = int(os.environ.get('WORKER_CONNECTIONS', '1000'))
max_requests = int(os.environ.get('MAX_REQUESTS', '1000'))
max_requests_jitter = int(os.environ.get('MAX_REQUESTS_JITTER', '100'))

# Timeout settings
timeout = int(os.environ.get('TIMEOUT', '30'))
keepalive = int(os.environ.get('KEEPALIVE', '2'))

# Restart workers after this many requests, to help prevent memory leaks
preload_app = os.environ.get('PRELOAD_APP', 'true').lower() == 'true'

# Logging
accesslog = os.environ.get('ACCESS_LOG', '-')
errorlog = os.environ.get('ERROR_LOG', '-')
loglevel = os.environ.get('LOG_LEVEL', 'info').lower()
access_log_format = os.environ.get(
    'ACCESS_LOG_FORMAT',
    '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'
)

# Process naming
proc_name = 'renteasy-backend'

# Server mechanics
daemon = False
pidfile = os.environ.get('PIDFILE', '/tmp/gunicorn.pid')
user = os.environ.get('USER', None)
group = os.environ.get('GROUP', None)
tmp_upload_dir = os.environ.get('TMP_UPLOAD_DIR', None)

# SSL (if needed)
keyfile = os.environ.get('SSL_KEYFILE', None)
certfile = os.environ.get('SSL_CERTFILE', None)

# Worker lifecycle
def when_ready(server):
    """Called just after the server is started."""
    server.log.info("RentEasy Backend server is ready. Workers: %s", server.cfg.workers)

def worker_int(worker):
    """Called just after a worker exited on SIGINT or SIGQUIT."""
    worker.log.info("Worker received INT or QUIT signal")

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    server.log.info("Worker spawned (pid: %s)", worker.pid)

def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    worker.log.info("Worker initialized (pid: %s)", worker.pid)

def worker_abort(worker):
    """Called when a worker received the SIGABRT signal."""
    worker.log.info("Worker received SIGABRT signal")

def pre_exec(server):
    """Called just before a new master process is forked."""
    server.log.info("Forked child, re-executing.")

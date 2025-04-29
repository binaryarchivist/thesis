#!/usr/bin/env bash
set -euo pipefail

##
## 1) Create the DB and user in Postgres
##
echo "→ Creating PostgreSQL database and user…"
sudo -u postgres psql <<SQL
  DROP DATABASE IF EXISTS thesis_db;
  DROP USER IF EXISTS edms_user;
  CREATE DATABASE thesis_db;
  CREATE USER edms_user WITH PASSWORD 'dbpass';
  GRANT ALL PRIVILEGES ON DATABASE thesis_db TO edms_user;
SQL

##
## 2) Write the .env file
##
echo "→ Writing .env file…"
cat > .env <<EOF
DB_NAME="thesis_db"
DB_USER="edms_user"
DB_PASSWORD="dbpass"
DB_HOST=127.0.0.1
DB_PORT=5432
DEBUG=on
SECRET_KEY="django-insecure-yy6c+r66pmuo%i2-0g0a%624z)v!ttzi-qnct#rw-pl5uq89(1)"
EOF

##
## 3) Set up Python venv and install requirements
##
echo "→ Setting up Python virtual environment…"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
# shellcheck source=/dev/null
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

##
## 4) Apply migrations and collect static (if needed)
##
echo "→ Applying database migrations…"
python manage.py migrate

##
## 5) Launch development server
##
echo "→ Starting Django development server at http://127.0.0.1:8000/"
python manage.py runserver
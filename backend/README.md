# DREAMATIC CMS Backend

Python FastAPI backend for managing insights dynamically.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Install and start MongoDB:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Or use MongoDB Atlas (cloud) - update MONGODB_URL in .env
```

3. Configure environment variables in `.env`:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dreamatic_cms
SECRET_KEY=your-secret-key-change-this-in-production
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

## API Endpoints

### Public Endpoints
- `GET /api/insights` - Get all published insights
- `GET /api/insights/{id}` - Get single insight

### Authentication
- `POST /api/auth/login` - Login (returns JWT token)

### Admin Endpoints (Require Authentication)
- `GET /api/admin/insights` - Get all insights (including unpublished)
- `POST /api/admin/insights` - Create new insight
- `PUT /api/admin/insights/{id}` - Update insight
- `DELETE /api/admin/insights/{id}` - Delete insight
- `POST /api/admin/users` - Create new admin user

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

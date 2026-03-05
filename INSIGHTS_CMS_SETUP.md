# Insights CMS - Setup Guide

Complete content management system for dynamically managing insights articles.

## 🏗️ Architecture

```
Frontend (Vue.js)          Backend (FastAPI)         Database
Port 3000                  Port 8000                 MongoDB
    │                           │                        │
    ├─ AIWork.vue ──────────────┤                        │
    │  (Displays insights)      │                        │
    │                           │                        │
    └─ InsightsAdmin.vue ───────┼────────────────────────┤
       (Manage insights)        │   (CRUD Operations)    │
                                └────────────────────────┘
```

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **Node.js 16+** installed  
3. **MongoDB** - Choose one:
   - Local: `sudo apt-get install mongodb` (Ubuntu/Debian)
   - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

## 🚀 Quick Start

### Step 1: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure Environment

Edit `backend/.env` if needed:
```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=dreamactic_cms
SECRET_KEY=your-secret-key-change-this-in-production
```

**For MongoDB Atlas (Cloud)**:
Replace `MONGODB_URL` with your Atlas connection string:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

### Step 3: Start MongoDB (if using local)

```bash
sudo systemctl start mongodb
# Or on macOS:
brew services start mongodb-community
```

### Step 4: Start Backend Server

```bash
cd backend
uvicorn main:app --reload
```

Backend will run at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Step 5: Start Frontend (in a new terminal)

```bash
# From project root
npm run dev
```

Frontend will run at: `http://localhost:3000`

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these in production!

## 📍 Access Points

- **Main Site**: `http://localhost:3000`
- **Admin Panel**: `http://localhost:3000/admin/insights`
- **API Documentation**: `http://localhost:8000/docs`
- **AI Work Page** (displays insights): `http://localhost:3000/services/ai-work`

## 🎯 How to Use

### Creating Your First Insight

1. Navigate to `http://localhost:3000/admin/insights`
2. Login with default credentials
3. Click "+ New Insight"
4. Fill in the form:
   - **Title**: Article title
   - **Date**: Display date (e.g., "Feb 12, 2026")
   - **Read Time**: Estimated read time (e.g., "6 min")
   - **Excerpt**: Brief description
   - **Content**: Full article content
   - **Author**: Author name (optional)
   - **Image URL**: Article image URL (optional)
   - **Published**: Check to make it visible on the main site
5. Click "Create"

### Editing/Deleting Insights

- Click "Edit" on any insight card to modify
- Click "Delete" to remove (with confirmation)
- Unpublished insights show a "Draft" badge

### Viewing on Main Site

- Published insights automatically appear in the "INSIGHTS" section
- Visit `http://localhost:3000/services/ai-work` and scroll to the bottom

## 🛠️ API Endpoints

### Public (No Auth Required)
- `GET /api/insights` - Get all published insights
- `GET /api/insights/{id}` - Get single insight

### Admin (Requires JWT Token)
- `POST /api/auth/login` - Login (get token)
- `GET /api/admin/insights` - Get all insights (including drafts)
- `POST /api/admin/insights` - Create new insight
- `PUT /api/admin/insights/{id}` - Update insight
- `DELETE /api/admin/insights/{id}` - Delete insight
- `POST /api/admin/users` - Create new admin user

## 🔧 Troubleshooting

### Backend won't start
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Verify Python dependencies: `pip list | grep fastapi`

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Verify `FRONTEND_URL` in `.env`

### Login fails
- Check MongoDB connection
- Verify default user was created (check backend logs)
- Try restarting the backend server

### Insights not showing on main page
- Ensure insights are marked as "Published"
- Check browser console for API errors
- Verify backend is running and accessible

## 📦 Project Structure

```
website-scrollable/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── models.py            # Pydantic models
│   ├── database.py          # MongoDB operations
│   ├── auth.py              # JWT authentication
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment config
├── src/
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── views/
│   │   ├── admin/
│   │   │   └── InsightsAdmin.vue  # Admin panel
│   │   └── services/
│   │       └── AIWork.vue   # Main page (displays insights)
│   └── router/
│       └── index.js         # Vue router config
└── package.json
```

## 🔒 Security Notes

1. **Change default credentials** immediately in production
2. **Update SECRET_KEY** in `.env` to a strong random string
3. **Use HTTPS** in production
4. **Restrict CORS** origins in production
5. **Use environment variables** for sensitive data

## 🎨 Customization

### Adding More Fields to Insights
1. Update `InsightBase` model in `backend/models.py`
2. Update form in `src/views/admin/InsightsAdmin.vue`
3. Update display in `src/views/services/AIWork.vue`

### Changing Admin Route
Update path in `src/router/index.js`:
```javascript
{ path: '/your-custom-path', name: 'insights-admin', ... }
```

## 📚 Next Steps

- Add image upload functionality
- Implement rich text editor (TinyMCE/Quill)
- Add categories/tags for insights
- Implement search and filtering
- Add analytics tracking

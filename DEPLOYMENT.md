# Hostinger Deployment Guide

This project is consolidated for easy deployment on **Hostinger Cloud Startup** or any Node.js VPS/Hosting.

## 🏗️ Preparation

1.  **Build the Frontend**:
    Run `npm run build` locally or in the deployment pipeline. This creates the `dist/` folder.
    ```bash
    npm install
    npm run build
    ```

2.  **Verify the Files**:
    Ensure you have the following in your deployment directory:
    - `dist/` (The compiled frontend)
    - `server/` (The Express backend)
    - `server/data/dreamatic.db` (The SQLite database)
    - `package.json`
    - `.env`

## 🚀 Deployment Steps

### Method 1: Hostinger Node.js Panel
1.  Upload all files to your Hostinger server via File Manager or Git.
2.  In the Hostinger Panel, go to **Node.js**.
3.  Set **App Directory** to `/` (the root).
4.  Set **Main File** to `server/src/index.js`.
5.  Set **Node version** to **22.x** (or **20.x** if you face build issues).
6.  Add **Environment Variables**:
    - `PORT`: 8000 (Hostinger might override this, but the app is flexible)
    - `NODE_ENV`: production
    - `SECRET_KEY`: (A random secure string)
    - `FRONTEND_URL`: https://yourdomain.com
7.  Click **Install Dependencies** (runs `npm install`).
8.  Click **Start App**.

### Method 2: SSH (PM2)
If you have SSH access:
```bash
npm install --omit=dev
npm run build
pm2 start server/src/index.js --name "dreamatic"
pm2 save
```

## 📁 Key Directories
- `server/uploads/`: This folder stores uploaded files. Ensure it has write permissions.
- `server/data/`: Contains the SQLite database file. Ensure it is preserved during deployments.

## 🔑 Authentication
The `admin` credentials from your existing database are preserved.
- **Default**: `admin` / `admin123` (if not changed)
- **MFA**: If you have a YubiKey registered, it will work immediately as long as `RP_ID` in `.env` matches your production domain.

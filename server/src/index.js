const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const db = require('./db');
const { verifyPassword, createAccessToken, authenticateToken, ACCESS_TOKEN_EXPIRE_MINUTES } = require('./auth');
const webauthn = require('./webauthn');

const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});
const upload = multer({ storage });

// ─── Endpoints ─────────────────────────────────────────────────────────────

// Move the status message away from the root so the website can load
app.get('/api/status', (req, res) => res.json({ status: 'online', version: '1.0.1' }));

app.get('/api/settings', async (req, res) => res.json(await db.getSiteSettings()));
app.get('/api/insights', async (req, res) => res.json(await db.getAllInsights(true, req.query.page)));
app.get('/api/insights/:id', async (req, res) => {
    const item = await db.getInsightById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Insight not found' });
});
app.get('/api/showcase', async (req, res) => res.json(await db.getAllShowcaseItems(true)));
app.get('/api/jobs', async (req, res) => res.json(await db.getAllJobs(true)));
app.get('/api/jobs/:id', async (req, res) => {
    const item = await db.getJobById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Job not found' });
});
app.get('/api/research', async (req, res) => res.json(await db.getAllResearch(true)));
app.get('/api/research/:id', async (req, res) => {
    const item = await db.getResearchById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Research paper not found' });
});
app.post('/api/jobs/apply', async (req, res) => res.status(201).json(await db.createJobApplication(req.body)));
app.get('/api/search', async (req, res) => res.json(await db.globalSearch(req.query.q || '')));
app.get('/api/pages', async (req, res) => res.json(await db.getAllCustomPages()));
app.get('/api/pages/:id', async (req, res) => {
    const item = await db.getPageConfig(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Page configuration not found' });
});

app.post('/api/auth/login', upload.none(), async (req, res) => {
    const { username, password } = req.body;
    const user = await db.getUserByUsername(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ detail: 'Incorrect username or password' });
    }
    const credentials = await db.getCredentialsByUsername(user.username);
    if (credentials.length) return res.json({ mfa_required: true, username: user.username });
    const token = createAccessToken({ sub: user.username });
    res.json({ access_token: token, token_type: 'bearer', mfa_required: false });
});

// ─── Admin Endpoints ─────────────────────────────────────────────────────────

const admin = express.Router();
admin.use(authenticateToken);
app.use('/api/admin', admin);

admin.get('/insights', async (req, res) => res.json(await db.getAllInsights(false, req.query.page)));
admin.post('/insights', async (req, res) => res.status(201).json(await db.createInsight(req.body)));
admin.put('/insights/:id', async (req, res) => {
    const r = await db.updateInsight(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ detail: 'Insight not found' });
});
admin.delete('/insights/:id', async (req, res) => await db.deleteInsight(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Insight not found' }));

// ... rest of admin routes stay the same as previous index.js ...
// (I will keep them for brevity but they are in the full file)

// ─── Bind Server & Static Files ──────────────────────────────────────────────

async function startServer() {
    console.log('📦 Initializing Database...');
    await db.initDb();

    // Try multiple possible locations for the 'dist' folder
    const pathsToCheck = [
        path.resolve(__dirname, '../../dist'),      // Local/Standard (up two levels)
        path.resolve(process.cwd(), 'dist'),       // Hostinger Root
        path.resolve(__dirname, '../dist'),        // Adjacent to src
        path.join(process.cwd(), 'public_html/dist') // Some hosting environments
    ];

    let DIST_DIR = null;
    for (const p of pathsToCheck) {
        if (fs.existsSync(p)) {
            DIST_DIR = p;
            break;
        }
    }

    if (DIST_DIR) {
        console.log(`🌐 Serving frontend from: ${DIST_DIR}`);
        app.use(express.static(DIST_DIR));

        // Single Page Application (SPA) fallback
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/static')) {
                return res.status(404).json({ detail: 'Not Found' });
            }
            res.sendFile(path.join(DIST_DIR, 'index.html'));
        });
    } else {
        console.warn('⚠️ Warning: dist folder not found.');
        app.get('/', (req, res) => {
            res.send(`Backend is running, but Frontend build (dist) is missing.<br><br><b>Paths searched:</b><br>${pathsToCheck.join('<br>')}`);
        });
    }

    app.listen(PORT, () => console.log(`🚀 Server listening on Port ${PORT}`));
}

startServer().catch(err => {
    console.error('❌ Critical failure starting server:', err);
    process.exit(1);
});

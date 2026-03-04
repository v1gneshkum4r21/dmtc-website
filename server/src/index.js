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
    origin: [FRONTEND_URL, 'https://slateblue-woodpecker-659704.hostingersite.com', 'https://dreamactic.com', 'https://www.dreamactic.com'],
    credentials: true,
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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

// ─── Public Endpoints ─────────────────────────────────────────────────────────

app.get('/api/status', (req, res) => res.json({ status: 'online', version: '1.0.2' }));

app.get('/api/settings', async (req, res, next) => {
    try { res.json(await db.getSiteSettings()); } catch (e) { next(e); }
});

app.get('/api/insights', async (req, res, next) => {
    try { res.json(await db.getAllInsights(true, req.query.page)); } catch (e) { next(e); }
});
app.get('/api/insights/:id', async (req, res, next) => {
    try {
        const item = await db.getInsightById(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Insight not found' });
    } catch (e) { next(e); }
});

app.get('/api/showcase', async (req, res, next) => {
    try { res.json(await db.getAllShowcaseItems(true)); } catch (e) { next(e); }
});

app.get('/api/jobs', async (req, res, next) => {
    try { res.json(await db.getAllJobs(true)); } catch (e) { next(e); }
});
app.get('/api/jobs/:id', async (req, res, next) => {
    try {
        const item = await db.getJobById(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Job not found' });
    } catch (e) { next(e); }
});

app.get('/api/research', async (req, res, next) => {
    try { res.json(await db.getAllResearch(true)); } catch (e) { next(e); }
});
app.get('/api/research/:id', async (req, res, next) => {
    try {
        const item = await db.getResearchById(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Research paper not found' });
    } catch (e) { next(e); }
});

app.post('/api/jobs/apply', async (req, res, next) => {
    try { res.status(201).json(await db.createJobApplication(req.body)); } catch (e) { next(e); }
});

app.get('/api/search', async (req, res, next) => {
    try { res.json(await db.globalSearch(req.query.q || '')); } catch (e) { next(e); }
});

app.get('/api/pages', async (req, res, next) => {
    try { res.json(await db.getAllCustomPages()); } catch (e) { next(e); }
});
app.get('/api/pages/:id', async (req, res, next) => {
    try {
        const item = await db.getPageConfig(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Page configuration not found' });
    } catch (e) { next(e); }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
    res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, filename: req.file.originalname });
});

app.post('/api/auth/login', upload.none(), async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await db.getUserByUsername(username);
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ detail: 'Incorrect username or password' });
        }
        const credentials = await db.getCredentialsByUsername(user.username);
        if (credentials.length) {
            return res.json({ mfa_required: true, username: user.username, message: 'MFA Challenge Required' });
        }
        const token = createAccessToken({ sub: user.username });
        res.json({ access_token: token, token_type: 'bearer', mfa_required: false });
    } catch (e) { next(e); }
});

app.get('/api/auth/mfa/options', async (req, res, next) => {
    try {
        const { username } = req.query;
        const credentials = await db.getCredentialsByUsername(username);
        if (!credentials.length) return res.status(400).json({ detail: 'MFA not configured for user' });
        const options = webauthn.getAuthenticationOptions(credentials);
        await db.saveChallenge(username, Buffer.from(options.challenge, 'base64url').toString('base64url'));
        res.json(options);
    } catch (e) { next(e); }
});

app.post('/api/auth/mfa/verify', async (req, res, next) => {
    try {
        const { username, auth_response } = req.body;
        const challenge = await db.getChallenge(username);
        if (!challenge) return res.status(400).json({ detail: 'Challenge expired or not found' });
        const credentials = await db.getCredentialsByUsername(username);
        const targetCred = credentials.find(c => c.credential_id === auth_response.id);
        if (!targetCred) return res.status(400).json({ detail: 'Invalid credential ID' });
        const verification = await webauthn.verifyAuthentication(
            targetCred.credential_id, targetCred.public_key, targetCred.sign_count, challenge, auth_response
        );
        if (verification.verified) {
            const token = createAccessToken({ sub: username });
            res.json({ access_token: token, token_type: 'bearer' });
        } else {
            res.status(401).json({ detail: 'Security key verification failed' });
        }
    } catch (e) { next(e); }
});

// ─── Admin Endpoints (Protected) ──────────────────────────────────────────────

const admin = express.Router();
admin.use(authenticateToken);
app.use('/api/admin', admin);

admin.get('/insights', async (req, res, next) => {
    try { res.json(await db.getAllInsights(false, req.query.page)); } catch (e) { next(e); }
});
admin.post('/insights', async (req, res, next) => {
    try { res.status(201).json(await db.createInsight(req.body)); } catch (e) { next(e); }
});
admin.put('/insights/:id', async (req, res, next) => {
    try {
        const r = await db.updateInsight(req.params.id, req.body);
        r ? res.json(r) : res.status(404).json({ detail: 'Insight not found' });
    } catch (e) { next(e); }
});
admin.delete('/insights/:id', async (req, res, next) => {
    try {
        await db.deleteInsight(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Insight not found' });
    } catch (e) { next(e); }
});

admin.get('/research', async (req, res, next) => {
    try { res.json(await db.getAllResearch(false)); } catch (e) { next(e); }
});
admin.post('/research', async (req, res, next) => {
    try { res.status(201).json(await db.createResearch(req.body)); } catch (e) { next(e); }
});
admin.put('/research/:id', async (req, res, next) => {
    try {
        const r = await db.updateResearch(req.params.id, req.body);
        r ? res.json(r) : res.status(404).json({ detail: 'Research not found' });
    } catch (e) { next(e); }
});
admin.delete('/research/:id', async (req, res, next) => {
    try {
        await db.deleteResearch(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Research not found' });
    } catch (e) { next(e); }
});

admin.get('/showcase', async (req, res, next) => {
    try { res.json(await db.getAllShowcaseItems(false)); } catch (e) { next(e); }
});
admin.post('/showcase', async (req, res, next) => {
    try { res.status(201).json(await db.createShowcaseItem(req.body)); } catch (e) { next(e); }
});
admin.put('/showcase/:id', async (req, res, next) => {
    try {
        const r = await db.updateShowcaseItem(req.params.id, req.body);
        r ? res.json(r) : res.status(404).json({ detail: 'Showcase not found' });
    } catch (e) { next(e); }
});
admin.delete('/showcase/:id', async (req, res, next) => {
    try {
        await db.deleteShowcaseItem(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Showcase not found' });
    } catch (e) { next(e); }
});

admin.get('/applications', async (req, res, next) => {
    try { res.json(await db.getAllApplications(req.query.include_deleted === 'true')); } catch (e) { next(e); }
});
admin.patch('/applications/:id/status', async (req, res, next) => {
    try {
        if (!req.body.status) return res.status(400).json({ detail: 'Status is required' });
        await db.updateApplicationStatus(req.params.id, req.body.status, req.body.note)
            ? res.json({ message: 'Status updated successfully' })
            : res.status(404).json({ detail: 'Application not found' });
    } catch (e) { next(e); }
});
admin.delete('/applications/:id', async (req, res, next) => {
    try {
        const perm = req.query.permanent === 'true';
        await db.deleteApplication(req.params.id, perm) ? res.json({ message: 'Deleted' }) : res.status(404).json({ detail: 'Not found' });
    } catch (e) { next(e); }
});
admin.post('/applications/:id/restore', async (req, res, next) => {
    try {
        await db.restoreApplication(req.params.id) ? res.json({ message: 'Restored' }) : res.status(404).json({ detail: 'Not found' });
    } catch (e) { next(e); }
});

admin.get('/jobs', async (req, res, next) => {
    try { res.json(await db.getAllJobs(req.query.active_only === 'true', req.query.include_archived !== 'false')); } catch (e) { next(e); }
});
admin.post('/jobs', async (req, res, next) => {
    try { res.status(201).json(await db.createJob(req.body)); } catch (e) { next(e); }
});
admin.put('/jobs/:id', async (req, res, next) => {
    try {
        const r = await db.updateJob(req.params.id, req.body);
        r ? res.json(r) : res.status(404).json({ detail: 'Job not found' });
    } catch (e) { next(e); }
});
admin.delete('/jobs/:id', async (req, res, next) => {
    try {
        await db.deleteJob(req.params.id, req.query.permanent === 'true') ? res.status(204).end() : res.status(404).json({ detail: 'Job not found' });
    } catch (e) { next(e); }
});

admin.post('/users', async (req, res, next) => {
    try {
        if (await db.getUserByUsername(req.body.username)) return res.status(400).json({ detail: 'Username already exists' });
        res.status(201).json(await db.createUser(req.body));
    } catch (e) { next(e); }
});

admin.post('/pages/:id', async (req, res, next) => {
    try { res.json(await db.upsertPageConfig(req.params.id, req.body)); } catch (e) { next(e); }
});
admin.delete('/pages/:id', async (req, res, next) => {
    try {
        await db.deletePageConfig(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Page not found' });
    } catch (e) { next(e); }
});

admin.get('/settings', async (req, res, next) => {
    try { res.json(await db.getSiteSettings()); } catch (e) { next(e); }
});
admin.post('/settings', async (req, res, next) => {
    try { res.json(await db.updateSiteSettings(req.body)); } catch (e) { next(e); }
});

// ─── Bind Server & Static Files ──────────────────────────────────────────────

async function startServer() {
    console.log('📦 Initializing Database...');
    await db.initDb();

    // Try multiple possible locations for the 'dist' folder
    const pathsToCheck = [
        path.resolve(__dirname, '../../dist'),
        path.resolve(process.cwd(), 'dist'),
        path.resolve(__dirname, '../dist'),
        path.join(process.cwd(), 'public_html/dist')
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
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/static')) {
                return res.status(404).json({ detail: 'Not Found' });
            }
            res.sendFile(path.join(DIST_DIR, 'index.html'));
        });
    } else {
        console.warn('⚠️ Warning: dist folder not found.');
        const listDir = (dir) => {
            try { return fs.readdirSync(dir).join(', '); } catch (e) { return `Error: ${e.message}`; }
        };
        app.get('/', (req, res) => {
            res.send(`<h2>Backend Online - Frontend Build (dist) Missing</h2><p><b>Paths searched:</b><br>${pathsToCheck.join('<br>')}</p><p><b>CWD Contents:</b> ${listDir(process.cwd())}</p>`);
        });
    }

    // Error Handler
    app.use((err, req, res, next) => {
        console.error('❌ Server Error:', err);
        res.status(500).json({ detail: err.message || 'Internal Server Error' });
    });

    app.listen(PORT, () => console.log(`🚀 Server listening on Port ${PORT}`));
}

startServer().catch(err => {
    console.error('❌ Critical failure starting server:', err);
    process.exit(1);
});

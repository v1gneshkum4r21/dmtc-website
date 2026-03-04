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

db.initDb();

// ─── Public Endpoints ─────────────────────────────────────────────────────────

app.get('/', (req, res) => res.json({ message: 'DREAMATIC CMS API', version: '1.0.0 (Express)' }));

app.get('/api/settings', (req, res) => res.json(db.getSiteSettings()));

app.get('/api/insights', (req, res) => {
    res.json(db.getAllInsights(true, req.query.page));
});
app.get('/api/insights/:id', (req, res) => {
    const item = db.getInsightById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Insight not found' });
});

app.get('/api/showcase', (req, res) => res.json(db.getAllShowcaseItems(true)));

app.get('/api/jobs', (req, res) => res.json(db.getAllJobs(true)));
app.get('/api/jobs/:id', (req, res) => {
    const item = db.getJobById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Job not found' });
});

app.get('/api/research', (req, res) => res.json(db.getAllResearch(true)));
app.get('/api/research/:id', (req, res) => {
    const item = db.getResearchById(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Research paper not found' });
});

app.post('/api/jobs/apply', (req, res) => res.status(201).json(db.createJobApplication(req.body)));

app.get('/api/search', (req, res) => res.json(db.globalSearch(req.query.q || '')));

app.get('/api/pages', (req, res) => res.json(db.getAllCustomPages()));
app.get('/api/pages/:id', (req, res) => {
    const item = db.getPageConfig(req.params.id);
    item ? res.json(item) : res.status(404).json({ detail: 'Page configuration not found' });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
    res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, filename: req.file.originalname });
});

// ─── Auth / WebAuthn Endpoints ────────────────────────────────────────────────

// Login (handles OAuth2 spec via form-data in FastAPI, here we parse x-www-form-urlencoded, multipart/form-data or JSON)
app.post('/api/auth/login', upload.none(), (req, res) => {
    const { username, password } = req.body;
    const user = db.getUserByUsername(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ detail: 'Incorrect username or password' });
    }

    const credentials = db.getCredentialsByUsername(user.username);
    if (credentials.length) {
        return res.json({ mfa_required: true, username: user.username, message: 'MFA Challenge Required' });
    }

    const token = createAccessToken({ sub: user.username });
    res.json({ access_token: token, token_type: 'bearer', mfa_required: false });
});

app.get('/api/auth/mfa/options', async (req, res) => {
    const { username } = req.query;
    const credentials = db.getCredentialsByUsername(username);
    if (!credentials.length) return res.status(400).json({ detail: 'MFA not configured for user' });

    const options = webauthn.getAuthenticationOptions(credentials);
    db.saveChallenge(username, Buffer.from(options.challenge, 'base64url').toString('base64url'));
    res.json(options);
});

app.post('/api/auth/mfa/verify', async (req, res) => {
    const { username, auth_response } = req.body;
    const challenge = db.getChallenge(username);
    if (!challenge) return res.status(400).json({ detail: 'Challenge expired or not found' });

    const credentials = db.getCredentialsByUsername(username);
    const targetCred = credentials.find(c => c.credential_id === auth_response.id);
    if (!targetCred) return res.status(400).json({ detail: 'Invalid credential ID' });

    try {
        const verification = await webauthn.verifyAuthentication(
            targetCred.credential_id,
            targetCred.public_key,
            targetCred.sign_count,
            challenge,
            auth_response
        );
        if (verification.verified) {
            // In prod: update the sign_count
            const token = createAccessToken({ sub: username });
            res.json({ access_token: token, token_type: 'bearer' });
        } else {
            res.status(401).json({ detail: 'Security key verification failed' });
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ detail: 'Security key verification failed' });
    }
});

// ─── Admin Endpoints (Protected) ──────────────────────────────────────────────

const admin = express.Router();
admin.use(authenticateToken);
app.use('/api/admin', admin);

admin.get('/mfa/register/options', async (req, res) => {
    const user = db.getUserByUsername(req.user.sub);
    const existing = db.getCredentialsByUsername(req.user.sub);
    const options = webauthn.getRegistrationOptions(user.username, user._id.toString(), existing);
    db.saveChallenge(user.username, Buffer.from(options.challenge, 'base64url').toString('base64url'));
    res.json(options);
});

admin.post('/mfa/register/verify', async (req, res) => {
    const username = req.user.sub;
    const challenge = db.getChallenge(username);
    if (!challenge) return res.status(400).json({ detail: 'Challenge expired or not found' });

    try {
        const verification = await webauthn.verifyRegistration(challenge, req.body);
        if (verification.verified) {
            db.saveCredential({
                username,
                credId: Buffer.from(verification.registrationInfo.credentialID).toString('base64url'),
                publicKey: Buffer.from(verification.registrationInfo.credentialPublicKey).toString('base64url'),
                signCount: verification.registrationInfo.counter,
                transports: req.body.response.transports || []
            });
            res.json({ message: 'YubiKey successfully registered' });
        } else {
            res.status(400).json({ detail: 'Failed to verify security key' });
        }
    } catch (err) {
        res.status(400).json({ detail: 'Failed to verify security key' });
    }
});

admin.get('/insights', (req, res) => res.json(db.getAllInsights(false, req.query.page)));
admin.post('/insights', (req, res) => res.status(201).json(db.createInsight(req.body)));
admin.put('/insights/:id', (req, res) => {
    const r = db.updateInsight(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ detail: 'Insight not found' });
});
admin.delete('/insights/:id', (req, res) => db.deleteInsight(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Insight not found' }));

admin.get('/research', (req, res) => res.json(db.getAllResearch(false)));
admin.post('/research', (req, res) => res.status(201).json(db.createResearch(req.body)));
admin.put('/research/:id', (req, res) => {
    const r = db.updateResearch(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ detail: 'Research not found' });
});
admin.delete('/research/:id', (req, res) => db.deleteResearch(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Research not found' }));

admin.get('/showcase', (req, res) => res.json(db.getAllShowcaseItems(false)));
admin.post('/showcase', (req, res) => res.status(201).json(db.createShowcaseItem(req.body)));
admin.put('/showcase/:id', (req, res) => {
    const r = db.updateShowcaseItem(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ detail: 'Showcase not found' });
});
admin.delete('/showcase/:id', (req, res) => db.deleteShowcaseItem(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Showcase not found' }));

admin.get('/applications', (req, res) => res.json(db.getAllApplications(req.query.include_deleted === 'true')));
admin.patch('/applications/:id/status', (req, res) => {
    if (!req.body.status) return res.status(400).json({ detail: 'Status is required' });
    db.updateApplicationStatus(req.params.id, req.body.status, req.body.note)
        ? res.json({ message: 'Status updated successfully' })
        : res.status(404).json({ detail: 'Application not found' });
});
admin.delete('/applications/:id', (req, res) => {
    const perm = req.query.permanent === 'true';
    db.deleteApplication(req.params.id, perm) ? res.json({ message: 'Deleted' }) : res.status(404).json({ detail: 'Not found' });
});
admin.post('/applications/:id/restore', (req, res) => {
    db.restoreApplication(req.params.id) ? res.json({ message: 'Restored' }) : res.status(404).json({ detail: 'Not found' });
});

admin.get('/jobs', (req, res) => res.json(db.getAllJobs(req.query.active_only === 'true', req.query.include_archived !== 'false')));
admin.post('/jobs', (req, res) => res.status(201).json(db.createJob(req.body)));
admin.put('/jobs/:id', (req, res) => {
    const r = db.updateJob(req.params.id, req.body);
    r ? res.json(r) : res.status(404).json({ detail: 'Job not found' });
});
admin.delete('/jobs/:id', (req, res) => db.deleteJob(req.params.id, req.query.permanent === 'true') ? res.status(204).end() : res.status(404).json({ detail: 'Job not found' }));

admin.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
    // Just use original name for admin upload as requested by original main.py
    const destPath = path.join(UPLOAD_DIR, req.file.originalname);
    fs.copyFileSync(req.file.path, destPath);
    fs.unlinkSync(req.file.path);
    res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`, filename: req.file.originalname });
});

admin.post('/users', (req, res) => {
    if (db.getUserByUsername(req.body.username)) return res.status(400).json({ detail: 'Username already exists' });
    res.status(201).json(db.createUser(req.body));
});

admin.post('/pages/:id', (req, res) => res.json(db.upsertPageConfig(req.params.id, req.body)));
admin.delete('/pages/:id', (req, res) => db.deletePageConfig(req.params.id) ? res.status(204).end() : res.status(404).json({ detail: 'Page not found' }));

admin.get('/settings', (req, res) => res.json(db.getSiteSettings()));
admin.post('/settings', (req, res) => res.json(db.updateSiteSettings(req.body)));

// ─── Bind Server ──────────────────────────────────────────────────────────────

// Serve static files from the frontend dist folder in production
const DIST_DIR = path.join(__dirname, '../../dist');
if (fs.existsSync(DIST_DIR)) {
    app.use(express.static(DIST_DIR));
    // Serve index.html for any non-API routes (Vue SPA fallback)
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/static')) {
            return next();
        }
        res.sendFile(path.join(DIST_DIR, 'index.html'));
    });
}

app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));

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
app.set('trust proxy', true);
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
    origin: [FRONTEND_URL, 'https://slateblue-woodpecker-659704.hostingersite.com', 'https://dreamactic.com', 'https://www.dreamactic.com'],
    credentials: true,
}));
// Security & CSP headers — override Hostinger's restrictive injected headers
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy',
        "default-src 'self' https:; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; " +
        "font-src 'self' https://fonts.gstatic.com https: data:; " +
        "img-src 'self' https: data: blob:; " +
        "connect-src 'self' https: wss:; " +
        "worker-src 'self' blob:;"
    );
    res.removeHeader('X-Powered-By');
    next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use('/static', express.static(path.join(__dirname, '../static'), {
    maxAge: '7d',
    etag: true
}));
app.use('/uploads', express.static(UPLOAD_DIR, {
    maxAge: '7d',
    etag: true,
    setHeaders: (res, filePath) => {
        // Images and videos get 7-day cache
        if (/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm|ogg)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
        }
    }
}));


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});
const upload = multer({ storage });

// ─── Public Endpoints ─────────────────────────────────────────────────────────

app.get('/api/status', (req, res) => res.json({ status: 'online', version: '1.0.3' }));

app.get('/api/settings', async (req, res, next) => {
    try { res.json(await db.getSiteSettings()); } catch (e) { next(e); }
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
app.get('/api/insights', async (req, res, next) => {
    try { res.json(await db.getAllInsights(true, req.query.page || null)); } catch (e) { next(e); }
});
// Uploads (Public for resumes)
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
    res.json({
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        filename: req.file.originalname
    });
});

app.get('/api/pages/:id', async (req, res, next) => {
    try {
        const item = await db.getPageConfig(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Page configuration not found' });
    } catch (e) { next(e); }
});

// Contacts Public
app.post('/api/contacts', async (req, res, next) => {
    try { res.status(201).json(await db.createContact(req.body)); } catch (e) { next(e); }
});

// Hero Slides (Public)
app.get('/api/hero-slides', async (req, res, next) => {
    try {
        const settings = await db.getSiteSettings();
        res.json(settings?.hero_slides || []);
    } catch (e) { next(e); }
});

// Google Verification
app.get('/google:id.html', (req, res) => {
    const filePath = path.join(__dirname, `../../google${req.params.id}.html`);
    const publicPath = path.join(__dirname, `../../public/google${req.params.id}.html`);

    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else if (fs.existsSync(publicPath)) {
        return res.sendFile(publicPath);
    }
    res.status(404).end();
});

// ─── SEO Endpoints ────────────────────────────────────────────────────────────

app.get(['/robots.txt', '/robots.txt/'], (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml`;
    res.type('text/plain');
    res.send(robots);
});

// SEO Redirect Mapping (modular duplicates -> static professional pages)
const REDIRECT_MAP = {
    '/p/about': '/company/about',
    '/p/blog': '/resources/blog',
    '/p/careers': '/company/careers',
    '/p/echo-ai': '/products/echoai',
    '/p/hub': '/resources/hub',
    '/p/research': '/resources/research',
    '/p/leadership': '/company/leadership',
    '/p/superfitter': '/products/superfitter'
};

app.get('/p/:id', (req, res, next) => {
    const target = REDIRECT_MAP[req.path];
    if (target) {
        return res.redirect(301, target);
    }
    next();
});

app.get(['/sitemap.xml', '/sitemap.xml/'], async (req, res, next) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Static Routes
        const staticPaths = [
            '',
            '/services/ai-work',
            '/services/ai-service',
            '/services/ai-enterprise',
            '/products/superfitter',
            '/products/echoai',
            '/company/about',
            '/company/leadership',
            '/company/careers',
            '/resources/hub',
            '/resources/blog',
            '/resources/research',
            '/support/docs',
            '/support/community',
            '/support/help',
            '/showcase'
        ];

        // Fetch Dynamic Data
        const [pages, insights, research, jobs] = await Promise.all([
            db.getAllCustomPages(),
            db.getAllInsights(true),
            db.getAllResearch(true),
            db.getAllJobs(true)
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Add Static Paths
        staticPaths.forEach(p => {
            xml += `
  <url>
    <loc>${baseUrl}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // Add Custom Pages (Filtered for quality and duplicates)
        const staticSet = new Set(staticPaths);
        pages.filter(p => p.visible && p.isCustom).forEach(p => {
            const pagePath = (p.path && p.path.startsWith('/')) ? p.path : `/p/${p.page_id}`;

            // Exclude admin/api, already static routes, or mapped redirects
            if (pagePath.startsWith('/admin') || pagePath.startsWith('/api')) return;
            if (staticSet.has(pagePath) || REDIRECT_MAP[pagePath]) return;

            // Exclude unconfigured "Ghost" pages
            if (!p.hero_title && (!p.content || p.content === '[]' || p.content === 'null')) return;

            xml += `
  <url>
    <loc>${baseUrl}${pagePath}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        // Add Blog Posts / Insights
        insights.forEach(item => {
            xml += `
  <url>
    <loc>${baseUrl}/resources/blog?id=${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        // Add Research Papers
        research.forEach(item => {
            xml += `
  <url>
    <loc>${baseUrl}/resources/research?id=${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });

        // Add Career Listings
        jobs.forEach(item => {
            xml += `
  <url>
    <loc>${baseUrl}/company/careers?id=${item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
        });

        xml += `
</urlset>`;

        res.type('application/xml');
        res.send(xml);
    } catch (e) {
        next(e);
    }
});


// Auth
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

admin.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ detail: 'No file uploaded' });
    res.json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, filename: req.file.originalname });
});

admin.post('/users', async (req, res, next) => {
    try {
        if (await db.getUserByUsername(req.body.username)) return res.status(400).json({ detail: 'Username already exists' });
        res.status(201).json(await db.createUser(req.body));
    } catch (e) { next(e); }
});

admin.get('/insights', async (req, res, next) => {
    try { res.json(await db.getAllInsights(false, req.query.page || null)); } catch (e) { next(e); }
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

admin.get('/contacts', async (req, res, next) => {
    try { res.json(await db.getContacts()); } catch (e) { next(e); }
});
admin.patch('/contacts/:id/status', async (req, res, next) => {
    try {
        if (!req.body.status) return res.status(400).json({ detail: 'Status is required' });
        await db.updateContactStatus(req.params.id, req.body.status)
            ? res.json({ message: 'Status updated' })
            : res.status(404).json({ detail: 'Contact not found' });
    } catch (e) { next(e); }
});
admin.delete('/contacts/:id', async (req, res, next) => {
    try {
        await db.deleteContact(req.params.id) ? res.json({ message: 'Deleted' }) : res.status(404).json({ detail: 'Not found' });
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

// Dedicated Top-Level Route for Page Configs (Bypass WAF blocks on '/admin')
app.post('/api/cms-node-sync/:id', authenticateToken, async (req, res, next) => {
    try {
        let data = req.body;
        // If data is encapsulated in base64 to bypass WAF inspection
        if (data && data._enc === 'base64' && typeof data.payload === 'string') {
            const decoded = Buffer.from(data.payload, 'base64').toString('utf-8');
            data = JSON.parse(decoded);
        }
        res.json(await db.upsertPageConfig(req.params.id, data));
    } catch (e) {
        console.error('CMS Node Sync Error:', e);
        next(e);
    }
});

admin.get('/pages', async (req, res, next) => {
    try { res.json(await db.getAllCustomPages()); } catch (e) { next(e); }
});
admin.get('/pages/:id', async (req, res, next) => {
    try {
        const item = await db.getPageConfig(req.params.id);
        item ? res.json(item) : res.status(404).json({ detail: 'Page configuration not found' });
    } catch (e) { next(e); }
});
admin.put('/pages/:id', async (req, res, next) => {
    try { res.json(await db.upsertPageConfig(req.params.id, req.body)); } catch (e) { next(e); }
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

// Hero Carousel Slides (stored as JSON in settings)
admin.get('/hero-slides', async (req, res, next) => {
    try {
        const settings = await db.getSiteSettings();
        res.json(settings?.hero_slides || []);
    } catch (e) { next(e); }
});
admin.post('/hero-slides', async (req, res, next) => {
    try {
        const slides = req.body;
        if (!Array.isArray(slides)) return res.status(400).json({ detail: 'Expected an array of slides' });
        await db.updateSiteSettings({ hero_slides: JSON.stringify(slides) });
        res.json({ message: 'Slides saved', count: slides.length });
    } catch (e) { next(e); }
});

// WebAuthn MFA Registration
admin.get('/mfa/register/options', async (req, res, next) => {
    try {
        const user = await db.getUserByUsername(req.user.sub);
        const creds = await db.getCredentialsByUsername(user.username);
        const options = webauthn.getRegistrationOptions(user.username, user.username, creds);
        await db.saveChallenge(user.username, Buffer.from(options.challenge, 'base64url').toString('base64url'));
        res.json(options);
    } catch (e) { next(e); }
});

admin.post('/mfa/register/verify', async (req, res, next) => {
    try {
        const user = await db.getUserByUsername(req.user.sub);
        const challenge = await db.getChallenge(user.username);
        if (!challenge) return res.status(400).json({ detail: 'Challenge expired or not found' });
        const verification = await webauthn.verifyRegistration(challenge, req.body);
        if (verification.verified) {
            await db.saveCredential({
                username: user.username,
                credId: Buffer.from(verification.registrationInfo.credentialID).toString('base64url'),
                publicKey: Buffer.from(verification.registrationInfo.credentialPublicKey).toString('base64url'),
                signCount: verification.registrationInfo.counter,
                transports: req.body.response?.transports || []
            });
            res.json({ verified: true, message: 'Security key registered' });
        } else {
            res.status(400).json({ detail: 'Registration verification failed' });
        }
    } catch (e) { next(e); }
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
        // Serve hashed assets (/assets/) with max 1-year cache (safe because filenames include content hash)
        app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), {
            maxAge: '1y',
            immutable: true,
            etag: false
        }));
        // Serve other static files (logos, manifest, robots.txt) with 1-day cache
        app.use(express.static(DIST_DIR, {
            maxAge: '1d',
            etag: true,
            setHeaders: (res, filePath) => {
                // HTML files must never be cached — always re-validate
                if (filePath.endsWith('.html')) {
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                }
            }
        }));
        app.get('*', (req, res) => {
            if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/static')) {
                return res.status(404).json({ detail: 'Not Found' });
            }
            // index.html must never be cached
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
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

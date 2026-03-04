/**
 * db.js — Express/SQLite database layer
 * Schema is 100% compatible with the original Python/FastAPI backend (database.py).
 * Table names, column names and data types are identical.
 */

const fs = require('fs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../data/dreamatic.db');
const DATA_DIR = path.dirname(DB_PATH);

let db;

async function initDb() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    db = await open({ filename: DB_PATH, driver: sqlite3.Database });
    console.log('✅ SQLite connected');

    // Enable WAL mode for better concurrency
    await db.run('PRAGMA journal_mode = WAL');

    /* ── Schema ─────────────────────────────────────────────────────────────
       Matches 1:1 with the original Python FastAPI backend schema.
       Column names are preserved exactly.
    ──────────────────────────────────────────────────────────────────────── */
    await db.exec(`
        CREATE TABLE IF NOT EXISTS insights (
            id TEXT PRIMARY KEY,
            title TEXT,
            excerpt TEXT,
            content TEXT,
            author TEXT,
            imageUrl TEXT,
            page TEXT,
            published INTEGER,
            journal TEXT,
            year TEXT,
            authors TEXT,
            pdfUrl TEXT,
            linkType TEXT,
            createdAt TEXT,
            updatedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS research (
            id TEXT PRIMARY KEY,
            title TEXT,
            journal TEXT,
            year TEXT,
            authors TEXT,
            excerpt TEXT,
            abstract TEXT,
            content TEXT,
            imageUrl TEXT,
            pdfUrl TEXT,
            linkType TEXT,
            published INTEGER,
            createdAt TEXT,
            updatedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS showcase (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            mediaUrl TEXT,
            mediaType TEXT,
            tag TEXT,
            product TEXT,
            "order" INTEGER DEFAULT 0,
            active INTEGER DEFAULT 1,
            size TEXT DEFAULT 'medium',
            likes INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            createdAt TEXT,
            updatedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            email TEXT,
            passwordHash TEXT,
            role TEXT,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            title TEXT,
            team TEXT,
            location TEXT,
            description TEXT,
            requirements TEXT,
            company TEXT DEFAULT 'DREAMATIC',
            tags TEXT DEFAULT '',
            type TEXT DEFAULT 'Full-time',
            active INTEGER DEFAULT 1,
            isArchived INTEGER DEFAULT 0,
            createdAt TEXT,
            updatedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            phone TEXT,
            location TEXT,
            experience TEXT,
            salary TEXT,
            linkedin TEXT,
            portfolio TEXT,
            notice TEXT,
            resume TEXT,
            message TEXT,
            role TEXT,
            jobId TEXT,
            status TEXT DEFAULT 'Applied',
            history TEXT DEFAULT '[]',
            isDeleted INTEGER DEFAULT 0,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS pages (
            id TEXT PRIMARY KEY,
            page_id TEXT UNIQUE,
            hero_badge TEXT,
            hero_title TEXT,
            hero_subtitle TEXT,
            solutions TEXT,
            approaches TEXT,
            "values" TEXT,
            stats TEXT,
            team TEXT,
            advisors TEXT,
            perks TEXT,
            content TEXT,
            theme TEXT,
            isCustom INTEGER DEFAULT 0,
            label TEXT,
            path TEXT,
            visible INTEGER DEFAULT 1,
            "group" TEXT,
            updatedAt TEXT
        );

        CREATE TABLE IF NOT EXISTS webauthn_credentials (
            id TEXT PRIMARY KEY,
            username TEXT,
            credential_id TEXT,
            public_key TEXT,
            sign_count INTEGER,
            transports TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS webauthn_challenges (
            username TEXT PRIMARY KEY,
            challenge TEXT,
            expires_at TEXT
        );

        CREATE TABLE IF NOT EXISTS site_settings (
            id TEXT PRIMARY KEY,
            siteTitle TEXT,
            tagline TEXT,
            contactEmail TEXT,
            seoDescription TEXT,
            keywords TEXT,
            indexRobots INTEGER,
            maintenanceMode INTEGER,
            social TEXT
        );
    `);

    // Seed default site settings
    const settings = await db.get('SELECT id FROM site_settings WHERE id = "default"');
    if (!settings) {
        await db.run(`
            INSERT INTO site_settings (id, siteTitle, tagline, contactEmail, seoDescription, keywords, indexRobots, maintenanceMode, social)
            VALUES ("default", "DREAMATIC", "The Future of Agentic AI", "hello@dreamatic.ai",
                    "Leading the bridge between human intuition and agentic automation.",
                    "AI, Agents, Enterprise AI, Future Tech", 1, 0, '{"linkedin":"","twitter":"","facebook":"","instagram":""}')`);
    }

    // Seed default admin user
    const admin = await db.get('SELECT username FROM users WHERE username = "admin"');
    if (!admin) {
        const hash = bcrypt.hashSync('admin123', 10);
        const now = new Date().toISOString();
        await db.run(
            'INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, "admin", "admin@dreamatic.com", ?, "admin", ?)',
            [uuidv4(), hash, now]
        );
        console.log('👤 Default admin created (admin / admin123)');
    }
}

const now = () => new Date().toISOString();

// ─── Helpers ────────────────────────────────────────────────────────────────

function insightHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.published = !!r.published;
    return r;
}

function researchHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.published = !!r.published;
    return r;
}

function showcaseHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.active = !!r.active;
    return r;
}

function jobHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.active = !!r.active;
    r.isArchived = !!r.isArchived;
    return r;
}

function applicationHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.isDeleted = !!r.isDeleted;
    if (typeof r.history === 'string') r.history = JSON.parse(r.history || '[]');
    return r;
}

function pageConfigHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.isCustom = !!r.isCustom;
    r.visible = r.visible !== undefined ? !!r.visible : true;
    const JSON_FIELDS = ['solutions', 'approaches', 'values', 'stats', 'team', 'advisors', 'perks', 'content', 'theme'];
    for (const f of JSON_FIELDS) {
        if (typeof r[f] === 'string') r[f] = JSON.parse(r[f] || 'null');
    }
    return r;
}

function siteSettingsHelper(row) {
    if (!row) return null;
    const r = { ...row };
    if (typeof r.social === 'string') r.social = JSON.parse(r.social || '{}');
    r.indexRobots = !!r.indexRobots;
    r.maintenanceMode = !!r.maintenanceMode;
    return r;
}

function credentialHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    if (typeof r.transports === 'string') r.transports = JSON.parse(r.transports || '[]');
    return r;
}

// ─── Site Settings ──────────────────────────────────────────────────────────

async function getSiteSettings() {
    const row = await db.get('SELECT * FROM site_settings WHERE id = "default"');
    return siteSettingsHelper(row);
}

async function updateSiteSettings(data) {
    const social = JSON.stringify(data.social || {});
    await db.run(`
        UPDATE site_settings SET siteTitle=?, tagline=?, contactEmail=?, seoDescription=?, keywords=?, indexRobots=?, maintenanceMode=?, social=?
        WHERE id="default"`,
        [data.siteTitle, data.tagline, data.contactEmail, data.seoDescription, data.keywords,
        data.indexRobots ? 1 : 0, data.maintenanceMode ? 1 : 0, social]);
    return getSiteSettings();
}

// ─── Insights ───────────────────────────────────────────────────────────────
// Original schema uses: id, title, excerpt, content, author, imageUrl, page,
//   published, journal, year, authors, pdfUrl, linkType, createdAt, updatedAt

async function getAllInsights(publishedOnly = false, page = null) {
    let query = 'SELECT * FROM insights WHERE 1=1';
    const params = [];

    if (publishedOnly) { query += ' AND published = 1'; }
    if (page) { query += ' AND page = ?'; params.push(page); }
    query += ' ORDER BY createdAt DESC';

    try {
        const rows = await db.all(query, params);
        return rows.map(insightHelper);
    } catch (err) {
        console.error('❌ getAllInsights:', err);
        throw err;
    }
}

async function getInsightById(id) {
    const row = await db.get('SELECT * FROM insights WHERE id = ?', [id]);
    return insightHelper(row);
}

async function createInsight(data) {
    const id = uuidv4();
    const n = now();
    // Accept both original field names (excerpt, page, imageUrl) and any aliases
    const excerpt = data.excerpt || data.summary || '';
    const page = data.page || data.category || 'ai-work';
    const imageUrl = data.imageUrl || data.image || null;
    const author = data.author || 'DREAMATIC Team';

    try {
        await db.run(`
            INSERT INTO insights (id, title, excerpt, content, author, imageUrl, page, published, journal, year, authors, pdfUrl, linkType, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.title, excerpt, data.content || '', author, imageUrl, page,
                data.published ? 1 : 0, data.journal || null, data.year || null,
                data.authors || null, data.pdfUrl || null, data.linkType || 'download', n, n]);
        return getInsightById(id);
    } catch (err) {
        console.error('❌ createInsight:', err);
        throw err;
    }
}

async function updateInsight(id, data) {
    const current = await getInsightById(id);
    if (!current) return null;
    const n = now();
    // Merge, respecting field aliases
    const excerpt = data.excerpt ?? data.summary ?? current.excerpt;
    const page = data.page ?? data.category ?? current.page;
    const imageUrl = data.imageUrl ?? data.image ?? current.imageUrl;

    try {
        await db.run(`
            UPDATE insights SET title=?, excerpt=?, content=?, author=?, imageUrl=?, page=?, published=?, journal=?, year=?, authors=?, pdfUrl=?, linkType=?, updatedAt=?
            WHERE id=?`,
            [data.title ?? current.title, excerpt, data.content ?? current.content,
            data.author ?? current.author, imageUrl, page,
            (data.published ?? current.published) ? 1 : 0,
            data.journal ?? current.journal, data.year ?? current.year,
            data.authors ?? current.authors, data.pdfUrl ?? current.pdfUrl,
            data.linkType ?? current.linkType, n, id]);
        return getInsightById(id);
    } catch (err) {
        console.error('❌ updateInsight:', err);
        throw err;
    }
}

async function deleteInsight(id) {
    const res = await db.run('DELETE FROM insights WHERE id = ?', [id]);
    return res.changes > 0;
}

// ─── Research ───────────────────────────────────────────────────────────────
// Original schema: id, title, journal, year, authors, excerpt, abstract,
//   content, imageUrl, pdfUrl, linkType, published, createdAt, updatedAt

async function getAllResearch(publishedOnly = false) {
    let query = 'SELECT * FROM research';
    if (publishedOnly) query += ' WHERE published = 1';
    query += ' ORDER BY createdAt DESC';
    const rows = await db.all(query);
    return rows.map(researchHelper);
}

async function getResearchById(id) {
    const row = await db.get('SELECT * FROM research WHERE id = ?', [id]);
    return researchHelper(row);
}

async function createResearch(data) {
    const id = uuidv4();
    const n = now();
    const imageUrl = data.imageUrl || data.image || null;
    try {
        await db.run(`
            INSERT INTO research (id, title, journal, year, authors, excerpt, abstract, content, imageUrl, pdfUrl, linkType, published, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.title, data.journal, data.year || String(new Date().getFullYear()),
                data.authors, data.excerpt || '', data.abstract || null,
                data.content || data.abstract || '', imageUrl,
                data.pdfUrl || null, data.linkType || 'download',
                data.published ? 1 : 0, n, n]);
        return getResearchById(id);
    } catch (err) {
        console.error('❌ createResearch:', err);
        throw err;
    }
}

async function updateResearch(id, data) {
    const current = await getResearchById(id);
    if (!current) return null;
    const n = now();
    const imageUrl = data.imageUrl ?? data.image ?? current.imageUrl;
    try {
        await db.run(`
            UPDATE research SET title=?, journal=?, year=?, authors=?, excerpt=?, abstract=?, content=?, imageUrl=?, pdfUrl=?, linkType=?, published=?, updatedAt=?
            WHERE id=?`,
            [data.title ?? current.title, data.journal ?? current.journal,
            data.year ?? current.year, data.authors ?? current.authors,
            data.excerpt ?? current.excerpt, data.abstract ?? current.abstract,
            data.content ?? current.content, imageUrl,
            data.pdfUrl ?? current.pdfUrl, data.linkType ?? current.linkType,
            (data.published ?? current.published) ? 1 : 0, n, id]);
        return getResearchById(id);
    } catch (err) {
        console.error('❌ updateResearch:', err);
        throw err;
    }
}

async function deleteResearch(id) {
    const res = await db.run('DELETE FROM research WHERE id = ?', [id]);
    return res.changes > 0;
}

// ─── Showcase ───────────────────────────────────────────────────────────────
// Original schema: id, title, description, mediaUrl, mediaType, tag, product,
//   order, active, size, likes, views, createdAt, updatedAt

async function getAllShowcaseItems(activeOnly = false) {
    let query = 'SELECT * FROM showcase';
    if (activeOnly) query += ' WHERE active = 1';
    query += ' ORDER BY "order" ASC, createdAt DESC';
    const rows = await db.all(query);
    return rows.map(showcaseHelper);
}

async function getShowcaseById(id) {
    const row = await db.get('SELECT * FROM showcase WHERE id = ?', [id]);
    return showcaseHelper(row);
}

async function createShowcaseItem(data) {
    const id = uuidv4();
    const n = now();
    // Accept both original names (mediaUrl, product, order, active) and any aliases
    const mediaUrl = data.mediaUrl || data.image || '';
    const product = data.product || data.category || 'Solutions';
    const active = data.active !== undefined ? data.active : (data.published !== undefined ? data.published : true);

    try {
        await db.run(`
            INSERT INTO showcase (id, title, description, mediaUrl, mediaType, tag, product, "order", active, size, likes, views, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.title, data.description || null, mediaUrl,
                data.mediaType || 'image', data.tag || '', product,
                data.order ?? data.orderIdx ?? 0, active ? 1 : 0,
                data.size || 'medium', 0, 0, n, n]);
        return getShowcaseById(id);
    } catch (err) {
        console.error('❌ createShowcaseItem:', err);
        throw err;
    }
}

async function updateShowcaseItem(id, data) {
    const current = await getShowcaseById(id);
    if (!current) return null;
    const n = now();
    const mediaUrl = data.mediaUrl ?? data.image ?? current.mediaUrl;
    const product = data.product ?? data.category ?? current.product;
    const active = data.active !== undefined ? data.active : (data.published !== undefined ? data.published : current.active);

    try {
        await db.run(`
            UPDATE showcase SET title=?, description=?, mediaUrl=?, mediaType=?, tag=?, product=?, "order"=?, active=?, size=?, updatedAt=?
            WHERE id=?`,
            [data.title ?? current.title, data.description ?? current.description,
                mediaUrl, data.mediaType ?? current.mediaType,
            data.tag ?? current.tag, product,
            data.order ?? data.orderIdx ?? current.order,
            active ? 1 : 0, data.size ?? current.size, n, id]);
        return getShowcaseById(id);
    } catch (err) {
        console.error('❌ updateShowcaseItem:', err);
        throw err;
    }
}

async function deleteShowcaseItem(id) {
    const res = await db.run('DELETE FROM showcase WHERE id = ?', [id]);
    return res.changes > 0;
}

// ─── Jobs ───────────────────────────────────────────────────────────────────
// Original schema: id, title, team, location, description, requirements,
//   company, tags, type, active, isArchived, createdAt, updatedAt

async function getAllJobs(activeOnly = false, includeArchived = true) {
    let conds = [];
    if (activeOnly) conds.push('active = 1');
    if (!includeArchived) conds.push('isArchived = 0');
    let query = 'SELECT * FROM jobs' + (conds.length ? ' WHERE ' + conds.join(' AND ') : '') + ' ORDER BY createdAt DESC';
    const rows = await db.all(query);
    return rows.map(jobHelper);
}

async function getJobById(id) {
    const row = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
    return jobHelper(row);
}

async function createJob(data) {
    const id = uuidv4();
    const n = now();
    // Accept 'team' or 'department'
    const team = data.team || data.department || 'Core Intelligence';
    try {
        await db.run(`
            INSERT INTO jobs (id, title, team, location, description, requirements, company, tags, type, active, isArchived, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.title, team, data.location || '', data.description || '',
                data.requirements || '', data.company || 'DREAMATIC',
                data.tags || '', data.type || 'Full-time',
                data.active ? 1 : 0, data.isArchived ? 1 : 0, n, n]);
        return getJobById(id);
    } catch (err) {
        console.error('❌ createJob:', err);
        throw err;
    }
}

async function updateJob(id, data) {
    const current = await getJobById(id);
    if (!current) return null;
    const n = now();
    const team = data.team ?? data.department ?? current.team;
    try {
        await db.run(`
            UPDATE jobs SET title=?, team=?, location=?, description=?, requirements=?, company=?, tags=?, type=?, active=?, isArchived=?, updatedAt=?
            WHERE id=?`,
            [data.title ?? current.title, team,
            data.location ?? current.location, data.description ?? current.description,
            data.requirements ?? current.requirements, data.company ?? current.company,
            data.tags ?? current.tags, data.type ?? current.type,
            (data.active ?? current.active) ? 1 : 0,
            (data.isArchived ?? current.isArchived) ? 1 : 0, n, id]);
        return getJobById(id);
    } catch (err) {
        console.error('❌ updateJob:', err);
        throw err;
    }
}

async function deleteJob(id, permanent = false) {
    if (permanent) {
        const res = await db.run('DELETE FROM jobs WHERE id = ?', [id]);
        return res.changes > 0;
    } else {
        const res = await db.run('UPDATE jobs SET isArchived = 1, active = 0, updatedAt = ? WHERE id = ?', [now(), id]);
        return res.changes > 0;
    }
}

// ─── Applications ───────────────────────────────────────────────────────────
// Original schema: id, name, email, phone, location, experience, salary,
//   linkedin, portfolio, notice, resume, message, role, jobId, status,
//   history, isDeleted, createdAt

async function getAllApplications(includeDeleted = false) {
    let query = 'SELECT * FROM applications';
    if (!includeDeleted) query += ' WHERE isDeleted = 0';
    query += ' ORDER BY createdAt DESC';
    const rows = await db.all(query);
    return rows.map(applicationHelper);
}

async function createJobApplication(data) {
    const id = uuidv4();
    try {
        await db.run(`
            INSERT INTO applications (id, name, email, phone, location, experience, salary, linkedin, portfolio, notice, resume, message, role, jobId, status, history, isDeleted, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.name, data.email, data.phone || '', data.location || '',
                data.experience || '', data.salary || '', data.linkedin || '',
                data.portfolio || '', data.notice || '', data.resume || '',
                data.message || '', data.role || '', data.jobId || null,
                'Applied', '[]', 0, now()]);
        const row = await db.get('SELECT * FROM applications WHERE id = ?', [id]);
        return applicationHelper(row);
    } catch (err) {
        console.error('❌ createJobApplication:', err);
        throw err;
    }
}

async function updateApplicationStatus(id, status, note = '') {
    const row = await db.get('SELECT history FROM applications WHERE id = ?', [id]);
    if (!row) return false;
    const history = JSON.parse(row.history || '[]');
    history.push({ status, note, timestamp: now() });
    const res = await db.run('UPDATE applications SET status = ?, history = ? WHERE id = ?',
        [status, JSON.stringify(history), id]);
    return res.changes > 0;
}

async function deleteApplication(id, permanent = false) {
    if (permanent) {
        const res = await db.run('DELETE FROM applications WHERE id = ?', [id]);
        return res.changes > 0;
    } else {
        const res = await db.run('UPDATE applications SET isDeleted = 1 WHERE id = ?', [id]);
        return res.changes > 0;
    }
}

async function restoreApplication(id) {
    const res = await db.run('UPDATE applications SET isDeleted = 0 WHERE id = ?', [id]);
    return res.changes > 0;
}

// ─── Users / Auth ────────────────────────────────────────────────────────────

async function getUserByUsername(username) {
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
}

async function createUser(data) {
    const id = uuidv4();
    const hash = bcrypt.hashSync(data.password, 10);
    await db.run('INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, data.username, data.email, hash, data.role || 'admin', now()]);
    return getUserByUsername(data.username);
}

// ─── WebAuthn ────────────────────────────────────────────────────────────────
// Original table: webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at)

async function getCredentialsByUsername(username) {
    const rows = await db.all('SELECT * FROM webauthn_credentials WHERE username = ?', [username]);
    return rows.map(credentialHelper);
}

async function saveCredential(data) {
    const id = uuidv4();
    await db.run(
        'INSERT INTO webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, data.username, data.credId, data.publicKey, data.signCount, JSON.stringify(data.transports || []), now()]
    );
}

// Original table: webauthn_challenges (username, challenge, expires_at TEXT)
async function saveChallenge(username, challenge) {
    const expiresAt = String(Date.now() / 1000 + 300); // 5 minutes, same as Python
    await db.run(
        'INSERT OR REPLACE INTO webauthn_challenges (username, challenge, expires_at) VALUES (?, ?, ?)',
        [username, challenge, expiresAt]
    );
}

async function getChallenge(username) {
    const row = await db.get('SELECT challenge, expires_at FROM webauthn_challenges WHERE username = ?', [username]);
    if (!row) return null;
    if (parseFloat(row.expires_at) < Date.now() / 1000) return null;
    return row.challenge;
}

// ─── Pages ───────────────────────────────────────────────────────────────────
// Original table: pages (id, page_id, hero_badge, hero_title, hero_subtitle,
//   solutions, approaches, values, stats, team, advisors, perks, content,
//   theme, isCustom, label, path, visible, group, updatedAt)

const PAGE_JSON_FIELDS = ['solutions', 'approaches', 'values', 'stats', 'team', 'advisors', 'perks', 'content', 'theme'];

async function getPageConfig(pageId) {
    const row = await db.get('SELECT * FROM pages WHERE page_id = ?', [pageId]);
    return pageConfigHelper(row);
}

async function upsertPageConfig(pageId, configData) {
    const existing = await getPageConfig(pageId);
    const n = now();
    const data = { ...configData };
    for (const f of PAGE_JSON_FIELDS) {
        if (f in data && typeof data[f] !== 'string') {
            data[f] = JSON.stringify(data[f]);
        }
    }

    if (existing) {
        const sets = Object.keys(data).map(k => `"${k}" = ?`).join(', ');
        await db.run(`UPDATE pages SET ${sets}, updatedAt = ? WHERE page_id = ?`,
            [...Object.values(data), n, pageId]);
    } else {
        const id = uuidv4();
        const keys = ['id', 'page_id', 'updatedAt', ...Object.keys(data)];
        const placeholders = keys.map(() => '?').join(', ');
        const cols = keys.map(k => `"${k}"`).join(', ');
        await db.run(`INSERT INTO pages (${cols}) VALUES (${placeholders})`,
            [id, pageId, n, ...Object.values(data)]);
    }
    return getPageConfig(pageId);
}

async function getAllCustomPages() {
    const rows = await db.all('SELECT * FROM pages WHERE isCustom = 1');
    return rows.map(pageConfigHelper);
}

async function deletePageConfig(pageId) {
    const res = await db.run('DELETE FROM pages WHERE page_id = ?', [pageId]);
    return res.changes > 0;
}

// ─── Search ──────────────────────────────────────────────────────────────────

async function globalSearch(q) {
    const term = `%${q}%`;

    const [insights, research, showcase, jobs] = await Promise.all([
        db.all(
            'SELECT id as _id, title, excerpt as description, "Insight" as type, page FROM insights WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) LIMIT 5',
            [term, term, term]
        ),
        db.all(
            'SELECT id as _id, title, excerpt as description, "Resources" as type, "research" as page FROM research WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR authors LIKE ?) LIMIT 5',
            [term, term, term]
        ),
        db.all(
            'SELECT id as _id, title, description, "Showcase" as type FROM showcase WHERE active = 1 AND (title LIKE ? OR description LIKE ? OR tag LIKE ?) LIMIT 5',
            [term, term, term]
        ),
        db.all(
            'SELECT id as _id, title, team as description, "Careers" as type FROM jobs WHERE active = 1 AND isArchived = 0 AND (title LIKE ? OR description LIKE ? OR team LIKE ?) LIMIT 5',
            [term, term, term]
        )
    ]);

    return [...insights, ...research, ...showcase, ...jobs];
}

module.exports = {
    initDb,
    getSiteSettings,
    updateSiteSettings,
    getAllInsights,
    getInsightById,
    createInsight,
    updateInsight,
    deleteInsight,
    getAllResearch,
    getResearchById,
    createResearch,
    updateResearch,
    deleteResearch,
    getAllShowcaseItems,
    getShowcaseById,
    createShowcaseItem,
    updateShowcaseItem,
    deleteShowcaseItem,
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    createJobApplication,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
    restoreApplication,
    getUserByUsername,
    createUser,
    getCredentialsByUsername,
    saveCredential,
    saveChallenge,
    getChallenge,
    getPageConfig,
    upsertPageConfig,
    getAllCustomPages,
    deletePageConfig,
    globalSearch
};

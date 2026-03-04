const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Point at the same DB file used by the Python backend
const DB_PATH = path.join(__dirname, '../../backend/dreamatic.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function insightHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.published = Boolean(r.published);
    return r;
}

function researchHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.published = Boolean(r.published);
    return r;
}

function showcaseHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.active = Boolean(r.active);
    return r;
}

function userHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    return r;
}

function jobHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.active = Boolean(r.active);
    r.isArchived = Boolean(r.isArchived);
    return r;
}

function applicationHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.isDeleted = Boolean(r.isDeleted);
    if (typeof r.history === 'string') {
        try { r.history = JSON.parse(r.history); } catch { r.history = []; }
    }
    return r;
}

function siteSettingsHelper(row) {
    if (!row) return null;
    const r = { ...row };
    if (typeof r.social === 'string') {
        try { r.social = JSON.parse(r.social); } catch { r.social = {}; }
    }
    r.indexRobots = Boolean(r.indexRobots);
    r.maintenanceMode = Boolean(r.maintenanceMode);
    return r;
}

function pageConfigHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    r.isCustom = Boolean(r.isCustom);
    r.visible = r.visible !== undefined ? Boolean(r.visible) : true;
    const jsonFields = ['solutions', 'approaches', 'values', 'stats', 'team', 'advisors', 'perks', 'content', 'theme'];
    for (const f of jsonFields) {
        if (typeof r[f] === 'string') {
            try { r[f] = JSON.parse(r[f]); } catch { r[f] = null; }
        }
    }
    return r;
}

function credentialHelper(row) {
    if (!row) return null;
    const r = { ...row };
    r._id = r.id; delete r.id;
    if (typeof r.transports === 'string') {
        try { r.transports = JSON.parse(r.transports); } catch { r.transports = []; }
    }
    return r;
}

// ─── Insights CRUD ────────────────────────────────────────────────────────────

function getAllInsights(publishedOnly = true, page = null) {
    let query = 'SELECT * FROM insights';
    const conditions = [];
    const params = [];
    if (publishedOnly) conditions.push('published = 1');
    if (page) { conditions.push('page = ?'); params.push(page); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY createdAt DESC';
    return db.prepare(query).all(...params).map(insightHelper);
}

function getInsightById(id) {
    return insightHelper(db.prepare('SELECT * FROM insights WHERE id = ?').get(id));
}

function createInsight(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO insights (id, title, excerpt, content, author, imageUrl, page, published, journal, year, authors, pdfUrl, linkType, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, data.title, data.excerpt, data.content,
        data.author ?? 'DREAMATIC Team', data.imageUrl ?? null,
        data.page ?? 'ai-work', data.published !== false ? 1 : 0,
        data.journal ?? null, data.year ?? null, data.authors ?? null,
        data.pdfUrl ?? null, data.linkType ?? 'download', now, now
    );
    return getInsightById(id);
}

function updateInsight(id, data) {
    const fields = Object.entries(data).filter(([, v]) => v !== undefined && v !== null);
    if (!fields.length) return getInsightById(id);
    const now = new Date().toISOString();
    const setClauses = fields.map(([k]) => `${k} = ?`).join(', ');
    const values = fields.map(([k, v]) => k === 'published' ? (v ? 1 : 0) : v);
    db.prepare(`UPDATE insights SET ${setClauses}, updatedAt = ? WHERE id = ?`).run(...values, now, id);
    return getInsightById(id);
}

function deleteInsight(id) {
    return db.prepare('DELETE FROM insights WHERE id = ?').run(id).changes > 0;
}

// ─── Research CRUD ────────────────────────────────────────────────────────────

function getAllResearch(publishedOnly = true) {
    const query = publishedOnly
        ? 'SELECT * FROM research WHERE published = 1 ORDER BY createdAt DESC'
        : 'SELECT * FROM research ORDER BY createdAt DESC';
    return db.prepare(query).all().map(researchHelper);
}

function getResearchById(id) {
    return researchHelper(db.prepare('SELECT * FROM research WHERE id = ?').get(id));
}

function createResearch(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO research (id, title, journal, year, authors, excerpt, abstract, content, imageUrl, pdfUrl, linkType, published, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, data.title, data.journal, data.year, data.authors, data.excerpt,
        data.abstract ?? null, data.content, data.imageUrl ?? null,
        data.pdfUrl ?? null, data.linkType ?? 'download',
        data.published !== false ? 1 : 0, now, now
    );
    return getResearchById(id);
}

function updateResearch(id, data) {
    const fields = Object.entries(data).filter(([, v]) => v !== undefined && v !== null);
    if (!fields.length) return getResearchById(id);
    const now = new Date().toISOString();
    const setClauses = fields.map(([k]) => `${k} = ?`).join(', ');
    const values = fields.map(([k, v]) => k === 'published' ? (v ? 1 : 0) : v);
    db.prepare(`UPDATE research SET ${setClauses}, updatedAt = ? WHERE id = ?`).run(...values, now, id);
    return getResearchById(id);
}

function deleteResearch(id) {
    return db.prepare('DELETE FROM research WHERE id = ?').run(id).changes > 0;
}

// ─── Showcase CRUD ────────────────────────────────────────────────────────────

function getAllShowcaseItems(activeOnly = true) {
    const query = activeOnly
        ? 'SELECT * FROM showcase WHERE active = 1 ORDER BY `order` ASC, createdAt DESC'
        : 'SELECT * FROM showcase ORDER BY `order` ASC, createdAt DESC';
    return db.prepare(query).all().map(showcaseHelper);
}

function getShowcaseItemById(id) {
    return showcaseHelper(db.prepare('SELECT * FROM showcase WHERE id = ?').get(id));
}

function createShowcaseItem(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO showcase (id, title, description, mediaUrl, mediaType, tag, product, \`order\`, active, size, likes, views, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, data.title, data.description ?? null, data.mediaUrl, data.mediaType,
        data.tag, data.product, data.order ?? 0,
        data.active !== false ? 1 : 0, data.size ?? 'medium',
        0, 0, now, now
    );
    return getShowcaseItemById(id);
}

function updateShowcaseItem(id, data) {
    const fields = Object.entries(data).filter(([, v]) => v !== undefined && v !== null);
    if (!fields.length) return getShowcaseItemById(id);
    const now = new Date().toISOString();
    const setClauses = fields.map(([k]) => `\`${k}\` = ?`).join(', ');
    const values = fields.map(([k, v]) => k === 'active' ? (v ? 1 : 0) : v);
    db.prepare(`UPDATE showcase SET ${setClauses}, updatedAt = ? WHERE id = ?`).run(...values, now, id);
    return getShowcaseItemById(id);
}

function deleteShowcaseItem(id) {
    return db.prepare('DELETE FROM showcase WHERE id = ?').run(id).changes > 0;
}

// ─── Users CRUD ───────────────────────────────────────────────────────────────

function getUserByUsername(username) {
    return userHelper(db.prepare('SELECT * FROM users WHERE username = ?').get(username));
}

function createUser(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const hash = bcrypt.hashSync(data.password, 10);
    db.prepare(`
    INSERT INTO users (id, username, email, passwordHash, role, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, data.username, data.email, hash, data.role ?? 'admin', now);
    return getUserByUsername(data.username);
}

function initDefaultUser() {
    const existing = getUserByUsername('admin');
    if (!existing) {
        createUser({ username: 'admin', email: 'admin@dreamatic.ai', password: 'admin123', role: 'admin' });
        console.log('👤 Default admin user created (admin/admin123)');
    }
}

// ─── Jobs CRUD ────────────────────────────────────────────────────────────────

function getAllJobs(activeOnly = true, includeArchived = false) {
    let query = 'SELECT * FROM jobs';
    const conditions = [];
    if (activeOnly) conditions.push('active = 1');
    if (!includeArchived) conditions.push('isArchived = 0');
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY createdAt DESC';
    return db.prepare(query).all().map(jobHelper);
}

function getJobById(id) {
    return jobHelper(db.prepare('SELECT * FROM jobs WHERE id = ?').get(id));
}

function createJob(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO jobs (id, title, team, location, description, requirements, company, tags, type, active, isArchived, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, data.title, data.team, data.location, data.description, data.requirements,
        data.company ?? 'DREAMATIC', data.tags ?? '', data.type ?? 'Full-time',
        data.active !== false ? 1 : 0, data.isArchived ? 1 : 0, now, now
    );
    return getJobById(id);
}

function updateJob(id, data) {
    const fields = Object.entries(data).filter(([, v]) => v !== undefined && v !== null);
    if (!fields.length) return getJobById(id);
    const now = new Date().toISOString();
    const setClauses = fields.map(([k]) => `${k} = ?`).join(', ');
    const values = fields.map(([k, v]) => ['active', 'isArchived'].includes(k) ? (v ? 1 : 0) : v);
    db.prepare(`UPDATE jobs SET ${setClauses}, updatedAt = ? WHERE id = ?`).run(...values, now, id);
    return getJobById(id);
}

function deleteJob(id, permanent = false) {
    if (permanent) {
        return db.prepare('DELETE FROM jobs WHERE id = ?').run(id).changes > 0;
    }
    return db.prepare('UPDATE jobs SET isArchived = 1, updatedAt = ? WHERE id = ?').run(new Date().toISOString(), id).changes > 0;
}

// ─── Applications ─────────────────────────────────────────────────────────────

function getAllApplications(includeDeleted = false) {
    const query = includeDeleted
        ? 'SELECT * FROM applications ORDER BY createdAt DESC'
        : 'SELECT * FROM applications WHERE isDeleted = 0 ORDER BY createdAt DESC';
    return db.prepare(query).all().map(applicationHelper);
}

function createJobApplication(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
    INSERT INTO applications (id, name, email, phone, location, experience, salary, linkedin, portfolio, notice, resume, message, role, jobId, status, history, isDeleted, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
        id, data.name, data.email, data.phone, data.location, data.experience,
        data.salary, data.linkedin, data.portfolio, data.notice, data.resume,
        data.message, data.role, data.jobId ?? null, data.status ?? 'Applied',
        JSON.stringify(data.history ?? []), 0, now
    );
    return applicationHelper(db.prepare('SELECT * FROM applications WHERE id = ?').get(id));
}

function updateApplicationStatus(id, status, note = null) {
    const row = db.prepare('SELECT history FROM applications WHERE id = ?').get(id);
    if (!row) return false;
    let history = [];
    try { history = JSON.parse(row.history); } catch { }
    history.push({ status, note, timestamp: new Date().toISOString() });
    db.prepare('UPDATE applications SET status = ?, history = ? WHERE id = ?').run(status, JSON.stringify(history), id);
    return true;
}

function deleteApplication(id, permanent = false) {
    if (permanent) {
        return db.prepare('DELETE FROM applications WHERE id = ?').run(id).changes > 0;
    }
    return db.prepare('UPDATE applications SET isDeleted = 1 WHERE id = ?').run(id).changes > 0;
}

function restoreApplication(id) {
    return db.prepare('UPDATE applications SET isDeleted = 0 WHERE id = ?').run(id).changes > 0;
}

// ─── Page Configs ─────────────────────────────────────────────────────────────

function getPageConfig(pageId) {
    return pageConfigHelper(db.prepare('SELECT * FROM pages WHERE page_id = ?').get(pageId));
}

function upsertPageConfig(pageId, data) {
    const existing = getPageConfig(pageId);
    const now = new Date().toISOString();
    const jsonFields = ['solutions', 'approaches', 'values', 'stats', 'team', 'advisors', 'perks', 'content', 'theme'];
    const flat = { ...data };
    for (const f of jsonFields) {
        if (f in flat && flat[f] !== null && typeof flat[f] !== 'string') {
            flat[f] = JSON.stringify(flat[f]);
        }
    }

    if (existing) {
        const fields = Object.entries(flat);
        const setClauses = fields.map(([k]) => `\`${k}\` = ?`).join(', ');
        const values = fields.map(([, v]) => v);
        db.prepare(`UPDATE pages SET ${setClauses}, updatedAt = ? WHERE page_id = ?`).run(...values, now, pageId);
    } else {
        const id = uuidv4();
        const keys = ['id', 'page_id', 'updatedAt', ...Object.keys(flat)];
        const placeholders = keys.map(() => '?').join(', ');
        const cols = keys.map(k => `\`${k}\``).join(', ');
        db.prepare(`INSERT INTO pages (${cols}) VALUES (${placeholders})`).run(id, pageId, now, ...Object.values(flat));
    }
    return getPageConfig(pageId);
}

function getAllCustomPages() {
    return db.prepare('SELECT * FROM pages WHERE isCustom = 1').all().map(pageConfigHelper);
}

function deletePageConfig(pageId) {
    return db.prepare('DELETE FROM pages WHERE page_id = ?').run(pageId).changes > 0;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

function ensureSiteSettingsTable() {
    db.exec(`
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
    )
  `);
}

function getSiteSettings() {
    ensureSiteSettingsTable();
    let row = db.prepare('SELECT * FROM site_settings LIMIT 1').get();
    if (!row) {
        const defaults = {
            siteTitle: 'DREAMATIC',
            tagline: 'The Future of Agentic AI',
            contactEmail: 'hello@dreamatic.ai',
            seoDescription: 'Leading the bridge between human intuition and agentic automation.',
            keywords: 'AI, Agents, Enterprise AI, Future Tech',
            indexRobots: 1,
            maintenanceMode: 0,
            social: JSON.stringify({ linkedin: '', twitter: '' })
        };
        db.prepare(`
      INSERT INTO site_settings (id, siteTitle, tagline, contactEmail, seoDescription, keywords, indexRobots, maintenanceMode, social)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('default', defaults.siteTitle, defaults.tagline, defaults.contactEmail,
            defaults.seoDescription, defaults.keywords, defaults.indexRobots,
            defaults.maintenanceMode, defaults.social);
        row = db.prepare('SELECT * FROM site_settings LIMIT 1').get();
    }
    return siteSettingsHelper(row);
}

function updateSiteSettings(data) {
    ensureSiteSettingsTable();
    db.prepare(`
    UPDATE site_settings SET
      siteTitle = ?, tagline = ?, contactEmail = ?,
      seoDescription = ?, keywords = ?,
      indexRobots = ?, maintenanceMode = ?, social = ?
    WHERE id = 'default'
  `).run(
        data.siteTitle, data.tagline, data.contactEmail,
        data.seoDescription, data.keywords,
        data.indexRobots ? 1 : 0, data.maintenanceMode ? 1 : 0,
        JSON.stringify(data.social ?? {})
    );
    return getSiteSettings();
}

// ─── Global Search ────────────────────────────────────────────────────────────

function globalSearch(q) {
    const like = `%${q}%`;
    const results = [];

    db.prepare(`SELECT * FROM insights WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) LIMIT 5`).all(like, like, like)
        .map(insightHelper).forEach(item => results.push({
            id: item._id, title: item.title, description: item.excerpt,
            type: 'insight', category: 'INSIGHT', url: `/resources/blog?id=${item._id}`
        }));

    db.prepare(`SELECT * FROM research WHERE published = 1 AND (title LIKE ? OR excerpt LIKE ? OR authors LIKE ?) LIMIT 5`).all(like, like, like)
        .map(researchHelper).forEach(item => results.push({
            id: item._id, title: item.title, description: item.excerpt,
            type: 'research', category: 'RESEARCH', url: `/resources/research?id=${item._id}`
        }));

    db.prepare(`SELECT * FROM showcase WHERE active = 1 AND (title LIKE ? OR description LIKE ? OR tag LIKE ?) LIMIT 5`).all(like, like, like)
        .map(showcaseHelper).forEach(item => results.push({
            id: item._id, title: item.title, description: item.description ?? item.tag,
            type: 'insight', category: 'SHOWCASE', url: `/showcase?id=${item._id}`
        }));

    db.prepare(`SELECT * FROM jobs WHERE active = 1 AND isArchived = 0 AND (title LIKE ? OR description LIKE ? OR team LIKE ?) LIMIT 5`).all(like, like, like)
        .map(jobHelper).forEach(item => results.push({
            id: item._id, title: item.title, description: `${item.team} · ${item.location}`,
            type: 'job', category: 'CAREERS', url: `/company/careers?id=${item._id}`
        }));

    return results;
}

// ─── WebAuthn / MFA ───────────────────────────────────────────────────────────

function getCredentialsByUsername(username) {
    return db.prepare('SELECT * FROM webauthn_credentials WHERE username = ?').all(username).map(credentialHelper);
}

function saveCredential({ username, credId, publicKey, signCount, transports }) {
    const id = uuidv4();
    db.prepare(`
    INSERT INTO webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, username, credId, publicKey, signCount, JSON.stringify(transports ?? []), new Date().toISOString());
}

function saveChallenge(username, challenge) {
    const expiresAt = (Date.now() / 1000 + 300).toString(); // 5 minutes
    db.prepare('INSERT OR REPLACE INTO webauthn_challenges (username, challenge, expires_at) VALUES (?, ?, ?)').run(username, challenge, expiresAt);
}

function getChallenge(username) {
    const row = db.prepare('SELECT challenge, expires_at FROM webauthn_challenges WHERE username = ?').get(username);
    if (!row) return null;
    if (parseFloat(row.expires_at) < Date.now() / 1000) return null;
    return row.challenge;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function initDb() {
    ensureSiteSettingsTable();
    initDefaultUser();
    getSiteSettings(); // seeds defaults if empty
    console.log('✅ SQLite connected and initialized');
}

module.exports = {
    // Insights
    getAllInsights, getInsightById, createInsight, updateInsight, deleteInsight,
    // Research
    getAllResearch, getResearchById, createResearch, updateResearch, deleteResearch,
    // Showcase
    getAllShowcaseItems, getShowcaseItemById, createShowcaseItem, updateShowcaseItem, deleteShowcaseItem,
    // Users
    getUserByUsername, createUser, initDefaultUser,
    // Jobs
    getAllJobs, getJobById, createJob, updateJob, deleteJob,
    // Applications
    getAllApplications, createJobApplication, updateApplicationStatus, deleteApplication, restoreApplication,
    // Pages
    getPageConfig, upsertPageConfig, getAllCustomPages, deletePageConfig,
    // Settings
    getSiteSettings, updateSiteSettings,
    // Search
    globalSearch,
    // MFA
    getCredentialsByUsername, saveCredential, saveChallenge, getChallenge,
    // Init
    initDb,
};

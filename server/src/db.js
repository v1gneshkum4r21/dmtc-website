/**
 * db.js — Express/MySQL database layer
 * Professional MySQL implementation for Local and Hostinger environments.
 */

const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

let pool;

async function initDb() {
    if (pool) return pool;

    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    });

    try {
        const conn = await pool.getConnection();
        console.log('✅ MySQL Database Connected Successfully');
        conn.release();
    } catch (err) {
        console.error('❌ MySQL Connection Error:', err.message);
        console.error('👉 Make sure you whitelisted your IP in Hostinger Remote MySQL!');
        throw err;
    }

    // Initialize Tables
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            createdAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS insights (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            excerpt TEXT,
            content LONGTEXT,
            author VARCHAR(255),
            imageUrl TEXT,
            page VARCHAR(100),
            published BOOLEAN DEFAULT 1,
            journal VARCHAR(255),
            year VARCHAR(50),
            authors TEXT,
            pdfUrl TEXT,
            linkType VARCHAR(50),
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS research (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            journal VARCHAR(255),
            year VARCHAR(50),
            authors TEXT,
            excerpt TEXT,
            abstract TEXT,
            content LONGTEXT,
            imageUrl TEXT,
            pdfUrl TEXT,
            linkType VARCHAR(50),
            published BOOLEAN DEFAULT 1,
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS showcase (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            mediaUrl TEXT,
            mediaType VARCHAR(50),
            tag VARCHAR(100),
            product VARCHAR(100),
            \`order\` INT DEFAULT 0,
            active BOOLEAN DEFAULT 1,
            size VARCHAR(50) DEFAULT 'medium',
            likes INT DEFAULT 0,
            views INT DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS jobs (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            team VARCHAR(100),
            location VARCHAR(100),
            description LONGTEXT,
            requirements LONGTEXT,
            company VARCHAR(100),
            tags TEXT,
            type VARCHAR(50),
            salary_range VARCHAR(100),
            remote_policy VARCHAR(100),
            experience_level VARCHAR(100),
            benefits TEXT,
            deadline DATETIME,
            active BOOLEAN DEFAULT 1,
            isArchived BOOLEAN DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS applications (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(100),
            location VARCHAR(255),
            experience TEXT,
            salary VARCHAR(100),
            linkedin TEXT,
            portfolio TEXT,
            notice VARCHAR(100),
            resume TEXT,
            message LONGTEXT,
            role VARCHAR(255),
            jobId VARCHAR(36),
            status VARCHAR(50) DEFAULT 'Applied',
            history LONGTEXT,
            isDeleted BOOLEAN DEFAULT 0,
            createdAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS pages (
            id VARCHAR(36) PRIMARY KEY,
            page_id VARCHAR(100) UNIQUE NOT NULL,
            hero_badge VARCHAR(255),
            hero_title VARCHAR(255),
            hero_subtitle TEXT,
            solutions LONGTEXT,
            approaches LONGTEXT,
            values_list LONGTEXT,
            stats LONGTEXT,
            team LONGTEXT,
            advisors LONGTEXT,
            perks LONGTEXT,
            content LONGTEXT,
            theme LONGTEXT,
            isCustom BOOLEAN DEFAULT 0,
            label VARCHAR(255),
            path VARCHAR(255),
            visible BOOLEAN DEFAULT 1,
            \`group\` VARCHAR(100),
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS settings (
            id VARCHAR(50) PRIMARY KEY,
            siteTitle VARCHAR(255),
            tagline VARCHAR(255),
            contactEmail VARCHAR(255),
            seoDescription TEXT,
            keywords TEXT,
            indexRobots BOOLEAN DEFAULT 1,
            maintenanceMode BOOLEAN DEFAULT 0,
            social LONGTEXT,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS webauthn_credentials (
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            credential_id TEXT NOT NULL,
            public_key TEXT NOT NULL,
            sign_count INT DEFAULT 0,
            transports TEXT,
            created_at DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS webauthn_challenges (
            username VARCHAR(255) PRIMARY KEY,
            challenge TEXT NOT NULL,
            expires_at VARCHAR(100)
        )`,
        `CREATE TABLE IF NOT EXISTS contacts (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'unseen',
            createdAt DATETIME
        )`
    ];

    const connection = await pool.getConnection();
    try {
        for (const sql of tables) {
            await connection.query(sql);
        }
    } finally {
        connection.release();
    }

    // Table Migrations (Add columns if missing)
    const alterJobs = [
        "ALTER TABLE jobs ADD COLUMN salary_range VARCHAR(100)",
        "ALTER TABLE jobs ADD COLUMN remote_policy VARCHAR(100)",
        "ALTER TABLE jobs ADD COLUMN experience_level VARCHAR(100)",
        "ALTER TABLE jobs ADD COLUMN benefits TEXT",
        "ALTER TABLE jobs ADD COLUMN deadline DATETIME"
    ];
    for (const sql of alterJobs) {
        try { await pool.query(sql); } catch (e) { /* Column likely exists */ }
    }

    // Add hero_slides column to settings if missing
    try { await pool.query("ALTER TABLE settings ADD COLUMN hero_slides LONGTEXT"); } catch (e) { /* already exists */ }

    // Default Seed Data
    const [users] = await pool.query('SELECT count(*) as count FROM users');
    if (users[0].count === 0) {
        const id = uuidv4();
        const hash = bcrypt.hashSync('admin123', 10);
        await pool.query('INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [id, 'admin', 'admin@dreamactic.com', hash, 'admin', now()]);
    }

    const [sets] = await pool.query('SELECT count(*) as count FROM settings');
    if (sets[0].count === 0) {
        await pool.query('INSERT INTO settings (id, siteTitle, tagline, contactEmail, social, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
            ['default', 'DREAMACTIC', 'The Future of Agentic AI', 'hello@dreamactic.com', '{}', now()]);
    }

    return pool;
}

function now() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }

const TABLE_COLUMNS = {
    settings: ['siteTitle', 'tagline', 'contactEmail', 'seoDescription', 'keywords', 'indexRobots', 'maintenanceMode', 'social', 'hero_slides', 'updatedAt'],
    insights: ['id', 'title', 'excerpt', 'content', 'author', 'imageUrl', 'page', 'published', 'journal', 'year', 'authors', 'pdfUrl', 'linkType', 'createdAt', 'updatedAt'],
    research: ['id', 'title', 'journal', 'year', 'authors', 'excerpt', 'abstract', 'content', 'imageUrl', 'pdfUrl', 'linkType', 'published', 'createdAt', 'updatedAt'],
    showcase: ['id', 'title', 'description', 'mediaUrl', 'mediaType', 'tag', 'product', 'order', 'active', 'size', 'likes', 'views', 'createdAt', 'updatedAt'],
    jobs: ['id', 'title', 'team', 'location', 'description', 'requirements', 'company', 'tags', 'type', 'salary_range', 'remote_policy', 'experience_level', 'benefits', 'deadline', 'active', 'isArchived', 'createdAt', 'updatedAt'],
    pages: ['id', 'page_id', 'hero_badge', 'hero_title', 'hero_subtitle', 'solutions', 'approaches', 'values_list', 'stats', 'team', 'advisors', 'perks', 'content', 'theme', 'isCustom', 'label', 'path', 'visible', 'group', 'updatedAt']
};

function sanitize(table, data) {
    const allowed = TABLE_COLUMNS[table];
    if (!allowed) return data;
    const clean = {};
    for (const key of allowed) {
        if (key in data) {
            let val = data[key];
            if (val !== null && typeof val === 'object' && key !== 'deadline') {
                val = JSON.stringify(val);
            }
            clean[key] = val;
        }
    }
    return clean;
}

// ─── Shared Helpers ──────────────────────────────────────────────────────────

const insightHelper = (r) => r ? ({ ...r, _id: r.id, published: !!r.published }) : null;
const researchHelper = (r) => r ? ({ ...r, _id: r.id, published: !!r.published }) : null;
const showcaseHelper = (r) => r ? ({ ...r, _id: r.id, active: !!r.active }) : null;
const jobHelper = (r) => r ? ({ ...r, _id: r.id, active: !!r.active, isArchived: !!r.isArchived }) : null;
const applicationHelper = (r) => {
    if (!r) return null;
    const item = { ...r, _id: r.id, isDeleted: !!r.isDeleted };
    if (typeof item.history === 'string') item.history = JSON.parse(item.history || '[]');
    return item;
};
const pageConfigHelper = (row) => {
    if (!row) return null;
    const item = { ...row, _id: row.id, isCustom: !!row.isCustom, visible: !!row.visible };
    if ('values_list' in item) { item.values = item.values_list; delete item.values_list; }
    const JSON_FIELDS = ['solutions', 'approaches', 'values', 'stats', 'team', 'advisors', 'perks', 'content', 'theme'];
    for (const f of JSON_FIELDS) {
        if (typeof item[f] === 'string') try { item[f] = JSON.parse(item[f] || 'null'); } catch (e) { }
    }
    return item;
};
const settingsHelper = (r) => {
    if (!r) return null;
    const item = { ...r, indexRobots: !!r.indexRobots, maintenanceMode: !!r.maintenanceMode };
    if (typeof item.social === 'string') item.social = JSON.parse(item.social || '{}');
    if (typeof item.hero_slides === 'string') item.hero_slides = JSON.parse(item.hero_slides || '[]');
    return item;
};

const credentialHelper = (r) => {
    if (!r) return null;
    return {
        ...r,
        transports: JSON.parse(r.transports || '[]')
    };
};

// ─── API Methods ─────────────────────────────────────────────────────────────

// Settings
async function getSiteSettings() {
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = ?', ['default']);
    return settingsHelper(rows[0]);
}

async function updateSiteSettings(data) {
    const d = sanitize('settings', { ...data, updatedAt: now() });
    delete d.id;
    const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE settings SET ${sets} WHERE id = ?`, [...Object.values(d), 'default']);
    return getSiteSettings();
}

// Insights (Blog/Hub)
async function getAllInsights(publishedOnly = false, page = null) {
    let sql = 'SELECT * FROM insights';
    const params = [];
    const wheres = [];
    if (publishedOnly) wheres.push('published = 1');
    if (page) { wheres.push('page = ?'); params.push(page); }
    if (wheres.length) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql, params);
    return rows.map(insightHelper);
}

async function getInsightById(id) {
    const [rows] = await pool.query('SELECT * FROM insights WHERE id = ?', [id]);
    return insightHelper(rows[0]);
}

async function createInsight(data) {
    const id = uuidv4();
    const d = sanitize('insights', { ...data, id, createdAt: now(), updatedAt: now() });
    const cols = Object.keys(d).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(d).map(() => '?').join(', ');
    await pool.query(`INSERT INTO insights (${cols}) VALUES (${placeholders})`, Object.values(d));
    return getInsightById(id);
}

async function updateInsight(id, data) {
    const d = sanitize('insights', { ...data, updatedAt: now() });
    delete d.id;
    const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE insights SET ${sets} WHERE id = ?`, [...Object.values(d), id]);
    return getInsightById(id);
}

async function deleteInsight(id) {
    const [res] = await pool.query('DELETE FROM insights WHERE id = ?', [id]);
    return res.affectedRows > 0;
}

// Research
async function getAllResearch(publishedOnly = false) {
    let sql = 'SELECT * FROM research';
    if (publishedOnly) sql += ' WHERE published = 1';
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql);
    return rows.map(researchHelper);
}

async function getResearchById(id) {
    const [rows] = await pool.query('SELECT * FROM research WHERE id = ?', [id]);
    return researchHelper(rows[0]);
}

async function createResearch(data) {
    const id = uuidv4();
    const d = sanitize('research', { ...data, id, createdAt: now(), updatedAt: now() });
    const cols = Object.keys(d).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(d).map(() => '?').join(', ');
    await pool.query(`INSERT INTO research (${cols}) VALUES (${placeholders})`, Object.values(d));
    return getResearchById(id);
}

async function updateResearch(id, data) {
    const d = sanitize('research', { ...data, updatedAt: now() });
    delete d.id;
    const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE research SET ${sets} WHERE id = ?`, [...Object.values(d), id]);
    return getResearchById(id);
}

// Showcase
async function getAllShowcaseItems(activeOnly = false) {
    let sql = 'SELECT * FROM showcase';
    if (activeOnly) sql += ' WHERE active = 1';
    sql += ' ORDER BY `order` ASC, createdAt DESC';
    const [rows] = await pool.query(sql);
    return rows.map(showcaseHelper);
}

async function createShowcaseItem(data) {
    const id = uuidv4();
    const d = sanitize('showcase', { ...data, id, createdAt: now(), updatedAt: now() });
    const cols = Object.keys(d).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(d).map(() => '?').join(', ');
    await pool.query(`INSERT INTO showcase (${cols}) VALUES (${placeholders})`, Object.values(d));
    const [rows] = await pool.query('SELECT * FROM showcase WHERE id = ?', [id]);
    return showcaseHelper(rows[0]);
}

// Jobs
async function getAllJobs(activeOnly = false, includeArchived = true) {
    let sql = 'SELECT * FROM jobs';
    const wheres = [];
    if (activeOnly) wheres.push('active = 1');
    if (!includeArchived) wheres.push('isArchived = 0');
    if (wheres.length) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql);
    return rows.map(jobHelper);
}

async function getJobById(id) {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    return jobHelper(rows[0]);
}

async function createJob(data) {
    const id = uuidv4();
    const d = sanitize('jobs', { ...data, id, createdAt: now(), updatedAt: now() });
    const cols = Object.keys(d).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(d).map(() => '?').join(', ');
    await pool.query(`INSERT INTO jobs (${cols}) VALUES (${placeholders})`, Object.values(d));
    return getJobById(id);
}

// Applications
async function getAllApplications(includeDeleted = false) {
    let sql = 'SELECT * FROM applications';
    if (!includeDeleted) sql += ' WHERE isDeleted = 0';
    sql += ' ORDER BY createdAt DESC';
    const [rows] = await pool.query(sql);
    return rows.map(applicationHelper);
}

async function createJobApplication(data) {
    const id = uuidv4();
    const d = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        location: data.location || '',
        experience: data.experience || '',
        salary: data.salary || '',
        linkedin: data.linkedin || '',
        portfolio: data.portfolio || '',
        notice: data.notice || '',
        resume: data.resume || '',
        message: data.message || '',
        role: data.role || '',
        jobId: data.jobId || null,
        status: 'Applied',
        history: '[]',
        isDeleted: 0,
        createdAt: now()
    };
    const cols = Object.keys(d).map(k => `\`${k}\``).join(', ');
    const placeholders = Object.keys(d).map(() => '?').join(', ');
    await pool.query(`INSERT INTO applications (${cols}) VALUES (${placeholders})`, Object.values(d));
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    return applicationHelper(rows[0]);
}

async function updateApplicationStatus(id, status, note = '') {
    const [rows] = await pool.query('SELECT history FROM applications WHERE id = ?', [id]);
    if (!rows.length) return false;
    const history = JSON.parse(rows[0].history || '[]');
    history.push({ status, note, timestamp: now() });
    const [res] = await pool.query('UPDATE applications SET status = ?, history = ? WHERE id = ?',
        [status, JSON.stringify(history), id]);
    return res.affectedRows > 0;
}

async function deleteApplication(id, permanent = false) {
    if (permanent) {
        const [res] = await pool.query('DELETE FROM applications WHERE id = ?', [id]);
        return res.affectedRows > 0;
    } else {
        const [res] = await pool.query('UPDATE applications SET isDeleted = 1 WHERE id = ?', [id]);
        return res.affectedRows > 0;
    }
}

async function restoreApplication(id) {
    const [res] = await pool.query('UPDATE applications SET isDeleted = 0 WHERE id = ?', [id]);
    return res.affectedRows > 0;
}

// Pages
async function getPageConfig(pageId) {
    const [rows] = await pool.query('SELECT * FROM pages WHERE page_id = ?', [pageId]);
    return pageConfigHelper(rows[0]);
}

async function getAllCustomPages() {
    const [rows] = await pool.query('SELECT * FROM pages');
    return rows.map(pageConfigHelper);
}

async function upsertPageConfig(pageId, configData) {
    const existing = await getPageConfig(pageId);
    const n = now();
    const data = { ...configData };
    if ('values' in data) { data.values_list = data.values; delete data.values; }

    const d = sanitize('pages', { ...data, updatedAt: n });
    delete d.id;      // Ensure primary key isn't overwritten
    delete d.page_id; // Don't update the immutable page_id this way

    try {
        if (existing) {
            const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
            await pool.query(`UPDATE pages SET ${sets} WHERE page_id = ?`, [...Object.values(d), pageId]);
            return getPageConfig(pageId);
        } else {
            const id = uuidv4();
            const insertData = { ...d, id, page_id: pageId };
            const cols = Object.keys(insertData).map(k => `\`${k}\``).join(', ');
            const placeholders = Object.keys(insertData).map(() => '?').join(', ');
            await pool.query(`INSERT INTO pages (${cols}) VALUES (${placeholders})`, Object.values(insertData));
            return getPageConfig(pageId);
        }
    } catch (err) {
        console.error('❌ upsertPageConfig Error:', err);
        throw err;
    }
}

async function deletePageConfig(pageId) {
    const [res] = await pool.query('DELETE FROM pages WHERE page_id = ?', [pageId]);
    return res.affectedRows > 0;
}

// Search
async function globalSearch(q) {
    const term = `%${q}%`;
    const results = [];

    // Search Insights
    const [ins] = await pool.query(
        'SELECT id, title, excerpt, page FROM insights WHERE (title LIKE ? OR excerpt LIKE ? OR content LIKE ?) AND published = 1 LIMIT 5',
        [term, term, term]
    );
    ins.forEach(r => results.push({
        id: r.id,
        title: r.title,
        description: r.excerpt,
        type: 'insight',
        category: 'INSIGHT',
        url: `/resources/blog?id=${r.id}`
    }));

    // Search Research
    const [res] = await pool.query(
        'SELECT id, title, excerpt FROM research WHERE (title LIKE ? OR excerpt LIKE ? OR authors LIKE ?) AND published = 1 LIMIT 5',
        [term, term, term]
    );
    res.forEach(r => results.push({
        id: r.id,
        title: r.title,
        description: r.excerpt,
        type: 'research',
        category: 'RESEARCH',
        url: `/resources/research?id=${r.id}`
    }));

    // Search Showcase
    const [show] = await pool.query(
        'SELECT id, title, description, tag FROM showcase WHERE (title LIKE ? OR description LIKE ? OR tag LIKE ?) AND active = 1 LIMIT 5',
        [term, term, term]
    );
    show.forEach(r => results.push({
        id: r.id,
        title: r.title,
        description: r.description || r.tag,
        type: 'insight', // Standardized for UI
        category: 'SHOWCASE',
        url: `/showcase?id=${r.id}`
    }));

    // Search Jobs
    const [jobs] = await pool.query(
        'SELECT id, title, team, location FROM jobs WHERE (title LIKE ? OR description LIKE ? OR team LIKE ?) AND active = 1 AND isArchived = 0 LIMIT 5',
        [term, term, term]
    );
    jobs.forEach(r => results.push({
        id: r.id,
        title: r.title,
        description: `${r.team} · ${r.location}`,
        type: 'job',
        category: 'CAREERS',
        url: `/company/careers?id=${r.id}`
    }));

    return results;
}

// Auth
async function getUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

async function createUser(data) {
    const id = uuidv4();
    const hash = bcrypt.hashSync(data.password, 10);
    await pool.query('INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, data.username, data.email, hash, data.role || 'admin', now()]);
    return getUserByUsername(data.username);
}

// WebAuthn
async function getCredentialsByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM webauthn_credentials WHERE username = ?', [username]);
    return rows.map(credentialHelper);
}

async function saveCredential(data) {
    const id = uuidv4();
    await pool.query(
        'INSERT INTO webauthn_credentials (id, username, credential_id, public_key, sign_count, transports, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, data.username, data.credId, data.publicKey, data.signCount, JSON.stringify(data.transports || []), now()]
    );
}

async function saveChallenge(username, challenge) {
    const expiresAt = String(Date.now() / 1000 + 300);
    await pool.query(
        'INSERT INTO webauthn_challenges (username, challenge, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE challenge = VALUES(challenge), expires_at = VALUES(expires_at)',
        [username, challenge, expiresAt]
    );
}

async function getChallenge(username) {
    const [rows] = await pool.query('SELECT challenge, expires_at FROM webauthn_challenges WHERE username = ?', [username]);
    if (!rows.length) return null;
    if (parseFloat(rows[0].expires_at) < Date.now() / 1000) return null;
    return rows[0].challenge;
}

// Missing Deletes
async function deleteJob(id, permanent = false) {
    if (permanent) {
        const [res] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
        return res.affectedRows > 0;
    } else {
        const [res] = await pool.query('UPDATE jobs SET isArchived = 1, active = 0 WHERE id = ?', [id]);
        return res.affectedRows > 0;
    }
}

async function updateJob(id, data) {
    const d = sanitize('jobs', { ...data, updatedAt: now() });
    delete d.id;
    const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE jobs SET ${sets} WHERE id = ?`, [...Object.values(d), id]);
    return getJobById(id);
}

async function deleteResearch(id) {
    const [res] = await pool.query('DELETE FROM research WHERE id = ?', [id]);
    return res.affectedRows > 0;
}

async function deleteShowcaseItem(id) {
    const [res] = await pool.query('DELETE FROM showcase WHERE id = ?', [id]);
    return res.affectedRows > 0;
}

async function updateShowcaseItem(id, data) {
    const d = sanitize('showcase', { ...data, updatedAt: now() });
    delete d.id;
    const sets = Object.keys(d).map(k => `\`${k}\` = ?`).join(', ');
    await pool.query(`UPDATE showcase SET ${sets} WHERE id = ?`, [...Object.values(d), id]);
    const [rows] = await pool.query('SELECT * FROM showcase WHERE id = ?', [id]);
    return showcaseHelper(rows[0]);
}

async function createContact(data) {
    const id = uuidv4();
    await pool.query('INSERT INTO contacts (id, name, email, subject, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, data.name, data.email, data.subject, data.message, 'unseen', now()]);
    return id;
}

async function getContacts() {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY createdAt DESC');
    return rows;
}

async function updateContactStatus(id, status) {
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
    return true;
}

async function deleteContact(id) {
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    return true;
}

module.exports = {
    initDb, getSiteSettings, updateSiteSettings, getAllInsights, getInsightById, createInsight, updateInsight, deleteInsight,
    getAllResearch, getResearchById, createResearch, updateResearch, deleteResearch,
    getAllShowcaseItems, createShowcaseItem, updateShowcaseItem, deleteShowcaseItem,
    getAllJobs, getJobById, createJob, updateJob, deleteJob,
    getAllApplications, createJobApplication, updateApplicationStatus, deleteApplication, restoreApplication,
    getPageConfig, getAllCustomPages, upsertPageConfig, deletePageConfig,
    globalSearch, getUserByUsername, createUser,
    getCredentialsByUsername, saveCredential, saveChallenge, getChallenge,
    createContact, getContacts, updateContactStatus, deleteContact
};

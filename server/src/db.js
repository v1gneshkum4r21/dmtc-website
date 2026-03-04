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

    db = await open({
        filename: DB_PATH,
        driver: sqlite3.Database
    });

    console.log('✅ SQLite (async) connected and initialized');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS insights (
            _id TEXT PRIMARY KEY,
            title TEXT,
            summary TEXT,
            content TEXT,
            category TEXT,
            author TEXT,
            date TEXT,
            readTime TEXT,
            image TEXT,
            tags TEXT,
            slug TEXT UNIQUE,
            published BOOLEAN,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS research (
            _id TEXT PRIMARY KEY,
            title TEXT,
            authors TEXT,
            journal TEXT,
            year INTEGER,
            abstract TEXT,
            doi TEXT,
            pdfUrl TEXT,
            tags TEXT,
            published BOOLEAN,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS showcase (
            _id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            image TEXT,
            link TEXT,
            category TEXT,
            tags TEXT,
            published BOOLEAN,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS jobs (
            _id TEXT PRIMARY KEY,
            title TEXT,
            department TEXT,
            location TEXT,
            type TEXT,
            description TEXT,
            requirements TEXT,
            salary TEXT,
            active BOOLEAN,
            archived BOOLEAN,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS job_applications (
            id TEXT PRIMARY KEY,
            jobId TEXT,
            jobTitle TEXT,
            name TEXT,
            email TEXT,
            phone TEXT,
            linkedIn TEXT,
            resumeUrl TEXT,
            message TEXT,
            status TEXT,
            appliedDate TEXT,
            deletedAt TEXT,
            notes TEXT
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE,
            email TEXT,
            passwordHash TEXT,
            role TEXT,
            createdAt TEXT
        );

        CREATE TABLE IF NOT EXISTS credentials (
            credential_id TEXT PRIMARY KEY,
            username TEXT,
            public_key TEXT,
            sign_count INTEGER,
            transports TEXT
        );

        CREATE TABLE IF NOT EXISTS challenges (
            username TEXT PRIMARY KEY,
            challenge TEXT,
            expiresAt INTEGER
        );

        CREATE TABLE IF NOT EXISTS page_configs (
            page_id TEXT PRIMARY KEY,
            config TEXT
        );

        CREATE TABLE IF NOT EXISTS site_settings (
            id TEXT PRIMARY KEY,
            siteTitle TEXT,
            tagline TEXT,
            contactEmail TEXT,
            seoDescription TEXT,
            keywords TEXT,
            indexRobots BOOLEAN,
            maintenanceMode BOOLEAN,
            social TEXT
        );
    `);

    // Ensure default settings exist
    const settings = await db.get('SELECT id FROM site_settings WHERE id = "default"');
    if (!settings) {
        await db.run(`INSERT INTO site_settings (id, siteTitle, tagline, contactEmail, social) 
                      VALUES ("default", "DREAMATIC", "The Future of Agentic AI", "hello@dreamatic.ai", "{}")`);
    }

    // Ensure default admin exists
    const admin = await db.get('SELECT username FROM users WHERE username = "admin"');
    if (!admin) {
        const hash = bcrypt.hashSync('admin123', 10);
        await db.run(`INSERT INTO users (id, username, email, passwordHash, role, createdAt) 
                      VALUES (?, "admin", "admin@dreamatic.com", ?, "admin", ?)`,
            [uuidv4(), hash, new Date().toISOString()]);
        console.log('👤 Default admin user created (admin / admin123)');
    }
}

// ─── Site Settings ──────────────────────────────────────────────────────────

async function getSiteSettings() {
    const row = await db.get('SELECT * FROM site_settings WHERE id = "default"');
    if (row) {
        row.social = JSON.parse(row.social || '{}');
        row.indexRobots = !!row.indexRobots;
        row.maintenanceMode = !!row.maintenanceMode;
    }
    return row;
}

async function updateSiteSettings(data) {
    const current = await getSiteSettings();
    const updated = { ...current, ...data };
    await db.run(`UPDATE site_settings SET 
        siteTitle = ?, tagline = ?, contactEmail = ?, seoDescription = ?, 
        keywords = ?, indexRobots = ?, maintenanceMode = ?, social = ?
        WHERE id = "default"`,
        [updated.siteTitle, updated.tagline, updated.contactEmail, updated.seoDescription,
        updated.keywords, updated.indexRobots ? 1 : 0, updated.maintenanceMode ? 1 : 0, JSON.stringify(updated.social)]);
    return getSiteSettings();
}

// ─── Insights ───────────────────────────────────────────────────────────────

async function getAllInsights(onlyPublished = false, page = null) {
    let query = 'SELECT * FROM insights';
    if (onlyPublished) query += ' WHERE published = 1';
    query += ' ORDER BY createdAt DESC';

    if (page) {
        const offset = (parseInt(page) - 1) * 10;
        query += ` LIMIT 10 OFFSET ${offset}`;
    }

    const rows = await db.all(query);
    return rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published }));
}

async function getInsightById(id) {
    const row = await db.get('SELECT * FROM insights WHERE _id = ?', [id]);
    return row ? { ...row, tags: JSON.parse(row.tags || '[]'), published: !!row.published } : null;
}

async function createInsight(data) {
    const insight = {
        _id: uuidv4(),
        ...data,
        tags: JSON.stringify(data.tags || []),
        createdAt: new Date().toISOString(),
        published: data.published ? 1 : 0
    };
    await db.run(`INSERT INTO insights (_id, title, summary, content, category, author, date, readTime, image, tags, slug, published, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [insight._id, insight.title, insight.summary, insight.content, insight.category, insight.author,
        insight.date, insight.readTime, insight.image, insight.tags, insight.slug, insight.published, insight.createdAt]);
    return getInsightById(insight._id);
}

async function updateInsight(id, data) {
    const current = await getInsightById(id);
    if (!current) return null;
    const updated = { ...current, ...data };
    await db.run(`UPDATE insights SET title=?, summary=?, content=?, category=?, author=?, date=?, readTime=?, image=?, tags=?, slug=?, published=?
        WHERE _id=?`,
        [updated.title, updated.summary, updated.content, updated.category, updated.author, updated.date,
        updated.readTime, updated.image, JSON.stringify(updated.tags), updated.slug, updated.published ? 1 : 0, id]);
    return getInsightById(id);
}

async function deleteInsight(id) {
    const res = await db.run('DELETE FROM insights WHERE _id = ?', [id]);
    return res.changes > 0;
}

// ─── Research ───────────────────────────────────────────────────────────────

async function getAllResearch(onlyPublished = false) {
    let query = 'SELECT * FROM research';
    if (onlyPublished) query += ' WHERE published = 1';
    query += ' ORDER BY createdAt DESC';
    const rows = await db.all(query);
    return rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published }));
}

async function getResearchById(id) {
    const row = await db.get('SELECT * FROM research WHERE _id = ?', [id]);
    return row ? { ...row, tags: JSON.parse(row.tags || '[]'), published: !!row.published } : null;
}

async function createResearch(data) {
    const id = uuidv4();
    await db.run(`INSERT INTO research (_id, title, authors, journal, year, abstract, doi, pdfUrl, tags, published, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, data.title, data.authors, data.journal, data.year, data.abstract, data.doi, data.pdfUrl,
            JSON.stringify(data.tags || []), data.published ? 1 : 0, new Date().toISOString()]);
    return getResearchById(id);
}

async function updateResearch(id, data) {
    const current = await getResearchById(id);
    if (!current) return null;
    const updated = { ...current, ...data };
    await db.run(`UPDATE research SET title=?, authors=?, journal=?, year=?, abstract=?, doi=?, pdfUrl=?, tags=?, published=?
        WHERE _id=?`,
        [updated.title, updated.authors, updated.journal, updated.year, updated.abstract, updated.doi,
        updated.pdfUrl, JSON.stringify(updated.tags), updated.published ? 1 : 0, id]);
    return getResearchById(id);
}

async function deleteResearch(id) {
    const res = await db.run('DELETE FROM research WHERE _id = ?', [id]);
    return res.changes > 0;
}

// ─── Showcase ───────────────────────────────────────────────────────────────

async function getAllShowcaseItems(onlyPublished = false) {
    let query = 'SELECT * FROM showcase';
    if (onlyPublished) query += ' WHERE published = 1';
    query += ' ORDER BY createdAt DESC';
    const rows = await db.all(query);
    return rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]'), published: !!r.published }));
}

async function getShowcaseById(id) {
    const row = await db.get('SELECT * FROM showcase WHERE _id = ?', [id]);
    return row ? { ...row, tags: JSON.parse(row.tags || '[]'), published: !!row.published } : null;
}

async function createShowcaseItem(data) {
    const id = uuidv4();
    await db.run(`INSERT INTO showcase (_id, title, description, image, link, category, tags, published, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, data.title, data.description, data.image, data.link, data.category,
            JSON.stringify(data.tags || []), data.published ? 1 : 0, new Date().toISOString()]);
    return getShowcaseById(id);
}

async function updateShowcaseItem(id, data) {
    const current = await getShowcaseById(id);
    if (!current) return null;
    const updated = { ...current, ...data };
    await db.run(`UPDATE showcase SET title=?, description=?, image=?, link=?, category=?, tags=?, published=?
        WHERE _id=?`,
        [updated.title, updated.description, updated.image, updated.link, updated.category,
        JSON.stringify(updated.tags), updated.published ? 1 : 0, id]);
    return getShowcaseById(id);
}

async function deleteShowcaseItem(id) {
    const res = await db.run('DELETE FROM showcase WHERE _id = ?', [id]);
    return res.changes > 0;
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

async function getAllJobs(activeOnly = false, includeArchived = true) {
    let conditions = [];
    if (activeOnly) conditions.push('active = 1');
    if (!includeArchived) conditions.push('archived = 0');

    let query = 'SELECT * FROM jobs';
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY createdAt DESC';

    const rows = await db.all(query);
    return rows.map(r => ({ ...r, active: !!r.active, archived: !!r.archived }));
}

async function getJobById(id) {
    const row = await db.get('SELECT * FROM jobs WHERE _id = ?', [id]);
    return row ? { ...row, active: !!row.active, archived: !!row.archived } : null;
}

async function createJob(data) {
    const id = uuidv4();
    await db.run(`INSERT INTO jobs (_id, title, department, location, type, description, requirements, salary, active, archived, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, data.title, data.department, data.location, data.type, data.description, data.requirements,
            data.salary, data.active ? 1 : 0, 0, new Date().toISOString()]);
    return getJobById(id);
}

async function updateJob(id, data) {
    const current = await getJobById(id);
    if (!current) return null;
    const updated = { ...current, ...data };
    await db.run(`UPDATE jobs SET title=?, department=?, location=?, type=?, description=?, requirements=?, salary=?, active=?, archived=?
        WHERE _id=?`,
        [updated.title, updated.department, updated.location, updated.type, updated.description,
        updated.requirements, updated.salary, updated.active ? 1 : 0, updated.archived ? 1 : 0, id]);
    return getJobById(id);
}

async function deleteJob(id, permanent = false) {
    if (permanent) {
        const res = await db.run('DELETE FROM jobs WHERE _id = ?', [id]);
        return res.changes > 0;
    } else {
        const res = await db.run('UPDATE jobs SET archived = 1, active = 0 WHERE _id = ?', [id]);
        return res.changes > 0;
    }
}

// ─── Job Applications ───────────────────────────────────────────────────────

async function createJobApplication(data) {
    const id = uuidv4();
    await db.run(`INSERT INTO job_applications (id, jobId, jobTitle, name, email, phone, linkedIn, resumeUrl, message, status, appliedDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", ?)`,
        [id, data.jobId, data.jobTitle, data.name, data.email, data.phone, data.linkedIn,
            data.resumeUrl, data.message, new Date().toISOString()]);
    return { id, message: 'Application submitted' };
}

async function getAllApplications(includeDeleted = false) {
    let query = 'SELECT * FROM job_applications';
    if (!includeDeleted) query += ' WHERE deletedAt IS NULL';
    query += ' ORDER BY appliedDate DESC';
    return db.all(query);
}

async function updateApplicationStatus(id, status, note = '') {
    const res = await db.run('UPDATE job_applications SET status = ?, notes = ? WHERE id = ?', [status, note, id]);
    return res.changes > 0;
}

async function deleteApplication(id, permanent = false) {
    if (permanent) {
        const res = await db.run('DELETE FROM job_applications WHERE id = ?', [id]);
        return res.changes > 0;
    } else {
        const res = await db.run('UPDATE job_applications SET deletedAt = ? WHERE id = ?', [new Date().toISOString(), id]);
        return res.changes > 0;
    }
}

async function restoreApplication(id) {
    const res = await db.run('UPDATE job_applications SET deletedAt = NULL WHERE id = ?', [id]);
    return res.changes > 0;
}

// ─── User / Auth ────────────────────────────────────────────────────────────

async function getUserByUsername(username) {
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
}

async function createUser(data) {
    const id = uuidv4();
    const hash = bcrypt.hashSync(data.password, 10);
    await db.run('INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        [id, data.username, data.email, hash, data.role || 'admin', new Date().toISOString()]);
    return getUserByUsername(data.username);
}

async function getCredentialsByUsername(username) {
    const rows = await db.all('SELECT * FROM credentials WHERE username = ?', [username]);
    return rows.map(r => ({ ...r, transports: JSON.parse(r.transports || '[]') }));
}

async function saveCredential(data) {
    await db.run('INSERT INTO credentials (credential_id, username, public_key, sign_count, transports) VALUES (?, ?, ?, ?, ?)',
        [data.credId, data.username, data.publicKey, data.signCount, JSON.stringify(data.transports || [])]);
}

async function saveChallenge(username, challenge) {
    const expiresAt = Date.now() + 60000;
    await db.run('INSERT OR REPLACE INTO challenges (username, challenge, expiresAt) VALUES (?, ?, ?)', [username, challenge, expiresAt]);
}

async function getChallenge(username) {
    const row = await db.get('SELECT * FROM challenges WHERE username = ?', [username]);
    if (!row || row.expiresAt < Date.now()) return null;
    return row.challenge;
}

// ─── Dynamic Pages ──────────────────────────────────────────────────────────

async function getAllCustomPages() {
    const rows = await db.all('SELECT page_id FROM page_configs');
    return rows.map(r => r.page_id);
}

async function getPageConfig(id) {
    const row = await db.get('SELECT config FROM page_configs WHERE page_id = ?', [id]);
    return row ? JSON.parse(row.config) : null;
}

async function upsertPageConfig(id, config) {
    await db.run('INSERT OR REPLACE INTO page_configs (page_id, config) VALUES (?, ?)', [id, JSON.stringify(config)]);
    return { success: true };
}

async function deletePageConfig(id) {
    const res = await db.run('DELETE FROM page_configs WHERE page_id = ?', [id]);
    return res.changes > 0;
}

// ─── Search ─────────────────────────────────────────────────────────────────

async function globalSearch(q) {
    const term = `%${q}%`;
    const [insights, showcase, jobs] = await Promise.all([
        db.all('SELECT _id, title, category as type FROM insights WHERE title LIKE ? OR summary LIKE ? LIMIT 5', [term, term]),
        db.all('SELECT _id, title, "showcase" as type FROM showcase WHERE title LIKE ? OR description LIKE ? LIMIT 5', [term, term]),
        db.all('SELECT _id, title, "job" as type FROM jobs WHERE title LIKE ? OR description LIKE ? LIMIT 5', [term, term])
    ]);
    return [...insights, ...showcase, ...jobs];
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
    getAllCustomPages,
    getPageConfig,
    upsertPageConfig,
    deletePageConfig,
    globalSearch
};

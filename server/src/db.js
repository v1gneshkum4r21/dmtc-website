/**
 * db.js — Hybrid Database Layer
 * Supports SQLite (Local) and MySQL (Production/Hostinger)
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

let db;
const DB_TYPE = process.env.DB_TYPE || 'sqlite';

async function initDb() {
    if (DB_TYPE === 'mysql') {
        const mysql = require('mysql2/promise');
        console.log('📦 Initializing MySQL Database...');
        db = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10
        });

        // Verify MySQL
        try {
            const conn = await db.getConnection();
            console.log('✅ MySQL connected');
            conn.release();
        } catch (err) {
            console.error('❌ MySQL connection failed:', err.message);
            throw err;
        }

        // Add run/get/all wrappers to match sqlite behavior for easier queries
        db.run = async (sql, params) => {
            const [res] = await db.query(sql.replace(/\?/g, '?'), params);
            return { lastID: res.insertId, changes: res.affectedRows };
        };
        db.get = async (sql, params) => {
            const [rows] = await db.query(sql, params);
            return rows[0];
        };
        db.all = async (sql, params) => {
            const [rows] = await db.query(sql, params);
            return rows;
        };

    } else {
        const { open } = require('sqlite');
        const sqlite3 = require('sqlite3');
        const DB_PATH = path.join(__dirname, '../data/dreamatic.db');
        const DATA_DIR = path.dirname(DB_PATH);

        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

        console.log('📦 Initializing SQLite Database...');
        db = await open({
            filename: DB_PATH,
            driver: sqlite3.Database
        });
        console.log('✅ SQLite connected');
    }

    // Common Table Creation (Compatible SQL)
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            username VARCHAR(255) ${DB_TYPE === 'mysql' ? '' : 'UNIQUE'} NOT NULL,
            email VARCHAR(255) ${DB_TYPE === 'mysql' ? '' : 'UNIQUE'} NOT NULL,
            passwordHash TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'admin',
            createdAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS insights (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            excerpt TEXT,
            content ${DB_TYPE === 'mysql' ? 'LONGTEXT' : 'TEXT'},
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
        `CREATE TABLE IF NOT EXISTS showcase (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            mediaUrl TEXT,
            mediaType TEXT,
            tag TEXT,
            product TEXT,
            \`order\` INTEGER DEFAULT 0,
            active BOOLEAN DEFAULT 1,
            size TEXT,
            likes INTEGER DEFAULT 0,
            views INTEGER DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS jobs (
            id VARCHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            team TEXT,
            location TEXT,
            description ${DB_TYPE === 'mysql' ? 'LONGTEXT' : 'TEXT'},
            requirements ${DB_TYPE === 'mysql' ? 'LONGTEXT' : 'TEXT'},
            company TEXT,
            tags TEXT,
            type TEXT,
            active BOOLEAN DEFAULT 1,
            isArchived BOOLEAN DEFAULT 0,
            createdAt DATETIME,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS applications (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
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
            history TEXT,
            isDeleted BOOLEAN DEFAULT 0,
            createdAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS pages (
            id VARCHAR(36) PRIMARY KEY,
            page_id VARCHAR(100) ${DB_TYPE === 'mysql' ? '' : 'UNIQUE'} NOT NULL,
            hero_badge TEXT,
            hero_title TEXT,
            hero_subtitle TEXT,
            solutions TEXT,
            approaches TEXT,
            values_list TEXT,
            stats TEXT,
            team TEXT,
            advisors TEXT,
            perks TEXT,
            content TEXT,
            theme TEXT,
            isCustom BOOLEAN DEFAULT 0,
            label TEXT,
            path TEXT,
            visible BOOLEAN DEFAULT 1,
            \`group\` TEXT,
            updatedAt DATETIME
        )`,
        `CREATE TABLE IF NOT EXISTS settings (
            id VARCHAR(50) PRIMARY KEY,
            siteTitle TEXT,
            tagline TEXT,
            contactEmail TEXT,
            seoDescription TEXT,
            keywords TEXT,
            indexRobots BOOLEAN DEFAULT 1,
            maintenanceMode BOOLEAN DEFAULT 0,
            social TEXT,
            updatedAt DATETIME
        )`
    ];

    for (const sql of tables) {
        await db.run(sql);
    }

    // Seed default user
    const user = await db.get('SELECT count(*) as count FROM users');
    if ((user.count || 0) === 0) {
        const id = uuidv4();
        const hash = bcrypt.hashSync('admin123', 10);
        await db.run('INSERT INTO users (id, username, email, passwordHash, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
            [id, 'admin', 'admin@dreamatic.com', hash, 'admin', now()]);
    }

    // Seed default settings
    const setting = await db.get('SELECT count(*) as count FROM settings');
    if ((setting.count || 0) === 0) {
        await db.run('INSERT INTO settings (id, siteTitle, tagline, contactEmail, social, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
            ['default', 'DREAMATIC', 'The Future of Agentic AI', 'hello@dreamatic.ai', '{}', now()]);
    }

    return db;
}

function now() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }

// ─── Shared Helpers ──────────────────────────────────────────────────────────

const insightHelper = (r) => r ? ({ ...r, _id: r.id, published: !!r.published }) : null;
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
    return item;
};

// ─── API Methods ─────────────────────────────────────────────────────────────

async function getSiteSettings() {
    const row = await db.get('SELECT * FROM settings WHERE id = ?', ['default']);
    return settingsHelper(row);
}

async function getAllInsights(publishedOnly = false, page = null) {
    let sql = 'SELECT * FROM insights';
    const params = [];
    const wheres = [];
    if (publishedOnly) wheres.push('published = 1');
    if (page) { wheres.push('page = ?'); params.push(page); }
    if (wheres.length) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY createdAt DESC';
    const rows = await db.all(sql, params);
    return rows.map(insightHelper);
}

async function getInsightById(id) {
    const row = await db.get('SELECT * FROM insights WHERE id = ?', [id]);
    return insightHelper(row);
}

async function getAllShowcaseItems(activeOnly = false) {
    let sql = 'SELECT * FROM showcase';
    if (activeOnly) sql += ' WHERE active = 1';
    sql += ' ORDER BY `order` ASC, createdAt DESC';
    const rows = await db.all(sql);
    return rows.map(showcaseHelper);
}

async function getAllJobs(activeOnly = false, includeArchived = true) {
    let sql = 'SELECT * FROM jobs';
    const wheres = [];
    if (activeOnly) wheres.push('active = 1');
    if (!includeArchived) wheres.push('isArchived = 0');
    if (wheres.length) sql += ' WHERE ' + wheres.join(' AND ');
    sql += ' ORDER BY createdAt DESC';
    const rows = await db.all(sql);
    return rows.map(jobHelper);
}

async function getJobById(id) {
    const row = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
    return jobHelper(row);
}

async function getAllApplications(includeDeleted = false) {
    let sql = 'SELECT * FROM applications';
    if (!includeDeleted) sql += ' WHERE isDeleted = 0';
    sql += ' ORDER BY createdAt DESC';
    const rows = await db.all(sql);
    return rows.map(applicationHelper);
}

async function createJobApplication(data) {
    const id = uuidv4();
    const cols = ['id', 'name', 'email', 'phone', 'location', 'experience', 'salary', 'linkedin', 'portfolio', 'notice', 'resume', 'message', 'role', 'jobId', 'status', 'history', 'isDeleted', 'createdAt'];
    const p = [id, data.name, data.email, data.phone || '', data.location || '', data.experience || '', data.salary || '', data.linkedin || '', data.portfolio || '', data.notice || '', data.resume || '', data.message || '', data.role || '', data.jobId || null, 'Applied', '[]', 0, now()];
    await db.run(`INSERT INTO applications (${cols.map(c => `\`${c}\``).join(',')}) VALUES (${p.map(() => '?').join(',')})`, p);
    return db.get('SELECT * FROM applications WHERE id = ?', [id]).then(applicationHelper);
}

async function getPageConfig(pageId) {
    const row = await db.get('SELECT * FROM pages WHERE page_id = ?', [pageId]);
    return pageConfigHelper(row);
}

async function getAllCustomPages() {
    const rows = await db.all('SELECT * FROM pages');
    return rows.map(pageConfigHelper);
}

async function globalSearch(q) {
    const term = `%${q}%`;
    const results = [];
    const ins = await db.all('SELECT id, title, page FROM insights WHERE (title LIKE ? OR excerpt LIKE ?) AND published = 1 LIMIT 5', [term, term]);
    ins.forEach(r => results.push({ _id: r.id, title: r.title, type: 'Insight', page: r.page }));
    return results;
}

// Auth & User
async function getUserByUsername(username) {
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
}

module.exports = {
    initDb, getSiteSettings, getAllInsights, getInsightById, getAllShowcaseItems,
    getAllJobs, getJobById, getAllApplications, createJobApplication,
    getPageConfig, getAllCustomPages, globalSearch, getUserByUsername
};

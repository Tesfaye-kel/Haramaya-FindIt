const fs = require('fs');
const path = require('path');
const env = require('./env');

const dataDir = path.join(__dirname, '../../data');
const dbFile = path.join(dataDir, 'haramaya_findit.json');

fs.mkdirSync(dataDir, { recursive: true });

function readDb() {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      roles: parsed.roles || [],
      users: parsed.users || [],
      institutions: parsed.institutions || [],
      audit_logs: parsed.audit_logs || [],
    };
  } catch (error) {
    return { roles: [], users: [], institutions: [], audit_logs: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

function initializeDefaultData() {
  const db = readDb();
  const defaultRoles = [
    { id: 1, name: 'student', description: 'Regular user and report owner' },
    { id: 2, name: 'finder', description: 'User who reports found items' },
    { id: 3, name: 'staff_reviewer', description: 'Manual verification reviewer' },
    { id: 4, name: 'property_officer', description: 'Sensitive claim and handover reviewer' },
    { id: 5, name: 'institution_manager', description: 'Institution-level settings manager' },
    { id: 6, name: 'system_admin', description: 'Application administrator' },
    { id: 7, name: 'platform_owner', description: 'Platform-wide operations' },
  ];

  if (!db.roles || db.roles.length === 0) {
    db.roles = defaultRoles;
    writeDb(db);
  }
}

initializeDefaultData();

async function getUserByEmail(email) {
  const db = readDb();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return db.users.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

async function getUserById(id) {
  const db = readDb();
  return db.users.find((user) => Number(user.id) === Number(id)) || null;
}

async function createUser({ name, email, passwordHash, role = 'student' }) {
  const db = readDb();
  const nextId = db.users.length > 0 ? Math.max(...db.users.map((user) => Number(user.id))) + 1 : 1;
  const user = {
    id: nextId,
    name,
    email: email.toLowerCase(),
    password_hash: passwordHash,
    role,
    email_verified: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);
  return user;
}

async function createAuditLog({ userId, action, details }) {
  const db = readDb();
  const log = {
    id: db.audit_logs.length > 0 ? Math.max(...db.audit_logs.map((item) => Number(item.id))) + 1 : 1,
    user_id: userId || null,
    action,
    details: details || null,
    created_at: new Date().toISOString(),
  };

  db.audit_logs.push(log);
  writeDb(db);
  return log;
}

module.exports = {
  db: readDb(),
  databaseType: 'json',
  getUserByEmail,
  getUserById,
  createUser,
  createAuditLog,
};

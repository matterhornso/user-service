// Provisions one operator account, because the application has no registration
// route: RegisterPage exists as a component but is wired to no path, so an
// account cannot be created through the UI at all.
//
// The HTTP createUser path is not usable here either — it requires shineKey,
// shinePrivateKey, user_encrypted_data and user_signature, and calls out to
// encryption and blockchain services that are not deployed. Those fields are
// inherited from an unrelated precious-metals product. This writes the records
// directly instead, using the same password scheme the login path verifies
// against: pbkdf2(password, salt, 1000, 64, sha512).
//
// The password comes from SEED_USER_PASSWORD so it is never committed and
// never printed to logs. Idempotent: skips a user that already exists.

import mongoose from 'mongoose';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const EMAIL = process.env['SEED_USER_EMAIL'] || '';
const PASSWORD = process.env['SEED_USER_PASSWORD'] || '';
const FULL_NAME = process.env['SEED_USER_NAME'] || 'Operator';
const ORG_NAME = 'climat';
const ORG_TYPE = 'ISSUER';
const DEPT_NAME = 'Origination';
const DEPT_ROLES = ['ISSUER_role'];

export async function seedAccount(): Promise<void> {
  if (!EMAIL || !PASSWORD) {
    console.log('[account seed] SEED_USER_EMAIL / SEED_USER_PASSWORD not set - skipping.');
    return;
  }

  const db = mongoose.connection;
  const organizations = db.collection('organizations');
  const departments = db.collection('departments');
  const users = db.collection('users');

  const existing = await users.findOne({ email: EMAIL });
  if (existing) { console.log('[account seed] user already exists - skipping.'); return; }

  let org: any = await organizations.findOne({ name: ORG_NAME });
  if (!org) {
    const r = await organizations.insertOne({
      uuid: uuidv4(), name: ORG_NAME, type: ORG_TYPE,
      about: 'Operator organisation', createdAt: new Date(), updatedAt: new Date(), __v: 0,
    } as any);
    org = { _id: r.insertedId };
    console.log('[account seed] created organisation');
  }

  let dept: any = await departments.findOne({ name: DEPT_NAME, organization_id: org._id });
  if (!dept) {
    const r = await departments.insertOne({
      uuid: uuidv4(), name: DEPT_NAME, organization_id: org._id,
      about: 'Origination department', roles: DEPT_ROLES,
      transactions: [], createdAt: new Date(), updatedAt: new Date(), __v: 0,
    } as any);
    dept = { _id: r.insertedId };
    console.log('[account seed] created department');
  }

  // Must match validPassword() exactly or login fails with "password incorrect".
  const passwordSalt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(PASSWORD, passwordSalt, 1000, 64, 'sha512').toString('hex');

  await users.insertOne({
    uuid: uuidv4(), fullName: FULL_NAME, email: EMAIL, departmentId: dept._id,
    passwordHash, passwordSalt, transactions: [],
    createdAt: new Date(), updatedAt: new Date(), __v: 0,
  } as any);
  console.log('[account seed] created operator user');
}

if (require.main === module) {
  const { MongoConnection } = require('../../MongoConnection');
  (async () => {
    new MongoConnection();
    await new Promise((resolve) => mongoose.connection.once('open', resolve));
    await seedAccount();
    await mongoose.connection.close();
    process.exit(0);
  })().catch((err: any) => { console.error(err); process.exit(1); });
}

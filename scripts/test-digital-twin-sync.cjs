const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const { PrismaClient } = require('@prisma/client');
const root = path.resolve(__dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'resort-sync-'));
const prisma = new PrismaClient({ datasources: { db: { url: 'file:' + path.join(temp, 'test.db').replaceAll('\\', '/') } } });
const modules = new Map();
function load(file) {
  if (modules.has(file)) return modules.get(file).exports;
  const mod = { exports: {} }; modules.set(file, mod);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  function resolve(name) {
    if (name === '@/lib/prisma') return { prisma };
    if (name === 'next-auth/jwt') return { getToken: async ({ req }) => req.headers.get('test-role') ? { role: req.headers.get('test-role'), name: 'Test Guest' } : null };
    if (name.startsWith('@/')) return load(path.join(root, name.slice(2) + '.ts'));
    if (name.startsWith('.')) return load(path.resolve(path.dirname(file), name + '.ts'));
    return require(name);
  }
  new Function('require', 'module', 'exports', source)(resolve, mod, mod.exports);
  return mod.exports;
}
function request(role, body) {
  return new Request('http://localhost/test', { method: body ? 'POST' : 'GET', headers: { ...(role ? { 'test-role': role } : {}), 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
(async () => {
  const twin = load(path.join(root, 'app/api/digital-twin/rooms/route.ts'));
  const revenue = load(path.join(root, 'app/api/revenue/simulator/route.ts'));
  assert.equal((await twin.GET(request())).status, 401);
  assert.equal((await revenue.GET(request('GUEST'))).status, 403);
  assert.equal((await revenue.POST(request('GUEST', { simulatedOccupancy: 85 }))).status, 403);
  const before = await (await revenue.GET(request('RESORT_MANAGER'))).json();
  assert.equal(before.rooms.length, 242);
  const room = before.rooms.find(r => r.status === 'AVAILABLE');
  const responses = await Promise.all([1, 2].map(() => twin.POST(request('GUEST', { action: 'book', roomId: room.id }))));
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]);
  const after = await (await revenue.GET(request('RESORT_MANAGER'))).json();
  assert.equal(after.live.occupiedRooms, before.live.occupiedRooms + 1);
  assert.equal(after.rooms.find(r => r.id === room.id).status, 'OCCUPIED');
  assert.equal((await revenue.POST(request('RESORT_MANAGER', { simulatedOccupancy: -1 }))).status, 400);
  assert.equal((await revenue.POST(request('RESORT_MANAGER', { simulatedOccupancy: 95 }))).status, 200);
  const updated = await (await twin.GET(request('GUEST'))).json();
  assert.equal(updated.rooms.find(r => r.id === room.id).price, room.price);
  const available = updated.rooms.find(r => r.status === 'AVAILABLE');
  assert.notEqual(available.price, available.basePrice);
  const reloaded = await (await twin.GET(request('RESORT_MANAGER'))).json();
  assert.equal(reloaded.rooms.find(r => r.id === room.id).status, 'OCCUPIED');
  assert.equal((await twin.POST(request('GUEST', { action: 'status', roomId: room.id, status: 'AVAILABLE' }))).status, 403);
  console.log('PASS: access control, shared inventory, booking synchronization, concurrent duplicate rejection, rate validation, locked booking rates, reload persistence');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); if (path.dirname(path.resolve(temp)) !== path.resolve(os.tmpdir()) || !path.basename(temp).startsWith('resort-sync-')) throw new Error('Unexpected test directory'); fs.rmSync(temp, { recursive: true, force: true }); });

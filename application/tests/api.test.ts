import { test, before, after, describe } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../src/app.js'
import { setupDBConnection, closeDBConnection } from '../src/db/connection.js'
import { fillDemoData } from '../src/db/seed.js'

let mongo: MongoMemoryServer

before(async () => {
  mongo = await MongoMemoryServer.create()
  await setupDBConnection(mongo.getUri(), true)
  await fillDemoData()
})

after(async () => {
  await closeDBConnection()
  await mongo.stop()
})

describe('meta', () => {
  test('GET /health → 200 ok', async () => {
    const res = await request(app).get('/health')
    assert.equal(res.status, 200)
    assert.equal(res.body.status, 'ok')
  })

  test('GET /api → 200 hypermedia root', async () => {
    const res = await request(app).get('/api')
    assert.equal(res.status, 200)
    assert.ok(res.body._links.networks)
    assert.ok(res.body._links.capture)
  })

  test('GET /api/unknown → 404', async () => {
    const res = await request(app).get('/api/unknown-route')
    assert.equal(res.status, 404)
  })
})

describe('networks', () => {
  test('GET /api/networks → collection with _links', async () => {
    const res = await request(app).get('/api/networks')
    assert.equal(res.status, 200)
    assert.ok(Array.isArray(res.body.items))
    assert.ok(res.body.count >= 1)
    assert.ok(res.body._links.self)
  })

  test('GET /api/networks/default → topology with _links', async () => {
    const res = await request(app).get('/api/networks/default')
    assert.equal(res.status, 200)
    assert.ok(res.body.id)
    assert.ok(Array.isArray(res.body.nodes))
    assert.ok(res.body._links.self)
    assert.ok(res.body._links.traces)
  })

  test('POST /api/networks → 201 + Location', async () => {
    const res = await request(app).post('/api/networks').send({ name: 'Test Net', description: 'd' })
    assert.equal(res.status, 201)
    assert.ok(res.headers.location)
    assert.equal(res.body.name, 'Test Net')
    assert.ok(res.body._links.self)
  })

  test('POST /api/networks without name → 400', async () => {
    const res = await request(app).post('/api/networks').send({})
    assert.equal(res.status, 400)
  })

  test('GET /api/networks/:missing → 404', async () => {
    const res = await request(app).get('/api/networks/does-not-exist')
    assert.equal(res.status, 404)
  })

  test('full CRUD lifecycle + nodes/edges', async () => {
    const created = await request(app).post('/api/networks').send({ name: 'Lifecycle' })
    const id = created.body.id

    const got = await request(app).get(`/api/networks/${id}`)
    assert.equal(got.status, 200)

    const updated = await request(app).put(`/api/networks/${id}`).send({ description: 'updated' })
    assert.equal(updated.status, 200)
    assert.equal(updated.body.description, 'updated')

    const node = await request(app).post(`/api/networks/${id}/nodes`).send({
      type: 'pc', label: 'PC', position: { x: 0, y: 0 }, config: {},
    })
    assert.equal(node.status, 201)
    assert.ok(node.body.id)

    const node2 = await request(app).post(`/api/networks/${id}/nodes`).send({
      type: 'server', label: 'SRV', position: { x: 10, y: 10 }, config: {},
    })
    const edge = await request(app).post(`/api/networks/${id}/edges`).send({
      source: node.body.id, target: node2.body.id, config: {},
    })
    assert.equal(edge.status, 201)

    const delNode = await request(app).delete(`/api/networks/${id}/nodes/${node.body.id}`)
    assert.equal(delNode.status, 204)

    const del = await request(app).delete(`/api/networks/${id}`)
    assert.equal(del.status, 204)

    const gone = await request(app).get(`/api/networks/${id}`)
    assert.equal(gone.status, 404)
  })
})

describe('traces', () => {
  test('POST /api/networks/default/traces → 201', async () => {
    const res = await request(app)
      .post('/api/networks/default/traces')
      .send({ srcNodeId: 'pc-1', dstNodeId: 'server-1', protocol: 'tcp', dstPort: 443 })
    assert.equal(res.status, 201)
    assert.ok(Array.isArray(res.body.hops))
    assert.ok(res.body._links.self)
  })

  test('POST traces without fields → 400', async () => {
    const res = await request(app).post('/api/networks/default/traces').send({})
    assert.equal(res.status, 400)
  })
})

describe('cidr', () => {
  test('GET /api/cidr → links', async () => {
    const res = await request(app).get('/api/cidr')
    assert.equal(res.status, 200)
    assert.ok(res.body._links.calculations)
  })

  test('POST /api/cidr/calculations → 201 result', async () => {
    const res = await request(app).post('/api/cidr/calculations').send({ input: '10.0.0.0/24' })
    assert.equal(res.status, 201)
    assert.equal(res.body.networkAddress, '10.0.0.0')
    assert.ok(res.body._links.self)
  })

  test('POST /api/cidr/calculations without input → 400', async () => {
    const res = await request(app).post('/api/cidr/calculations').send({})
    assert.equal(res.status, 400)
  })

  test('POST /api/cidr/subnets → 201 items', async () => {
    const res = await request(app).post('/api/cidr/subnets').send({ network: '10.0.0.0/24', count: 4 })
    assert.equal(res.status, 201)
    assert.ok(res.body.count >= 1)
    assert.ok(Array.isArray(res.body.items))
  })

  test('POST /api/cidr/supernets → 201', async () => {
    const res = await request(app)
      .post('/api/cidr/supernets')
      .send({ networks: ['192.168.0.0/24', '192.168.1.0/24'] })
    assert.equal(res.status, 201)
    assert.ok(res.body.networkAddress)
  })

  test('GET /api/cidr/validations/:ip → 200', async () => {
    const ok = await request(app).get('/api/cidr/validations/10.0.0.1')
    assert.equal(ok.status, 200)
    assert.equal(ok.body.valid, true)
    const bad = await request(app).get('/api/cidr/validations/999.0.0.1')
    assert.equal(bad.body.valid, false)
  })
})

describe('capture + packets', () => {
  test('GET /api/capture → state + stats + _links', async () => {
    const res = await request(app).get('/api/capture')
    assert.equal(res.status, 200)
    assert.equal(typeof res.body.capturing, 'boolean')
    assert.ok(res.body.stats)
    assert.ok(res.body._links.self)
  })

  test('PATCH /api/capture toggles state', async () => {
    const on = await request(app).patch('/api/capture').send({ capturing: true })
    assert.equal(on.status, 200)
    assert.equal(on.body.capturing, true)
    const off = await request(app).patch('/api/capture').send({ capturing: false })
    assert.equal(off.body.capturing, false)
  })

  test('PATCH /api/capture without body → 400', async () => {
    const res = await request(app).patch('/api/capture').send({})
    assert.equal(res.status, 400)
  })

  test('GET /api/packets → collection', async () => {
    const res = await request(app).get('/api/packets')
    assert.equal(res.status, 200)
    assert.ok(Array.isArray(res.body.items))
    assert.ok(res.body._links.self)
  })

  test('GET /api/packets/:id non-numeric → 400', async () => {
    const res = await request(app).get('/api/packets/abc')
    assert.equal(res.status, 400)
  })

  test('GET /api/packets/:id missing → 404', async () => {
    const res = await request(app).get('/api/packets/999999')
    assert.equal(res.status, 404)
  })

  test('DELETE /api/packets → 204', async () => {
    const res = await request(app).delete('/api/packets')
    assert.equal(res.status, 204)
  })
})

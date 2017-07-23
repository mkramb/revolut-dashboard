#!/usr/bin/env node

require('dotenv').config()

const restify = require('restify')
const statements = require('../src/routes/statements')

const server = restify.createServer({
  version: process.env.SERVER_VERSION
})

server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.get('/api/statements', statements)
server.get('/', restify.plugins.serveStatic({
    directory: `${__dirname}/../public`,
    default: 'index.html'
}))

server.listen(process.env.SERVER_PORT, (err) => {
  const database = require('../database')
  if (err) database.close()

  console.log(
    `listening at ${server.url}`
  )
})
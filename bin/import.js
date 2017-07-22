#!/usr/bin/env node

const dir = require('node-dir')
const parse = require('csv-parse/lib/sync')

const database = require('../database')
const { loadFromAPI, insertAsBulk } = require('../models/Statement')

const path = `${__dirname}/../data/`
const options = {
  match: /^Revolut-(.+).csv$/,
  recursive: false
}

let records = []

const onFile = (err, content, next) => {
  if (err) throw err

  records = records.concat(
    parse(content, {
      delimiter: ';',
      columns: true,
      trim: true
    })
  )

  next()
}

const onFinished = (err) => {
  if (err) throw err

  insertAsBulk(loadFromAPI(records))
  database.close()
}

dir.readFiles(
  path,
  options,
  onFile,
  onFinished
)
#!/usr/bin/env node

const dir = require('node-dir')
const parse = require('csv-parse/lib/sync')

const database = require('../database')
const { Statement, parseFromAPI } = require('../models/Statement')

const errorCallback = (err) => {
  if (err) throw err
}

const path = `${__dirname}/../data/`
const options = {
  match: /^Revolut-(.+).csv$/,
  recursive: false
}

let records = []

const onFile = (err, content, next) => {
  errorCallback(err)

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
  errorCallback(err)

  Statement.remove({}, errorCallback) 
  Statement.create(
    parseFromAPI(records.reverse()),
    errorCallback
  )

  database.close()
}

dir.readFiles(
  path,
  options,
  onFile,
  onFinished
)
require('dotenv').config()

const mongoose = require('mongoose')
const database = mongoose.connection
const databaseURI = process.env.DATABASE_URI

if (!database.readyState) {
  mongoose.connect(databaseURI, {
    useMongoClient: true
  })
}

database.once(
  'error',
  (error) => console.error('connection error:', error)
)

module.exports = database
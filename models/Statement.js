const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statementSchema = new Schema({
  completedAt: Date,
  reference: String,
  category: String,
  balance: {
    currency: String,
    value: Number
  }
})

statementSchema.index({
  completedAt: 1,
  category: 1
})

const Statement = mongoose.model('Statement', statementSchema)

const loadFromAPI = (records) => (
  records.map((r) => ({
    completedAt: Date.parse(r['Completed Date']),
    reference: r['Reference'],
    category: r['Category'],
    balance: {
      currency: 'GBP',
      value: Number(r['Balance (GBP)'])
    }
  }))
)

const insertAsBulk = (records) => {
  Statement.create(records, (err) => {
    if (err) throw err
  })
}

module.exports = {
  Statement,
  loadFromAPI,
  insertAsBulk
}
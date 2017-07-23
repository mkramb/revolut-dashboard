const mongoose = require('mongoose')
const math = require('mathjs')

const Schema = mongoose.Schema
const statementSchema = new Schema({
  completedAt: Date,
  reference: String,
  transaction: {
    amount: Number,
    category: String
  },
  balance: {
    currency: String,
    value: Number
  }
})

statementSchema.index({
  completedAt: -1,
  category: 1
})

const Statement = mongoose.model('Statement', statementSchema)

const calculateAmount = (currentBal, previousBal) => (
  math.subtract(
    math.fraction(currentBal),
    math.fraction(previousBal)
  ).valueOf()
)

const parseFromAPI = (records) => (
  records.map((record, index) => {
    const currentBal = record['Balance (GBP)']
    const previousBal = index ? records[index - 1]['Balance (GBP)'] : 0

    return {
      completedAt: Date.parse(record['Completed Date']),
      reference: record['Reference'],
      transaction: {
        amount: calculateAmount(currentBal, previousBal),
        category: record['Category']
      },
      balance: {
        value: previousBal,
        currency: 'GBP'
      }
    }
  })
)

module.exports = {
  Statement,
  parseFromAPI
}
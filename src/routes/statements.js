const { Statement } = require('../models/statement')

const route = (req, res, next) => {
  Statement.find({}, (err, statements) => {  
    res.send(statements)
    next()
  })
}

module.exports = route
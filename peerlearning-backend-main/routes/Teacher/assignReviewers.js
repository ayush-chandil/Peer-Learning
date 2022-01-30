const { assignReviewers } = require('../../controllers/Teacher/assignReviewers')

const assignReviewersRouter = require('express').Router()

assignReviewersRouter.post('/', assignReviewers)

module.exports = assignReviewersRouter

// start peer learning on an assignment

const { addPeerReview } = require('../../controllers/Teacher/assignment')

const assignmentRouter = require('express').Router()

assignmentRouter.post('/add', addPeerReview)

module.exports = assignmentRouter

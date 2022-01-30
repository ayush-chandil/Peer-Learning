const { addAssignmentScore } = require('../../controllers/Teacher/add_assignment_score')

const addAssignmentScoreRouter = require('express').Router()

addAssignmentScoreRouter.post('/', addAssignmentScore)

module.exports = addAssignmentScoreRouter

// Assignment wise peer score

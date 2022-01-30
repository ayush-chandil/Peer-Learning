const { getAssignmentScore } = require('../../controllers/Teacher/getAssignmentScore')
console.log("routes")
const getAssignmentScoreRouter = require('express').Router()

getAssignmentScoreRouter.get('/', getAssignmentScore)

module.exports = getAssignmentScoreRouter

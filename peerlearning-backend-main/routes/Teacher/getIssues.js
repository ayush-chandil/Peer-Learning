const { getIssues } = require('../../controllers/Teacher/getIssues')

const getIssuesRouter = require('express').Router()

getIssuesRouter.get('/', getIssues)

module.exports = getIssuesRouter

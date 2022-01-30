const { getLogs } = require('../../controllers/Teacher/getlogs')

const getLogsRouter = require('express').Router()

getLogsRouter.get('/', getLogs)

module.exports = getLogsRouter

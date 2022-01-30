const { getAssignment } = require('../../controllers/Student/getAssignment')

const getAssignmentRouter = require('express').Router()

getAssignmentRouter.get('/', getAssignment)

module.exports = getAssignmentRouter

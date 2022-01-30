const { closeAssignment } = require('../../controllers/Teacher/closeAssignment')

const closeAssignmentRouter = require('express').Router()

closeAssignmentRouter.post('/', closeAssignment)

module.exports = closeAssignmentRouter
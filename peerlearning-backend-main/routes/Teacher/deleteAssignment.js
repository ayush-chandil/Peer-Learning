const { deleteAssignment } = require('../../controllers/Teacher/deleteAssignment')

const deleteAssignmentRouter = require('express').Router()

deleteAssignmentRouter.delete('/', deleteAssignment)

module.exports = deleteAssignmentRouter
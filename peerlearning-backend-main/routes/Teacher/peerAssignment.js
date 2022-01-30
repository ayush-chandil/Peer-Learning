const { peerAssignment } = require('../../controllers/Teacher/peerAssignment')

const peerAssignmentRouter = require('express').Router()

peerAssignmentRouter.get('/assignment', peerAssignment)

module.exports = peerAssignmentRouter

//get detailed information on that peer assignment 

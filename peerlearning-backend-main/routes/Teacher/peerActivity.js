const { peerActivity } = require('../../controllers/Teacher/peerActivity')

const peerActivityRouter = require('express').Router()

peerActivityRouter.get('/', peerActivity)

module.exports = peerActivityRouter

// get list of all assigned assignments on given peer_assignment_id
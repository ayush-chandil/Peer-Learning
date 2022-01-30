const { activities } = require('../../controllers/Teacher/activities')

const activitiesRouter = require('express').Router()

activitiesRouter.get('/', activities)

module.exports = activitiesRouter

// get list of all assigned assignments(activities) on given course_work_id
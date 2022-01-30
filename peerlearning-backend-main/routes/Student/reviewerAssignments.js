const { reviewerAssignments } = require('../../controllers/Student/reviewerAssignments')

const reviewerAssignmentsRouter = require('express').Router()

reviewerAssignmentsRouter.get('/', reviewerAssignments)

module.exports = reviewerAssignmentsRouter

// get all peer activities assigned to a reviewer for given course_work_id
const { getReviews } = require('../../controllers/Student/getReviews')

const getReviewsRouter = require('express').Router()

getReviewsRouter.get('/', getReviews)

module.exports = getReviewsRouter

const { download } = require('../../controllers/Teacher/downloadReviewsCSV')

const downloadRouter = require('express').Router()

downloadRouter.get('/', download)

module.exports = downloadRouter